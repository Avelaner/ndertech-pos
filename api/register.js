process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || process.env.ndertech_POSTGRES_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
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
    const { fullName, companyName, email, phone, address, password, planId } = req.body;

    if (!fullName || !companyName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const existingTenant = await pool.query('SELECT id FROM tenants WHERE email = $1', [email]);
    if (existingTenant.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const subdomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const tenantResult = await pool.query(
      `INSERT INTO tenants (company_name, subdomain, email, phone, address, subscription_plan_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'trial') RETURNING id`,
      [companyName, subdomain, email, phone, address, planId || 1]
    );
    const tenantId = tenantResult.rows[0].id;

    const branchResult = await pool.query(
      `INSERT INTO branches (tenant_id, branch_name, address, phone, is_main) 
       VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
      [tenantId, `${companyName} Main Branch`, address, phone]
    );
    const branchId = branchResult.rows[0].id;

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
    return res.status(500).json({ success: false, message: error.message || 'Database connection error during registration.' });
  }
}