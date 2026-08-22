# BÁO CÁO SOI ĐỢT 2 — HMONG X trước lần nộp thứ BA

Aib Kub Lis Suav, em đã soi 10 mặt mà đợt 22/08 chưa đụng tới. Tổng 78 nghi vấn, em tự phản biện từng cái: **45 cái em BÁC BỎ** (sai, hoặc là code chết Apple không chạm tới), **33 cái còn sống**.

Nói thẳng trước: **sau khi kiểm chứng, KHÔNG còn cái nào em dám gọi là "Apple chắc chắn bắt"**. Nhưng có 3 cái nằm đúng trên hai vết thương cũ (3.1.1 và 5.1.1(v)) — chỗ người duyệt lần 3 chắc chắn soi kỹ.

---

## 1. BA THỨ NGUY HIỂM NHẤT

### ① Chữ MỜI MUA TOKEN vẫn lọt vào app iOS — đúng chỗ Apple vừa đánh rớt (3.1.1)

**Cái gì:** Đợt 22/08 chỉ giấu *màn hình* mua token (chặn `hxBuyOpen` khi `HX_IOSAPP`). Nhưng **câu chữ của máy chủ thì không ai lọc**.

```
server.js:815   'Tsis txaus token — ... Yuav token ntxiv los yog hloov gói.'
server.js:2433  'Thov hloov mus rau goi them nyiaj (Plus/Pro/Max).'   need:'upgrade'
server.js:953   '... los yog hloov gói ...'                            need:'limit'
```

Lá chắn iOS ở `web-index.html:1770` **chỉ bắt `need==='token'`**, và cả nhánh đó cũng chỉ *thêm* một toast sạch chứ không huỷ nơi gọi — `web-index.html:2781` vẫn in nguyên văn `j.error` vào bong bóng chat. Hai nhánh `upgrade` và `limit` thì đi thẳng ra màn hình, không qua lá chắn nào.

**Vì sao chết người:** Apple lần 2 nêu **đích danh 3.1.1** (ví token = intermediary currency). Đường chạm dễ nhất: bấm **✍️ Sau Dab Neeg lần thứ HAI** — gói Dawb chỉ cho đúng 1 truyện cả đời (`server.js:2407 DABNEEG_FREE=1`) — là ăn ngay câu "chuyển sang gói trả tiền (Plus/Pro/Max)". Người duyệt đang cầm sẵn thư từ chối 3.1.1 mà thấy câu này thì không cần suy nghĩ lâu.

Nặng hơn báo cáo gốc: `server.js:4032-4033` nhánh vẽ ảnh trong chat đẩy `gt.error` vào bong bóng qua **stream HTTP 200** — nên điều kiện `r.status===402` của lá chắn **về nguyên tắc không thể chặn được**.

**Sửa (chỉ web, không build lại):** mở rộng lá chắn `web-index.html:1770` cho cả `token | upgrade | limit`, chặn nơi gọi in `j.error` (2781, 4375, 4389, 4466, hàm `bao()` 2118), và vá riêng `server.js:4032`. Sạch nhất là làm một hàm `hxLoiSach(j)` trả câu trung tính khi `HX_IOSAPP`. **~45 phút.**

---

### ② Sign in with Apple: xoá tài khoản KHÔNG thu hồi token với Apple — mà code còn vứt luôn chìa khoá

**Cái gì:** `grep revoke` trên cả 9 file = **0 kết quả**. Apple 5.1.1(v) bắt buộc: app có Sign in with Apple thì khi người dùng xoá tài khoản **phải gọi `appleid.apple.com/auth/revoke`**.

```
server.js:3324-3327   ... chỉ dùng tk.id_token — tk.refresh_token bị VỨT
server.js:3538-3562   delete-account: chỉ USERS.splice + saveUsers + ẩn danh ORDERS
                      → không một lời gọi nào ra ngoài
```

