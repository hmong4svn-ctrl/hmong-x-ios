# KẾ HOẠCH CHUẨN HOÁ BUILD 2.0 — HMONG X
**Cho Aib Kub Lis Suav · 22/08/2026 · em soạn sau khi rà 10 mặt trên bản snapshot web + iOS đang chạy**

---

## 0. Nói thẳng trước khi đi vào việc

Em rà xong 8 file hồ sơ. Có 3 điều Aib cần nghe trước:

**Một.** Trong 5 lỗi Apple nêu, **4 lỗi nằm ở WEB** — sửa `web-index.html` / `server.js` rồi deploy lên VPS là app iOS tự đổi theo, **không cần build lại, không cần Codemagic, không cần chờ Apple xử lý binary**. Vì `capacitor.config.json` trỏ thẳng `"url": "https://hmongx.com"`. Đây là lợi thế lớn nhất của mình, đừng lãng phí nó bằng cách đi build lại những thứ không cần build.

**Hai.** Lỗi **3.1.1 (token / In-App Purchase) là ngã ba đường thật sự**, không phải việc sửa vặt. Ngày 19/08 đội mình đã ẩn hết cửa mua token trong app (`web-index.html:3812`, `:4053`), vậy mà Apple duyệt ngày 21/08 **vẫn viện 3.1.1**. Nghĩa là: **ẩn nút mua là chưa đủ** — Apple bắt vì *bản thân đồng token tồn tại và tiêu được trong app*. Em nói thật: em **không dám hứa** cách nào chắc chắn qua. Nhưng em phân tích được 2 đường và khuyên rõ Aib nên đi đường nào (mục 1 bên dưới).

**Ba.** Có 2 lỗi **không nằm trong code**, Claude không làm thay được: bộ ảnh chụp màn hình trên App Store Connect (2.3.10) và video quay luồng xoá tài khoản Apple đòi (5.1.1(v)). Hai cái này mà không làm thì code sửa sạch vẫn rớt.

---

## 1. QUYẾT ĐỊNH GỐC — phải chốt TRƯỚC khi làm bất cứ việc nào khác

**Vấn đề:** `server.js:577` khai `const COST = { image: 3, song: 8, beat: 4, video: 80 };` và `server.js:843` khai bảng gói `PACKS` (p50: 50 token / 99.000đ…). Token mua bằng tiền thật ở web (SePay/PayPal/Lemon Squeezy) rồi **tiêu trong app iOS**. Thư Apple ghi nguyên văn: *"The app includes intermediary currencies, such as points, coins, or gems, without using In-App Purchase."*

### Đường A — BẢN iOS SẠCH TIỀN ẢO *(em khuyên chọn cái này)*
Trong app iOS: bỏ hết chữ "token", bỏ số dư, bỏ bảng giá quy đổi. Đổi sang **hạn mức miễn phí theo ngày** (server đã có sẵn cơ chế `readPerDay` / `micPerDay` / `haisPerMonth` ở `server.js:570-576` để bắt chước — vd: iOS được 3 ảnh/ngày, 2 bài nhạc/ngày, hết thì báo "hnub no siv tag lawm, rov qab tag kis").
- **Ưu:** sửa hoàn toàn ở web + server, **KHÔNG cần build lại**, làm xong trong 1 ngày, Apple không ăn 15-30%.
- **Nhược:** người dùng iOS không mua thêm được trong app. Doanh thu iOS = 0, iOS chỉ là kênh phủ thương hiệu.
- **Không chắc:** em không dám khẳng định 100% Apple duyệt. Nhưng khi không còn từ "token", không còn con số đếm, không còn bảng giá — thì không còn "intermediary currency" nào cho họ chỉ vào.

### Đường B — CẮM StoreKit In-App Purchase
Thêm plugin IAP, khai sản phẩm consumable trên App Store Connect, server nhận receipt rồi cộng token.
- **Ưu:** giữ nguyên mô hình kinh doanh, người iOS mua được.
- **Nhược:** code native → **BẮT BUỘC build lại**; phải khai sản phẩm + ký hợp đồng Paid Apps + khai thuế/ngân hàng với Apple; Apple ăn 15-30%; mất ít nhất 1-2 tuần.

> **Em đề nghị:** lần nộp thứ 3 này đi **Đường A** cho nhanh và chắc phần code. Khi app đã lên được App Store rồi, muốn bán token thì làm IAP ở bản 2.1 sau, lúc đó không bị áp lực.

**Aib chốt A hay B — em mới bắt tay làm mục 2 được**, vì toàn bộ nhóm A1 phụ thuộc quyết định này.

---

# NHÓM A — SỬA WEB LÀ XONG, KHÔNG CẦN BUILD LẠI
*Làm được ngay hôm nay. Deploy `web-index.html` + `server.js` lên VPS là app trên máy Apple đổi theo ngay.*

## A1 · Dọn sạch mọi vết token trong bản iOS — **CHẶN NỘP** · Guideline 3.1.1
**Ước tính: 2–3 tiếng** (nếu đi Đường A thì cộng thêm ~3 tiếng làm hạn mức ngày)

Đây là **6 chỗ rò**, phải bịt hết, bịt sót một chỗ là công cốc:

