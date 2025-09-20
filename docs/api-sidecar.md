# Sidecar API — Auth + Profile (Community Builder)

Proposed endpoints for extended sync:

- POST `/api/v1/auth/magic-link` — Body: `{ email }` → `{ ok:true }`
- POST `/api/v1/auth/exchange` — Body: `{ code }` → `{ token }`
- GET  `/api/v1/me/profile` (Bearer) → `{ firstname, lastname, dob, languages, country, blood, ec1n, ec1p, ec2n, ec2p, ec3n, ec3p, ice_url }`
- PUT  `/api/v1/me/profile` (Bearer) — Body: same editable fields (no `ice_url`) → `{ ok:true }`

Security: JWT (HS256), 1h TTL, refresh via magic link. Server side will map to CB fields.