**Vì sao chết người:** Đây là thứ người duyệt kiểm được **từ ngoài, không cần đọc code**: đăng nhập bằng Apple → xoá tài khoản trong app → Settings → Apple ID → Sign-In & Security → nếu HMONG X còn trong danh sách là rớt. Apple đã từ chối 5.1.1(v) một lần rồi, lần 3 họ sẽ mở đúng luồng xoá tài khoản. Em xác nhận SIWA **đang sống thật** trên prod: `/api/plans` trả `appleReady:true`, `/api/auth/apple/start` trả 302 sang `appleid.apple.com`.

**Sửa (chỉ server, không build lại), 2 mảnh:**
1. Sau `findOrCreateSocial(...)` (~3341): `if (tk.refresh_token) { u.appleRefresh = tk.refresh_token; saveUsers(); }`
2. Trước `USERS.splice(i,1)` (3549): gọi `postForm('appleid.apple.com','/auth/revoke', {client_id, client_secret: appleClientSecret(), token: gone.appleRefresh, token_type_hint:'refresh_token'})`, bọc try/catch.

⚠️ **Bẫy:** `/auth/revoke` trả **HTTP 200 thân RỖNG**, mà `postForm()` đang `JSON.parse` mọi phản hồi → sẽ báo lỗi giả. Phải nới `postForm` cho phép thân rỗng. Handler cũng phải đổi sang `async (b) => {...}`. **~1 giờ.**

Nợ vĩnh viễn: người đã đăng nhập Apple TRƯỚC bản vá không có refresh_token — họ đăng nhập lại một lần là có.

---

### ③ Xoá tài khoản xong, người khác đăng ký lại đúng email đó THỪA KẾ truyện của người cũ

**Cái gì:** Kho truyện `DN_BO` (dab-neeg-bo.json) khoá theo **chuỗi email**, không phải user.id:

```
server.js:1821  dnBoTim(id,email) → b.email === email
server.js:1822  dnBoCuaToi(email) → DN_BO.filter(b => b.email === email)
server.js:4242  /api/dab-neeg-bo → jsonRes(200, { bo: dnBoCuaToi(u && u.email) })
server.js:3538  delete-account → KHÔNG đụng DN_BO một dòng nào
```

**Vì sao chết người:** Đây là kịch bản người duyệt Apple **hay test đúng như vậy** để kiểm xem "xoá tài khoản" có thật không: xoá → đăng ký lại cùng email → mở Hais Dab Neeg → thấy truyện không phải của mình. Vừa là 5.1.1(v) (dữ liệu không bị xoá) vừa là **5.1.2 (dữ liệu người này chảy sang tay người khác)**. Và reviewer tạo được dữ liệu để thấy: gói Dawb cho viết 1 truyện, truyện đầu luôn `xong:false` — đúng loại `taiBo()` hiện ra.

Cùng bệnh, nặng hơn nữa: `server.js:3547` `fs.copyFileSync(USERS_FILE, USERS_FILE+'.bak-truoc-xoa-'+Date.now())` — chép nguyên users.json (email + salt + hash mật khẩu người vừa xoá) và **không bao giờ dọn**. Ngay trong hàm mang tiêu đề "Apple Guideline 5.1.1(v)".

**Sửa (chỉ server):** ngay sau `USERS.splice(i,1); saveUsers();` thêm `DN_BO = DN_BO.filter(b => b.email !== gone.email); dnBoLuu();`. Bỏ hoặc hẹn dọn dòng copyFileSync 3547. Dài hạn đổi khoá DN_BO sang userId. **~30 phút.**

---

## 2. DANH SÁCH VIỆC

### (A) SỬA WEB LÀ XONG — không build lại, không nộp binary mới

