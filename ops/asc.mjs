// Gọi App Store Connect API bằng khoá team 8484N8P7UM — không cần thư viện.
import crypto from 'node:crypto'; import fs from 'node:fs';
const KID='8484N8P7UM', ISS='9bbbab4e-b125-455c-8c24-727bcf0b74dd';
const pem=fs.readFileSync(process.env.HOME+'/.hmongx-keys/AuthKey_'+KID+'.p8');
const b64=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');
export function jwt(){const t=Math.floor(Date.now()/1000);const h=b64({alg:'ES256',kid:KID,typ:'JWT'});const p=b64({iss:ISS,iat:t,exp:t+1200,aud:'appstoreconnect-v1'});const s=crypto.sign('sha256',Buffer.from(h+'.'+p),{key:pem,dsaEncoding:'ieee-p1363'});return h+'.'+p+'.'+s.toString('base64url');}
export async function asc(method,path,body){const r=await fetch('https://api.appstoreconnect.apple.com'+path,{method,headers:{Authorization:'Bearer '+jwt(),'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return {status:r.status,j,t};}
if (process.argv[1].endsWith('asc.mjs')) {
  const [m,p,b]=process.argv.slice(2); const r=await asc(m||'GET',p||'/v1/apps',b?JSON.parse(b):undefined); console.log(r.status, JSON.stringify(r.j,null,1).slice(0,3000));
}
