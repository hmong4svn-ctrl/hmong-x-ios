# BÁO CÁO — HMONG X, ĐƯỜNG LÊN APP STORE LẦN THỨ 3

*Tổng hợp 5 mảng nghiên cứu + kết quả kiểm nguồn độc lập. Ngày 22/08/2026.*

---

## 1. TRẢ LỜI THẲNG: NỘP NGAY HAY CHỜ CÓ IAP?

**CHỜ. Đừng bấm Submit.** Nhưng em phải nói rõ một chuyện trước, vì nó làm câu hỏi này gần như vô nghĩa về mặt kỹ thuật:

**Ngay lúc này anh CHƯA BẤM ĐƯỢC nút nộp**, không phải vì thiếu IAP mà vì ba cái chặn giấy tờ:

| Chặn | Nguồn (đã kiểm) |
|---|---|
| PLA mới chưa Account Holder chấp nhận | Chính Apple đang hiện thông báo cho anh |
| Age rating chưa trả lời bộ câu hỏi mới | `beginning in September 2026, responses will be required when submitting new apps or updates` |
| DSA trader status chưa khai | `You'll need to let us know whether or not you're a trader to submit new apps to the App Store.` |

Nên câu hỏi thật không phải "nộp hay chờ" mà là **"gỡ chặn theo thứ tự nào"**.

### Vì sao ẩn nút mua không cứu được — đây là chỗ mù đã sáng

Anh ẩn nút mua ngày 19/08, Apple vẫn bắt 3.1.1 ngày 21/08. **Đó không phải reviewer đọc sót.** Luật hiện hành (bản cập nhật 08/06/2026) viết:

> *"If you want to unlock features or functionality within your app, (by way of example: subscriptions, in-game currencies, game levels, access to premium content, or unlocking a full version), you must use in-app purchase."*
> — và câu ngay sau: *"Apps may not use their own mechanisms to unlock content or functionality, such as license keys, augmented reality markers, QR codes, cryptocurrencies and cryptocurrency wallets, etc."*

Ví token tự dựng của anh chính là "their own mechanisms". Apple **không đòi anh ngừng bán — Apple đòi trong app PHẢI MUA ĐƯỢC**. Ẩn nút càng làm nặng thêm vì càng chứng minh không có đường mua hợp lệ.

### Ngoại lệ 3.1.3(b) multiplatform — KHÔNG phải cửa thoát, nhưng là TIN TỐT

Đây là câu anh cần đọc kỹ nhất trong cả báo cáo:

> *"Apps that operate across multiple platforms may allow users to access content, subscriptions, or features they have acquired in your app on other platforms or your web site, including consumable items in multi-platform games, **provided those items are also available as in-app purchases within the app**."*

Đọc đúng: nó **ĐÒI** IAP chứ không **MIỄN** IAP. Nhưng mặt tốt là — **khách cũ đã nạp token trên kubsuav.com/hmongx.com KHÔNG mất tiền**. Cắm IAP xong là ví web và ví iOS được phép dùng chung hợp pháp. Anh không phải đền ai cả.

Một cảnh báo kỹ thuật: cụm "consumable items" trong câu đó gắn với chữ **games**. Nếu reviewer bắt bẻ chặt, họ có thể nói token tiêu-hết-là-mất của app không-phải-game không nằm trong ngoại lệ. Cách chắc ăn khi trình bày: gọi token là "features/content acquired", đừng tự gọi nó là "consumable game currency". Dù bắt bẻ kiểu nào thì việc phải làm cũng y hệt: **cắm IAP**.

### Đã soi hết 7 ngoại lệ của 3.1.3 — HMONG X không lọt cửa nào

(a) reader — chỉ magazines/newspapers/books/audio/music/video · (b) đa nền tảng — có điều kiện phải có IAP · (c) enterprise — bán trực tiếp cho tổ chức · (d) dịch vụ 1-1 thời gian thực · (e) hàng vật lý · (f) free stand-alone — chỉ VoIP/Cloud Storage/Email/Web Hosting, và nguyên văn còn đuôi *"or calls to action for purchase outside of the app"* · (g) advertising management.

Hết đường vòng. Anh chốt đi đường IAP thật là **quyết định đúng**.

### Con đường duy nhất lên store mà KHÔNG cần Paid Apps

Có đúng một cửa, và em phải nói rõ nó là quyết định sản phẩm chứ không phải mẹo kỹ thuật:

> **Bỏ HẲN cơ chế token khỏi bản iOS.** App iOS chỉ chạy chức năng miễn phí, không đọc ví token, không hiện số dư, không có màn hình nào dẫn tới token.

Khi trong app không còn nội dung nào "đã mua ở ngoài" thì 3.1.1 không còn cớ.

**Nhưng em không dám hứa cửa này ăn.** Có một ca kể trên diễn đàn Apple tháng 12/2025 — app B2B SaaS sạch hơn HMONG X (không bán, không link, không sign-up, chỉ login) — vẫn bị đúng câu 3.1.1 nhiều lần. **Đây là giai thoại, em chưa kiểm nguồn được thread đó**, nên anh đừng coi là bằng chứng chắc. Nhưng nó đủ để em khuyên: nếu đi cửa này thì phải cắt TRIỆT ĐỂ, không nửa vời.

### Vì sao nộp bây giờ không tiết kiệm được vòng nào

Luật App Store Connect:

> *"The first consumable, non-consumable, auto-renewable subscription, and non-renewing subscription In-App Purchase of each type must be submitted with a new app version."*

Token là consumable. **Consumable đầu tiên bắt buộc nộp CHUNG với một app version.** Nên phương án "nộp đại cho qua, IAP tính sau" là bất khả thi — dù có lọt hôm nay thì vẫn phải nộp thêm một version nữa.

### Hậu quả nếu cứ nộp mù lần 3

Không mất tài khoản. Apple chỉ trục xuất khi **gian lận**:

> *"If you attempt to cheat the system (for example, by trying to trick the review process...) your apps will be removed from the store and you will be expelled from the Apple Developer Program."*

Cái mất thật là tốc độ:

> *"if your app is repeatedly rejected for the same guideline violation... review of your app will take longer to complete."*

Và **đừng appeal**. Điều kiện appeal là *"you feel we misunderstood your app's concept and functionality"* — ở đây Apple hiểu ĐÚNG. Mỗi submission chỉ appeal được **một lần**, dùng sai là đốt mất quyền.

---

## 2. NHỮNG THỨ CHƯA BIẾT MÀ SUÝT DÍNH