| # | Việc | File + dòng | Thời gian | Mức |
|---|---|---|---|---|
| A1 | Lọc chữ mời mua token/nâng gói cho iOS (cả 3 nhánh need + nhánh stream 200) | `web-index.html:1770, 2118, 2781, 4375, 4389, 4466` · `server.js:815, 953, 2422, 2427, 2433, 4032` | 45' | **RỦI RO** |
| A2 | SIWA revoke: lưu refresh_token + gọi /auth/revoke + nới postForm | `server.js:3327, 3549, 971-996` | 60' | **RỦI RO** |
| A3 | Xoá DN_BO theo email khi xoá tài khoản + bỏ file .bak | `server.js:3547, 3549` | 30' | **RỦI RO** |
| A4 | Tạo ảnh: thêm `timeoutMs:55000` + AbortController 90s (né trần 100s Cloudflare) | `server.js:3023, 2850` · `web-index.html:2778` | 30' | **RỦI RO** |
| A5 | Chặn `taiBo()` khi chưa đăng nhập → hết cảnh thẻ đăng ký tự bung lúc mở app | `web-index.html:4404` (hoặc `server.js:4239` trả 200 `{bo:[]}`) | 10' | Rủi ro nhẹ |
| A6 | Gỡ toast DEBUG băng thu ("BĂNG THU TỆ… RẤT DỄ LÀ BỊA") | `web-index.html:3075-3078` · `server.js:4619` | 10' | Góp ý |
| A7 | Chuỗi server còn dạy "Windows → Sound → Input" (đợt 22/08 sót vì nằm bên server) | `server.js:4564` | 5' | Góp ý |
| A8 | Nút ☰ trắng-trên-trắng ở chế độ Sáng | `web-index.html:947` → thêm `body[data-mode="light"] .nav-toggle span{background:#141A22;box-shadow:none}` | 5' | Góp ý |
| A9 | Ép font 16px cho ô nhập trong app (dùng móc `html.native-app` đang bỏ không ở dòng 41) | `web-index.html:4558-4563` | 10' | Góp ý |
| A10 | Bỏ lời khuyên tắt Hide My Email + bám `p.sub` thay email cho SIWA | `server.js:3334, 774` | 30' | Góp ý |
| A11 | Chốt quyền cho `/api/stt-config` (đang mở toang, ai cũng đổi được nơi nhận băng ghi âm) | `server.js:4203-4214` | 15' | Bảo mật |
| A12 | Che lỗi lộ `.env` ở nút ⭐ Duab Hmoob | `server.js:3037-3038` | 5' | Góp ý |
| A13 | Trần theo IP/ngày cho 4 cửa AI đốt tiền (chat, chat-stream, translate, write-lyrics) | `server.js:3922, 3966, 4056, 4650` | 60' | **Tiền của Aib** |
| A14 | Gộp 2 câu lỗi đăng nhập thành một ("Email lossis password tsis raug") | `server.js:611` | 5' | Bảo mật |
| A15 | `/api/pay/status` bỏ trường `wallet` hoặc bắt token | `server.js:3752` | 10' | Bảo mật |
| A16 | Token đăng nhập thêm hạn dùng (30-90 ngày) | `server.js:586` | 20' | Bảo mật |
| A17 | `startsWith(PUBLIC + path.sep)` cho serveStatic | `server.js:3221, 3269, 3277` | 5' | Phòng xa |
| A18 | Đánh số lại Kuv Chaw 1→11 (đang nhảy 4 → 7) | `web-index.html:1417-1433` | 10' | Góp ý |
| A19 | Bọc nhãn nút social thành `<span>` + thêm khoá "Sign in with Apple/Google" vào D | `web-index.html:3703-3730, 4733+` | 10' | Góp ý |
| A20 | Tạm ẩn mục **English** trong menu 🌐 (chỉ 128/vài nghìn chuỗi có bản en → nhìn như dịch dở) | `web-index.html:871-874` | 5' | Góp ý |
| A21 | Thêm Replicate vào privacy.html mục 3 | `privacy.html` ~45-52 | 3' | Góp ý |
| A22 | Thêm mục 11 vào terms.html: 4 điều khoản EULA tối thiểu của Apple | `terms.html:72-80` | 15' | Góp ý |
| A23 | Đổi "koj lub xov tooj" → "koj lub cuab yeej" (app có khai iPad) | `web-index.html:3209, 3212` | 3' | Góp ý |
| A24 | Sidebar iPad dựng đứng bỏ trống ~700px | `web-index.html:115-118` (chèn `<div style="flex:1 1 auto">` trước `.side-foot`) | 10' | Góp ý |
| A25 | Nút "Khaws daim duab" trong app: đổi sang `navigator.share({files:[File]})` thay vì nhét data URL vào `url` | `web-index.html:60, 2560-2566` | 30' | Góp ý |

