// Điền hồ sơ Duab Zoo trên App Store Connect bằng API — chạy SAU KHI app record đã tạo.
//   node ops/asc-dien.mjs <APP_ID>            (Apple ID 10 số của app "Duab Zoo")
// Làm: 3 IAP consumable · Privacy URL · category · pricing Free · availability · review detail · ảnh chợ 6.7".
// Đúc từ log.md [2026-09-04] (Kho Video) — endpoint đã dùng thật HTTP 200/201.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import { asc } from './asc.mjs';
const APP = process.argv[2]; if (!APP) { console.error('thieu APP_ID'); process.exit(1); }
const SITE = process.env.SITE || 'https://duab.kubsuav.cloud';
const log = (t, r) => console.log(t, r.status, r.j?.errors ? JSON.stringify(r.j.errors[0]).slice(0, 300) : (r.j?.data?.id || ''));

// 1. IAP consumable — productId PHẢI trùng server/lib/iap.js
const GOI = [
  { pid: 'com.hmongx.duabzoo.anh1', ten: '1 ảnh', mota: 'Sửa 1 ảnh bằng AI (tô màu, vá ảnh rách hoặc sửa theo yêu cầu).' },
  { pid: 'com.hmongx.duabzoo.anh5', ten: 'Gói 5 ảnh', mota: 'Sửa 5 ảnh bằng AI. Không hết hạn, dùng hết thì thôi.' },
  { pid: 'com.hmongx.duabzoo.anh20', ten: 'Gói 20 ảnh', mota: 'Sửa 20 ảnh bằng AI. Không hết hạn, dùng hết thì thôi.' },
];
const daCo = await asc('GET', `/v1/apps/${APP}/inAppPurchasesV2?limit=50`);
const coRoi = new Set((daCo.j?.data || []).map((d) => d.attributes.productId));
for (const g of GOI) {
  if (coRoi.has(g.pid)) { console.log('IAP co roi', g.pid); continue; }
  const r = await asc('POST', '/v2/inAppPurchases', { data: { type: 'inAppPurchases', attributes: { name: g.ten, productId: g.pid, inAppPurchaseType: 'CONSUMABLE', reviewNote: 'Buy a photo pack. After purchase the app calls our server which verifies the transaction with Apple and issues an access code (DZ-xxxxxx) that unlocks paid AI edits. Test with a sandbox account: buy, then the code appears under Me > My code.' }, relationships: { app: { data: { type: 'apps', id: APP } } } } });
  log('IAP ' + g.pid, r);
  if (r.j?.data?.id) {
    const id = r.j.data.id;
    for (const [loc, name, desc] of [['vi', g.ten, g.mota], ['en-US', g.ten.replace('Gói ', '').replace('ảnh', 'photos').replace('1 photos', '1 photo') + ' pack', g.mota.includes('1 ảnh') ? 'Edit 1 photo with AI (colourise, repair or edit by request).' : 'AI photo edits. Never expires; ends when used up.']]) {
      const l = await asc('POST', '/v1/inAppPurchaseLocalizations', { data: { type: 'inAppPurchaseLocalizations', attributes: { locale: loc, name, description: desc }, relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id } } } } });
      log('  loc ' + loc, l);
    }
  }
}
console.log('→ Giá IAP + ảnh duyệt IAP: đặt tay trên ASC (API giá IAP cần bảng price point, làm tay 1 phút/gói: 20.000đ · 80.000đ · 250.000đ, chọn bậc gần nhất).');

// 2. App info: privacy URL + category
const infos = await asc('GET', `/v1/apps/${APP}/appInfos`);
const info = infos.j?.data?.[0];
if (info) {
  const r = await asc('PATCH', `/v1/appInfos/${info.id}`, { data: { type: 'appInfos', id: info.id, relationships: { primaryCategory: { data: { type: 'appCategories', id: 'PHOTO_AND_VIDEO' } } } } });
  log('category', r);
  const locs = await asc('GET', `/v1/appInfos/${info.id}/appInfoLocalizations`);
  for (const l of locs.j?.data || []) {
    const r2 = await asc('PATCH', `/v1/appInfoLocalizations/${l.id}`, { data: { type: 'appInfoLocalizations', id: l.id, attributes: { privacyPolicyUrl: SITE + '/rieng-tu/', name: 'Duab Zoo', subtitle: l.attributes.locale.startsWith('vi') ? 'Hồi sinh ảnh cũ bằng AI' : 'Old photos, made new with AI' } } });
    log('appInfoLoc ' + l.attributes.locale, r2);
  }
}