| # | Chỗ rò | File · dòng | Đang hiện gì |
|---|---|---|---|
| 1 | **Ví trên thanh trên cùng** (mọi màn hình) | `web-index.html:1786-1789` | `n.innerHTML = '<span class="hx-uname">'+nm+'</span> <img class="tokic"...> ' + HXME.tokens;` — hàm `walletPaint()` **không có nhánh iOS nào** |
| 2 | **Ô tài khoản** (chính là màn có nút xoá) | `web-index.html:3809-3811` | `🪙 Koj muaj <b>N</b> token` + `Nqi token: 🎨 duab <b>3</b> · 🎵 nkauj <b>8</b>` — chỉ mỗi dòng 3812 (nút mua) có cờ `HX_IOSAPP`, 3 dòng trên thì không |
| 3 | **Hộp "🪙 Token" của chính nhánh iOS** | `web-index.html:4053-4058` | Nhánh viết riêng cho iOS mà vẫn in bảng giá `Nqi token: 🎨 duab 3 · 🎵 nkauj 8` |
| 4 | **Câu mời mua từ server** | `server.js:815` | `'Tsis txaus token — xav tau ' + cost + ', koj muaj ' + u.credits + '. **Yuav token ntxiv los yog hloov gói.**'` — dịch ra là *"Mua thêm token hoặc đổi gói"*, đúng thứ anti-steering cấm. 13 cửa API dùng chung câu này |
| 5 | **Đường stream lách qua bộ chặn** | `server.js:4031-4034` | Khi vẽ ảnh trong khung Chat, header đã gửi rồi nên server nhét câu mời mua **vào giữa dòng chat** dưới HTTP 200 — bộ chặn iOS ở `web-index.html:1762` chỉ bắt `status===402` nên không với tới |
| 6 | **Dab Neeg mời nâng gói** | `server.js:2427` và `:2433` | `'Thov hloov mus rau goi them nyiaj (Plus/Pro/Max).'` — nêu đích danh tên gói. `DABNEEG_FREE` mặc định = 1 nên viết truyện thứ 2 là dính |

**Điểm dễ chạm nhất mà Aib nên biết:** tài khoản mới chỉ được **27 token** (`server.js:580`), mà `COST.video = 80`. Nghĩa là người duyệt bấm nút video **lần đầu tiên** đã thấy câu mời mua. Không cần đốt hết token.

**Cách làm (Đường A):**
1. `server.js:815` — cắt hẳn vế `"Yuav token ntxiv los yog hloov gói."`, chỉ để lại phần báo sự thật.
2. `server.js:2422, 2427, 2433` — bỏ hết cụm `"hloov mus rau goi them nyiaj (Plus/Pro/Max)"` và `"hloov mus rau goi siab dua"`.
3. `web-index.html:1786-1789` — khi `window.HX_IOSAPP` thì chỉ hiện tên, bỏ icon + số + class `low`.
4. `web-index.html:3809-3811` — bọc `(window.HX_IOSAPP ? '' : ...)` giống hệt cách dòng 3812 đang làm.
5. `web-index.html:4053-4058` — bỏ nốt bảng giá trong chính nhánh iOS.
6. `web-index.html:1762` — đổi toast `'Koj cov token tag lawm.'` sang câu không có chữ token, kiểu `'Hnub no siv tag lawm — rov qab tag kis.'`
7. Thêm một hàm lọc chung: mọi chỗ vẽ `j.error` ra màn hình, khi `HX_IOSAPP` thì thay bằng câu trung tính. Hiện đang vẽ thô ở `web-index.html:2736` (`add('uaduab','bot','⚠︎ '+j.error)`), `:2675`, `:3205`.

> **Em nói thẳng chỗ không chắc:** nếu Aib chọn Đường A nửa vời — chỉ xoá chữ mà backend vẫn trừ `u.credits` theo `COST` — thì về bản chất vẫn là tiền ảo, chỉ là giấu tên. Apple có thể vẫn bắt. Muốn sạch thật thì bản iOS phải **đổi sang đếm lượt/ngày**, không trừ ví.

---

## A2 · Làm nút xoá tài khoản NHÌN RA ĐƯỢC — **CHẶN NỘP** · Guideline 5.1.1(v)
**Ước tính: 45 phút**

Sự thật quan trọng: **app CÓ chức năng xoá và nó chạy thật.** Nút ở `web-index.html:3815` (`🗑 Rho tawm kuv tus account`), luồng xác nhận ở `:3831-3862`, backend ở `server.js:3538` xoá thật (`USERS.splice(i,1); saveUsers();`), không phải nút giả. Nút **không** bị cờ iOS ẩn.

Vậy tại sao Apple báo không tìm thấy? Vì **4 rào cản chồng nhau**:

**(a) Cửa vào bị dán nhãn sai.** Nút duy nhất dẫn tới đó là chip ví ở `web-index.html:1023` + `:1786`. Khi đã đăng nhập nó hiện: *tên + ảnh chú bé Mông + con số token*. Không có 👤, không có chữ "Account", không có bánh răng. Người duyệt nhìn ra "số dư credit", không nghĩ trong đó có mục xoá tài khoản.
→ **Sửa `:1786`**: thêm `'👤 '` vào đầu, và sửa `b.title` thành có chữ `Account`.

**(b) Có mồi nhử dẫn sai đường.** Sidebar có mục **"Kuv Chaw"** (`:875`) → mở `#view-kuv-chaw` (`:1389`) tiêu đề *"👤 Tus Tswv Cov Ntaub Ntawv"*, bản dịch tiếng Anh là **"My Space"**. Người duyệt bấm vào đây tìm nút xoá — trong đó **không có**. Đây rất có thể là đúng đường họ đã đi.
→ **Sửa**: thêm một lối vào thứ hai — dòng `🗑 Delete my account` ở cuối `#view-kuv-chaw`, gọi thẳng `showDel()`.

**(c) Nút xác nhận cuối bị dịch sai nghĩa.** Nút ở `:3839` dùng chuỗi `'🗑 Rho tawm tag nrho'` — **trùng khoá** với nút xoá lịch sử ở `:1596`. Từ điển `:4797` dịch chuỗi đó thành `en:"🗑 Clear all"`. Nghĩa là nếu người duyệt bật English, **nút bấm cuối của luồng xoá tài khoản hiện chữ "Clear all"**. Ai dám tin đó là nút xoá tài khoản?
→ **Sửa**: đổi `:3839` (và 2 chỗ gán lại `textContent` ở `:3848`, `:3858`) sang chuỗi riêng, vd `'🗑 Rho tawm kuv tus account tag nrho'`, rồi thêm khoá mới vào từ điển `D` với `en:'🗑 Permanently delete my account'`.

