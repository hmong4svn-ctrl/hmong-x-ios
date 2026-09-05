// Vá 4 chỗ Apple từ chối ở lượt 1 + giá IAP + ảnh duyệt IAP.  node ops/asc-dien-2.mjs 6808990045
import fs from 'node:fs'; import crypto from 'node:crypto';
import { asc } from './asc.mjs';
const APP = process.argv[2]; const SITE = process.env.SITE || 'https://duab.152-42-172-109.sslip.io';
const log = (t, r) => console.log(t, r.status, r.j?.errors ? JSON.stringify(r.j.errors[0]).slice(0, 260) : (r.j?.data?.id || ''));

// 1. anh1: mo ta <= 55 ky tu
const iaps = (await asc('GET', `/v1/apps/${APP}/inAppPurchasesV2?limit=50`)).j.data;
const byPid = Object.fromEntries(iaps.map((i) => [i.attributes.productId, i.id]));
const MO = { 'com.hmongx.duabzoo.anh1': [['vi', '1 ảnh', 'Sửa 1 ảnh bằng AI: tô màu, vá rách, sửa theo yêu cầu.'], ['en-US', '1 photo', 'Edit 1 photo with AI: colourise, repair, custom.']] };
for (const [pid, locs] of Object.entries(MO)) {
  const id = byPid[pid]; const co = (await asc('GET', `/v2/inAppPurchases/${id}/inAppPurchaseLocalizations`)).j.data || [];
  for (const [loc, name, desc] of locs) {
    if (co.find((c) => c.attributes.locale === loc)) { console.log('loc co roi', pid, loc); continue; }
    log('loc ' + pid + ' ' + loc, await asc('POST', '/v1/inAppPurchaseLocalizations', { data: { type: 'inAppPurchaseLocalizations', attributes: { locale: loc, name, description: desc }, relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id } } } } }));
  }
}

// 2. Gia IAP theo VND (bac gan nhat): anh1 20.000 · anh5 80.000 · anh20 250.000
const GIA = { 'com.hmongx.duabzoo.anh1': 20000, 'com.hmongx.duabzoo.anh5': 80000, 'com.hmongx.duabzoo.anh20': 250000 };
for (const [pid, vnd] of Object.entries(GIA)) {
  const id = byPid[pid];
  const pp = (await asc('GET', `/v2/inAppPurchases/${id}/pricePoints?filter[territory]=VNM&limit=200`)).j?.data || [];
  const best = pp.map((p) => ({ id: p.id, gia: Number(p.attributes.customerPrice) })).filter((p) => p.gia > 0).sort((a, b) => Math.abs(a.gia - vnd) - Math.abs(b.gia - vnd))[0];
  if (!best) { console.log('khong co price point VNM', pid); continue; }
  const r = await asc('POST', '/v1/inAppPurchasePriceSchedules', { data: { type: 'inAppPurchasePriceSchedules', relationships: { inAppPurchase: { data: { type: 'inAppPurchases', id } }, baseTerritory: { data: { type: 'territories', id: 'VNM' } }, manualPrices: { data: [{ type: 'inAppPurchasePrices', id: '${p}' }] } } }, included: [{ type: 'inAppPurchasePrices', id: '${p}', attributes: { startDate: null }, relationships: { inAppPurchasePricePoint: { data: { type: 'inAppPurchasePricePoints', id: best.id } } } }] });
  log(`gia ${pid} = ${best.gia} VND`, r);
  // 3. Anh duyet IAP (bat buoc)
  const daCo = (await asc('GET', `/v2/inAppPurchases/${id}/appStoreReviewScreenshot`)).j?.data;
  if (daCo) { console.log('  anh duyet co roi'); continue; }
  const buf = fs.readFileSync('anh-cho/05-mua-app-store.png');
  const mk = await asc('POST', '/v1/inAppPurchaseAppStoreReviewScreenshots', { data: { type: 'inAppPurchaseAppStoreReviewScreenshots', attributes: { fileName: 'mua.png', fileSize: buf.length }, relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id } } } } });
  const sc = mk.j?.data; if (!sc) { log('  anh duyet', mk); continue; }
  for (const op of sc.attributes.uploadOperations) { const h = {}; for (const x of op.requestHeaders) h[x.name] = x.value; await fetch(op.url, { method: op.method, headers: h, body: buf.subarray(op.offset, op.offset + op.length) }); }
  log('  anh duyet', await asc('PATCH', `/v1/inAppPurchaseAppStoreReviewScreenshots/${sc.id}`, { data: { type: 'inAppPurchaseAppStoreReviewScreenshots', id: sc.id, attributes: { uploaded: true, sourceFileChecksum: crypto.createHash('md5').update(buf).digest('hex') } } }));
}

