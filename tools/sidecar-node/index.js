require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DB = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
const TABLE_PREFIX = process.env.DB_PREFIX || '';
const USERS = `${TABLE_PREFIX}users`;
const CB = `${TABLE_PREFIX}comprofiler`;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_TTL_SECONDS = Number(process.env.JWT_TTL_SECONDS || 3600);

let pool;
async function getPool(){
  if (!pool) pool = mysql.createPool({ ...DB, waitForConnections: true, connectionLimit: 10 });
  return pool;
}

/** In-memory code store (replace with Redis/DB later) */
const CODE_STORE = new Map(); // code -> email,expiresAt
function issueCode(email){
  const code = String(Math.floor(100000 + Math.random()*900000));
  const exp = Date.now() + 10*60*1000;
  CODE_STORE.set(code, { email, exp });
  return code;
}
function consumeCode(code){
  const entry = CODE_STORE.get(code);
  if (!entry) return null;
  if (Date.now() > entry.exp) { CODE_STORE.delete(code); return null; }
  CODE_STORE.delete(code);
  return entry.email;
}

/** Mailer */
let transporter = null;
function getTransporter(){
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 25),
    secure: String(process.env.SMTP_SECURE||'false') === 'true',
    auth: (process.env.SMTP_USER? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined)
  });
  return transporter;
}

function signToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TTL_SECONDS });
}
function verifyToken(token){
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

// Utilities: map DB row -> API shape
function rowToProfile(row){
  return {
    firstname: row.firstname || undefined,
    lastname: row.lastname || undefined,
    dob: row.cb_dateofbirth || undefined,
    languages: row.cb_spokenlang || undefined,
    country: row.cb_country_of_residence || undefined,
    blood: row.cb_blood_type || undefined,
    ec1n: row.cb_ec1_name || undefined,
    ec1p: row.cb_ec1_phone || undefined,
    ec2n: row.cb_ec2_name || undefined,
    ec2p: row.cb_ec2_phone || undefined,
    ec3n: row.cb_ec3_name || undefined,
    ec3p: row.cb_ec3_phone || undefined,
    ice_url: row.cb_ice_url || undefined,
  };
}

function buildUpdateSet(up){
  const fields = [];
  const values = [];
  const map = {
    firstname: 'firstname',
    lastname: 'lastname',
    dob: 'cb_dateofbirth',
    languages: 'cb_spokenlang',
    country: 'cb_country_of_residence',
    blood: 'cb_blood_type',
    ec1n: 'cb_ec1_name',
    ec1p: 'cb_ec1_phone',
    ec2n: 'cb_ec2_name',
    ec2p: 'cb_ec2_phone',
    ec3n: 'cb_ec3_name',
    ec3p: 'cb_ec3_phone',
  };
  for (const [k,v] of Object.entries(up || {})){
    if (k === 'ice_url') continue; // read-only
    const col = map[k];
    if (!col) continue;
    fields.push(`${col} = ?`);
    values.push(v ?? null);
  }
  return { fields, values };
}

/** Routes */
app.get('/health', (_req,res)=>res.json({ ok:true }));

app.post('/api/v1/auth/magic-link', async (req,res) => {
  const email = (req.body?.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'email required' });
  try {
    const pool = await getPool();
    const [rows] = await pool.query(`SELECT id,email FROM ${USERS} WHERE email = ? LIMIT 1`, [email]);
    if (!Array.isArray(rows) || rows.length === 0){
      // Security: don't leak existence; still issue a code but not usable
    }
    const code = issueCode(email);
    const t = getTransporter();
    if (t){
      await t.sendMail({
        from: process.env.MAIL_FROM || 'ICE-CODE <no-reply@localhost>',
        to: email,
        subject: process.env.MAIL_SUBJECT || 'Votre code de connexion',
        text: `Votre code: ${code} (valide 10 minutes)`,
      });
    } else {
      console.log(`[magic-link] email=${email} code=${code}`);
    }
    res.json({ ok: true });
  } catch (e){
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

app.post('/api/v1/auth/exchange', async (req,res) => {
  const code = (req.body?.code || '').trim();
  if (!code) return res.status(400).json({ error: 'code required' });
  const email = consumeCode(code);
  if (!email) return res.status(400).json({ error: 'invalid code' });
  try {
    const pool = await getPool();
    const [rows] = await pool.query(`SELECT id,email FROM ${USERS} WHERE email = ? LIMIT 1`, [email]);
    if (!Array.isArray(rows) || rows.length === 0){
      // Unknown email → deny
      return res.status(400).json({ error: 'invalid user' });
    }
    const user = rows[0];
    const token = signToken({ sub: String(user.id), email: user.email });
    res.json({ token });
  } catch (e){
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Auth middleware
app.use('/api', (req,res,next)=>{
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'unauthorized' });
  req.user = payload;
  next();
});

app.get('/api/v1/me/profile', async (req,res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT u.id as user_id, u.email, p.* FROM ${USERS} u JOIN ${CB} p ON p.user_id = u.id WHERE u.id = ? LIMIT 1`,
      [req.user.sub]
    );
    if (!Array.isArray(rows) || rows.length === 0){
      return res.status(404).json({ error: 'profile not found' });
    }
    const row = rows[0];
    res.json(rowToProfile(row));
  } catch (e){
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

app.put('/api/v1/me/profile', async (req,res) => {
  try {
    const pool = await getPool();
    const up = req.body || {};
    const { fields, values } = buildUpdateSet(up);
    if (fields.length === 0) return res.json({ ok: true });
    values.push(req.user.sub);
    const sql = `UPDATE ${CB} SET ${fields.join(', ')} WHERE user_id = ?`;
    await pool.query(sql, values);
    res.json({ ok: true });
  } catch (e){
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

app.listen(PORT, () => {
  console.log(`ICE-CODE sidecar listening on :${PORT}`);
});