**(d) Cả luồng xoá không có trong từ điển.** Em grep rồi: `'🗑 Rho tawm kuv tus account'` (`:3815`) và `'🗑 Rho tawm account'` (`:3834`) **không có** trong từ điển `D` (`:4664-4805`). Bật English thì chúng vẫn đứng nguyên tiếng Mông. Chuỗi tiếng Anh duy nhất đọc được trong hộp thoại lại là… "Clear all".
→ **Sửa**: thêm 3-4 khoá vào `D`. **Rẻ hơn nữa**: sửa thẳng `:3815` thành song ngữ `'🗑 Rho tawm kuv tus account · Delete my account'` — đọc ngôn ngữ nào cũng thấy chữ *Delete*, không phụ thuộc người duyệt có bấm đổi ngôn ngữ hay không. Em khuyên làm cách này, chắc ăn nhất.

⚠️ Tuyệt đối **KHÔNG** đưa chuỗi placeholder `'RHO TAWM'` (`:3838`) vào từ điển. Nếu nó bị dịch thì nút xác nhận sẽ không bao giờ mở khoá được (`:3845` so sánh cứng `=== 'RHO TAWM'`). Chỉ nên thêm một dòng tiếng Anh phía trên ô: *"Type RHO TAWM to confirm"*.

---

## A3 · Dọn chữ "máy tính Windows" còn sót trong app — **RỦI RO** · Guideline 2.3.10 / 4
**Ước tính: 20 phút**

Đây là chữ **hiện ra cho người dùng**, trong app iPhone:

| Dòng | Nội dung | Vấn đề |
|---|---|---|
| `web-index.html:3153` | `'🚫 Browser tsis teb thaum thov mic... **QHIB HAUV GOOGLE CHROME: http://localhost:8787**'` | Bảo người dùng iPhone mở Google Chrome vào localhost. **Nặng nhất.** Nhánh này nổ khi getUserMedia treo >15s — đúng tình huống webview |
| `web-index.html:3150` | `'Nias lub 🔒 ntawm **chaw sau URL** → Microphone → Allow'` | App Capacitor **không có thanh địa chỉ**. Người dùng bị kẹt |
| `web-index.html:3151` | `'Tsis pom mic hauv koj lub **computer**'` | Gọi iPhone là "máy tính" |
| `web-index.html:3152` | `'Mic raug lwm tus program siv lawm (**Zoom/Zalo/OBS**…)'` | 3 phần mềm máy tính |
| `web-index.html:2967` | `'...Qhib dua ntawm: http://localhost:8787\nLosis siv link https (**MO-WEB.bat**)'` | File `.bat` của Windows |
| `web-index.html:2968` | `'Siv **Google Chrome / Edge** tshiab.'` | Trình duyệt desktop |

**Cách sửa:** viết lại 6 chuỗi theo giọng iOS. Với `NotAllowedError` trên iOS, hướng dẫn đúng là *Settings → HMONG X → Microphone*. Gọn nhất: bọc một hàm chọn thông điệp theo `window.HX_IOSAPP` — iOS một bộ chữ, web một bộ chữ.

**Vì sao Apple cần:** lần này Apple đang cầm sẵn cây gậy 2.3.10 (*"metadata includes information about third-party platforms"*). Em thành thật: 2.3.10 nguyên nghĩa là nói về **ảnh trên App Store Connect**, không phải chữ trong app — nên em **không chắc** Apple sẽ bắt mấy chuỗi này. Nhưng câu ở `:3153` bảo người dùng "mở Google Chrome" thì dính đúng tinh thần Guideline 4 (đẩy ra trình duyệt ngoài — đúng cái Apple vừa bắt), và sửa chỉ mất 20 phút. Không có lý do gì để lại.

---

## A4 · Sửa ô soạn bị bóp còn 58px trên iPhone — **RỦI RO** · Guideline 2.1
**Ước tính: 20 phút, chỉ CSS**

Em đo thật bằng Chrome (mở snapshot qua http, đặt viewport iPhone):
- Màn **Tsim Duab** ở 375px: ô nhập chỉ rộng **58px** (~3 ký tự), trong khi nút "Tsim Duab" chiếm 151px, mic 52px, nút + 40px.
- Ở 430px: ô nhập 113px.
- Màn **Chat** (màn mặc định, người duyệt thấy đầu tiên): 143px ở 375px, 198px ở 430px.

**Gốc bệnh:** khối `cgpt` ở `web-index.html:4988-4999` bê nút `.send` và `.rpick` **ra khỏi** `.ctools` để nhét vào `.crow`/`.cright`. Nhưng luật cứu bố cục điện thoại ở `:996` viết theo cấu trúc cũ (`.composer .ctools .send{flex:1 1 100%}`) nên **không còn khớp phần tử nào** — luật xuống hàng đã chết âm thầm. Khối CSS mới ở `:4433-4436` thì không có media query điện thoại nào.

**Sửa:** thêm sau khối `:4436`:
```css
@media (max-width:560px){
  .composer .crow{flex-wrap:wrap}
  .composer .crow textarea{flex:1 1 100%;order:1}
  .composer .cplus-wrap{order:2}
  .composer .cright{order:3;flex:1 1 auto;justify-content:flex-end}
  .composer .cright .send{flex:1 1 auto;justify-content:center}
}
```
Tức ô nhập chiếm trọn 1 hàng, hàng dưới mới là `[+] [mic] [nút gửi]`. Chữa luôn cả 2 màn.

**Trung thực về mức độ:** Apple duyệt trên iPhone 17 Pro Max = 440pt, không phải 375pt. Ở 440px placeholder xuống 3 dòng vẫn đọc được, không "cụt còn chữ Piav" như báo cáo thô mô tả. Nên đây **không phải chặn nộp** — nhưng nó xấu thật với người dùng iPhone màn nhỏ, và sửa 20 phút.

---

## A5 · Nút "⬇ Download duab" chết trong app — **RỦI RO** · Guideline 2.1
**Ước tính: 30 phút**

4 nút tải ảnh: `web-index.html:2605`, `:2740`, `:4158`, `:4183`. Cả 4 gắn `<a download>` vào một **data: URL** (server trả `data:image/png;base64,...` ở `server.js:2759`, `:2802`).

