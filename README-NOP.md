# DUAB ZOO iOS — sổ nộp App Store

> Vỏ iOS (Capacitor 8) cho web app **https://duab.kubsuav.cloud** (tạm thời: https://duab.152-42-172-109.sslip.io).
> Dựng 05/09/2026 theo đúng khuôn `~/hmong-live-ios` / `~/hmong-x-ios` (HMONG X đậu Apple 26/08/2026).
> Bundle **`com.hmongx.duabzoo`** · Tên **Duab Zoo** · Team Apple **A4XPMY5ZB8** · chỉ iPhone (`TARGETED_DEVICE_FAMILY = 1`).

Chủ sản phẩm: Giàng A Hùng (Cháu Hùng). Tài khoản Apple + máy chủ: Kub Lis Suav.

---

## 0. App này qua bảng 11 lỗi của skill `nop-app-store` thế nào

| # | Guideline | Duab Zoo | Trạng thái |
|---|---|---|---|
| 1 | 5.1.1 xoá tài khoản | Không có tài khoản, chỉ ghi tên + số. Có nút **"Xoá dữ liệu của tôi"** (Cá Nhân) xoá cả trên máy chủ | ✅ |
| 2 | 1.2 nội dung AI | AI chỉ sửa ảnh riêng của khách, không đăng công khai, không chia sẻ. Có trang riêng tư + liên hệ + EULA | ✅ |
| 3 | 1.2 prompt "never refuse" | Không có | ✅ |
| 4 | 2.1 nút chết | Đã rà: mọi nút có ruột. Gói chưa có giá thì KHÔNG gắn bấm | ✅ |
| 5 | 2.1 Information Needed | Chuẩn bị video demo nếu Apple hỏi (mục 3) | ⏳ |
| 6 | 2.1(a) crash thiếu quyền | `Info.plist` có NSPhotoLibrary / NSCamera / NSPhotoLibraryAdd | ✅ |
| 7 | Guideline 4 đăng nhập ra Safari | Không có đăng nhập | ✅ |
| 8 | 4.8 Sign in with Apple | Không có đăng nhập mạng xã hội ⇒ không áp dụng | ✅ |
| 9 | 2.3.10 ảnh chợ | `anh-cho/*.png` đúng 1290×2796, không khung máy lạ | ✅ |
| 10 | **3.1.1 IAP** | Trong app iOS: mua gói bằng **StoreKit** (3 consumable), mã cấp bởi máy chủ sau khi hỏi Apple. Không có Zalo/chuyển khoản/bảng giá web trong bản iOS | ✅ mã · ⏳ sản phẩm trên ASC |
| 11 | 2.1(b) IAP lỗi | Paid Apps đã Active (HMONG X). Chưa có giá ⇒ nút mờ + câu "đang tải giá", không câu lỗi | ✅ |
| 12 | 3.1.2 thuê bao | Không có thuê bao, chỉ consumable | ✅ |

---

## 1. EM ĐÃ LÀM

- `package.json` Capacitor 8 + `cordova-plugin-purchase` 13; `npx cap add ios` + `sync` xong (SPM, không cần Xcode/Pods).
- `capacitor.config.json`: `server.url = https://duab.kubsuav.cloud`, `appendUserAgent = DuabZooiOS` (web nhận biết → chế độ iOS), nền `#251357`.
- `Info.plist`: 3 quyền ảnh/camera, `ITSAppUsesNonExemptEncryption=false`, URL scheme `com.hmongx.duabzoo`, chỉ dọc.
- `project.pbxproj`: `com.hmongx.duabzoo`, `1.0 (1)`, chỉ iPhone. Scheme `App` chia sẻ (Codemagic cần).
- Icon 1024 không alpha + Splash 2732 từ logo gốc (`assets/`). LaunchScreen nền tím.
- `codemagic.yaml`: `ios-verify` (không ký) và `ios-appstore` (ký khoá cố định `CERTIFICATE_PRIVATE_KEY`, group `ios_signing`, integration `hmongx-asc`). `APP_STORE_APPLE_ID` để trống — điền sau khi tạo app.
- Máy chủ `/opt/duab-zoo`: `/api/iap-products` (ready:true), `/api/iap-verify` (hỏi Apple, phát mã DZ-…), `/api/iap-cua-toi` (Restore). Khoá IAP team `WD227TA459` dùng chung HMONG X.
- Web: chạy trong app iOS thì ẩn mọi lời mời mua ngoài, hiện cửa mua App Store ở Cá Nhân và ngay khi hết lượt; nút Restore; trang `/rieng-tu/` có EULA Apple.