Xếp theo mức nguy hiểm thật, không theo thứ tự anh hỏi.

### 🔴 MỨC 1 — CHẶN CỨNG Ở CỬA, KHÔNG TỚI TAY REVIEWER

**1.1. Age rating 12+ của HMONG X là mức ĐÃ BỊ XOÁ — và hạn chót còn ~10 ngày**

Đây là thứ cấp bách nhất trong cả báo cáo, và cũng là khẳng định vững nhất (kiểm nguồn 3 trang Apple).

- Từ 24/07/2025 Apple thêm 13+/16+/18+. Trang bảng giá trị hiện hành của App Store Connect liệt kê đúng **4+, 9+, 13+, 16+, 18+, Unrated** — **không còn 12+, không còn 17+**.
- HMONG X đang để 12+ = anh **chưa trả lời bộ câu hỏi age rating mới**. Hạn Apple đặt là 31/01/2026, đã trôi qua 7 tháng.
- Apple viết đen trắng: *"beginning in September 2026, responses will be required when submitting new apps or updates."* Hôm nay 22/08. Apple không nêu ngày cụ thể trong tháng 9 → **cứ coi hạn là 31/08/2026**.

Nếu anh dồn hết sức vào IAP rồi đầu tháng 9 mới bấm nộp, App Store Connect chặn ngay tại cửa và anh sẽ tưởng là lỗi kỹ thuật.

Làm mất **10 phút**. Trong đó:
- Câu hỏi mạng xã hội (thêm 09/07/2026): trả lời **KHÔNG**. Định nghĩa của Apple: *"the ability to redistribute, amplify, or interact with user-generated content through a social feed or similar discovery method."* HMONG X không có feed/repost/like. ⚠️ Anh tự xác nhận điều này — khai sai nặng hơn nhiều so với bị gắn nhãn.
- Câu hỏi User-Generated Content: trả lời **KHÔNG**, có căn cứ văn bản. Apple định nghĩa UGC là *"the broad distribution of content created by users..."* — ảnh/nhạc/truyện AI chỉ người tạo xem, không phân phối rộng.
- Mức tuổi: Apple nói *"you must consider how all app features, including AI assistants and chatbot functionality, impact the frequency of sensitive content."* Apple **không** ấn định mức nào cho app AI. **13+ là khuyến nghị của em**, không phải luật.

⚠️ Cái giá của việc để reviewer tự dán nhãn UGC không phải 13+ mà có thể là **18+** — mất gần hết tệp người Hmoob trẻ.

**1.2. PLA mới chưa chấp nhận** — chỉ Account Holder (chính anh) bấm được, không uỷ quyền được.

**1.3. DSA trader chưa khai** — và có một chi tiết nối chùm mà chưa ai nêu: trang hướng dẫn ghi *"All traders: You'll need to provide payment account details, if you haven't already entered them in App Store Connect."* **Khai trader đòi luôn thông tin tài khoản thanh toán** — tức nó dính vào đúng khâu Paid Apps đang kẹt, không phải hai việc rời nhau. Cá nhân phải nhập địa chỉ/hòm thư + điện thoại + email (hiện **công khai** trên trang App Store ở EU), có OTP 2 lớp, và nộp giấy chứng minh địa chỉ.

### 🔴 MỨC 2 — ĐƯỜNG GĂNG DÀI NHẤT: LEGAL ENTITY

**2.1. Chưa ký Paid Apps = không tạo được sản phẩm IAP nào**

> *"You won't be able to create a new app or In-App Purchase until you've agreed to the most recent version of the Paid Apps Agreement."*
> *"To sell apps or offer In-App Purchases, the Account Holder must sign the Paid Apps Agreement."*

**2.2. Sửa legal entity có thể mất TỚI 2 TUẦN, và có thể dài hơn**

> *"To update the legal entity name and address that appear in Business, contact us. You may need to provide business documentation to support your request. Once changes are approved, it can take up to two weeks for the updates to appear in App Store Connect."*
> — và câu ít người để ý: *"Some updates may generate a new Paid Apps Agreement, which you can accept after the update finishes processing."*

Tức sửa xong **có thể phải ký lại từ đầu**.

**2.3. ⚠️ RỦI RO NGƯỢC ÍT AI NGHĨ TỚI — sửa giấy tờ có thể tự khoá đường nộp app**

Trang compliance review của Apple:

> *"Legal entity review: ... You may not be able to sign pending agreements or submit new apps or app updates until review is complete."*
> *"Apple periodically re-performs compliance reviews, **including when you make changes to information related to your Developer Account**."*

Nghĩa là: chính hành động đi sửa legal entity **có thể kích hoạt một vòng review, và trong lúc review thì không nộp app được**. Vì vậy việc đầu tiên không phải mở ticket — mà là **soi nhãn trạng thái ở Business trước đã**:

| Nhãn | Nghĩa |
|---|---|
| `Active` | Hợp đồng đang có hiệu lực |
| `Verifying` | Apple đang soi giấy tờ — nằm im chờ |
| `Processing` | Apple đang duyệt hợp đồng |
| `Pending (New Legal Entity)` | Phải ký hợp đồng mới |
| `Pending (Update Legal Entity)` | Cần thêm form ngân hàng/thuế |
| `Pending User Info` | Đã ký nhưng thiếu thông tin |

**2.4. Small Business Program nằm SAU nút thắt, không chạy song song**

Điều kiện đăng ký ghi rõ: *"Review and accept the latest Paid Apps agreement (Schedule 2...)"*. Và 15% **không ăn ngay**: *"Your proceeds will be adjusted fifteen (15) days after the end of the fiscal calendar month in which your enrollment is approved."*

Toán giá: bù hoa hồng 30% phải cộng **42,9%**; bù 15% chỉ cần cộng **17,6%**. Đừng lên bảng giá theo mức 30%.

### 🟠 MỨC 3 — CHẮC CHẮN BỊ SOI Ở VÒNG SAU

**3.1. Token mua qua IAP KHÔNG ĐƯỢC HẾT HẠN + phải có nút Restore**

> *"Any credits or in-game currencies purchased via in-app purchase may not expire, and you should make sure you have a restore mechanism for any restorable in-app purchases."*

Chữ đầu là **"Any credits"** — không giới hạn game, phủ thẳng ví token HMONG X. Nếu ví hiện tại tính hạn theo gói/theo tháng thì token mua qua IAP phải tách logic, đánh dấu vĩnh viễn trong `users.json`. Vế "restore mechanism" cũng là code thật phải làm — reviewer hay bấm thử nút Restore Purchases.