Em đọc thẳng mã nguồn Capacitor 8.4.2 trên máy Aib (`WebViewDelegationHandler.swift:100-114`): URL `data:` có host = nil, không khớp `allowNavigation`, nên rơi vào nhánh `UIApplication.shared.open(navURL)` rồi `.cancel`. iOS được đưa một data: URL không ai mở được → **bấm là im ru, không tải, không báo lỗi**.

**Nhưng đừng hoảng:** app vốn dạy người dùng cách khác — `web-index.html:1334` ghi *"🖼️ Duab AI — nias daim duab kom download"* (bấm/giữ vào **ảnh** để tải), và giữ lâu trên `<img>` trong WKWebView vẫn ra menu Save to Photos. Info.plist đã có `NSPhotoLibraryUsageDescription`. Nên **vẫn còn đường lưu ảnh chạy được**; nút ⬇ chỉ là nút phụ chết.

Các nút tải **nhạc** (`:3216`, `:3403`, `:3425`, `:3504`) dùng URL https nên vẫn chạy — chỉ 4 nút ảnh chết.

**Sửa:** khi `window.HX_IOSAPP` thì ẩn 4 thẻ `<a download>` đó và hiện dòng chữ *"nias daim duab kom khaws"*. Hoặc nối vào `window.hxNativeShare` — hàm này **đã viết sẵn ở `:60` mà cả file không chỗ nào gọi** (grep ra đúng 2 lần: 1 comment + 1 định nghĩa). Gắn nút 📤 vào mỗi thẻ ảnh/nhạc là vừa chữa được lỗi, vừa có tính năng native để khoe với Apple (chống 4.2).

**Trung thực:** Apple đã duyệt 2 lần, chưa lần nào nhắc nút tải ảnh. Đây là lỗi thật nhưng chưa từng bị bắt.

---

## A6 · Ba việc dọn nhỏ ở web — **GÓP Ý**
**Ước tính: 30 phút cả cụm**

1. **Link Điều khoản / Bảo mật văng ra Safari** — `web-index.html:900-901` dùng `target="_blank"`. Em đọc mã Capacitor: `createWebViewWith` gọi thẳng `UIApplication.shared.open()`, **không** kiểm `allowNavigation`, nên dù cùng tên miền hmongx.com vẫn bật Safari ngoài. → Bỏ `target="_blank"` ở cả 2 thẻ. *(Nói thật: link pháp lý mở trình duyệt hệ thống là chuẩn phổ biến, Apple không từ chối vì việc này. Nhưng lần này họ đang soi Guideline 4, sửa cho sạch.)*

2. **Trang báo đăng nhập xong vẫn bảo tự quay về app** — `server.js:710-717`: `'Thov <b>rov qab mus rau app HMONG X</b>'`. Câu này viết cho thời còn đá ra Safari ngoài. Nay dùng Safari View Controller, app tự `B.close()` sau ~2 giây. Chữ này làm người duyệt tưởng vẫn bị đá ra ngoài. → Đổi thành *"Nkag tau lawm — tos ib pliag…"*

3. **Đường lui đăng nhập trỏ sai tên miền** — `web-index.html:3694` dùng `location.origin` (= hmongx.com, nằm trong `allowNavigation`) cho nhánh dự phòng `location.href`. Nhánh này chỉ chạy trên app đời cũ chưa có plugin Browser, nên **không ảnh hưởng bản nộp** — nhưng người đang test TestFlight 1.0(1) sẽ dính Google chặn `disallowed_useragent`. → Đổi sang tên miền ngoài `allowNavigation`, hoặc bỏ hẳn nhánh đó.

---

## A7 · Nợ kỹ thuật phía server, làm sau khi nộp cũng được — **GÓP Ý**
**Ước tính: 1 tiếng**

Apple **không thể** thấy mấy cái này (họ không đọc được ổ đĩa VPS). Nhưng nó mâu thuẫn với chính lời hứa mình in trên màn hình, nên nên dọn:

- `server.js:3547` — `fs.copyFileSync(USERS_FILE, USERS_FILE + '.bak-truoc-xoa-' + Date.now())`. Mỗi lượt xoá tài khoản đẻ **một bản sao toàn bộ users.json** (email + salt + hash mật khẩu), grep cả file thì chuỗi `bak-truoc-xoa` chỉ xuất hiện đúng 1 lần → **không có chỗ nào dọn**. Trong khi `web-index.html:3836` hứa với người dùng *"xoá vĩnh viễn… Không khôi phục được"*. → Bỏ dòng đó (`saveUsers()` đã ghi đè an toàn rồi), hoặc giữ backup nhưng ghi bản **đã lọc bỏ** người vừa xoá + tự dọn sau 7 ngày.
- `server.js:3573-3577` — email người đã xoá vẫn nằm trong `ceeb-toom.jsonl`. → Ẩn danh giống cách đang làm với ORDERS ở `:3555`.
- `web-index.html:3853` — sau khi xoá tài khoản chỉ gỡ `AUTH_KEY`, kho `hxHist` (ảnh/nhạc/bản dịch) vẫn nằm nguyên trên máy. → Gọi thêm `hxHist.clear()` (hàm đã có sẵn, nút `kk-clear` ở `:1596` đang dùng).
- **Lỗ cày token:** xoá tài khoản xong đăng nhập lại bằng Google là `findOrCreateSocial` (`server.js:771`) tạo mới và tặng lại 27 token. Không phải lỗi Apple, nhưng là lỗ thủng doanh thu.

---

## A8 · Một chỗ em CHƯA KIỂM ĐƯỢC, Aib nhớ soi trước khi deploy
`web-index.html:16` vẫn đăng ký Service Worker: `navigator.serviceWorker.register('/sw.js')`. App nạp đúng origin hmongx.com nên **SW đăng ký được trong WKWebView**.

⚠️ **Toàn bộ chiến lược "sửa web là app đổi theo" đứng trên giả định app luôn lấy HTML mới.** Nếu `public/sw.js` dùng cache-first cho trang chủ, máy nào đã mở app một lần sẽ **tiếp tục ăn bản HTML cũ** — tức bản Apple vừa từ chối — kể cả sau khi mình vá xong trên VPS.

