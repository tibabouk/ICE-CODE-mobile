# ICE-CODE Sidecar (Node.js) — Joomla/Community Builder bridge

Ce service expose l’API attendue par l’app mobile et lit/écrit dans la base MySQL de Joomla/CB.

Endpoints:
- POST `/api/v1/auth/magic-link` → `{ email }` → `{ ok:true }`
- POST `/api/v1/auth/exchange` → `{ code }` → `{ token }`
- GET  `/api/v1/me/profile` (Bearer) → profil JSON
- PUT  `/api/v1/me/profile` (Bearer) → met à jour certains champs CB (voir mapping)

## Config

Copiez `.env.example` en `.env` et remplissez:
- DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_PREFIX (ex: `jtmd_`)
- JWT_SECRET (long et aléatoire), JWT_TTL_SECONDS (par défaut 3600)
- SMTP_* (optionnel en DEV; sinon le code est logué en console)

## Démarrage local

- `npm install`
- `npm run dev`
- Test: `GET /health` → `{ ok:true }`

## Mapping des champs (selon dumps fournis)

Table: `${DB_PREFIX}users` (email, id)
Table: `${DB_PREFIX}comprofiler`

- firstname ↔ `comprofiler.firstname`
- lastname  ↔ `comprofiler.lastname`
- dob       ↔ `comprofiler.cb_dateofbirth`
- languages ↔ `comprofiler.cb_spokenlang`
- country   ↔ `comprofiler.cb_country_of_residence`
- blood     ↔ `comprofiler.cb_blood_type`
- ec1n      ↔ `comprofiler.cb_ec1_name`
- ec1p      ↔ `comprofiler.cb_ec1_phone`
- ec2n      ↔ `comprofiler.cb_ec2_name`
- ec2p      ↔ `comprofiler.cb_ec2_phone`
- ec3n      ↔ `comprofiler.cb_ec3_name`
- ec3p      ↔ `comprofiler.cb_ec3_phone`
- ice_url   ↔ `comprofiler.cb_ice_url` (lecture seule)

Adaptez ce mapping si votre instance utilise d’autres noms (cf. `jtmd_comprofiler.sql`).

## Déploiement PlanetHoster (mutu “The World”)

1) Créez une application Node.js depuis le NOC
- Version Node: choisissez la plus récente dispo (idéalement 20 LTS).
- Point d’entrée: `index.js`
- Chemin de l’app: par ex. `~/icecode/sidecar`
- Mode: Développement pour débuter (peut rester en Prod ensuite).

2) Déployez le dossier `tools/sidecar-node`
- Via Git, SFTP ou File Manager, uploadez le contenu dans le chemin de l’app.
- Créez le fichier `.env` (basé sur `.env.example`) avec les bonnes valeurs MySQL et JWT.

3) Installez les dépendances
- Dans le NOC → Shell Web, exécutez dans le dossier de l’app: `npm install`

4) Démarrez l’app Node
- Dans la page Node.js du NOC, cliquez « Démarrer ».
- Vérifiez les logs/console pour `listening on :PORT`.

5) Reverse proxy et HTTPS
- Associez un sous-domaine (ex: `api.ice-code.domoun.re`) à l’app Node:
  - Dans le NOC, section Domaines/Proxy vers l’app Node (ou App Node “URL” fournie).
  - Activez SSL (Let's Encrypt) sur le sous-domaine via le NOC.

6) Pare-feu et accès DB
- Autorisez l’IP du serveur Node à accéder à MySQL (si base sur le même mutualisé, utilisez l’hôte interne 127.0.0.1 et l’utilisateur MySQL du cPanel).
- Testez la connexion via `SELECT 1` (le service affiche erreurs si échec).

7) Brancher l’app mobile
- `src/config.ts` → `API_BASE_URL = 'https://api.ice-code.domoun.re'` (ou URL fournie par le NOC)
- Test flow:
  - POST `/api/v1/auth/magic-link` avec un email existant dans `jtmd_users`.
  - Recevez le code (ou lisez la console si SMTP non configuré).
  - POST `/api/v1/auth/exchange` → token.
  - GET `/api/v1/me/profile` → données.

## Sécurité / Production
- JWT secret fort (env), TTL court (1h) + refresh via magic link.
- CORS restreint au domaine mobile en prod.
- Remplacer le store de codes en mémoire par Redis/DB avec TTL.
- Logs sobres (ne pas loguer les codes en prod), rate-limit sur `/auth/*`.
- Ajouter HTTPS obligatoire au reverse proxy.

## Personnalisation
- Si d’autres champs CB doivent être exposés, étendez `rowToProfile` et `buildUpdateSet`.
- Si `ice_url` doit être calculé, faites-le côté serveur et renvoyez-le en read-only.