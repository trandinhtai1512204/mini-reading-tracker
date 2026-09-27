# Mini Reading Tracker — Session Runbook

File này là "ngữ cảnh gốc" cho toàn bộ bài test ICODE. Khi mở một session Codex mới, không cần kể lại lịch sử: chỉ cần dán **Prompt khởi động** bên dưới, sau đó dán nhiệm vụ của đúng session đang làm. Mỗi session là một checkpoint nhỏ, có code chạy được, giải thích để ôn phỏng vấn, commit riêng và (khi đã có môi trường) deploy checkpoint đó.

> Nguyên tắc học thật: chỉ commit phần đã được kiểm tra; nội dung commit và README phải phản ánh đúng việc đã làm. Nếu chưa hoàn thành hoặc chưa kiểm tra được, ghi rõ `FAIL` hoặc `BLOCKED`, không ngụy tạo kết quả.

## Nguồn yêu cầu chuẩn

- Đề gốc: `README.reading-tracker.pdf`.
- Deadline thực tế theo email: hết ngày **02/10/2026**; bỏ qua mốc 3–5 ngày trong PDF.
- Công nghệ bắt buộc: Vue.js, Node.js, MySQL.
- Frontend **không được gọi trực tiếp** Open Library; mọi request đi qua backend của dự án.
- Sản phẩm cuối: frontend/backend public HTTPS, data mẫu, repo có lịch sử commit, README đầy đủ và hoạt động tối thiểu 7 ngày.

## Prompt khởi động — dán trong mọi session

```text
Tôi tiếp tục bài test Fullstack ICODE “Mini Reading Tracker”. Hãy đọc kỹ file CODEX-SESSION-RUNBOOK.md và README.reading-tracker.pdf trong repository trước khi làm bất kỳ thay đổi nào. File runbook là nguồn điều phối session; PDF là nguồn yêu cầu sản phẩm.

Các yêu cầu không được vi phạm:
- Frontend Vue.js, backend Node.js, database MySQL.
- Frontend chỉ gọi API của backend dự án. Backend gọi Open Library và chuẩn hoá dữ liệu trả về.
- Tủ sách lưu MySQL; localStorage không phải nguồn dữ liệu chính.
- Không thêm trùng sách: backend trả HTTP 409 Conflict.
- 0 <= currentPage <= totalPages; rating là số nguyên 1–5 hoặc null.
- currentPage bằng totalPages tự chuyển Read; lần đầu Reading lưu startedAt; Read lưu finishedAt.
- Validate ở backend và trả lỗi theo một format thống nhất, có thông báo rõ.
- Không commit secret, credential, token hoặc file .env thật.

Quy trình bắt buộc trong session này:
1. Chạy git status --short --branch và đọc cấu trúc/code liên quan. Bảo toàn mọi thay đổi có sẵn: không reset, clean, stash, checkout hay xoá file của người dùng.
2. Nêu kế hoạch ngắn: scope session, file dự kiến sửa, rủi ro. Nếu scope mâu thuẫn runbook/PDF, dừng và nêu mâu thuẫn.
3. Chỉ làm đúng Session tôi chỉ định; không lấn sang session kế tiếp.
4. Sau khi làm, chạy lint/typecheck/test/browser check phù hợp. Tách bạch PASS, FAIL và BLOCKED, không suy diễn PASS.
5. Giải thích bằng tiếng Việt để tôi học phỏng vấn theo đúng mẫu “Báo cáo học lại” bên dưới.
6. Nếu scope session PASS và git diff chỉ gồm phần của session: tạo một commit Conventional Commit đúng nội dung, rồi push origin/main. Nếu chưa có origin hoặc push lỗi, commit local (nếu an toàn) và báo BLOCKED kèm lệnh/điều kiện còn thiếu. Không tự force-push hay commit thay đổi ngoài scope.
7. Chỉ deploy khi session yêu cầu deploy hoặc tôi yêu cầu rõ. Sau deploy, kiểm tra URL thật và ghi thời gian/URL/kết quả; không nói deploy PASS khi chưa smoke test.
```

## Mẫu “Báo cáo học lại” bắt buộc ở cuối mọi session