File `sw.js` **không có trong bộ hồ sơ** nên em không kết luận được là đang hỏng. **Đây là việc bắt buộc phải mở ra xem trước khi nộp lại.** Nếu nó cache `index.html` thì đổi sang network-first cho HTML, hoặc bọc dòng 16 lại: `if(!window.HX_IOSAPP && 'serviceWorker' in navigator){...}`.

*(Điểm đỡ lo: `server.js:3226` đã đặt `Cache-Control: no-cache, no-store, must-revalidate` cho mọi `.html`/`.js` — nên khả năng cao SW không giữ bản cũ. Nhưng vẫn phải mở ra nhìn.)*

---

# NHÓM B — PHẢI BUILD LẠI MỚI ĂN
*Mã native, deploy web không đẩy được. Gom hết vào **MỘT** lần build, đừng build lẻ.*

## B1 · Bản 1.0(2) đã vá crash camera — xác nhận lại là đủ · Guideline 2.1(a)
**Ước tính: 0 (đã làm), chỉ cần xác nhận**

Apple crash khi bấm *'take photo'*. "Take Photo" là nhãn của **bảng chọn hệ thống iOS**, chỉ hiện khi ô file **không** có thuộc tính `capture` — tức 3 ô thuần ở `web-index.html:1710` (`fd-img-pick`), `:1712` (`pf-avatar-pick`), `:1714` (`imgpick`). Nguyên nhân gần như chắc chắn: bản 1.0(1) thiếu `NSCameraUsageDescription` → iOS TCC giết tiến trình.

`Info.plist:25-30` **nay đã có đủ** `NSCameraUsageDescription` / `NSPhotoLibraryUsageDescription` / `NSMicrophoneUsageDescription`. Cái này nằm trong build 1.0(2).

→ **Việc cần làm: bảo đảm bản nộp lần 3 là build ĐÃ KÈM Info.plist mới, tuyệt đối không nộp lại 1.0(1).**

**Góp ý kèm (rẻ, làm luôn khi build):** đổi 3 ô file ở `:1710`, `:1712`, `:1713` từ `style="display:none"` sang `position:fixed;left:-9999px;width:1px;height:1px;opacity:0`. Phần tử `display:none` nằm ngoài cây bố cục, trong WKWebView có trường hợp `.click()` bằng mã bị bỏ qua — đúng kiểu triệu chứng "bấm take photo không lên gì". *(Đây là phòng xa, em chưa thử trên iPhone thật.)* — Cái này thực ra là **web**, làm được ngay không cần build.

## B2 · AVAudioSession bật sai chỗ — mở app là cắt nhạc người ta đang nghe
**Ước tính: 10 phút code, ăn theo build**

`AppDelegate.swift:17-22`:
```swift
try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
try AVAudioSession.sharedInstance().setActive(true)
```
Bản vá này đúng bệnh (gạt im lặng thì máy đọc vẫn kêu) nhưng đặt sai chỗ: `setActive(true)` chạy ngay trong `didFinishLaunchingWithOptions`, **trước khi app phát bất cứ tiếng nào**, `options` rỗng nghĩa là không mixable → hệ điều hành tắt phiên âm thanh của app khác. Người dùng đang nghe nhạc, mở HMONG X, nhạc tắt phụt.

**Sửa:** dời `setActive(true)` xuống ngay trước lúc TTS thật sự phát (web chỉ mở khoá TTS khi người dùng chạm — `web-index.html:1856`), hoặc thêm `options: [.mixWithOthers]`. `.playback` vẫn kêu khi gạt im lặng trong cả hai cách.

**Trung thực:** Apple **không** có guideline nào bắt lỗi này, cả 2 lần từ chối không nhắc âm thanh. Chỉ làm khi đằng nào cũng build.

## B3 · Thêm `ITSAppUsesNonExemptEncryption`
**Ước tính: 2 phút, ăn theo build**

`Info.plist` (57 dòng, em đọc hết) không có khoá này. Thiếu nó thì mỗi bản build lên App Store Connect đều bị hỏi câu về xuất khẩu mã hoá, phải bấm tay.

**Trung thực về mức độ:** build 1.0(1) đã lọt qua khâu này **hai lần** (thư ghi Submission ID + review date + máy thử, tức đã tới tay người duyệt). Nên **nó KHÔNG chặn nộp**, chỉ là một cú bấm. Đừng build lại chỉ vì nó. Thêm `<key>ITSAppUsesNonExemptEncryption</key><false/>` khi build vì lý do khác (app chỉ dùng HTTPS nên khai `false` là đúng luật).

## B4 · Cân nhắc tắt iPad + xoay ngang
**Ước tính: 5 phút, ăn theo build**

`pbxproj-tomtat.txt:6, 10`: `TARGETED_DEVICE_FAMILY = "1,2"` (bật cả iPad). `Info.plist:41-53` cho xoay ngang.

**Trung thực:** đây là **mặc định của Capacitor**, không phải Aib làm sai, và app đã qua 2 vòng duyệt với cấu hình này mà chưa lần nào bị nhắc. Apple chỉ test trên iPhone 17 Pro Max (ghi rõ trong thư). Web cũng có breakpoint `@media (min-width:901px)` nên iPad ngang rơi vào bố cục máy tính đã chạy thật.

**Nhưng:** vì đang là app universal, khi làm lại bộ ảnh để vá 2.3.10 thì **phải làm cả 2 bộ** — iPhone 6.9" *và* iPad 13". Sửa mỗi bộ iPhone rồi nộp là có thể bị bắt lại ở bộ iPad.

→ **Quyết định của Aib:** nếu không muốn nuôi bộ ảnh iPad thì đổi về `"1"` + bỏ 2 mục Landscape (phải build lại). Nếu giữ thì phải chụp thêm bộ iPad bằng iPad Simulator (miễn phí, không cần mua máy).

## B5 · SỬA CODEMAGIC TRƯỚC KHI BUILD — không thì sắp chết ở khâu ký
**Ước tính: 20 phút · KHÔNG cần build lại, nhưng phải làm TRƯỚC lần build tới**