**Tổng lane A: ~7 giờ.** Bốn việc A1–A4 là phần đáng làm trước khi nộp; còn lại vá sau khi lên store cũng được.

### (B) PHẢI BUILD LẠI — em khuyên KHÔNG làm trước lần nộp thứ 3

| # | Việc | File + dòng | Ghi chú |
|---|---|---|---|
| B1 | Bỏ iPad: `TARGETED_DEVICE_FAMILY = "1"` | `/Users/laoacu/hmong-x-ios/ios/App/App.xcodeproj/project.pbxproj:312, 333` | Cắt sạch một mặt trận: hết đòi ảnh iPad 13", hết thử xoay 4 hướng/chia đôi màn, hết 4 lỗi iPad ở lane A. **Quyết định của Aib.** |
| B2 | `errorPath: "error.html"` cho màn hình mất mạng | `capacitor.config.json:5-9` + thêm file `www/error.html` | Apple **chưa từng nhắc** chuyện này trong 2 thư từ chối. Để dành lần build sau. |
| B3 | `npm uninstall @capacitor/preferences` (nhúng vào binary, 0 lần gọi) | `package.json:21` · `CapApp-SPM/Package.swift:20, 39` | Chỉ gộp vào nếu đằng nào cũng build. Đừng build riêng vì việc này. |

**Nếu Aib chọn B1 thì làm luôn B2+B3 một thể — một build, một lần nộp.**

### (C) VIỆC CỦA AIB — Claude không làm thay được

| # | Việc | Chỗ làm | Thời gian |
|---|---|---|---|
| C1 | **Xoá mục 5 trong Ghi chú người duyệt** — đang tự khai "IAP chưa xong" rồi *hỏi ngược Apple có nên duyệt không*. Người duyệt không có thẩm quyền trả lời, họ chỉ có nút Reject. | `scratchpad/ghi-chu2.mjs:30-31` → PATCH lại appStoreReviewDetail `47da1c3b-…` | 10' |
| C2 | **Ký Apple Developer Program License Agreement bản mới** — chưa ký thì nộp cũng vô ích; và Paid Apps chưa ký nên chưa làm IAP được. Kiểm lại bằng API: `contentStatuses` phải hết `CANNOT_SELL`. | Agreements, Tax and Banking | 20' |
| C3 | Tắt **Scrape Shield → Email Address Obfuscation** — Cloudflare đang biến email liên hệ trên terms/privacy thành `[email protected]` (5 chỗ) | Cloudflare, tên miền hmongx.com | 5' |
| C4 | **Bấm thử nút ⭐ Duab Hmoob một lần** trên hmongx.com. Ra ảnh = yên tâm. Ra lỗi = prod chưa cắm FAL_KEY, phải ẩn nút đó trong app. | Trình duyệt | 2' |
| C5 | **Bấm micro trên iPhone thật**, thu một câu, xem có toast tiếng Việt "to 4.2% · lặng 91%" không (kiểm A6 đã ăn chưa) | iPhone | 3' |
| C6 | Quyết định **giữ hay bỏ iPad** (B1) | — | — |
| C7 | Đổi subtitle App Store sang song ngữ ("Hmong AI · AI hais lus Hmoob", ≤30 ký tự) + thêm 1 câu tiếng Anh mở đầu promotional text | App Store Connect | 10' |
| C8 | Thêm tên pháp nhân **CÔNG TY TNHH CÔNG NGHỆ HMONG X** vào đầu terms.html + privacy.html (hiện chỉ xưng "chúng tôi" + một gmail cá nhân) | — | 5' |

---

## 3. CÁI GÌ ĐÃ SẠCH — Aib yên tâm mấy mặt này

Em soi kỹ rồi **bác bỏ 45 nghi vấn**. Những mặt sau em kết luận **không có vấn đề** với lần nộp thứ ba:

