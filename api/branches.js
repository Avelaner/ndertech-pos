import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Tenant-Id');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const tenantId = req.headers['tenant-id'] || req.body.tenantId;
  if (!tenantId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing Tenant ID.' });
  }

  try {
    // ACTION: CREATE BRANCH
    if (req.method === 'POST' && req.query.action === 'create_branch') {
      const { branchName, address, phone } = req.body;

      // Check tenant's subscription plan branch limit
      const planCheck = await pool.query(
        `SELECT p.max_branches FROM tenants t 
         JOIN subscription_plans p ON t.subscription_plan_id = p.id 
         WHERE t.id = $1`,
        [tenantId]
      );
      const maxBranches = planCheck.rows[0]?.max_branches || 1;

      const branchCount = await pool.query('SELECT COUNT(*) FROM branches WHERE tenant_id = $1', [tenantId]);
      if (parseInt(branchCount.rows[0].count) >= maxBranches) {
        return res.status(403).json({ 
          success: false, 
          message: `Branch limit reached! Your current plan allows a maximum of ${maxBranches} branch(es). Please upgrade your plan.` 
        });
      }

      const newBranch = await pool.query(
        `INSERT INTO branches (tenant_id, branch_name, address, phone, is_main) 
         VALUES ($1, $2, $3, $4, FALSE) RETURNING *`,
        [tenantId, branchName, address, phone]
      );

      return res.status(200).json({ success: true, message: 'Branch created successfully!', branch: newBranch.rows[0] });
    }

    // ACTION: ALLOCATE / CREATE STAFF USER FOR A BRANCH
    if (req.method === 'POST' && req.query.action === 'create_user') {
      const { branchId, roleId, name, email, password } = req.body;

      // Check tenant's users-per-branch limit
      const planCheck = await pool.query(
        `SELECT p.max_users_per_branch FROM tenants t 
         JOIN subscription_plans p ON t.subscription_plan_id = p.id 
         WHERE t.id = $1`,
        [tenantId]
      );
      const maxUsersPerBranch = planCheck.rows[0]?.max_users_per_branch || 3;

      const userCount = await pool.query('SELECT COUNT(*) FROM users WHERE branch_id = $1', [branchId]);
      if (parseInt(userCount.rows[0].count) >= maxUsersPerBranch) {
        return res.status(403).json({ 
          success: false, 
          message: `User limit reached for this branch! Your plan allows up to ${maxUsersPerBranch} users per branch.` 
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const newUser = await pool.query(
        `INSERT INTO users (tenant_id, branch_id, role_id, name, email, password_hash, status) 
         VALUES ($1, $2, $3, $4, $5, $6, 'active') RETURNING id, name, email`,
        [tenantId, branchId, roleId, name, email, passwordHash]
      );

      return res.status(200).json({ success: true, message: 'Staff allocated to branch successfully!', user: newUser.rows[0] });
    }

    // ACTION: FETCH BRANCHES & STAFF
    if (req.method === 'GET') {
      const branches = await pool.query('SELECT * FROM branches WHERE tenant_id = $1', [tenantId]);
      const users = await pool.query('SELECT id, name, email, branch_id, role_id, status FROM users WHERE tenant_id = $1', [tenantId]);
      const roles = await pool.query('SELECT * FROM roles WHERE tenant_id = $1 OR tenant_id IS NULL', [tenantId]);

      return res.status(200).json({ success: true, branches: branches.rows, users: users.rows, roles: roles.rows });
    }

    return res.status(400).json({ success: false, message: 'Invalid action or method.' });
  } catch (error) {
    console.error('Branch Management Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error.' });
  }
}