```text
## Báo cáo học lại
1. Đã thay đổi gì? (file → vai trò → lý do)
2. Luồng dữ liệu: người dùng thao tác → Vue state/component → API client → Node route/controller/service → MySQL/Open Library → response → UI.
3. Kiến trúc/quyết định: tại sao chọn cách này; phương án khác và trade-off.
4. Giải thích code chi tiết: đi qua từng hàm, input, output, validation, lỗi và side effect của phần mới. Nêu dòng/file cụ thể khi phù hợp.
5. Điều cần nhớ để phỏng vấn: 5 câu hỏi có thể bị hỏi và câu trả lời ngắn, trung thực.
6. Kiểm tra: lệnh đã chạy, kết quả PASS/FAIL/BLOCKED và bằng chứng.
7. Git/deploy: commit SHA + message, remote push trạng thái, URL deploy (nếu có).
8. Phần chưa làm/rủi ro còn lại và session tiếp theo theo runbook.
```

## Quy ước kiến trúc được chốt trước khi code

Mục tiêu là kiến trúc nhỏ, dễ giải thích — không cần microservice hay state-management phức tạp.

```text
Browser (Vue 3)
  └─ API client (VITE_API_BASE_URL)
       └─ Node/Express REST API
            ├─ validation + error middleware
            ├─ library service ─── MySQL
            └─ OpenLibrary service ─── public Open Library API
```

- **Vue** chịu UI, route, local UI state và render trạng thái loading/empty/error.
- **Node/Express** là ranh giới tin cậy: validate, áp business rule, che giấu sự thay đổi của Open Library bằng DTO và chỉ backend biết upstream URL.
- **MySQL** là nguồn dữ liệu duy nhất cho “tủ sách của tôi”. Dữ liệu search/chi tiết từ Open Library có thể thiếu hoặc thay đổi, nên lưu snapshot metadata cần hiển thị khi thêm vào tủ.
- **Unique constraint trên `work_id`** là lớp chống duplicate chắc chắn; controller chuyển duplicate database thành `409` thay vì chỉ dựa vào kiểm tra từ frontend.
- Format lỗi nên ổn định, ví dụ `{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [...] } }`, để Vue hiển thị được thông báo có ích.
- Khi update tiến độ/status, service tính và ghi các field phụ thuộc trong cùng một luồng (hoặc transaction nếu có nhiều query), không để frontend tự suy đoán `startedAt`/`finishedAt`.

## Phân phiên thực hiện

### Session 00 — Khảo sát, scaffold và hợp đồng kiến trúc

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 00. Scope duy nhất: khảo sát repository, tạo nền project tối thiểu và tài liệu kỹ thuật; chưa làm chức năng nghiệp vụ hoàn chỉnh.

Hãy:
- Kiểm tra git/repo, package manager và các thay đổi hiện có.
- Chốt cấu trúc thư mục cho Vue frontend và Node backend, stack tối thiểu, lệnh local dev/test/lint.
- Tạo .gitignore an toàn, .env.example không secret và README khởi đầu.
- Viết API contract sơ bộ, format lỗi, và schema MySQL dự kiến trong README hoặc docs.
- Nếu repo trống, scaffold tối thiểu để frontend/backend có thể bắt đầu ở session sau; chưa làm giao diện/tích hợp Open Library.
- Tạo checklist đối chiếu tất cả yêu cầu PDF → session/file dự kiến.

Commit kỳ vọng: chore: initialize reading tracker project structure
Không deploy trừ khi tôi yêu cầu.
```

### Session 01 — Backend nền tảng, MySQL, migration và health check

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 01. Chỉ xây nền backend và persistence, chưa tích hợp Open Library hay Vue nghiệp vụ.

Hãy:
- Thiết lập Node/Express, config environment, kết nối MySQL và migration.
- Tạo bảng library_books (hoặc tên tương đương) có workId unique, title, author, coverId/url, publishYear, totalPages, status, currentPage, rating nullable, note, startedAt, finishedAt, createdAt, updatedAt.
- Chọn enum/status rõ ràng cho WANT_TO_READ, READING, READ.
- Tạo health endpoint và middleware format lỗi thống nhất.
- Tạo seed data idempotent để reviewer có dữ liệu xem ngay.
- Test kết nối/migration/seed ở mức khả dụng.

Commit kỳ vọng: feat(api): add database foundation and health endpoint
Nếu đã có VPS/DB staging, deploy backend health checkpoint và smoke test URL; nếu chưa có thì không tự bịa deploy.
```

