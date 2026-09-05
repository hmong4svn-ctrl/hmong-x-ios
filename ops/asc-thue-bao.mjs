// Tao NHOM thue bao + 1 thue bao thang "Duab Zoo Pro" 1,99 USD; xoa 3 goi le cu.  node ops/asc-thue-bao.mjs 6808990045
import fs from 'node:fs'; import crypto from 'node:crypto';
import { asc } from './asc.mjs';
const APP = process.argv[2]; const PID = 'com.hmongx.duabzoo.pro.thang';
const log = (t, r) => console.log(t, r.status, r.j?.errors ? JSON.stringify(r.j.errors[0]).slice(0, 260) : (r.j?.data?.id || ''));

// 0. Xoa 3 goi le cu (chua bao gio ban)
const cu = (await asc('GET', `/v1/apps/${APP}/inAppPurchasesV2?limit=50`)).j?.data || [];
for (const i of cu) if (/\.anh(1|5|20)$/.test(i.attributes.productId)) log('xoa ' + i.attributes.productId, await asc('DELETE', `/v2/inAppPurchases/${i.id}`));

// 1. Nhom thue bao
let groups = (await asc('GET', `/v1/apps/${APP}/subscriptionGroups`)).j?.data || [];
let g = groups.find((x) => x.attributes.referenceName === 'Duab Zoo Pro');
if (!g) { const r = await asc('POST', '/v1/subscriptionGroups', { data: { type: 'subscriptionGroups', attributes: { referenceName: 'Duab Zoo Pro' }, relationships: { app: { data: { type: 'apps', id: APP } } } } }); log('group', r); g = r.j?.data; }
if (!g) process.exit(1);
for (const [loc, name] of [['vi', 'Duab Zoo Pro'], ['en-US', 'Duab Zoo Pro']]) {
  const r = await asc('POST', '/v1/subscriptionGroupLocalizations', { data: { type: 'subscriptionGroupLocalizations', attributes: { locale: loc, name, customAppName: 'Duab Zoo' }, relationships: { subscriptionGroup: { data: { type: 'subscriptionGroups', id: g.id } } } } });
  log('groupLoc ' + loc, r);
}

// 2. Thue bao thang
let subs = (await asc('GET', `/v1/subscriptionGroups/${g.id}/subscriptions`)).j?.data || [];
let sub = subs.find((x) => x.attributes.productId === PID);
if (!sub) {
  const r = await asc('POST', '/v1/subscriptions', { data: { type: 'subscriptions', attributes: { name: 'Duab Zoo Pro (thang)', productId: PID, subscriptionPeriod: 'ONE_MONTH', familySharable: false, groupLevel: 1, reviewNote: 'Monthly auto-renewable subscription: 40 AI photo restorations + 3 custom edits per month. After purchase the app calls our server, which verifies the transaction with Apple (App Store Server API) and issues an access code (DZ-xxxxxx) valid until the expiration date; renewals extend the same code. Test with a sandbox Apple ID: Me tab > Duab Zoo Pro > Subscribe. Restore Purchases is on the same screen.' }, relationships: { group: { data: { type: 'subscriptionGroups', id: g.id } } } } });
  log('subscription', r); sub = r.j?.data;
}
if (!sub) process.exit(1);
const S = sub.id;
// Localizations
const co = (await asc('GET', `/v1/subscriptions/${S}/subscriptionLocalizations`)).j?.data || [];
for (const [loc, name, desc] of [['vi', 'Duab Zoo Pro', '40 ảnh AI + 3 lượt sửa theo yêu cầu mỗi tháng.'], ['en-US', 'Duab Zoo Pro', '40 AI photo restorations + 3 custom edits per month.']]) {
  if (co.find((c) => c.attributes.locale === loc)) continue;
  log('subLoc ' + loc, await asc('POST', '/v1/subscriptionLocalizations', { data: { type: 'subscriptionLocalizations', attributes: { locale: loc, name, description: desc }, relationships: { subscription: { data: { type: 'subscriptions', id: S } } } } }));
}
// Gia: 1,99 USD base USA
const pp = (await asc('GET', `/v1/subscriptions/${S}/pricePoints?filter[territory]=USA&limit=200`)).j?.data || [];
const p199 = pp.find((p) => Number(p.attributes.customerPrice) === 1.99) || pp.sort((a, b) => Math.abs(a.attributes.customerPrice - 1.99) - Math.abs(b.attributes.customerPrice - 1.99))[0];
if (p199) {
  const r = await asc('POST', '/v1/subscriptionPrices', { data: { type: 'subscriptionPrices', attributes: { preserveCurrentPrice: false }, relationships: { subscription: { data: { type: 'subscriptions', id: S } }, subscriptionPricePoint: { data: { type: 'subscriptionPricePoints', id: p199.id } } } } });
  log('gia ' + p199.attributes.customerPrice + ' USD', r);
}
// Anh duyet
const daCo = (await asc('GET', `/v1/subscriptions/${S}/appStoreReviewScreenshot`)).j?.data;
if (!daCo) {
  const buf = fs.readFileSync('anh-cho/05-mua-app-store.png');
  const mk = await asc('POST', '/v1/subscriptionAppStoreReviewScreenshots', { data: { type: 'subscriptionAppStoreReviewScreenshots', attributes: { fileName: 'thue-bao.png', fileSize: buf.length }, relationships: { subscription: { data: { type: 'subscriptions', id: S } } } } });
  const sc = mk.j?.data; if (sc) { for (const op of sc.attributes.uploadOperations) { const h = {}; for (const x of op.requestHeaders) h[x.name] = x.value; await fetch(op.url, { method: op.method, headers: h, body: buf.subarray(op.offset, op.offset + op.length) }); }
    log('anh duyet', await asc('PATCH', `/v1/subscriptionAppStoreReviewScreenshots/${sc.id}`, { data: { type: 'subscriptionAppStoreReviewScreenshots', id: sc.id, attributes: { uploaded: true, sourceFileChecksum: crypto.createHash('md5').update(buf).digest('hex') } } })); } else log('anh duyet', mk);
}
const st = (await asc('GET', `/v1/subscriptions/${S}`)).j?.data?.attributes; console.log('thue bao', PID, st?.state);