// 3. Giá Free + bán toàn cầu
const pp = await asc('GET', `/v1/apps/${APP}/appPricePoints?filter[territory]=USA&limit=1`);
const free = pp.j?.data?.find((p) => p.attributes.customerPrice === '0.0') || pp.j?.data?.[0];
if (free) {
  const r = await asc('POST', '/v1/appPriceSchedules', { data: { type: 'appPriceSchedules', relationships: { app: { data: { type: 'apps', id: APP } }, baseTerritory: { data: { type: 'territories', id: 'USA' } }, manualPrices: { data: [{ type: 'appPrices', id: 'p0' }] } } }, included: [{ type: 'appPrices', id: 'p0', attributes: { startDate: null }, relationships: { appPricePoint: { data: { type: 'appPricePoints', id: free.id } } } }] });
  log('price Free', r);
}
const terr = await asc('GET', '/v1/territories?limit=200');
const r3 = await asc('POST', '/v2/appAvailabilities', { data: { type: 'appAvailabilities', attributes: { availableInNewTerritories: true }, relationships: { app: { data: { type: 'apps', id: APP } }, territoryAvailabilities: { data: (terr.j?.data || []).map((t, i) => ({ type: 'territoryAvailabilities', id: 't' + i })) } } }, included: (terr.j?.data || []).map((t, i) => ({ type: 'territoryAvailabilities', id: 't' + i, attributes: { available: true }, relationships: { territory: { data: { type: 'territories', id: t.id } } } })) });
log('availability', r3);