`codemagic.yaml:76-88`:
```yaml
ssh-keygen -t rsa -b 2048 -m PEM -f /tmp/hmongx_cert_key -q -N ""
app-store-connect certificates create --type IOS_DISTRIBUTION --certificate-key=@file:/tmp/hmongx_cert_key --save || true
app-store-connect fetch-signing-files "$BUNDLE_ID" --type IOS_APP_STORE --certificate-key=@file:/tmp/hmongx_cert_key --create
```
Khoá RSA sinh vào `/tmp`, máy Codemagic sạch mỗi lần chạy → **mỗi build là một chứng chỉ phân phối mới** trong tài khoản Apple. Apple giới hạn số chứng chỉ distribution (số ít, 2-3 tuỳ loại). Build 1.0(1) và 1.0(2) đã đốt khoảng 2 cái. Mà đường 3.1.1 nếu đi Đường B (IAP) thì phải build đi build lại nhiều lần — **đúng lúc gần trần nhất**.

**Sửa:**
1. Chạy `ssh-keygen` **một lần** trên Mac.
2. Dán khoá riêng vào biến môi trường mã hoá `CERTIFICATE_PRIVATE_KEY` trong Codemagic (group `ios_signing`).
3. Trong yaml: bỏ hẳn `ssh-keygen` và lệnh `certificates create`; chỉ còn `fetch-signing-files ... --certificate-key=@env:CERTIFICATE_PRIVATE_KEY --create`.
4. Vào developer.apple.com → Certificates, **revoke** các chứng chỉ IOS_DISTRIBUTION thừa từ các build trước, giữ đúng 1 cái khớp khoá cố định.

**Đính chính báo cáo thô:** khi đụng trần thì build sẽ chết **ồn ào** (mail failure đã cấu hình ở `codemagic.yaml:114-119`), không im lặng như báo cáo lo. Nhưng vẫn nghẽn đường nộp.

**Góp ý kèm:** `codemagic.yaml:112` chỉ có `submit_to_testflight: true`, không khai `beta_groups` → build chỉ phát cho internal tester. Nếu muốn người khác thử luồng xoá tài khoản trên máy họ thì cần nhóm external, mà nhóm external phải qua Beta App Review → tạo trước 2-3 ngày.

---

# NHÓM C — VIỆC CỦA AIB, EM KHÔNG LÀM THAY ĐƯỢC

## C1 · CHỤP LẠI TOÀN BỘ ẢNH APP STORE — **CHẶN NỘP** · Guideline 2.3.10
**Ước tính: 1-2 tiếng**

Lỗi này **100% nằm trên App Store Connect, không nằm trong code**. Thư Apple: *"metadata includes information about third-party platforms"*. Chừng nào bộ ảnh chưa thay thì nộp lại vẫn rớt đúng mục này, dù code có vá sạch.

**Luật chụp:**
- Chụp bằng **iPhone thật hoặc iOS Simulator**. Đúng kích thước 6.9″: `1320×2868` hoặc `1290×2796`.
- **Tuyệt đối không**: khung máy Android, thanh địa chỉ / tab / nút Chrome-Safari, con trỏ chuột, ảnh ghép từ màn desktop. Muốn có khung máy thì chỉ dùng khung iPhone.
- ⚠️ Trong bộ nhớ vault có ghi *"Chrome headless ép ngang 500px"* — nghĩa là ảnh cũ **nhiều khả năng dựng bằng Chrome trên máy**, đó chính là thứ Apple bắt.
- Nếu giữ `TARGETED_DEVICE_FAMILY = "1,2"` thì phải có **cả bộ iPad 13″** (`2064×2752`), dùng iPad Simulator.

**Đừng đưa các màn này vào ảnh:**
- Màn **"Cov Cuab Yeej"** (`web-index.html:1533, 1538, 1544`) — có chữ *Facebook*, *TikTok*, *Reels*. Trong app thì vô hại (CapCut, Canva đều làm vậy), nhưng chui vào ảnh App Store là chui thẳng vào metadata.
- Màn **Ai Laj Luam** hồ sơ (`:1196`) — placeholder *"Facebook, TikTok, Zalo, YouTube, livestream…"*
- Bất cứ màn nào còn hiện số token (sau khi làm A1 thì hết).

**Mô tả + từ khoá — em soạn sẵn, Aib chỉ việc dán:**

> **Tên (30 ký tự):** `HMONG X — Hmong AI`
> **Phụ đề (30):** `Chat, voice, art in Hmong`
>
> **Mô tả (tiếng Anh trước, bản Hmoob đặt sau trong cùng ô):**
> *HMONG X is an AI assistant that speaks and writes Hmong (RPA). Chat in Hmong and get answers in Hmong. Listen: the app reads any Hmong text out loud in a natural Hmong voice. Speak: talk in Hmong and the app writes it down. Translate between Hmong, Vietnamese, Lao, Thai, English and Chinese. Create images from a Hmong description. Make songs with Hmong lyrics. Hear Hmong folk stories. Get help writing sales copy for your small business. Everything you make is saved in your own history on your device. Chat and voice are free and unlimited.*
>
> **Từ khoá (100 ký tự, phẩy không khoảng trắng):**
> `hmong,hmoob,rpa,lus hmoob,txhais lus,hmong voice,hmong ai,dab neeg,nkauj,suab hmoob,translate,tts`

❌ **CẤM đưa vào mô tả/từ khoá:** `facebook`, `tiktok`, `zalo`, `shopee`, `android`, `google play` (2.3.10), `chatgpt`, `gemini`, `openai` (5.2.1 — tên đối thủ), và `hmongx.com` / `kubsuav.com` (chỉ điền vào ô Support URL & Marketing URL).

❗ Nếu đi **Đường A** thì mô tả **không được nhắc token**. Nếu đi **Đường B** (IAP) thì câu cuối để: *"Images and songs use tokens; new accounts start with free tokens."* — chỉ nói token **dùng** vào việc gì, tuyệt đối không nói mua ở đâu.

## C2 · QUAY VIDEO LUỒNG XOÁ TÀI KHOẢN — **CHẶN NỘP** · Guideline 5.1.1(v)
**Ước tính: 15 phút**