## 1b. ĐÃ LÀM THÊM 05/09 tối (em làm, bằng khoá API + Chrome của Aib)

| Việc | Kết quả |
|---|---|
| App ID `com.hmongx.duabzoo` | ✅ Tạo qua ASC API (`ops/asc.mjs`), id `L9G7QR8973`, team A4XPMY5ZB8 — Aib KHÔNG cần vào developer.apple.com nữa |
| Kho mã | ✅ Đẩy lên **nhánh `duab-zoo-ios` trong kho `hmong4svn-ctrl/hmong-x-ios`** (kho công khai, vỏ không chứa khoá). Không tạo app Codemagic mới: dùng app `hmong-x-ios` sẵn có, chọn nhánh này khi build ⇒ tái dùng integration `hmongx-asc` + group `ios_signing` |
| Codemagic | ✅ Đã chạy workflow `ios-verify` (biên dịch không ký) trên nhánh này — xem kết quả ở codemagic.io/builds |
| App Store Connect | ⛔ Phiên hết hạn (`authResult=FAILED`), em không được đăng nhập hộ ⇒ **Aib đăng nhập ASC rồi báo em**, em tạo app + 3 IAP + điền hồ sơ qua API/Chrome |

## 2. CHỈ AIB LÀM ĐƯỢC — theo thứ tự

1. **DNS**: quét QR Mắt Bão, em thêm A `duab → 152.42.172.109`, bật Caddy `duab.kubsuav.cloud`. (App trỏ tên miền này; chưa có DNS thì app mở ra trắng.)
2. **Apple Developer → Identifiers → +**: App ID explicit `com.hmongx.duabzoo`, tick **In-App Purchase**. KHÔNG tạo thêm certificate.
3. **App Store Connect → Apps → +**: Name `Duab Zoo`, Bundle `com.hmongx.duabzoo`, SKU `duab-zoo`, ngôn ngữ chính Vietnamese. Chép **Apple ID** (10 số) → điền `APP_STORE_APPLE_ID` trong `codemagic.yaml`.
4. **Monetization → In-App Purchases → + Consumable** — 3 mã ĐÚNG TỪNG CHỮ:

   | Product ID | Reference name | Số ảnh | Giá gợi ý (bậc Apple gần 20k/80k/250k) |
   |---|---|---|---|
   | `com.hmongx.duabzoo.anh1` | 1 anh | 1 | 25.000đ (Tier tương đương $0.99) |
   | `com.hmongx.duabzoo.anh5` | 5 anh | 5 | 99.000đ ($3.99) |
   | `com.hmongx.duabzoo.anh20` | 20 anh | 20 | 279.000đ ($10.99) |

   Mỗi sản phẩm cần: tên hiển thị (vi + hmn), mô tả, ảnh chụp màn hình để duyệt (dùng `anh-cho/05-mua-app-store.png`), review note. Rồi **Add for Review → Draft Submission** cùng bản app (luồng mới §7c của skill).
   Sau khi tạo xong, em đổi `IAP_SANDBOX` khi nộp thật và kiểm `/api/iap-verify` trả 404 thay vì 401 (401 hiện tại = Apple chưa biết bundle).