**3.2. Xoá tài khoản — bẫy tài khoản GUEST**

Nút xoá của anh đã sửa đúng gốc bệnh (nhãn "Clear all" khi máy để tiếng Anh). Nhưng còn một bẫy chưa ai soi:

> *"My app automatically creates an account for the user. Do I need to include an option to initiate account deletion? **Yes.** Users should have the option to delete automatically generated accounts (sometimes called "guest" accounts) and the data associated with those accounts."*

**Nếu hmongx.com tạo bản ghi người dùng khi khách vào lần đầu chưa đăng nhập** → trạng thái chưa đăng nhập cũng phải có đường xoá. Cần kiểm.

Các luật khác đã kiểm nguyên văn:
- *"only offering to temporarily deactivate or disable an account is insufficient"* — phải xoá THẬT.
- *"This includes user-generated content that's shared with others, such as photos, video, text posts, and reviews"* — lịch sử chat, ảnh, file tiếng, nhạc đều phải cuốn theo.
- *"Apps not operating in highly regulated industries should not require people to make a phone call, send an email, or go through other support flows"* — cấm kiểu "nhắn Zalo cho admin". Danh sách ngành được miễn (ngân hàng, y tế, cờ bạc, cần sa, hàng không, sàn crypto) không có trợ lý AI.
- Xoá chậm/xoá tay được chấp nhận, miễn báo thời gian và gửi xác nhận khi xong.
- **⚠️ Ví token phải về 0 khi xoá.** Nếu đăng nhập lại mà số dư còn, reviewer coi là soft-delete → rớt tiếp, và nối thẳng vào nghi ngờ 3.1.1.

**3.3. Sign in with Apple revoke token — anh HỎI ĐÚNG, nhưng câu trả lời là "chưa, và sắp"**

Luật gốc, nguyên văn, đã kiểm:

> *"**If your app offers Sign in with Apple**, you'll need to use the Sign in with Apple REST API to revoke user tokens when deleting an account."*

Câu bắt đầu bằng "If your app offers" → **nghĩa vụ CÓ ĐIỀU KIỆN. HMONG X hiện chỉ có Google/Facebook nên CHƯA dính. Đừng tốn công cắm revoke lúc này.**

**NHƯNG** — và đây là quả mìn chưa nổ, chưa lần từ chối nào nhắc tới — **Guideline 4.8**:

> *"Apps that use a third-party or social login service (such as Facebook Login, Google Sign-In...) to set up or authenticate the user's primary account with the app must also offer as an equivalent option another login service with the following features: the login service limits data collection to the user's name and email address; the login service allows users to keep their email address private...; and the login service does not collect interactions with your app for advertising purposes without consent."*

Đã đối chiếu đủ **cả 5 ngoại lệ** trong văn bản — HMONG X không lọt cái nào. Ngoại lệ "app dùng hệ đăng nhập của chính mình" đòi chữ **exclusively**, tức còn giữ nút Google/FB là vẫn dính.

Lưu ý chính xác: 4.8 **không** đích danh đòi Sign in with Apple, nó đòi "another login service" thoả 3 tính năng. Nhưng SIWA là lựa chọn dễ nhất vì tính năng giấu email.

👉 **Dây chuyền là: 4.8 ép cắm SIWA → cắm SIWA thì revoke token thành BẮT BUỘC NGAY.** Nên khi anh làm SIWA, phải làm luôn: lưu `refresh_token` lúc đăng nhập, khi xoá tài khoản gọi `https://appleid.apple.com/auth/revoke`.

*(Bản trích chi tiết về /auth/revoke mà agent đưa ra đã bị viết lại chứ không nguyên văn — em xếp xuống mục "chưa kiểm chứng" ở cuối. Nguồn chắc là bản tin 12m75xbj ở trên.)*

**3.4. 5.1.2(i) — xin phép trước khi gửi dữ liệu sang AI bên thứ ba**

Nguyên văn, kiểm khớp 100%:

> *"You must clearly disclose where personal data will be shared with third parties, **including with third-party AI**, and obtain explicit permission before doing so."*

HMONG X gửi lời người dùng sang Gemini, OpenAI, Suno mà chưa có màn hình xin phép nào.

**⚠️ ĐÂY LÀ CHỖ HAI AGENT MÂU THUẪN, em phải nói ra:**

| Agent nghiên cứu | Người kiểm nguồn |
|---|---|
| "Luật MỚI 13/11/2025, lần nộp tới **gần như chắc chắn rớt**" | Apple dùng đúng chữ **"Clarifies"** (làm rõ luật cũ), và **cả 2 lần từ chối HMONG X đều KHÔNG nêu 5.1.2(i)** → "gần như chắc chắn" là **phỏng đoán, không phải dữ kiện** |

Em nghiêng về người kiểm nguồn. Nhưng rủi ro là thật và chi phí vá thấp → **cứ vá**.

Một chi tiết cần chính xác: luật dùng chữ *"clearly disclose **where**"* — **không** bắt phải liệt kê đích danh tên từng nhà cung cấp trong màn hình xin phép. Nêu đích danh là cách an toàn nhất, nhưng đừng nói với ai là "Apple bắt thế".

Kèm theo 5.1.1(i) — privacy policy phải có đủ 3 thứ, và có câu ít người để ý: *"All apps must include a link to their privacy policy in the App Store Connect metadata field **and within the app in an easily accessible manner**"* — link chính sách phải có **ngay trong app**, dễ thấy.

**3.5. Nội dung AI và guideline 1.2 — anh hỏi đúng chỗ**

Chữ nghĩa 1.2 nguyên văn:

> *"apps with user-generated content or social networking services must include: A method for filtering objectionable material **from being posted to the app** · A mechanism to report **offensive content** and timely responses to concerns · The ability to **block abusive users** from the service · Published contact information so users can easily reach you."*

Ba trong bốn gạch đầu dòng chỉ có nghĩa khi tồn tại người dùng thứ hai. HMONG X không có feed, không có post, không có người dùng khác → **có lý lẽ văn bản để nói không thuộc 1.2**. Gạch thứ tư (công bố thông tin liên hệ) thì vẫn phải làm.

⚠️ Cảnh báo: bản tin 08/06/2026 ghi *"1.2: new paragraph clarifies developer responsibilities for content that violates this guideline"* — **1.2 vừa bị Apple sửa cách đây 2 tháng**. Đừng cãi kiểu "1.2 không liên quan gì tới tôi".