// 4. Gia app Free — local id dang ${p0}
const pp = (await asc('GET', `/v1/apps/${APP}/appPricePoints?filter[territory]=USA&limit=5`)).j?.data || [];
const free = pp.find((p) => Number(p.attributes.customerPrice) === 0) || pp[0];
log('price Free', await asc('POST', '/v1/appPriceSchedules', { data: { type: 'appPriceSchedules', relationships: { app: { data: { type: 'apps', id: APP } }, baseTerritory: { data: { type: 'territories', id: 'USA' } }, manualPrices: { data: [{ type: 'appPrices', id: '${p0}' }] } } }, included: [{ type: 'appPrices', id: '${p0}', attributes: { startDate: null }, relationships: { appPricePoint: { data: { type: 'appPricePoints', id: free.id } } } }] }));

// 5. Ban toan cau — local id ${tN}
const terr = (await asc('GET', '/v1/territories?limit=200')).j?.data || [];
log('availability', await asc('POST', '/v2/appAvailabilities', { data: { type: 'appAvailabilities', attributes: { availableInNewTerritories: true }, relationships: { app: { data: { type: 'apps', id: APP } }, territoryAvailabilities: { data: terr.map((t, i) => ({ type: 'territoryAvailabilities', id: '${t' + i + '}' })) } } }, included: terr.map((t, i) => ({ type: 'territoryAvailabilities', id: '${t' + i + '}', attributes: { available: true }, relationships: { territory: { data: { type: 'territories', id: t.id } } } })) }));

// 6. Mo ta app — bo chu Lao/Thai (Apple cam ky tu ngoai locale), giu chu Viet
const V = (await asc('GET', `/v1/apps/${APP}/appStoreVersions?filter[platform]=IOS&limit=1`)).j.data[0].id;
const vl = (await asc('GET', `/v1/appStoreVersions/${V}/appStoreVersionLocalizations`)).j.data;
const MO_TA_VI = `Duab Zoo giúp anh chị cứu lại những tấm ảnh gia đình đã cũ, mờ, rách — ngay trên điện thoại.

MIỄN PHÍ, chạy ngay trong máy, ảnh không rời khỏi điện thoại:
• Xoá nền ảnh, chọn nền mới
• Làm ảnh thẻ 3x4 / 4x6 / 2x3, nền trắng hoặc xanh
• Xếp 9 / 4 / 16 ảnh thẻ vào tờ 10x15 để mang ra tiệm in

BẰNG AI (mua gói trong app):
• Tô màu ảnh trắng đen
• Vá ảnh rách, ố, mất góc
• Sửa theo yêu cầu: ghi muốn sửa gì, AI làm theo

Giao diện 6 thứ tiếng: Hmoob (tiếng Mông), Tiếng Việt, English, tiếng Lào, tiếng Thái, tiếng Trung.
Không cần tài khoản, không mật khẩu. Xoá dữ liệu của mình bất cứ lúc nào trong mục Cá Nhân.

Chính sách riêng tư: ${SITE}/rieng-tu/
Điều khoản: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`;
for (const l of vl) {
  log('versionLoc ' + l.attributes.locale, await asc('PATCH', `/v1/appStoreVersionLocalizations/${l.id}`, { data: { type: 'appStoreVersionLocalizations', id: l.id, attributes: { description: MO_TA_VI, keywords: 'ảnh cũ,phục hồi ảnh,xoá nền,ảnh thẻ,tô màu,hmong,mông,duab', supportUrl: SITE + '/rieng-tu/', marketingUrl: SITE, promotionalText: 'Ảnh cũ của ông bà, của bố mẹ — làm rõ lại chỉ trong vài giây.' } } }));
}
// 7. Kiem lai
const st = (await asc('GET', `/v1/apps/${APP}/appStoreVersions?filter[platform]=IOS&limit=1`)).j.data[0].attributes;
console.log('version', st.versionString, st.appStoreState);
