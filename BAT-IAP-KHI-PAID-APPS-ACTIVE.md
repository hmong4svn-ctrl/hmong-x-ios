# Bật In-App Purchase — làm khi Paid Apps chuyển Active

Backend đã viết xong và đang chạy trên VPS (22/08/2026). Chưa có khoá nên mọi route trả 503,
app không vỡ. Dưới đây là 6 bước bật, làm theo đúng thứ tự.

## 1. Kiểm Paid Apps đã Active chưa
appstoreconnect.apple.com/business → dòng **Paid Apps Agreement** phải là `Active`
(không còn `Pending User Info`). Chưa Active thì KHÔNG tạo được sản phẩm, đừng làm tiếp.

## 2. Tạo 4 sản phẩm trên App Store Connect
Apps → HMONG X → **Monetization → In-App Purchases** → dấu **+** → chọn **Consumable**.

Mã sản phẩm phải khai **ĐÚNG TỪNG CHỮ** như dưới, vì backend khớp theo mã này
(`IAP_PACKS` trong `server.js`). Sai một ký tự là khách mua rồi không được token.

| Product ID | Tên hiển thị | Token | Giá tham chiếu (web) |
|---|---|---|---|
| `com.hmongx.app.token50`  | 50 token  | 50  | 99.000đ |
| `com.hmongx.app.token120` | 120 token | 120 | 250.000đ |
| `com.hmongx.app.token400` | 400 token | 400 | 599.000đ |
| `com.hmongx.app.token900` | 900 token | 900 | 1.599.000đ |

⚠️ Giá trên App Store phải chọn theo **bậc giá của Apple**, không gõ số tuỳ ý. Nhớ cộng thêm
phần Apple giữ lại (15% nếu đã đăng ký Small Business Program, 30% nếu chưa) — **đăng ký
Small Business Program ngay trong ngày ký Paid Apps**, đừng để quên.

⚠️ Mỗi sản phẩm phải có: tên hiển thị, mô tả, **ảnh chụp màn hình để duyệt**, và
**Review Notes**. Thiếu là Apple từ chối riêng sản phẩm đó.

## 3. Tạo khoá In-App Purchase
Users and Access → **Integrations → In-App Purchase** → dấu **+** → tải file `.p8`.
⚠️ Đây là khoá **KHÁC** khoá App Store Connect (`AuthKey_8484N8P7UM.p8`) đang dùng để hỏi
trạng thái app. Đừng lẫn hai khoá.

Chép khoá lên VPS:
```
scp -i ~/.ssh/id_ed25519 ~/Downloads/AuthKey_XXXXX.p8 root@152.42.172.109:/opt/hmong-x-app/
ssh -i ~/.ssh/id_ed25519 root@152.42.172.109 "chown hmongx:hmongx /opt/hmong-x-app/AuthKey_XXXXX.p8 && chmod 600 /opt/hmong-x-app/AuthKey_XXXXX.p8"
```

## 4. Khai 4 dòng vào .env trên VPS
```
IAP_KEY_ID=<Key ID của khoá vừa tạo>
IAP_ISSUER=<Issuer ID, xem ngay trên trang Integrations>
IAP_KEY_FILE=/opt/hmong-x-app/AuthKey_XXXXX.p8
IAP_SANDBOX=1
```
`IAP_SANDBOX=1` để thử bằng tài khoản Sandbox trước. Chạy thật thì đổi `0`.

Khởi động lại: `systemctl restart hmongx`
Kiểm: `curl -s https://hmongx.com/api/iap/products` → phải thấy `"ready": true`

## 5. Nối nút mua trong app
Plugin `cordova-plugin-purchase@13.18.0` đã cài sẵn trong `~/hmong-x-ios`.
Trong `public/index.html`, nhánh `window.HX_IOSAPP`: hiện lại cửa mua token (hiện đang ẩn),
gọi StoreKit mua, xong lấy `transactionId` gửi lên `POST /api/iap/verify`.
Kèm nút **Restore Purchases** — Apple bắt buộc với hàng consumable mua lại được.

## 6. Bỏ ẩn token trên iOS
Khi IAP chạy thật thì mở lại phần đã ẩn ngày 22/08 (xem sổ nhớ `hmong-x-an-token-tren-ios`):
chip ví, số dư trong ô tài khoản, bảng giá. Lúc đó hiện token là hợp lệ vì đã mua được trong app.

---

## Backend đã có sẵn những gì

`server.js` — khối `IN-APP PURCHASE (Apple)` đặt ngay trước `grantOrder()`:

- `iapSan()` — kiểm đã có khoá chưa; chưa có thì route trả 503, app không vỡ
- `iapJwt()` — ký JWT ES256 cho App Store Server API
- `iapHoiApple(txId)` — **hỏi thẳng Apple** giao dịch có thật không
- `POST /api/iap/verify` — 3 chốt kiểm: đúng bundle · chưa bị thu hồi · mã sản phẩm có thật.
  Chống dùng lại biên lai hai lần bằng `IAP_DA_DUNG` + kiểm chéo trong `ORDERS`.
  Cộng token qua `grantOrder()` — **dùng chung đường với SePay/PayPal**, không viết lại.
- `GET /api/iap/products` — app hỏi danh sách mã sản phẩm

**Luật đã cài:** không tin gì app gửi lên. Mọi giao dịch đều hỏi lại Apple mới cộng tiền.