### 🟡 MỨC 4 — RỦI RO CÓ THẬT NHƯNG CHƯA AI BỊ, HOẶC CÁC AGENT CÃI NHAU

**4.1. Rủi ro 2.5.2 với app vỏ web — anh hỏi cái này, và câu trả lời là: KHÔNG PHẢI RỦI RO NHƯ ĐỒN**

Đây là chỗ em phải nói thẳng một cái sai nặng: **câu trích "miễn trừ WebKit/JavascriptCore" mà một agent đưa ra KHÔNG TỒN TẠI** trong hợp đồng hiện hành. Người kiểm nguồn tải trọn bản ADPLA (842KB HTML, 635.426 ký tự, đủ tới hết phụ lục) rồi grep: `WebKit` = 0 lần, `JavascriptCore` = 0 lần, `Exceptions to the foregoing` = 0 lần. Đó là chữ bản hợp đồng **cũ trước ~2019**.

Nguyên văn **THẬT** của mục "3.3.1 APIs and Functionality — B. Executable Code":

> *"Except as set forth in the next paragraph, an Application may not download or install executable code. Interpreted code may be downloaded to an Application but only so long as such code: (a) **does not change the primary purpose of the Application by providing features or functionality that are inconsistent with the intended and advertised purpose of the Application**; (b) does not bypass signing, sandbox, or other security features of the OS; and (c) for Applications distributed on the App Store, does not create a store or storefront for other Applications."*

👉 **Kết luận: nạp hmongx.com trong WebView TỰ NÓ KHÔNG vi phạm.** Hợp đồng cho phép tải interpreted code, miễn thoả 3 điều kiện.

👉 **Nhưng điều kiện (a) là quả bom, và nó nối thẳng vào vụ 3.1.1:**

> **Sau khi app được duyệt, nếu hmongx.com bật lại nút mua token bằng tiền thật cho người dùng iOS — đó vừa là 3.1.1 vừa là VI PHẠM HỢP ĐỒNG GIẤY PHÉP. Mức phạt không phải "rớt bản cập nhật" mà có thể là gỡ app / khoá Team ID A4XPMY5ZB8.**

Nút mua phải chặn ở **phía server theo cờ native**, vĩnh viễn — không ẩn bằng CSS, **không đoán user-agent**. Đoán user-agent là tự rước thêm 2.3.1 "hidden features", tức *"trying to trick the review process"*, tức mức phạt trục xuất.

⚠️ **Anh tự tải PDF hợp đồng từ developer.apple.com/support/terms để đọc nguyên văn** — dù sao cũng phải mở nó vì PLA mới đang chờ anh chấp nhận.

**4.2. Guideline 4.7.2 — HAI NGƯỜI KIỂM NGUỒN MÂU THUẪN NHAU, em không giấu**

Văn bản (kiểm khớp nguyên văn):
> 4.7: *"Apps may offer certain software that is not embedded in the binary, specifically HTML5 and JavaScript mini apps and mini games, streaming games, **chatbots**, and plug-ins."*
> 4.7.2: *"Your app may not extend or expose native platform APIs or technologies to the software without prior permission from Apple."*

| Bên nói CÓ RỦI RO | Bên nói KHÔNG |
|---|---|
| HMONG X trúng cả hai vế theo mặt chữ: toàn bộ UI là HTML5/JS không nhúng binary, và app đúng nghĩa đen là một **chatbot**. Cầu nối Capacitor chính là "phơi bày API native". Cả 4.7 và 4.7.2 đều mang chìa khoá ASR & NR (soi cả tự động lẫn thủ công) | Đọc trọn 4.7 thì văn cảnh là app đóng vai **NỀN TẢNG bày phần mềm của NGƯỜI KHÁC** (*"You are responsible for all such software offered in your app"*). Apple không có câu nào nói WebView nạp web của chính developer thì rơi vào 4.7 |

Và một lớp mâu thuẫn nữa: agent mảng 4 dùng trang Mini Apps Partner Program (*"put out by a person or entity that's not directly or indirectly controlled by you"*) làm lá bùa "4.7 chỉ nhắm bên thứ ba" — **người kiểm nguồn bác bỏ**: câu đó định nghĩa cái gì được hưởng **hoa hồng 85%**, không định nghĩa phạm vi guideline 4.7; và định nghĩa gốc "What's a mini app?" trên chính trang đó **không có** điều kiện bên-thứ-ba nào.

**Kết luận trung thực của em:** rủi ro 4.7.2 có thật về mặt câu chữ, **chưa tìm ra tiền lệ nào** ai bị đánh 4.7 vì tự nạp web của mình, và **hai lần từ chối HMONG X không nêu 4.7 lần nào**. → Đừng hoảng, đừng đập app đi làm lại. Nhưng **cũng đừng tự khai** với reviewer rằng app nạp URL ngoài, và đừng cầm câu Mini Apps ra cãi — nó không đỡ được.

**4.3. Guideline 4.2 — chưa phải cửa đang chặn, nhưng có một lỗ rẻ tiền nên vá**

> *"Your app should include features, content, and UI that elevate it beyond a repackaged website."*
> 4.2.2: *"Other than catalogs, apps shouldn't primarily be marketing materials, advertisements, **web clippings**, content aggregators, or a collection of links."*

Bằng chứng giảm nhẹ: Apple đã cầm app thật **hai lần**, nêu **6 guideline**, **không lần nào nêu 4.2**. Và 4.2 không mang chìa khoá ASR & NR — tức không có máy quét tự động, chỉ do người duyệt gõ.

Bằng chứng đáng lo: có ca tháng 01/2026 (giai thoại, chưa kiểm nguồn) một app Capacitor có Core Location + reverse geocoding + clipboard + share sheet + Apple Maps deep link + plugin Swift tự viết **vẫn** bị 4.2, Apple ghi *"features such as Core Location or sharing alone are not robust enough"*. Tức Apple chấm **trải nghiệm có khác trình duyệt không**, không đếm số plugin.

**Lỗ rẻ nhất nên vá ngay: tắt mạng là app trắng màn hình.** Chỉ cần một màn hình native có logo + chữ tiếng Mông + nút "Thử lại". Rẻ, nhanh, không phải viết lại gì.

**⚠️ ĐỪNG kê chức năng chưa có vào Notes for Review.** Camera đã có quyền (build 1.0(2)), nhưng Sign in with Apple / push / share sheet / lưu file thì phải **kiểm chứng thật trong build** trước khi ghi. Kê chức năng không tồn tại là mở đường cho lần từ chối thứ ba, và lần này là **2.3 Accurate Metadata**.

