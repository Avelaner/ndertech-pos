import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { fullName, companyName, email, phone, address, password } = req.body;

    if (!fullName || !companyName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Check if tenant/email already exists
    const existingTenant = await pool.query('SELECT id FROM tenants WHERE email = $1', [email]);
    if (existingTenant.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Generate a clean lowercase subdomain from company name
    const subdomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert into tenants table
    const tenantResult = await pool.query(
      `INSERT INTO tenants (company_name, subdomain, email, phone, address, status) 
       VALUES ($1, $2, $3, $4, $5, 'trial') RETURNING id`,
      [companyName, subdomain, email, phone, address]
    );
    const tenantId = tenantResult.rows[0].id;

    // Create a main branch for the tenant
    const branchResult = await pool.query(
      `INSERT INTO branches (tenant_id, branch_name, address, phone, is_main) 
       VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
      [tenantId, `${companyName} Main Branch`, address, phone]
    );
    const branchId = branchResult.rows[0].id;

    // Insert user into users table linked to this tenant and branch
    await pool.query(
      `INSERT INTO users (tenant_id, branch_id, name, email, password_hash, status) 
       VALUES ($1, $2, $3, $4, $5, 'active')`,
      [tenantId, branchId, fullName, email, passwordHash]
    );

    return res.status(200).json({
      success: true,
      message: `Tenant instance for ${companyName} initialized successfully!`,
      subdomain
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
}