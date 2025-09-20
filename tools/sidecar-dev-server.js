/* Simple mock Sidecar API for local QA.
 * Start: npm run dev:sidecar (see README).
 */
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/** In-memory store: { email: profile } */
const profiles = new Map();
/** Map code -> email (for a single code window mock) */
const codes = new Map();

/** Helpers */
function tokenFor(email) {
  return `mocktoken-${Buffer.from(email).toString('base64')}`;
}
function emailForToken(token) {
  if (!token?.startsWith('mocktoken-')) return null;
  try {
    const b64 = token.slice('mocktoken-'.length);
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch {
    return null;
  }
}

app.post('/api/v1/auth/magic-link', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  // Issue mock code "123456" for all emails
  codes.set('123456', email);
  if (!profiles.has(email)) {
    profiles.set(email, {
      firstname: 'Jane',
      lastname: 'Doe',
      dob: '1990-01-01',
      languages: 'FR,EN',
      country: 'FR',
      blood: 'O+',
      ec1n: 'Alice',
      ec1p: '+3312345678',
      ec2n: 'Bob',
      ec2p: '+3311122233',
      ec3n: 'Charlie',
      ec3p: '+3399988877',
      ice_url: 'https://ice-code.example/user/janedoe',
    });
  }
  res.json({ ok: true });
});

app.post('/api/v1/auth/exchange', (req, res) => {
  const { code } = req.body || {};
  const email = codes.get(code);
  if (!email) return res.status(400).json({ error: 'invalid code' });
  const token = tokenFor(email);
  res.json({ token });
});

app.use('/api', (req, res, next) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  const email = emailForToken(token);
  if (!email) return res.status(401).json({ error: 'unauthorized' });
  req.userEmail = email;
  next();
});

app.get('/api/v1/me/profile', (req, res) => {
  const email = req.userEmail;
  const p = profiles.get(email);
  if (!p) return res.status(404).json({ error: 'profile not found' });
  res.json(p);
});

app.put('/api/v1/me/profile', (req, res) => {
  const email = req.userEmail;
  const p = profiles.get(email) || {};
  const up = req.body || {};
  // ice_url read-only
  const { ice_url, ...editable } = up || {};
  const merged = { ...p, ...editable, ice_url: p.ice_url || 'https://ice-code.example/user/unknown' };
  profiles.set(email, merged);
  res.json({ ok: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`[mock] Sidecar listening on http://localhost:${port}`);
});