**4.4. 4.3(b) spam** — Apple siết thêm 08/06/2026 (*"4.3(b): clarifies the basis for the guideline and adds examples"*). Nhưng ví dụ Apple thật sự liệt kê là: dating, flashlight, sound effects, wallpaper, simple timers, fortune telling, drinking games, Kama Sutra, fart and burp apps — **không có AI**. Chuyện "app AI là nhóm bị chấm nặng nhất" là **cảm nhận nghề, không có nguồn**. Dù vậy lời khuyên vẫn tốt: đưa **tiếng Hmoob** lên ảnh số 1 và câu đầu mô tả, đừng để ô chat trống giống ChatGPT làm ảnh mở đầu. Đó là marketing, không phải yêu cầu của Apple.

**4.5. KHÔNG có yêu cầu dán nhãn "AI-generated"** — chữ "AI" chỉ xuất hiện **một lần** trong toàn bộ App Review Guidelines, ở 5.1.2(i). Nhãn "Made With AI" là của **Apple Music**, không liên quan App Store. Đừng tin blog, đừng tốn công.

**4.6. Bẫy tài khoản demo** — reviewer lần này **chắc chắn** sẽ bấm thử nút xoá. Nếu chỉ có một tài khoản demo, họ xoá xong là lần nộp sau rớt 2.1 "không đăng nhập được". **Đưa HAI tài khoản**: A để dùng app (ghi rõ xin đừng xoá), B để đem xoá.

**4.7. Bẫy 2.1 khi cắm IAP** — sản phẩm IAP phải thật sự ở trạng thái Ready to Submit và reviewer phải tìm được màn hình mua. Lỗi *"In-App Purchase products could not be found in the submitted binary"* là bẫy phổ biến nhất. Ghi đường đi từng bước vào Notes.

**4.8. Luật Texas** — từ 01/01/2026 tài khoản Apple mới ở Texas cần age assurance + phụ huynh đồng ý. Chưa gấp (người Mông ở Mỹ tập trung Minnesota/Wisconsin/California), nhưng bản tin nói *"upcoming U.S. state laws, including SB2420 in Texas"* — Texas là ví dụ, các bang khác đang tới.

---

## 3. THỨ TỰ NƯỚC ĐI CHO LẦN NỘP THỨ 3

### 🔵 HÔM NAY — 4 việc, đều của Aib, không ai làm hộ được

| # | Việc | Ai | Thời gian |
|---|---|---|---|
| 1 | **Soi trạng thái TRƯỚC** — App Store Connect → Business → Agreements + Compliance. Chụp lại đúng chữ ở cột trạng thái dòng Paid Apps. Nếu là `Verifying` / `Pending (...Legal Entity)` thì có thể đang bị chặn cả việc nộp app | Aib | 5 phút |
| 2 | **Account Holder chấp nhận PLA mới** trên developer.apple.com. Chưa làm bước này thì mọi thứ khác vô nghĩa | Aib (không uỷ quyền được) | 5 phút |
| 3 | **Trả lời TRỌN BỘ câu hỏi age rating mới** — hạn chặn cứng ~10 ngày. Social media: KHÔNG. UGC: KHÔNG. Mức: 13+ | Aib | 10 phút |
| 4 | **Khai DSA trader** — Business → Compliance. Dùng số điện thoại + email công việc (sẽ hiện công khai ở EU). Chuẩn bị sẵn giấy chứng minh địa chỉ, có OTP 2 lớp | Aib | 30 phút |

**Việc 1 làm TRƯỚC việc 5** — vì nếu tài khoản đang trong compliance review thì mở ticket lúc này có thể khoá thêm đường nộp app.

### 🔵 HÔM NAY hoặc SÁNG MAI — mở đường găng

| # | Việc | Ai |
|---|---|---|
| 5 | **Mở ticket developer.apple.com/contact** xin cập nhật legal entity. Mang sẵn giấy tờ (*"You may need to provide business documentation"*). **GIỮ NGUYÊN tư cách CÁ NHÂN (A Cu Lao)** — đừng đổi sang Công ty TNHH Công nghệ Hmong X lúc này ⚠️ | Aib |
| 6 | **Đặt lịch tư vấn 1-1 với App Review** (developer.apple.com/events, tìm "App Review"). Chính nhân viên Apple khuyên đường này trên forum. Một buổi hỏi trọn 4 việc: Paid Apps kẹt vì legal entity, cách làm IAP khi ví token đã bán trên web, DSA trader, và hỏi thẳng về 4.2/4.7 với app WebView | Aib |
| 7 | **Trả lời trong Resolution Center — để HỎI, không để cãi**. Nội dung: (a) 4 lỗi kia đã sửa, đính kèm ảnh/video; (b) với 3.1.1 chúng tôi CHẤP NHẬN đi đường IAP, đang bị chặn ở Paid Apps vì legal entity; (c) xin xác nhận trình tự. **Làm TRƯỚC khi nộp build** — bấm nộp là mất quyền trả lời | Aib + em soạn |

⚠️ **Ghi chú lý do việc 5 giữ cá nhân**: đổi sang pháp nhân sinh trạng thái `Pending (New Legal Entity)`, phải ký hợp đồng mới, cộng D-U-N-S. Nhưng em nói rõ — **"cá nhân thì chỉ cần xác nhận tên/địa chỉ" là SUY ĐOÁN**, trang Apple không phân biệt cá nhân với công ty. Anh mở ticket rồi **hỏi thẳng Apple cần đúng giấy gì**, đừng đoán.

### 🟢 TRONG LÚC CHỜ GIẤY TỜ (1–3 tuần) — phần việc của em