5. **Codemagic**: Add application → repo `duab-zoo-ios` (Aib `git init` + push, hoặc bảo em); biến `CERTIFICATE_PRIVATE_KEY` group `ios_signing` (đúng khoá HMONG X); chạy `ios-verify` → xanh → `ios-appstore` (lên TestFlight).
6. **TestFlight**: cài lên iPhone thật, mua thử bằng **Sandbox tester** (Users and Access → Sandbox) — phải thấy mã DZ-… kích hoạt. Đây là bước Apple sẽ làm y hệt.
7. **ASC bản 1.0**: ảnh `anh-cho/*.png` (1290×2796), mô tả (mục 4), Privacy Policy URL `https://duab.kubsuav.cloud/rieng-tu/`, Copyright `2026 Giàng A Hùng`, Age Rating 4+, App Privacy: Contact Info (name, phone) linked to user, không tracking. Review Notes (mục 3). Add for Review → Draft Submission (app + 3 IAP) → Submit.
8. Chạy `bash <vault>/.claude/skills/nop-app-store/scripts/kiem-truoc-khi-nop.sh` với `SITE=https://duab.kubsuav.cloud IOS_DIR=~/duab-zoo-ios` trước khi bấm Submit.

## 3. Review Notes (dán vào ASC, tiếng Anh)

```
Duab Zoo restores old family photos. No account is required: the first screen asks for a name and phone number once (no password), used only so the owner can contact the customer. To delete this data: tab "Cá Nhân" (Profile) → "Xoá dữ liệu của tôi" (Delete my data) → confirm. It is removed from the server immediately.
Free features (background removal, ID photo, print sheet) run entirely on device. Paid features (colorize, repair, custom edit) call our server which calls OpenAI; images are not stored.
In-App Purchase: tab "Cá Nhân" → "Mua thêm ảnh" (Buy more photos) → choose a pack → App Store payment → a code is activated automatically. "Khôi phục gói đã mua" = Restore. Free users get 2 paid-feature trials per day per device.
Language toggle: top-right pill (VI / HM) switches Vietnamese ↔ Hmong.
```

## 4. Mô tả chợ (Vietnamese)

**Subtitle**: Hồi sinh ảnh cũ · Việt – Hmoob

**Description**:
Duab Zoo giúp anh chị cứu lại những tấm ảnh gia đình đã cũ, mờ, rách — ảnh cưới của bố mẹ, ảnh ông bà, ảnh cả nhà ngày Tết.
• Xoá nền ảnh, làm ảnh thẻ 3×4 / 4×6, xếp tờ in 10×15 — miễn phí, xử lý ngay trong máy, ảnh không rời khỏi điện thoại.
• Tô màu ảnh trắng đen, vá vết rách vết ố, sửa theo yêu cầu bằng AI — dùng thử mỗi ngày, mua thêm gói ảnh ngay trong app.
• Toàn bộ giao diện song ngữ Tiếng Việt – Hmoob, chữ to, bấm một nút là xong. Ông bà cũng tự làm được.
Ghi tên một lần, không mật khẩu. Không quảng cáo, không bán dữ liệu.

**Keywords**: ảnh cũ,phục hồi ảnh,tô màu,ảnh thẻ,xoá nền,Hmong,Hmoob,duab,khôi phục,gia đình

## 5. Bẫy đã biết
- App nạp web từ máy chủ ⇒ sửa web không cần build lại; chỉ build lại khi đổi plugin / Info.plist / icon / capacitor.config.
- Mỗi lần sửa `capacitor.config.json` gốc phải `npx cap sync ios`.
- Người duyệt mua ở **sandbox** ⇒ `IAP_SANDBOX=1` để máy chủ hỏi sandbox trước; khách thật vẫn được vì máy chủ hỏi cả hai.
- Mã DZ-… gắn với **mã máy** của trình duyệt trong app. Cài lại app = mã máy mới ⇒ khách bấm **Restore** (hỏi theo mã máy cũ thì không thấy) → khách dán lại mã đã nhận, hoặc Aib tra `du-lieu/iap.json` theo transactionId và gửi lại mã.
