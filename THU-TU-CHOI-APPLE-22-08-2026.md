# Thư từ chối Apple — lần 2 (đọc 22/08/2026)

- Submission ID: 27b8715d-c415-4199-aae4-5eee38c84179
- Apple trả lời: Today 7:02 AM (22/08/2026) · Review date: August 21, 2026
- Máy thử: iPhone 17 Pro Max · iOS 26.6 · Version 1.0 (1)
- Trạng thái: Unresolved Issues — item REJECTED

## 5 lý do

### 1. Guideline 2.1(a) — App CRASH
"The app crashed when we tapped on 'take photo'."
→ Bấm nút CHỤP ẢNH là app sập. Có 2 file crashlog đính kèm:
crashlog-F1AA27FD-BB8A-4253-A56E-128EEE1D11B4.ips
crashlog-7AD43BB2-B560-4266-BC4C-AAE254EC69A4.ips

### 2. Guideline 4 — Design: đăng nhập bằng trình duyệt ngoài
"user is taken to the default web browser to sign in or register" → trải nghiệm kém.
→ Phải đăng nhập TRONG app, hoặc dùng SFSafariViewController (Safari View Controller).
(Đúng cơ chế mình đang làm: mở Safari thật + /api/auth/poll.)

### 3. Guideline 5.1.1(v) — thiếu xoá tài khoản
Apple nói app có tạo tài khoản mà KHÔNG thấy chỗ xoá.
→ Mình ĐÃ có nút xoá trên web, nhưng Apple không tìm thấy/không dùng được trong app.
→ Họ đòi VIDEO quay màn hình máy thật: tạo/đăng nhập tài khoản → tìm chỗ xoá → xoá trọn vẹn.

### 4. Guideline 3.1.1 — bắt buộc In-App Purchase
"The app includes intermediary currencies, such as points, coins, or gems, without using In-App Purchase."
→ VÍ TOKEN của mình bị coi là tiền ảo trung gian → BẮT BUỘC bán qua In-App Purchase (Apple ăn 15-30%).
→ Chỉ storefront MỸ mới được link ra trình duyệt ngoài để thu tiền.

### 5. Guideline 2.3.10 — ảnh chụp màn hình sai
"metadata includes information about third-party platforms" → ảnh screenshot có hình máy KHÔNG PHẢI iOS.
→ Sửa lại bộ screenshot trên App Store Connect, bỏ hết khung máy Android/desktop.

## Ghi chú
- 5 ảnh Apple chụp lúc thử: Screenshot-0822-075728/075829/075835/075944/075958.png (tải ở trang submission)
- Lần này Apple KHÔNG nhắc 4.2 và 3.1.1(a) nữa — nhưng 3.1.1 IAP là mới và nặng nhất.