Apple **đòi đích danh** video này trong thư từ chối. Quay màn hình iPhone, một mạch không cắt:
1. Mở app từ màn hình chính
2. Tạo tài khoản mới (hoặc đăng nhập) bằng **email + mật khẩu** — luồng này chạy trọn trong app, không đụng trình duyệt
3. Bấm nút tài khoản trên thanh trên (sau khi làm A2 thì nó có chữ 👤 / *Account*)
4. Bấm `🗑 Delete my account`
5. Gõ `RHO TAWM`, bấm nút xác nhận
6. Quay cảnh đăng nhập lại bằng đúng tài khoản đó → **không vào được**

Upload video vào phần trả lời Apple, kèm **App Review Notes** viết bằng tiếng Anh chỉ rõ đường đi từng bước (vì UI là tiếng Mông).

## C3 · Thử mic trên iPhone thật trước khi nộp
**Ước tính: 10 phút**

Chính code đã tự ghi nhận bệnh — `web-index.html:3108-3111` có comment *"getUserMedia có thể TREO VĨNH VIỄN (webview không cấp quyền, không báo lỗi) → chặn 15s"*.

`NSMicrophoneUsageDescription` trong Info.plist là điều kiện **cần nhưng chưa đủ**: từ iOS 15, WKWebView chỉ cấp quyền thu tiếng khi lớp chủ trả lời `requestMediaCapturePermissionFor` của `WKUIDelegate`. Em **không đọc được** phần đó trong hồ sơ nên **không dám khẳng định là thiếu** — nhưng cũng **không có bằng chứng nào** cho thấy nó đã chạy được trên iPhone.

Mic có mặt ở **5 cửa**: `mic-chat` (`:1097`), `flow-mic` (`:1311`), `mic-uaduab` (`:1332`), `tx-mic` (`:1367`), `mic-lajluam` (`:2849`).

**Cách thử:** cài TestFlight lên iPhone, bấm 🎤 ở cửa Chat. Có hiện hộp xin quyền micro của iOS không? Có ra chữ không?
- Chạy được → chỉ cần sửa câu thông báo lỗi (A3).
- Treo/câm → phải thêm `webView(_:requestMediaCapturePermissionFor:initiatedByFrame:type:decisionHandler:)` trả `.prompt` vào lớp `WKUIDelegate` của Capacitor → **lúc đó mới cần build lại**.

## C4 · Nếu chọn Đường B (IAP) — việc giấy tờ
- Ký hợp đồng **Paid Applications** trên App Store Connect
- Khai thông tin ngân hàng + thuế
- Tạo sản phẩm **Consumable** cho từng gói token
- Đây là việc pháp lý, em không làm thay được, và mất vài ngày chờ Apple duyệt hợp đồng.

## C5 · Kiểm tra trước khi bấm nộp
- Mở `hmongx.com` bằng 4G (không phải wifi nhà) xem có 200 OK không. App là vỏ web, site chết là app trắng màn.
- Kiểm hoá đơn DigitalOcean còn hạn (đã từng chết vì nợ).
- Mở `public/sw.js` trên VPS xem chiến lược cache (mục A8).
- Mở `terms.html` và `privacy.html` xem có nút quay lại không, và xem có nhắc đủ các bên nhận dữ liệu không *(em chưa đọc được 2 file này, chúng không có trong bộ hồ sơ)*.

---

# ⏱ TRÌNH TỰ LÀM — theo thứ tự, đừng đảo

| Thứ tự | Việc | Nhóm | Ai làm | Thời gian |
|---|---|---|---|---|
| **0** | **Chốt Đường A hay Đường B cho 3.1.1** | — | **Aib** | 10 phút suy nghĩ |
| 1 | Mở `sw.js` kiểm cache (A8) | A | Em | 15 phút |
| 2 | Dọn sạch vết token, 6 chỗ (A1) | A | Em | 2-5 tiếng |
| 3 | Làm nút xoá tài khoản nhìn ra được, 4 rào (A2) | A | Em | 45 phút |
| 4 | Dọn chữ Windows/Chrome/localhost (A3) | A | Em | 20 phút |
| 5 | Sửa CSS ô soạn (A4) + nút download (A5) + 3 việc nhỏ (A6) | A | Em | 1 tiếng 20 |
| 6 | **Deploy web lên VPS** | A | Em | 10 phút |
| 7 | Cài TestFlight, thử mic + camera + xoá tài khoản trên iPhone thật (C3) | C | **Aib** | 20 phút |
| 8 | Sửa `codemagic.yaml` khoá RSA cố định + revoke cert thừa (B5) | B | Em + Aib | 20 phút |
| 9 | Build 1.0(3) kèm AVAudioSession + ITSApp + quyết định iPad (B2-B4) | B | Em | 30 phút + chờ build |
| 10 | Chụp lại toàn bộ ảnh App Store bằng Simulator (C1) | C | **Aib** | 1-2 tiếng |
| 11 | Quay video xoá tài khoản (C2) | C | **Aib** | 15 phút |
| 12 | Viết App Review Notes tiếng Anh | C | Em soạn, Aib dán | 20 phút |
| 13 | Chạy CHECKLIST bên dưới | — | Cả hai | 30 phút |
| 14 | Bấm Submit for Review | — | **Aib** | 5 phút |

**Nếu đi Đường A:** ước tính **2 ngày làm việc** là nộp được.
**Nếu đi Đường B:** ước tính **1-2 tuần** (chờ hợp đồng Paid Apps + làm StoreKit + build đi build lại).

---

# ✅ CHECKLIST TRƯỚC KHI NỘP — không tick đủ thì không bấm Submit