### Session 02 — Backend proxy Open Library

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 02. Chỉ làm Open Library integration trong backend.

Hãy tạo và kiểm tra:
- GET search nhận keyword/page, gọi server-side https://openlibrary.org/search.json và phân trang theo đề.
- GET work detail nhận workId, gọi server-side https://openlibrary.org/works/{workId}.json.
- DTO ổn định cho frontend: workId, title, authors, coverId/coverUrl, firstPublishYear, description, numberOfPages, subjects; xử lý dữ liệu upstream thiếu/không đồng nhất.
- Validation keyword/page/workId, timeout và mapping lỗi upstream.
- Tài liệu API và test các nhánh success, invalid input, upstream error nếu khả thi.

Tuyệt đối không thêm URL Open Library vào frontend trong session này.
Commit kỳ vọng: feat(api): proxy Open Library search and work details
```

### Session 03 — API tủ sách và business rules

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 03. Chỉ làm REST API cho tủ sách và toàn bộ rule nghiệp vụ.

Phải có:
- Add book với trạng thái khởi tạo; duplicate trả 409 từ backend.
- List/filter theo status; stats total/reading/read.
- Update currentPage, status, rating và note; delete book.
- Validation đầy đủ: currentPage range, rating integer 1–5/null, status hợp lệ.
- Auto READ khi currentPage == totalPages; timestamp Reading lần đầu và Read đúng thời điểm.
- Test rõ các edge case, nhất là duplicate, progress vượt giới hạn, auto status/timestamp.

Không làm Vue UI trong session này.
Commit kỳ vọng: feat(api): manage personal library with reading rules
```

### Session 04 — Vue foundation và tìm kiếm sách

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 04. Chỉ làm nền Vue và màn hình tìm kiếm.

Hãy:
- Thiết lập router, API client đọc base URL từ environment và layout/navigational shell tối thiểu.
- Xây trang search theo tên/tác giả, debounce hợp lý, card/list gồm cover/title/author/year, pagination.
- Có loading, no result, error + retry, ảnh bìa fallback.
- Hiển thị badge “Đã thêm” dựa trên dữ liệu backend library, không tin vào state đơn lẻ.
- Kiểm tra responsive cơ bản và a11y: label, keyboard, focus, semantic button.

Chưa làm chi tiết hoặc thao tác thêm sách.
Commit kỳ vọng: feat(web): add book search experience
Deploy frontend preview/checkpoint nếu hạ tầng sẵn sàng, sau đó smoke test URL thật.
```

### Session 05 — Chi tiết sách và thêm vào tủ

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 05. Chỉ làm trang/modal chi tiết và thêm sách.

Hãy:
- Điều hướng từ search vào detail/modal, lấy detail qua backend API.
- Hiện bìa, title, authors, description, number of pages, subjects, publish year với fallback cho dữ liệu thiếu.
- Cho chọn trạng thái ban đầu rồi add vào tủ.
- Sau success đồng bộ badge ở search; xử lý 409 bằng thông báo thân thiện và an toàn.
- Nếu dùng modal, xử lý close/focus/keyboard đúng cách.

Commit kỳ vọng: feat(web): add book detail and library entry flow
```

### Session 06 — Tủ sách, tiến độ, đánh giá và xoá

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 06. Chỉ làm màn “Tủ sách của tôi”.

Hãy:
- Có tab Want to read / Reading / Read và stats total/reading/finished.
- Mỗi sách: progress %, current page update, đổi status, rating 1–5 sao, note ngắn, delete confirmation.
- UI phản ánh response backend; sau mutation thì refetch hoặc optimistic update có rollback rõ ràng.
- Empty/loading/error states cho màn và mutation.
- Browser-check hành vi khi đọc đủ trang, invalid progress, update status và delete.