| # | Việc | Ghi chú |
|---|---|---|
| 8 | **Chặn cửa mua ngoài bằng CỜ NATIVE** — app Capacitor gửi header riêng lên hmongx.com; server thấy header đó thì ẩn toàn bộ trang giá / nút mua / link SePay / PayPal. **KHÔNG đoán user-agent** | Đây là việc quan trọng nhất về code |
| 9 | **Rà toàn bộ web** — mở app iOS, cố lướt tới mọi trang có chữ giá/token/nạp tiền trong webview. App là Capacitor nạp thẳng hmongx.com nên **toàn bộ website nằm trong app** | Trang nào còn tới được là còn dính |
| 10 | **Màn hình offline native** — logo + chữ Mông + nút Thử lại, thay màn trắng | Vá 4.2 rẻ nhất |
| 11 | **Màn hình xin phép AI bên thứ ba** — hiện TRƯỚC gói tin đầu tiên rời máy, nêu Gemini/OpenAI/Suno, có nút Đồng ý và Từ chối thật, bật/tắt lại được trong Cài đặt | ⚠️ Đừng gọi API sớm rồi mới hiện màn hình — reviewer soi gói mạng |
| 12 | **Viết lại privacy policy** trên hmongx.com: liệt kê đích danh từng nhà xử lý AI, dữ liệu nào, giữ bao lâu, rút đồng ý thế nào. **Thêm link chính sách NGAY TRONG APP, dễ thấy** | |
| 13 | **Cắm 3 thứ của 4.7.1** phòng xa: bộ lọc prompt, nút Báo cáo trên mỗi kết quả AI, email liên hệ hiện trong app | Rẻ, và cũng thoả gạch thứ tư của 1.2 |
| 14 | **Kiểm tài khoản guest** — hmongx.com có tạo bản ghi khi chưa đăng nhập không? Nếu có, trạng thái chưa đăng nhập cũng phải có đường xoá | |
| 15 | **Tách logic hạn dùng ví token** — token mua qua IAP đánh dấu vĩnh viễn trong `users.json` | Luật *"may not expire"* |
| 16 | **Cắm Sign in with Apple** (vì 4.8) **+ revoke token** cùng lúc | Làm luôn đợt này để khỏi mất thêm một vòng |
| 17 | **Chuẩn bị sẵn code StoreKit + đường cộng token về ví chung** (kiểu webhook SePay đã có) + **nút Restore Purchases** | Khi Paid Apps active là nộp được ngay |
| 18 | **Quay video xoá tài khoản** — máy để tiếng Anh, liền mạch 40-60s: màn chính → Cài đặt → nút xoá → xác nhận → thông báo xong → đăng nhập lại thấy tài khoản trắng | Host `.mp4` trực tiếp trên VPS, giữ dưới 100MB (Cloudflare) |
| 19 | **Rà lại Notes for Review 3684 ký tự** — xoá sạch từ kỹ thuật (Capacitor, WKWebView, server.url, bridge, Firebase). Thêm: bảng dịch từng nút tiếng Mông sang tiếng Anh, hai tài khoản demo, lập luận không thuộc 1.2 | Ô Reply giới hạn ~4000 ký tự |

### 🟣 KHI PAID APPS CHUYỂN `ACTIVE`

20. Ký Paid Apps → **đăng ký Small Business Program ngay hôm đó** → rồi mới tính giá theo 15% (cộng ~17,6%, không phải 42,9%).
21. Tạo sản phẩm IAP dạng **Consumable**, lấy đúng các mốc gói token đang bán trên web. (Tham khảo cách chia mốc: ChatGPT 100/500/1000 credits; Perplexity 500 → 10.000; Claude 20/50/250 — **nhưng đừng bao giờ trích trang App Store của họ để cãi với reviewer, họ chỉ nghe văn bản guideline**.)
22. **Nộp IAP consumable đầu tiên CHUNG với app version** — luật bắt buộc.

### 🧪 TỰ THỬ NHƯ REVIEWER TRƯỚC KHI BẤM SUBMIT

- iPhone để **tiếng Anh**, nick Google mới → tạo 1 chat + 1 ảnh + 1 file tiếng → bấm xoá → **đăng nhập lại**. Phải ra tài khoản **trắng**, token **0**.
- Bật **chế độ máy bay** — không được ra màn hình trắng.
- Lướt khắp webview tìm mọi trang giá.
- Bấm thử nút **Restore Purchases**.

### ❌ NHỮNG THỨ ĐỪNG LÀM

- Đừng bấm Submit khi chưa có IAP.
- Đừng appeal — Apple hiểu đúng, và mỗi submission chỉ appeal được 1 lần.
- Đừng xin "cho lên trước, sửa sau" theo Bug Fix Submissions — cơ chế đó chỉ cho app **đã có** trên store.
- Đừng đập kiến trúc Capacitor ra viết lại native. 4.2 chưa từng bị nêu; đó là việc hàng tuần lễ trong lúc cửa thật đang kẹt.
- Đừng ẩn/hiện cửa nạp token theo cờ máy chủ hay IP khi Apple duyệt.
- Đừng đổi tài khoản sang pháp nhân công ty lúc này.
- Đừng trông vào cửa "US storefront" — khách Mông ở VN/Lào/Thái không thuộc kho Mỹ, và kể cả kho Mỹ thì link ra ngoài là quyền **THÊM** bên cạnh IAP, chưa bao giờ là quyền **BỎ** IAP.

### 🎁 MỘT MÓN QUÀ LUẬT CHO PHÉP

> 3.1.3: *"Developers can send communications outside of the app to their user base about purchasing methods other than in-app purchase."*

Anh **ĐƯỢC** nhắn Messenger, Zalo, email, đăng page hmong4skls 143K follower bảo khách vào kubsuav.com mua token rẻ hơn giá trong app. **Ngoài app thì Apple không cấm.** Đây đúng là cách đội sale của anh đang bán, và là cách các app lớn giữ biên lợi nhuận.

*(Lưu ý câu chữ: đoạn đó mở đầu bằng "Apps in this section", tức áp cho app đã lọt vào một ngoại lệ 3.1.3. Nên đừng dùng câu này để **biện hộ với reviewer** — chỉ dùng để yên tâm mà bán bên ngoài.)*

---

## 4. BẢNG NGUỒN

### 4A. NGUỒN ĐÃ KIỂM — MỞ ĐƯỢC, TRÍCH KHỚP NGUYÊN VĂN, DIỄN GIẢI KHÔNG ĐỌC RỘNG