**Khởi động & vòng đời app**
- **Splash 1200ms không hề để lại màn trống.** Em đo thật 3 lần: `hmongx.com` trả trọn trang trong 0,27–2,05 giây, có brotli, không có tài nguyên nào chặn render (CSS/JS inline hết, không Google Fonts, không script ngoài). Con số "14–28 giây trên 3G" trong nghi vấn ban đầu là bịa.
- **Không có chuyện màn hình trắng vĩnh viễn khi VPS chết.** hmongx.com đứng sau Cloudflare — VPS chết thì Cloudflare trả *trang HTML 522 có chữ*, với WKWebView đó là điều hướng THÀNH CÔNG, không kích hoạt nhánh lỗi. Không phải màn trắng.
- **Push notification KHÔNG phải lỗi Apple.** Em kiểm 4 lần từ 4 góc khác nhau: không có guideline nào cấm hỏi quyền thông báo sớm, dự án lại không bật capability push (`grep aps-environment` = 0, không file .entitlements) nên token chưa từng được ghi. Khối code này đã đi qua **cả hai lần review** mà Apple không nhắc.
- **AppDelegate `.playback` là ĐÚNG, đừng đụng.** Nó sinh ra để chữa bệnh thật (gạt nút im lặng là app câm trên TestFlight). Đổi nó ngay trước lần nộp 3 là mời lại đúng cái bug người duyệt bấm phát một là thấy. Info.plist cũng không khai `UIBackgroundModes` nên không dính 2.5.4.

**iPad & bố cục**
- Quét tràn ngang **toàn bộ 10 màn ở 1024 / 1366 / 820 / 320 đều SẠCH**.
- Sidebar **có `overflow-y:auto`** (dòng 95) — mọi nghi vấn kiểu "footer/Điều khoản/nút Báo cáo rơi khỏi màn hình" đều sai: nội dung cuộn tới được, và ở trạng thái máy mới cài (chưa có lịch sử) thì footer vừa màn, khỏi cuộn.
- **`@capacitor/share` có gọi `setCenteredPopover`** nên không sập UIActivityViewController trên iPad. **LaunchScreen.storyboard** dùng imageView làm root nên phủ đủ màn.
- Nút Báo cáo (Guideline 1.2) có **HAI lối vào**, không phải một: chân sidebar (899) và màn 👤 Tài khoản (3877).

**Pháp lý & metadata**
- **Privacy policy KHÔNG nói sai.** Câu "Lịch sử Keeb Kwm lưu ở máy" là đúng — `hxHist` (4172-4189) thuần IndexedDB, 0 lời gọi mạng. Và privacy.html:31 **đã khai rõ** chat/ảnh/giọng nói được gửi tới nhà cung cấp AI. Không có mâu thuẫn nào để Apple bắt.
- **Terms/Privacy chỉ có tiếng Việt: không có guideline nào bắt phải tiếng Anh.** Cả app vốn là tiếng Mông và đã qua 3 lượt Apple nhìn.
- **Từ khoá ASO, age rating 12+, Support URL, Content Rights = Yes** — em tra chéo với app thật trên store (Instagram/TikTok/Snapchat cùng khai 12+ với ToS 13 tuổi; superlative "first/world's first" trong description đang sống trên store) — không cái nào là cửa từ chối.
- **Hồ sơ nộp cũ KHÔNG khoá nút nộp lần 3.** Version 1.0 đang ở `PREPARE_FOR_SUBMISSION`, và build 2 đã PATCH gắn được — ASC chặn PATCH này khi version bị khoá, nên việc nó đi lọt là bằng chứng version tự do.
- **DSA/EU chưa khai trader chỉ chặn 27 storefront EU**, không chặn nộp — app đã nộp thành công 2 lần với đúng tình trạng này.

**Bảo mật đã dò mà không khai thác được**
- Path traversal: em thử thật `curl /../server.js`, `/../.env`, `/../kho-du-lieu/users.json` — **đều 404**. Chỉ là mẫu code yếu, chưa khai thác được.
- Nhân bản giọng hát / tải file nhạc lên: **toàn bộ là CODE CHẾT** — `flowCard()`, `askPoster()`, `huNkaujFromIdea()` mỗi hàm chỉ xuất hiện đúng 1 lần trong 5.120 dòng (chính dòng định nghĩa), không ai gọi; nút `sing-up-btn` không tồn tại trong DOM. Reviewer không có đường nào chạm tới.
- API giọng đã ẩn danh: `/api/voices` trả `HmongX1…HmongX7`, không lộ tên ca sĩ thật nào.