## Phần 1 — Web đã deploy và đã kiểm bằng mắt trên iPhone thật
- [ ] Đã deploy `web-index.html` + `server.js` lên VPS, đã `curl https://hmongx.com` trả 200
- [ ] Đã mở `public/sw.js`, xác nhận **không** cache-first cho HTML (hoặc đã tắt SW trong app)
- [ ] Mở app trên iPhone → **không thấy con số token nào** ở thanh trên cùng
- [ ] Mở ô tài khoản → **không thấy** chữ "token", **không thấy** bảng giá `duab 3 · nkauj 8`
- [ ] Bấm tạo ảnh khi hết lượt → câu báo **không có** chữ "Yuav token ntxiv" / "hloov gói"
- [ ] Nhờ AI vẽ ảnh **trong khung Chat** khi hết lượt → câu báo trong dòng chat cũng sạch
- [ ] Viết truyện Dab Neeg lần thứ 2 → câu báo **không nhắc** Plus/Pro/Max
- [ ] Bấm nút 🎬 Video (tốn 80, tài khoản mới chỉ 27) → câu báo sạch
- [ ] Bật ngôn ngữ **English** trong app, đi lại toàn bộ luồng xoá tài khoản → mọi chữ đọc được, nút cuối **KHÔNG** hiện "Clear all"
- [ ] Nút tài khoản trên thanh trên có 👤 hoặc chữ Account
- [ ] Có lối vào thứ hai tới nút xoá từ màn "Kuv Chaw"
- [ ] Bấm 🎤 ở cả 5 cửa mic → hoặc chạy được, hoặc báo lỗi bằng câu **không** nhắc Chrome/localhost/computer/URL bar/Zoom/Zalo/OBS
- [ ] Xoay dọc iPhone, mở màn Tsim Duab → ô nhập rộng đủ đọc placeholder
- [ ] Bấm Cai siv / Tswj ntiag tug → **không** văng ra Safari ngoài (hoặc có nút quay lại)
- [ ] Đăng nhập Google → mở Safari View Controller, xong tự đóng, tự vào app

## Phần 2 — Binary
- [ ] Bản nộp là **build mới**, **KHÔNG** phải 1.0(1)
- [ ] `Info.plist` có đủ `NSCameraUsageDescription` + `NSPhotoLibraryUsageDescription` + `NSMicrophoneUsageDescription`
- [ ] Bấm 📷 "Thaij Duab" trên iPhone thật → **KHÔNG crash**
- [ ] Bấm vào ô ảnh đại diện ở Kuv Chaw → chọn "Take Photo" → **KHÔNG crash**
- [ ] `codemagic.yaml` đã dùng khoá RSA cố định từ biến môi trường, **không** còn `ssh-keygen` trong build
- [ ] Đã vào developer.apple.com revoke chứng chỉ distribution thừa, còn đúng 1 cái
- [ ] Build lên TestFlight thành công, cài lên máy chạy được

## Phần 3 — App Store Connect (metadata)
- [ ] **Toàn bộ** ảnh chụp màn hình chụp bằng iPhone thật / iOS Simulator
- [ ] Không ảnh nào có khung Android, thanh địa chỉ trình duyệt, tab, con trỏ chuột, ảnh desktop
- [ ] Nếu vẫn để `TARGETED_DEVICE_FAMILY = "1,2"`: đã có **cả bộ ảnh iPad 13″**, cũng sạch như trên
- [ ] Không ảnh nào lọt màn "Cov Cuab Yeej" (có chữ Facebook/TikTok/Reels)
- [ ] Không ảnh nào còn hiện số token
- [ ] Mô tả + từ khoá **không có**: facebook, tiktok, zalo, shopee, android, google play, chatgpt, gemini, openai
- [ ] Mô tả **không có** hmongx.com / kubsuav.com (chỉ để ở ô Support URL & Marketing URL)
- [ ] Nếu đi Đường A: mô tả **không nhắc token**
- [ ] Đã trả lời câu hỏi Export Compliance (chọn miễn trừ — app chỉ dùng HTTPS)
- [ ] Đã rà lại xếp hạng tuổi cho khớp thực tế app sinh ảnh/truyện tự do

## Phần 4 — Hồ sơ trả lời Apple
- [ ] Đã upload **video quay luồng xoá tài khoản** trọn vẹn (tạo tài khoản → tìm nút → xoá → không đăng nhập lại được)
- [ ] **App Review Notes** viết bằng **tiếng Anh**, có: tài khoản demo (email + mật khẩu), đường đi từng bước tới nút xoá tài khoản, giải thích UI là tiếng Mông + chỗ đổi ngôn ngữ
- [ ] Nếu đi Đường A: ghi rõ trong Notes *"This version of the app does not contain any in-app currency or purchase. Image and song generation use a free daily quota."*
- [ ] Nếu đi Đường B: đã ký Paid Applications Agreement, đã tạo sản phẩm IAP, đã test sandbox

## Phần 5 — Hạ tầng
- [ ] `hmongx.com` sống, thử bằng 4G không phải wifi nhà
- [ ] Hoá đơn DigitalOcean còn hạn, VPS không sắp bị khoá
- [ ] Ví Gemini / OpenAI còn tiền (app chết giữa lúc Apple đang duyệt là rớt 2.1)

---

## Cuối cùng — em nói thật với Aib

Em **không hứa** lần này Apple duyệt. Lý do: mục 3.1.1 là mục duy nhất em không kiểm chứng được bằng code — đội mình đã ẩn cửa mua từ 19/08 mà Apple duyệt 21/08 vẫn bắt. Nghĩa là tiêu chuẩn thật của họ nằm ở đâu đó giữa "không có nút mua" và "không có khái niệm tiền ảo nào", mà mình chưa biết chính xác vạch ở đâu.

Cái em **chắc chắn** được:
- 4/5 lỗi Apple nêu là lỗi web, sửa được hết trong 1-2 ngày, không cần build lại.
- Nút xoá tài khoản **có tồn tại và chạy thật** — vấn đề chỉ là nhìn không ra. Sửa được.
- Crash camera đã có lời giải hợp lý và đã vá trong 1.0(2).
- Ảnh App Store là lỗi chắc chắn còn nguyên, không sửa là rớt lại đúng mục đó.

Nếu lần 3 vẫn rớt vì 3.1.1, thì lúc đó câu trả lời chỉ còn một: **cắm IAP thật**. Nhưng đừng làm IAP ngay bây giờ khi 4 lỗi kia còn chưa dọn — vì kể cả có IAP mà nút xoá vẫn khuất và ảnh vẫn có khung Android thì cũng rớt.

**Aib chốt Đường A hay Đường B, em bắt tay làm ngay.**