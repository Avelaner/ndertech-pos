import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const { action, email, password } = req.body;

    if (action === 'login') {
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const user = userResult.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, tenantId: user.tenant_id }
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid action.' });
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
}