// 4. Version 1.0: mô tả, từ khoá, review detail, ảnh chợ
const vers = await asc('GET', `/v1/apps/${APP}/appStoreVersions?filter[platform]=IOS&limit=1`);
const ver = vers.j?.data?.[0];
if (!ver) { console.log('Chua co version 1.0 — tao app xong ASC tu co; chay lai script.'); process.exit(0); }
const V = ver.id; console.log('version', V, ver.attributes.versionString, ver.attributes.appStoreState);
await asc('PATCH', `/v1/appStoreVersions/${V}`, { data: { type: 'appStoreVersions', id: V, attributes: { copyright: '2026 Giàng A Hùng' } } });
const vl = await asc('GET', `/v1/appStoreVersions/${V}/appStoreVersionLocalizations`);
const MO_TA = {
  vi: `Duab Zoo giúp anh chị cứu lại những tấm ảnh gia đình đã cũ, mờ, rách — ngay trên điện thoại.

MIỄN PHÍ, chạy ngay trong máy, ảnh không rời khỏi điện thoại:
• Xoá nền ảnh, chọn nền mới
• Làm ảnh thẻ 3×4 / 4×6 / 2×3, nền trắng hoặc xanh
• Xếp 9 / 4 / 16 ảnh thẻ vào tờ 10×15 để mang ra tiệm in

BẰNG AI (mua gói trong app):
• Tô màu ảnh trắng đen
• Vá ảnh rách, ố, mất góc
• Sửa theo yêu cầu: ghi muốn sửa gì, AI làm theo

Giao diện 6 thứ tiếng: Hmoob, Tiếng Việt, English, ພາສາລາວ, ภาษาไทย, 中文.
Không cần tài khoản, không mật khẩu. Xoá dữ liệu của mình bất cứ lúc nào trong mục Cá Nhân.

Chính sách riêng tư: ${SITE}/rieng-tu/
Điều khoản: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`,
  'en-US': `Duab Zoo brings old, blurry or torn family photos back to life — right on your phone.

FREE, runs on your device, photos never leave your phone:
• Remove background, pick a new one
• ID photos 3×4 / 4×6 / 2×3 cm, white or blue background
• Lay out 9 / 4 / 16 ID photos on a 10×15 sheet for printing

WITH AI (photo packs sold in the app):
• Colourise black-and-white photos
• Repair tears, stains and missing corners
• Edit by request: write what to change, AI does it

Interface in 6 languages: Hmong, Vietnamese, English, Lao, Thai, Chinese.
No account, no password. Delete your data any time from the Me tab.

Privacy policy: ${SITE}/rieng-tu/
Terms of use: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`,
};
for (const l of vl.j?.data || []) {
  const loc = l.attributes.locale; const mo = MO_TA[loc] || MO_TA['en-US'];
  const r = await asc('PATCH', `/v1/appStoreVersionLocalizations/${l.id}`, { data: { type: 'appStoreVersionLocalizations', id: l.id, attributes: { description: mo, keywords: loc.startsWith('vi') ? 'ảnh cũ,phục hồi ảnh,xoá nền,ảnh thẻ,tô màu,hmong,mông,duab' : 'old photo,restore,background remover,id photo,colorize,hmong,duab zoo', supportUrl: SITE + '/rieng-tu/', marketingUrl: SITE, promotionalText: loc.startsWith('vi') ? 'Ảnh cũ của ông bà, của bố mẹ — làm rõ lại chỉ trong vài giây.' : 'Grandparents’ old photos — clear again in seconds.' } } });
  log('versionLoc ' + loc, r);
  // Ảnh chợ 6.7" (1290×2796) — 7 ảnh trong anh-cho/
  if (process.env.UP_ANH !== '0') {
    const sets = await asc('GET', `/v1/appStoreVersionLocalizations/${l.id}/appScreenshotSets`);
    let set = sets.j?.data?.find((s) => s.attributes.screenshotDisplayType === 'APP_IPHONE_67');
    if (!set) { const c = await asc('POST', '/v1/appScreenshotSets', { data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_67' }, relationships: { appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: l.id } } } } }); set = c.j?.data; }
    if (set) {
      const daCoAnh = (await asc('GET', `/v1/appScreenshotSets/${set.id}/appScreenshots`)).j?.data?.length || 0;
      if (daCoAnh) { console.log('  anh cho da co', daCoAnh); }
      else for (const f of fs.readdirSync(path.join(process.cwd(), 'anh-cho')).filter((x) => /^\d\d-.*\.png$/.test(x)).sort()) {
        const buf = fs.readFileSync(path.join('anh-cho', f));
        const mk = await asc('POST', '/v1/appScreenshots', { data: { type: 'appScreenshots', attributes: { fileName: f, fileSize: buf.length }, relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: set.id } } } } });
        const sc = mk.j?.data; if (!sc) { log('  anh ' + f, mk); continue; }
        for (const op of sc.attributes.uploadOperations) {
          const h = {}; for (const x of op.requestHeaders) h[x.name] = x.value;
          await fetch(op.url, { method: op.method, headers: h, body: buf.subarray(op.offset, op.offset + op.length) });
        }
        const done = await asc('PATCH', `/v1/appScreenshots/${sc.id}`, { data: { type: 'appScreenshots', id: sc.id, attributes: { uploaded: true, sourceFileChecksum: crypto.createHash('md5').update(buf).digest('hex') } } });
        log('  anh ' + f, done);
      }
    }
  }
}
// Review detail
const rd = await asc('GET', `/v1/appStoreVersions/${V}/appStoreReviewDetail`);
const NOTE = `Duab Zoo is a photo-restoration app. No account or login is required: on first launch the user enters a display name and phone number (used only for support contact) and can delete them any time via Me tab > "Delete my data" (server-side deletion).

Free features (background removal, ID photos, print sheet) run entirely on-device.
Paid AI features (colourise, repair, edit by request) require a photo pack. Packs are sold ONLY via In-App Purchase inside the iOS app (consumables anh1/anh5/anh20). After purchase our server verifies the transaction with Apple and issues an access code that is activated automatically. Test with a sandbox Apple ID: Me tab > "Buy more photos". Every new device also gets 2 free AI edits per day to try.

Language: tap the globe button (top right) to switch between Hmong, Vietnamese, English, Lao, Thai, Chinese.
Privacy policy: ${SITE}/rieng-tu/  · Support: same page (Zalo/phone).`;
const attrs = { demoAccountRequired: false, notes: NOTE, contactFirstName: 'Kub', contactLastName: 'Lis Suav', contactEmail: 'hmong4svn@gmail.com', contactPhone: '+84832076394' };
const rr = rd.j?.data ? await asc('PATCH', `/v1/appStoreReviewDetails/${rd.j.data.id}`, { data: { type: 'appStoreReviewDetails', id: rd.j.data.id, attributes: attrs } })
  : await asc('POST', '/v1/appStoreReviewDetails', { data: { type: 'appStoreReviewDetails', attributes: attrs, relationships: { appStoreVersion: { data: { type: 'appStoreVersions', id: V } } } } });
log('reviewDetail', rr);
console.log('\nCÒN LÀM TAY TRÊN WEB ASC: giá 3 IAP + ảnh duyệt IAP · App Privacy (Publish) · Age Rating (7 bước) · gắn build · Add for Review.');