| # | Nguồn | Dùng cho | Loại |
|---|---|---|---|
| 1 | `developer.apple.com/app-store/review/guidelines/` — **Last Updated: June 8, 2026** | 3.1.1 (phải dùng IAP, "their own mechanisms", credits không hết hạn, restore) · 3.1.3(b) multiplatform · 3.1.3 giới hạn kho Mỹ + cho phép liên lạc ngoài app · 5.1.1(v) xoá tài khoản · 5.1.1(i) privacy policy · 5.1.2(i) third-party AI · 4.8 login service · 4.7 + 4.7.1 + 4.7.2 + 4.7.5 · 4.2 + 4.2.2 · 4.3(b) · 1.2 · "repeatedly rejected...take longer" · "cheat the system...expelled" · Bug Fix Submissions | LUẬT CHÍNH THỨC |
| 2 | `developer.apple.com/support/offering-account-deletion-in-your-app/` | Nút phải "easy to find", cấm "unnecessarily difficult", chỉ được link web để **hoàn tất**, cấm soft-delete, cấm bắt gọi/mail, **guest account cũng phải xoá được**, xoá chậm được nhưng phải báo, UGC phải xoá theo | LUẬT CHÍNH THỨC |
| 3 | `developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements` | "won't be able to create a new app or In-App Purchase until you've agreed..." · chỉ Account Holder ký được · legal entity **up to two weeks** · "may generate a new Paid Apps Agreement" · "may need to provide business documentation" | LUẬT CHÍNH THỨC |
| 4 | `developer.apple.com/help/app-store-connect/reference/account-management/compliance-review/` | "may not be able to sign pending agreements or **submit new apps or app updates** until review is complete" · "Apple periodically re-performs compliance reviews... when you make changes" · 14 business days | LUẬT CHÍNH THỨC |
| 5 | `developer.apple.com/help/app-store-connect/manage-agreements/view-agreements-status/` | Bảng 12 nhãn trạng thái hợp đồng (Active / Verifying / Processing / Pending...) | LUẬT CHÍNH THỨC |
| 6 | `developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase` | "The first consumable... must be submitted with a new app version" | LUẬT CHÍNH THỨC |
| 7 | `developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/reply-to-app-review-messages` | Reply to App Review + Attach File · "until you resubmit to App Review" · metadata sửa xong nộp lại được cùng build | LUẬT CHÍNH THỨC |
| 8 | `developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/manage-a-submission-with-unresolved-issues` | "You can edit items in a submission **once** before resubmission... can't add back removed items" | LUẬT CHÍNH THỨC |
| 9 | `developer.apple.com/distribute/app-review/` | Điều kiện appeal ("misunderstood your app's concept") · 1 appeal/submission · demo video chỉ khi "hard to replicate" · phải điền App Review Information | LUẬT CHÍNH THỨC |
| 10 | `developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/` | **Bảng mức hiện hành: 4+, 9+, 13+, 16+, 18+, Unrated — KHÔNG còn 12+/17+** · định nghĩa UGC = "broad distribution" | LUẬT CHÍNH THỨC |
| 11 | `developer.apple.com/news/?id=ks775ehf` (24/07/2025) | Thêm 13+/16+/18+ · hạn 31/01/2026 · "must consider how all app features, **including AI assistants and chatbot functionality**" | LUẬT CHÍNH THỨC |
| 12 | `developer.apple.com/news/?id=tlur8uvi` (09/07/2026) | **"beginning in September 2026, responses will be required"** · định nghĩa social media capability · nhãn Social Media hiện trên trang bán app | LUẬT CHÍNH THỨC |
| 13 | `developer.apple.com/news/?id=12m75xbj` (24/05/2022) | "**If your app offers Sign in with Apple**, you'll need to use the Sign in with Apple REST API to revoke user tokens when deleting an account" | LUẬT CHÍNH THỨC |
| 14 | `developer.apple.com/news/?id=x60uzbu9` (21/03/2024) | "You'll need to let us know whether or not you're a trader to submit new apps" | LUẬT CHÍNH THỨC |
| 15 | `developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/` | Cá nhân phải khai địa chỉ/điện thoại/email hiện công khai · OTP 2 lớp · **"All traders: You'll need to provide payment account details"** | LUẬT CHÍNH THỨC |
| 16 | `developer.apple.com/news/?id=a233fmpw` (08/06/2026) | Xác nhận mốc sửa 4.3(b) và **1.2 có đoạn mới về trách nhiệm gỡ nội dung** | LUẬT CHÍNH THỨC |
| 17 | `developer.apple.com/news/?id=2ezb6jhj` (04/11/2025) | Texas SB2420 từ 01/01/2026 · "upcoming U.S. state laws, **including** SB2420" | LUẬT CHÍNH THỨC |
| 18 | `apple.com/legal/app-store/transparency/2025/` | 2.093.244 lượt bị từ chối · Business 283.820 · **387.087 được duyệt sau khi bị từ chối** · appeal gỡ app 423/26.305 = 1,6% | **THỐNG KÊ**, không phải luật |
| 19 | `apps.apple.com/us/app/chatgpt/id6448311069` (+ Perplexity `id1668000334`, Claude `id6473753684` — đã mở riêng từng trang) | Credit lẻ bán qua IAP là chuẩn ngành; tham khảo cách chia mốc | **BẰNG CHỨNG THỊ TRƯỜNG**, không phải luật — đừng trích cho reviewer |
| 20 | `appstorereviewguidelineshistory.com` | Diff 29/01/2024: xoá "standard WebKit view" khỏi 4.7.1, dời lệnh cấm phơi API native sang 4.7.2 và mở rộng từ "third-party software" → "the software" | Bên thứ ba, đã đối chiếu thẻ diff |
| 21 | `capacitorjs.com/docs/config` | `server.url`: *"This is not intended for use in production."* (cụm này xuất hiện 4 lần trên trang) | Tài liệu Capacitor, **không phải luật Apple** |
| 22 | `developer.apple.com/app-store/small-business-program/` | 15% thay 30% · điều kiện: **"Review and accept the latest Paid Apps agreement"** · "adjusted fifteen (15) days after the end of the fiscal calendar month" | LUẬT CHÍNH THỨC (câu trích của agent đã được sửa lại cho nguyên văn) |
| 23 | ADPLA hiện hành, mục "3.3.1 APIs and Functionality — B. Executable Code" (tải trọn 842KB HTML) | Interpreted code được tải, với 3 điều kiện (a)(b)(c). **Điều kiện (a) "không đổi mục đích chính" là bẫy thật cho HMONG X** | LUẬT CHÍNH THỨC |

### 4B. NGUỒN SAI LỆCH — LINK THẬT NHƯNG TRÍCH HOẶC DIỄN GIẢI CÓ VẤN ĐỀ