Commit kỳ vọng: feat(web): manage reading progress in personal library
```

### Session 07 — Quality gate: test, responsive, accessibility

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 07. Không thêm feature. Audit và chỉ sửa lỗi cần thiết trong phạm vi đề.

Kiểm tra thật các luồng: search/pagination; detail; add cả ba trạng thái; duplicate 409; filter/stats; currentPage valid/invalid; auto Read; rating/note; delete; loading/empty/upstream failure.
Chạy lint, typecheck, test. Nếu có browser, kiểm tra desktop + mobile, overflow, keyboard/focus và ảnh bìa lỗi. Báo bằng chứng PASS/FAIL/BLOCKED tách bạch.

Commit kỳ vọng: test: verify reading tracker user flows
```

### Session 08 — README, Docker và production handoff

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 08. Không mở rộng sản phẩm. Chuẩn bị artefact nộp bài và deploy repeatable.

Hoàn chỉnh README có: ảnh/GIF; stack; local setup; .env; kiến trúc + DB diagram; endpoint/API docs/Swagger/Postman; seed; cách deploy; giả định, hạn chế, hướng phát triển; frontend/backend URLs khi đã có.
Chuẩn bị Docker/Docker Compose hoặc VPS config cho frontend/backend/MySQL, migration và seed. Rà soát git tracked files để chặn secrets. Viết deployment checklist: HTTPS, reverse proxy, CORS, health check, restart/logs/backup tối thiểu.

Commit kỳ vọng: docs: complete setup and deployment guide
```

### Session 09 — Deploy production và smoke test

```text
[Dán Prompt khởi động ở trên]

Thực hiện Session 09. Tôi đã cung cấp VPS/domain/credentials hoặc quyền deploy cần thiết. Không tự in hay commit secret.

Triển khai theo thứ tự: MySQL/migration/seed → backend health → frontend đúng public API URL → HTTPS/reverse proxy/CORS. Sau đó smoke test trên URL public: search, detail, add, bookshelf update và reload persistence.

Ghi URL public, thời gian kiểm tra, commit deployed và PASS/FAIL/BLOCKED vào README/deploy note. Chỉ kết luận PASS sau browser/API kiểm tra live.
Commit kỳ vọng: chore: deploy reading tracker production configuration
```

## Quy ước Git và deploy

- Một session PASS tương ứng một commit nhỏ, đọc được và không trộn refactor không liên quan.
- Prefix: `chore`, `feat(api)`, `feat(web)`, `test`, `docs`, `fix`.
- Luôn chạy `git diff --check`, kiểm tra `git status`, rồi mới add các file thuộc scope. Không dùng broad staging nếu có thay đổi lạ.
- Push `origin main` sau khi commit, trừ khi remote/credential/network bị BLOCKED. Không force push.
- Deploy checkpoint có ích: sau backend health + database (Session 01) và sau UI search (Session 04); phần còn lại deploy sau khi có luồng hoàn chỉnh hoặc khi người dùng yêu cầu. Mỗi lần phải smoke test URL thật.

## Câu trả lời kiến trúc ngắn để nhớ

1. **Vì sao frontend không gọi Open Library?** Backend kiểm soát validation, timeout, mapping lỗi, DTO và cho phép thay upstream mà không vỡ UI.
2. **Vì sao lưu sách vào MySQL nếu Open Library đã có?** Tủ sách là dữ liệu người dùng có trạng thái, tiến độ, rating/note và cần ổn định kể cả upstream thay đổi/thiếu dữ liệu.
3. **Vì sao check duplicate ở DB?** UI có thể stale và hai request có thể đến đồng thời; unique index bảo đảm chính xác cuối cùng.
4. **Vì sao auto chuyển Read ở backend?** Rule nghiệp vụ phải đúng với mọi client/API, không phụ thuộc riêng UI Vue.
5. **Vì sao cần startedAt/finishedAt?** Đây là audit của tiến độ đọc; backend quyết định thời điểm chuyển status để timestamp không bị giả/lệch giữa các thiết bị.
