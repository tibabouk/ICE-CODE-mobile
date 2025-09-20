import { http, HttpUnauthorizedError } from './http';
import type { ProfileFromApi, ProfileUpdatable } from '../types/profile';

// GET current user's profile
export async function getProfile(): Promise<ProfileFromApi> {
  return http<ProfileFromApi>('/api/v1/me/profile');
}

// PUT updates to current user's profile
export async function updateProfile(updates: ProfileUpdatable): Promise<{ ok: boolean }> {
  return http<{ ok: boolean }>('/api/v1/me/profile', {
    method: 'PUT',
    body: updates,
  });
}

export function isUnauthorized(e: any): boolean {
  if (!e) return false;
  if (e instanceof HttpUnauthorizedError) return true;
  if (typeof e === 'object' && 'status' in e && (e as any).status === 401) return true;
  return false;
}

// Convert API profile into simple Text1/Text2 representation and URL
export function profileToTextFields(p: ProfileFromApi) {
  const text1Lines: string[] = [];
  if (p.firstname) text1Lines.push(`First name: ${p.firstname}`);
  if (p.lastname) text1Lines.push(`Last name: ${p.lastname}`);
  if (p.dob) text1Lines.push(`DOB: ${p.dob}`);
  if (p.languages) text1Lines.push(`Languages: ${p.languages}`);
  if (p.country) text1Lines.push(`Country: ${p.country}`);
  if (p.blood) text1Lines.push(`Blood: ${p.blood}`);

  const text2Lines: string[] = [];
  if (p.ec1n || p.ec1p) text2Lines.push(`ICE 1: ${p.ec1n || ''}${p.ec1p ? ` (${p.ec1p})` : ''}`.trim());
  if (p.ec2n || p.ec2p) text2Lines.push(`ICE 2: ${p.ec2n || ''}${p.ec2p ? ` (${p.ec2p})` : ''}`.trim());
  if (p.ec3n || p.ec3p) text2Lines.push(`ICE 3: ${p.ec3n || ''}${p.ec3p ? ` (${p.ec3p})` : ''}`.trim());

  return {
    text1: text1Lines.join('\n'),
    text2: text2Lines.join('\n'),
    url: p.ice_url,
  };
}

// Parse Text1/Text2 back into an updatable profile payload
export function textFieldsToProfileUpdatable(text1: string, text2: string): ProfileUpdatable {
  const up: ProfileUpdatable = {};
  const lines1 = (text1 || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (const line of lines1) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key.startsWith('first')) up.firstname = val;
    else if (key.startsWith('last')) up.lastname = val;
    else if (key.startsWith('dob')) up.dob = val;
    else if (key.startsWith('lang')) up.languages = val;
    else if (key.startsWith('country')) up.country = val;
    else if (key.startsWith('blood')) up.blood = val;
  }

  const lines2 = (text2 || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (const line of lines2) {
    // Accept formats like: "ICE 1: Alice (+33...)" or "ICE1 : Alice - +33..."
    const iceMatch = line.match(/^ICE\s*([123])\s*:\s*(.*)$/i);
    if (!iceMatch) continue;
    const idx = iceMatch[1];
    const rest = iceMatch[2].trim();
    // Try to split name and phone if phone is in parentheses or after a dash
    let name = rest;
    let phone: string | undefined;
    const paren = rest.match(/^(.*)\(([^)]+)\)\s*$/);
    if (paren) {
      name = paren[1].trim();
      phone = paren[2].trim();
    } else {
      const dash = rest.split(/\s+-\s+|\s+–\s+|\s+—\s+/);
      if (dash.length === 2) {
        name = dash[0].trim();
        phone = dash[1].trim();
      }
    }
    if (idx === '1') { up.ec1n = name || undefined; up.ec1p = phone || undefined; }
    if (idx === '2') { up.ec2n = name || undefined; up.ec2p = phone || undefined; }
    if (idx === '3') { up.ec3n = name || undefined; up.ec3p = phone || undefined; }
  }

  return up;
}