---

## 4. CÒN MÙ Ở ĐÂU — phải thử trên máy thật

Em nói thẳng những chỗ **đọc code không kết luận được**:

1. **Không có iPhone/iPad thật, không có simulator** (`xcrun simctl list runtimes` rỗng). Nên mọi kết luận về hành vi WKWebView là suy từ tài liệu, không phải đo. Ba chỗ mù cụ thể:
   - iPad có thật sự **tự phóng to** khi chạm ô nhập 15px không (mắt xích chịu lực của việc A9).
   - Share sheet nhận **data: URL** thì iOS hiện những mục gì — em chắc là không có "Save Image", nhưng chưa nhìn tận mắt (A25).
   - Toast/tooltip nào thật sự hiện ra khi bấm micro và từ chối quyền.

2. **Không được POST nên không thử được luồng thật:** không tạo tài khoản, không xoá tài khoản, không chạy hết trần token. Nghĩa là **kịch bản ③ (thừa kế truyện) em suy từ code chứ chưa diễn lại**. Aib nên tự diễn một lần: đăng ký email nháp → viết 1 truyện → xoá tài khoản → đăng ký lại đúng email đó → mở Hais Dab Neeg.

3. **Không biết prod có cắm `FAL_KEY` / `FAL_LORA_URL`** — nên không biết nút ⭐ Duab Hmoob sống hay chết (C4).

4. **Không biết Cloudflare/Caddy có WAF rate-limit** đứng trước không — nên mức độ thật của A13 (cửa AI mở toang) có thể nhẹ hơn em nói.

5. **Chưa đọc được thư từ chối LẦN 1.** Em chỉ có thư lần 2 (`/Users/laoacu/hmong-x-ios/THU-TU-CHOI-APPLE-22-08-2026.md`, review 21/08, iPhone 17 Pro Max iOS 26.6, 5 lỗi: 2.1(a) crash nút chụp ảnh · Guideline 4 đăng nhập trình duyệt ngoài · 5.1.1(v) xoá tài khoản · 3.1.1 IAP · 2.3.10 ảnh). Lý do lần 1 chỉ biết là "2.1 Information Needed".

6. **Chuỗi thời gian tạo ảnh (A4)** em không đo được vì không được gọi API tốn tiền. Em tính từ code: xấu nhất ≈ 30s + treo + 183s, vượt xa trần 100s Cloudflare; ca trung bình ~90s, **sát mép**. Aib bấm tạo 3-4 tấm ảnh liên tiếp, nếu có lần nào quay ~100 giây rồi báo "Sib txuas tsis tau rau server" thì đúng bệnh này.

---

## Em nói thật cuối cùng

Em **không dám hứa Apple duyệt**. Ba lần từ chối đến từ ba thứ khác nhau, và lần nào cũng có cái không ai đoán trước.

Nhưng em chắc chắn hai điều:

- **A1, A2, A3 nằm đúng trên hai vết thương Apple vừa nêu đích danh** (3.1.1 và 5.1.1(v)). Người duyệt lần 3 mở thư cũ ra là biết soi chỗ nào. Ba việc này cộng lại ~2 giờ 15 phút, **chỉ sửa web, không phải build lại, không phải nộp binary mới**.
- **Đừng build lại trước lần nộp này** trừ khi Aib chủ động chọn bỏ iPad (B1). B2 và B3 không đáng đánh đổi một vòng build + upload cho thứ Apple chưa từng nhắc.

Việc của Aib gấp nhất là **C1** (xoá câu hỏi ngược trong ghi chú người duyệt — đang tự nộp bằng chứng chống lại mình) và **C2** (chưa ký License Agreement mới thì bấm nộp cũng không đi được).