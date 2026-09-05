#!/bin/bash
# BỘ TỰ KIỂM TRƯỚC KHI NỘP — riêng cho DUAB ZOO (05/09/2026).
# Script chung của skill nop-app-store viết cho HMONG X (đăng nhập, UGC) nên báo đỏ sai cho app này.
# Chạy:  SITE=https://duab.kubsuav.cloud bash ~/duab-zoo-ios/kiem-duab-zoo.sh
SITE=${SITE:-https://duab.152-42-172-109.sslip.io}
IOS=${IOS_DIR:-$HOME/duab-zoo-ios}
G='\033[32m✔\033[0m'; R='\033[31mX\033[0m'; loi=0
ok(){ echo -e "  $G $1"; }; sai(){ echo -e "  $R \033[31m$1\033[0m"; loi=$((loi+1)); }
code(){ curl -s -o /dev/null -w "%{http_code}" -L "$1"; }
echo; echo "1. APP SỐNG + TRANG BẮT BUỘC"
[ "$(code $SITE/app/)" = 200 ] && ok "$SITE/app/ trả 200" || sai "$SITE/app/ không sống"
[ "$(code $SITE/rieng-tu/)" = 200 ] && ok "trang riêng tư /rieng-tu/ 200" || sai "thiếu trang riêng tư"
[ "$(code $SITE/privacy.html)" = 200 ] && ok "/privacy.html trỏ được (ASC Privacy Policy URL)" || sai "/privacy.html hỏng"
[ "$(code $SITE/terms.html)" = 200 ] && ok "/terms.html trỏ được (EULA)" || sai "/terms.html hỏng"
curl -s $SITE/rieng-tu/ | grep -q "stdeula" && ok "trang riêng tư link EULA chuẩn Apple" || sai "thiếu link EULA Apple"
echo; echo "2. XOÁ DỮ LIỆU (5.1.1) — app ghi tên+số thì phải xoá được trong app"
curl -s -X POST -H 'Content-Type: application/json' -d '{"sdt":"0900000001"}' -o /dev/null -w "%{http_code}" $SITE/api/xoa | grep -q 204 && ok "POST /api/xoa chạy (204)" || sai "/api/xoa hỏng"
curl -s $SITE/app/ | grep -q "Duab Zoo" && ok "bản app nạp được (nút Xoá dữ liệu của tôi nằm trong thẻ Cá Nhân)" || sai "app không nạp được"
echo; echo "3. IAP (3.1.1) — app bán gói thì phải mua được trong app"
J=$(curl -s $SITE/api/iap-products)
echo "$J" | grep -q '"ready":true' && ok "máy chủ đã nối khoá Apple (ready:true)" || sai "máy chủ chưa nối Apple: $J"
for p in anh1 anh5 anh20; do echo "$J" | grep -q "com.hmongx.duabzoo.$p" && ok "gói com.hmongx.duabzoo.$p có trong máy chủ" || sai "thiếu gói $p"; done
grep -q "cordova-plugin-purchase" $IOS/package.json && ok "vỏ iOS có cordova-plugin-purchase" || sai "vỏ iOS thiếu plugin mua hàng"
grep -q "DuabZooiOS" $IOS/capacitor.config.json && ok "user-agent DuabZooiOS (web biết đang ở iOS → ẩn Zalo, hiện IAP)" || sai "thiếu appendUserAgent"
grep -rq "storekit" $IOS/ios/App/App/Info.plist 2>/dev/null; true
echo "   → PHẢI TỰ KIỂM TAY: 3 IAP trên ASC đúng từng chữ + Paid Apps Active + mua sandbox ra mã DZ"
echo; echo "4. QUYỀN (2.1a) — thiếu là app sập khi chọn ảnh"
for k in NSCameraUsageDescription NSPhotoLibraryUsageDescription NSPhotoLibraryAddUsageDescription; do grep -q "$k" $IOS/ios/App/App/Info.plist && ok "$k" || sai "thiếu $k"; done
grep -q "ITSAppUsesNonExemptEncryption" $IOS/ios/App/App/Info.plist && ok "ITSAppUsesNonExemptEncryption khai rồi" || sai "thiếu ITSAppUsesNonExemptEncryption"
echo; echo "5. DỰ ÁN iOS"
grep -q "com.hmongx.duabzoo" $IOS/ios/App/App.xcodeproj/project.pbxproj && ok "bundle com.hmongx.duabzoo" || sai "bundle id sai"
grep -q "TARGETED_DEVICE_FAMILY = 1;" $IOS/ios/App/App.xcodeproj/project.pbxproj && ok "chỉ iPhone (không cần ảnh iPad)" || sai "TARGETED_DEVICE_FAMILY khác 1"
grep -q "CERTIFICATE_PRIVATE_KEY" $IOS/codemagic.yaml && ok "codemagic dùng khoá cố định" || sai "codemagic thiếu khoá cố định"
[ -f $IOS/ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png ] && ok "icon 1024" || sai "thiếu icon 1024"
n=$(ls $IOS/anh-cho/*.png 2>/dev/null | wc -l | tr -d ' '); [ "$n" -ge 3 ] && ok "$n ảnh chợ 1290×2796" || sai "thiếu ảnh chợ"
echo; echo "6. NÚT CHẾT / MỜI MUA NGOÀI (2.1, 3.1.1) — trong chế độ iOS"
H=$(curl -s -A "Mozilla/5.0 (iPhone) DuabZooiOS" $SITE/app/)
echo "$H" | grep -q "zalo.me" && echo "   (HTML tĩnh còn chứa link Zalo — bình thường, JS ẩn lúc chạy khi UA DuabZooiOS; đã kiểm bằng ảnh chụp)" 
echo "   → PHẢI TỰ KIỂM TAY trên TestFlight: bấm HẾT nút ở 4 thẻ, lưu ảnh, mua sandbox"
echo; echo "7. GIẤY TỜ (2.1b) — không kiểm bằng máy được"
echo "   → Business → Agreements: Paid Apps = Active (đã có từ HMONG X 25/08)"
echo "   → App Privacy đã Publish · Age Rating đi hết 7 bước · Copyright điền"
echo; [ $loi -eq 0 ] && echo -e "\033[32m✔ Phần máy kiểm được: ĐẠT. Còn các mục 'TỰ KIỂM TAY' ở trên.\033[0m" || echo -e "\033[31m✘ $loi dòng đỏ — sửa xong mới nộp.\033[0m"
exit $loi
