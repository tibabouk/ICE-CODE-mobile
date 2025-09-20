// NDEF helpers for ICE‑CODE.help (Mode B): Text, Text, URI + JSON (ntgui_version=18)
export type BasicInfo = { signature?: string; firstname?: string; lastname?: string; dob?: string; country?: string; languages?: string; blood?: string; };
export type Contacts = { ice1n?: string; ice1p?: string; ice2n?: string; ice2p?: string; ice3n?: string; ice3p?: string; };

const enc = new TextEncoder();

function computeAge(dob?: string) {
  if (!dob) return ''; const d = new Date(dob); if (isNaN(+d)) return '';
  const t = new Date(); let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth(); if (m<0 || (m===0 && t.getDate()<d.getDate())) a--; return String(a);
}
function normLangs(s?: string) {
  const map: Record<string,string> = {'ANG':'EN','EN-GB':'EN','EN_UK':'EN','EN-UK':'EN','EN-US':'EN','EN_US':'EN','UK':'EN'};
  const parts = (s||'').replace(/[|;]+/g, ',').toUpperCase().split(/[,\\s]+/).filter(Boolean).map(x=>map[x]||x);
  return Array.from(new Set(parts)).join(', ');
}
export function buildText1(b: BasicInfo) {
  const sig = b.signature || 'ICEv1'; const name = [b.firstname, b.lastname].filter(Boolean).join(' ').trim();
  const L: string[] = []; if (name) L.push(`N: ${name}`);
  if (b.dob){ const age = computeAge(b.dob); L.push(age?`Age : ${age}`:`BDate : ${b.dob}`);} if (b.blood) L.push(`BLOODTYPE : ${b.blood}`);
  const R: string[] = []; if (b.languages) R.push(`LANG : ${normLangs(b.languages)}`); if (b.country) R.push(`From : ${b.country}`);
  const left=L.join(' | '), right=R.join(' // ');
  if (left && right) return `${sig} | ${left}  // ${right}`; if (left) return `${sig} | ${left}`; if (right) return `${sig} // ${right}`; return sig;
}
export function buildText2(c: Contacts){ const out:string[]=[];
  const add=(lab:string,n?:string,p?:string)=>{ if (!n && !p) return; out.push(`${lab} :${n?` ${n}`:''}${p?` - ${p}`:''}`); };
  add('ICE1', c.ice1n, c.ice1p); add('ICE2', c.ice2n, c.ice2p); add('ICE3', c.ice3n, c.ice3p); return out.join(' // ');
}
export function payloadText(text: string, lang='fr'){
  const l=(lang||'fr').split('-')[0].toLowerCase(); const lb=enc.encode(l); const tb=enc.encode(text||'');
  const out=new Uint8Array(1+lb.length+tb.length); out[0]=lb.length & 0x1F; out.set(lb,1); out.set(tb,1+lb.length); return out;
}
export function payloadUri(url: string){ const p=['','http://www.','https://www.','http://','https://']; let code=0, rest=url||'';
  for (let i=1;i<p.length;i++){ if (url?.toLowerCase().startsWith(p[i])){ code=i; rest=url.slice(p[i].length); break; } }
  const rb=enc.encode(rest); const out=new Uint8Array(1+rb.length); out[0]=code; out.set(rb,1); return out;
}
export function toNtguiJson(t1:string,t2:string,url:string,lang='fr'){
  const p1=Array.from(payloadText(t1,lang)), p2=Array.from(payloadText(t2,lang)), p3=Array.from(payloadUri(url));
  return { ntgui_version:18, data:[
    { kRecordDescription:t1, kRecordSelection:0, kRecordField1:t1, kRecordSize:p1.length, kRecordObject:{ kTnf:1, kChunked:false, kType:[84], kId:[], kPayload:p1 } },
    { kRecordDescription:t2, kRecordSelection:0, kRecordField1:t2, kRecordSize:p2.length, kRecordObject:{ kTnf:1, kChunked:false, kType:[84], kId:[], kPayload:p2 } },
    { kRecordDescription:url, kRecordSelection:2, kRecordField1:url, kRecordSize:p3.length, kRecordObject:{ kTnf:1, kChunked:false, kType:[85], kId:[], kPayload:p3 } },
  ]};
}
export function suggestJsonFilename(username?: string, d=new Date()){ const u=(username||'user').replace(/[^a-z0-9_\\-]+/ig,'_');
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); return `${u}_${y}${m}${dd}_NFCntguiv18.json`; }