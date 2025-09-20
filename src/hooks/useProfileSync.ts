import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { getProfile, updateProfile, profileToTextFields, textFieldsToProfileUpdatable, isUnauthorized } from '../services/profile';
import { logout as doLogout } from '../services/auth';

export function useProfileSync() {
  const [loading, setLoading] = useState(false);

  const importOnlineToTextFields = useCallback(async (setText1: (s: string) => void, setText2: (s: string) => void, setUrl: (s: string) => void) => {
    setLoading(true);
    try {
      const p = await getProfile();
      const { text1, text2, url } = profileToTextFields(p);
      setText1(text1);
      setText2(text2);
      setUrl(url || '');
      Alert.alert('Import', 'Profil chargé depuis le serveur.');
    } catch (e: any) {
      if (isUnauthorized(e)) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.');
        await doLogout();
      } else {
        Alert.alert('Erreur', e?.message || 'Échec de l’import.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const exportOnlineFromTextFields = useCallback(async (text1: string, text2: string) => {
    setLoading(true);
    try {
      const up = textFieldsToProfileUpdatable(text1, text2);
      await updateProfile(up);
      Alert.alert('Export', 'Profil mis à jour en ligne.');
    } catch (e: any) {
      if (isUnauthorized(e)) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter.');
        await doLogout();
      } else {
        Alert.alert('Erreur', e?.message || 'Échec de l’export.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    importOnlineToTextFields,
    exportOnlineFromTextFields,
  };
}