| Nguồn | Vấn đề |
|---|---|
| Câu **"Exceptions to the foregoing include scripts and code downloaded and run by Apple's built-in WebKit framework or JavascriptCore"** | ⛔ **CÂU NÀY KHÔNG TỒN TẠI** trong hợp đồng hiện hành. Grep toàn văn: WebKit = 0, JavascriptCore = 0. Là chữ bản **cũ trước ~2019**. **Aib đừng bao giờ trích câu này cho Apple** — trích là lộ ngay đọc tài liệu lỗi thời. Dùng bản nguyên văn ở mục 23 bảng trên |
| `news.ycombinator.com/item?id=18431247` | Comment có thật (jek0, 12/11/2018) nhưng **không chứa câu được gán cho nó**, và nội dung thật nói ngược lại. Nội dung đúng nằm trong ADPLA 3.3.1(B)(a) — đổi nguồn |
| `developer.apple.com/programs/mini-apps-partner/` | Link + trích đúng 100%, nhưng **diễn giải sai**: câu đó định nghĩa cái gì hưởng hoa hồng 85%, **không** định nghĩa phạm vi guideline 4.7. Định nghĩa "What's a mini app?" trên chính trang đó không có điều kiện bên-thứ-ba. **Đừng cầm ra cãi với Apple** |
| `developer.apple.com/news/?id=9txfddzf` (01/05/2025) | Link + trích thật (guidelines sửa cho kho Mỹ sau vụ Epic). Nhưng phần *"là CÂU MẪU dán vào mọi thư 3.1.1"* **không có trong nguồn** — là giai thoại của agent |
| `developer.apple.com/news/?id=ey6d8onl` (13/11/2025) | Link + trích thật, nhưng Apple dùng chữ **"Clarifies"** (làm rõ luật cũ). Câu "không phải luật cũ anh đã tuân thủ từ trước" đi **ngược** chính chữ Apple |
| `developer.apple.com/forums/thread/766486` | ⚠️ **KHÔNG PHẢI KỸ SƯ APPLE.** Câu về link `.mp4` do người dùng cộng đồng **WindowsMEMZ** viết (10/2024), không huy hiệu Apple. Lời khuyên tự host .mp4 vẫn tốt, nhưng **đừng nói "Apple bảo thế"** |
| `developer.apple.com/forums/thread/708415` | Tác giả đúng là DTS Engineer (Apple, 6/2022), nhưng **câu trích bị viết lại**, mất cụm giới hạn "associated to your developer account". Đừng dán vào thư gửi Apple như trích dẫn |
| `developer.apple.com/forums/thread/131256` | Con số "phản hồi trong 24 giờ" đến từ bài forum **tháng 4/2020** (6 năm tuổi), không có trong tài liệu hiện hành. Ý "trả lời được mà chưa cần build mới" thì đúng — dùng nguồn #7 bảng trên thay thế |
| Bài blog `ptkd.com`, `orbitkit.io`, `mobiloud.com`, `acceptmy.app`, `code2native`/`shopapper`/... | Blog SEO của các hãng bán dịch vụ đóng gói web thành app — **có lợi ích riêng**. Trong đó có một ý **SAI rõ**: "thiếu public deletion URL là rớt" — Apple ghi user privacy choices URL là **tuỳ chọn**. Đừng tốn thời gian |

### 4C. GIAI THOẠI CHƯA KIỂM CHỨNG ĐƯỢC

Những thread sau **không nằm trong bảng kiểm nguồn** nào — em ghi lại vì nội dung có ích, nhưng anh đừng coi là bằng chứng:

| Nội dung | Nguồn được nêu | Trạng thái |
|---|---|---|
| Mẫu thư từ chối 3.1.1 nguyên văn ("must be available for purchase in the app using only in-app purchase") | forums/thread/794034 | **Chưa kiểm** |
| Ca 12/2025: app companion login-only, không bán, không link, vẫn bị 3.1.1 nhiều lần | forums/thread/811018 | **Chưa kiểm** — đây là ca quan trọng nhất cho quyết định "bỏ token khỏi iOS", mà lại chưa kiểm được |
| Ca bị 2.3.1 "hidden features" vì server đổi giao diện lúc duyệt, từ chối 3 lần | forums/thread/802224 | **Chưa kiểm** |
| Ca 01/2026: app Capacitor nhiều tính năng native vẫn bị 4.2, "sharing alone are not robust enough" | forums/thread/812889 | **Chưa kiểm** |
| Ca 11/2025: app webview bị từ chối 10 lần; nhân viên Apple khuyên đặt lịch tư vấn 1-1 | forums/thread/806726 | **Chưa kiểm** — nhưng lời khuyên đặt lịch tư vấn thì vô hại và đáng làm |
| Làn sóng từ chối third-party AI tháng 2/2026 + công thức 4 bước đã được duyệt | forums/thread/815842 | **Chưa kiểm** |
| Reviewer xoá mất tài khoản demo duy nhất, lần sau rớt 2.1 | forums/thread/704811 | **Chưa kiểm** |
| App bị dán nhãn UGC bị ép lên 18+ | forums/thread/807358 | **Chưa kiểm** |
| Bẫy "IAP products could not be found in the submitted binary" | forums/thread/812196 | **Chưa kiểm** |
| jcesarmobile (maintainer Capacitor, 2021): server.url có thể làm rớt app | github.com/ionic-team/capacitor/discussions/4080 | **Chưa kiểm** — và điều khoản anh ta trích đã bị Apple xoá 29/01/2024 |
| Vụ Epic v. Apple lên Tối cao Pháp viện 06/2026 | 9to5mac | **Chưa kiểm** |
| Trang nộp appeal `developer.apple.com/contact/app-store/?topic=appeal` | — | **Không mở được** (đòi đăng nhập) |
| Trang đặt lịch tư vấn App Review | — | **Không mở được** (đòi đăng nhập) — anh tự vào xem |

---

## LỜI CUỐI, THẲNG

Em **không hứa** Apple sẽ duyệt. Không ai hứa được.

Ba điều em chắc:
1. **Nộp bây giờ chắc chắn không tiết kiệm được vòng nào** — vì consumable đầu tiên bắt buộc đi kèm app version, và vì hiện anh còn chưa bấm được nút nộp.
2. **Đường găng không phải code, mà là giấy tờ** — legal entity tới 2 tuần, có thể dài hơn nếu Apple đẻ ra Paid Apps mới. Code IAP xong sớm cũng phải nằm chờ.
3. **Việc gấp nhất trong 24 giờ tới không phải IAP mà là age rating** — 10 ngày nữa là chặn cứng ở cửa, làm mất 10 phút.

Hai chuyện khác nhau, đừng gộp: **luật có cho không — CÓ** (cắm IAP là hợp lệ, ví web và ví iOS được dùng chung, khách cũ không mất tiền). **Tài khoản có làm được chưa — CHƯA**.