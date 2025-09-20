# ICE-CODE Mobile — Sidecar auth + sync

Cette section documente l’intégration « Sidecar auth + profile sync (magic link) ».

## Aperçu

- Authentification par « magic link » (email → code → token).
- Récupération du profil pour pré-remplir les champs Text1/Text2 et l’URL (lecture seule).
- Mise à jour du profil (PUT) depuis le contenu des champs Text1/Text2 (format balisé).
- Gestion des 401 → logout automatique.

## Démarrage rapide (mock server)

1. Installer les dépendances du mock:
   ```bash
   npm i express cors
   ```
2. Lancer le serveur mock:
   ```bash
   npm run dev:sidecar
   ```
   Ajoutez dans package.json:
   ```json
   {
     "scripts": {
       "dev:sidecar": "node tools/sidecar-dev-server.js"
     }
   }
   ```
3. Vérifier que `API_BASE_URL` pointe vers `http://localhost:3001` (voir `src/config.ts`).

## Flow de test

1. Ouvrir l’app sans token: l’écran d’auth s’affiche.
2. Entrer un email et « Envoyer code » → OK (le mock accepte tous les emails et émet le code 123456).
3. Sur l’écran suivant, entrer `123456` → un token est stocké → l’écran principal (EncodeScreen) est affiché.
4. Cliquer « Importer en ligne » → les champs Text1/Text2 sont remplis depuis le profil; l’URL (lecture seule) est mise à jour.
5. Modifier des champs dans Text1/Text2 puis « Exporter en ligne » → PUT /me/profile; recharger via « Importer en ligne » pour vérifier la persistance.
6. Pour simuler une 401, changez manuellement le token dans le storage (ou redémarrez le mock sans réémettre de code) → l’app retourne au login.

## Intégration UI

- Le flow d’auth ajoute deux écrans:
  - `src/screens/LoginScreen.tsx` (envoi du code)
  - `src/screens/VerifyCodeScreen.tsx` (échange du code)
- Les actions de synchronisation sont exposées par `useProfileSync()`:
  - `importOnlineToTextFields(setText1, setText2, setUrl)`
  - `exportOnlineFromTextFields(text1, text2)`

### Exemple d’intégration dans EncodeScreen

```tsx
import { useProfileSync } from '../hooks/useProfileSync';

const { loading: syncLoading, importOnlineToTextFields, exportOnlineFromTextFields } = useProfileSync();

// Supposons que votre écran a déjà ces states:
const [text1, setText1] = useState('');
const [text2, setText2] = useState('');
const [url, setUrl] = useState('');

// Boutons (placer près des actions existantes)
<Button title={syncLoading ? 'Import…' : 'Importer en ligne'} onPress={() => importOnlineToTextFields(setText1, setText2, setUrl)} disabled={syncLoading} />
<Button title={syncLoading ? 'Export…' : 'Exporter en ligne'} onPress={() => exportOnlineFromTextFields(text1, text2)} disabled={syncLoading} />
```

### App.tsx (routing minimal sans lib)

Vous pouvez rendre conditionnellement l’auth vs l’écran principal:

```tsx
import { useAuth } from './src/hooks/useAuth';
import LoginScreen from './src/screens/LoginScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';
import EncodeScreen from './src/screens/EncodeScreen';

export default function App() {
  const { token, loading, phase } = useAuth();

  if (loading) return null;

  if (!token) {
    if (phase === 'verify') return <VerifyCodeScreen />;
    return <LoginScreen />;
  }

  return <EncodeScreen />;
}
```

## Format des champs Text1/Text2

- Text1
  ```
  First name: Jane
  Last name: Doe
  DOB: 1990-01-01
  Languages: FR,EN
  Country: FR
  Blood: O+
  ```
- Text2
  ```
  ICE 1: Alice (+3312345678)
  ICE 2: Bob (+3311122233)
  ICE 3: Charlie (+3399988877)
  ```

L’export en ligne parse ces formats de base; les lignes inconnues sont ignorées.

## Sécurité

- Le token est stocké via AsyncStorage si disponible, sinon fallback mémoire (DEV).
- Pour la production, prévoir un stockage sécurisé (Keychain/Keystore), ou une lib comme `react-native-keychain`.
