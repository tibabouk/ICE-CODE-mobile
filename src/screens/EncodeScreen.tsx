import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import NfcManager, { Ndef, NfcEvents, NfcTech } from 'react-native-nfc-manager';
import { BasicInfo, Contacts, buildText1, buildText2, toNtguiJson, suggestJsonFilename } from '../services/ndef';

NfcManager.start();

export default function EncodeScreen(){
  const [supported, setSupported] = useState<boolean|null>(null);
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('fr');
  const [username, setUsername] = useState('');
  const [basic, setBasic] = useState<BasicInfo>({ signature:'ICEv1' });
  const [contacts, setContacts] = useState<Contacts>({});
  const [prev1, setPrev1] = useState('');
  const [prev2, setPrev2] = useState('');

  useEffect(()=>{ NfcManager.isSupported().then(setSupported); return ()=>{ NfcManager.setEventListener(NfcEvents.DiscoverTag, null as any); }; },[]);
  useEffect(()=>{ setPrev1(buildText1(basic)); setPrev2(buildText2(contacts) || 'ICE contacts: none'); },[basic,contacts]);

  const readTag = async () => {
    try {
      await NfcManager.requestTechnology([NfcTech.Ndef]);
      const tag = await NfcManager.getTag();
      const recs = tag?.ndefMessage || [];
      if (recs.length < 1) throw new Error('Message NDEF vide');
      const decodeText = (r:any)=>{ try { return Ndef.text.decodePayload(r.payload); } catch { return ''; } };
      if (recs[0]) setPrev1(decodeText(recs[0]));
      if (recs[1]) setPrev2(decodeText(recs[1]));
      if (recs[2] && Ndef.isUrlRecord(recs[2])) setUrl(Ndef.uri.decodePayload(recs[2].payload as any) || '');
      Alert.alert('NFC', 'Tag lu');
    } catch(e:any){ Alert.alert('NFC', e?.message || 'Lecture annulée'); }
    finally { NfcManager.cancelTechnologyRequest(); }
  };

  const writeTag = async () => {
    if (!url) { Alert.alert('NFC','URL manquante: lire d\'abord la puce.'); return; }
    const t1 = buildText1(basic); const t2 = buildText2(contacts) || 'ICE contacts: none';
    const msg = [ Ndef.textRecord(t1, lang), Ndef.textRecord(t2, lang), Ndef.uriRecord(url) ];
    const bytes = Ndef.encodeMessage(msg); if (!bytes) { Alert.alert('NFC','Encodage impossible'); return; }
    try { await NfcManager.requestTechnology([NfcTech.Ndef]); await Ndef.writeNdefMessage(bytes); Alert.alert('NFC','Écriture réussie'); }
    catch(e:any){ Alert.alert('NFC', e?.message || 'Écriture échouée'); }
    finally { NfcManager.cancelTechnologyRequest(); }
  };

  const exportJson = () => {
    const t1 = buildText1(basic); const t2 = buildText2(contacts) || 'ICE contacts: none';
    const json = toNtguiJson(t1,t2,url,lang); const name = suggestJsonFilename(username);
    console.log(name, JSON.stringify(json, null, 2));
    Alert.alert('Export', `JSON prêt: ${name}\n(Copiez depuis la console; un flux de sauvegarde sera ajouté ultérieurement).`);
  };

  if (supported===false) return <View style={{padding:16}}><Text>Appareil sans NFC</Text></View>;

  return (
    <ScrollView contentContainerStyle={{padding:16, gap:10}}>
      <Text style={{fontSize:22,fontWeight:'800'}}>ICE‑CODE.help — NFC</Text>
      <Button title="Scanner la puce" onPress={readTag} />

      <Text style={{marginTop:12,fontWeight:'700'}}>URL ICE (lecture seule)</Text>
      <TextInput editable={false} value={url} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />

      <Text style={{marginTop:12,fontWeight:'700'}}>Identité</Text>
      <TextInput placeholder="Username (pour le nom du fichier JSON)" value={username} onChangeText={setUsername} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="Prénom" value={basic.firstname} onChangeText={(v)=>setBasic(s=>({...s, firstname:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="Nom" value={basic.lastname} onChangeText={(v)=>setBasic(s=>({...s, lastname:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="Date de naissance (YYYY-MM-DD)" value={basic.dob} onChangeText={(v)=>setBasic(s=>({...s, dob:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="Nationalité" value={basic.country} onChangeText={(v)=>setBasic(s=>({...s, country:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="Langues (FR, EN, ...)" value={basic.languages} onChangeText={(v)=>setBasic(s=>({...s, languages:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="Groupe sanguin (A+, O-, ...)" value={basic.blood} onChangeText={(v)=>setBasic(s=>({...s, blood:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />

      <Text style={{marginTop:12,fontWeight:'700'}}>Contacts d'urgence</Text>
      <TextInput placeholder="ICE1 Nom" value={contacts.ice1n} onChangeText={(v)=>setContacts(s=>({...s, ice1n:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="ICE1 Tel" value={contacts.ice1p} onChangeText={(v)=>setContacts(s=>({...s, ice1p:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="ICE2 Nom" value={contacts.ice2n} onChangeText={(v)=>setContacts(s=>({...s, ice2n:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="ICE2 Tel" value={contacts.ice2p} onChangeText={(v)=>setContacts(s=>({...s, ice2p:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="ICE3 Nom" value={contacts.ice3n} onChangeText={(v)=>setContacts(s=>({...s, ice3n:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />
      <TextInput placeholder="ICE3 Tel" value={contacts.ice3p} onChangeText={(v)=>setContacts(s=>({...s, ice3p:v}))} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10}} />

      <Text style={{marginTop:12,fontWeight:'700'}}>Aperçu</Text>
      <Text>Record 1</Text><Text selectable>{prev1}</Text>
      <Text>Record 2</Text><Text selectable>{prev2}</Text>

      <View style={{flexDirection:'row', gap:12, marginTop:8}}>
        <Button title="Écrire la puce" onPress={writeTag} />
        <Button title="Exporter JSON" onPress={exportJson} />
      </View>
    </ScrollView>
  );
}