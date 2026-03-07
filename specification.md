1. Quy mô thực tế của hệ thống

Ví dụ trường THPT bình thường:

Thành phần	Số lượng
Giáo viên	60 – 120
Học sinh	800 – 2000
Lớp	25 – 50
Môn học	12 – 15

Số bài kiểm tra mỗi năm:

~ 300 – 1000 bài

Số lượt làm bài:

~ 10.000 – 30.000 attempts

👉 Quy mô này 1 server chạy dư sức.

2. Kiến trúc backend phù hợp nhất

Không cần microservice.

Dùng:

Modular Monolith

Kiến trúc:

Frontend (React / Next)
        │
        │
    ASP.NET API
        │
   PostgreSQL / SQL Server
        │
    File Storage

Đơn giản – dễ bảo trì – dễ code.

3. Kiến trúc Backend Modules

Chỉ cần khoảng 10 module chính.

Backend
│
├── Auth
├── Teacher
├── Student
├── Class
├── Subject
├── Exam
├── Question
├── Attempt
├── Grading
└── Report
4. Auth Module

Quản lý đăng nhập.

User chỉ có 3 loại:

Admin
Teacher
Student

Database:

Users
Roles
5. Teacher Module

Quản lý giáo viên.

Chức năng:

tạo giáo viên
sửa giáo viên
xóa giáo viên
xem lớp đang dạy
6. Student Module

Quản lý học sinh.

Chức năng:

thêm học sinh
import excel
xem danh sách lớp
7. Class Module

Quản lý lớp.

Ví dụ:

10A1
10A2
11A1

Quan hệ:

Class
  ├─ Students
  └─ Teachers
8. Subject Module

Danh sách môn học.

Toán
Văn
Anh
Lý
Hóa
Sinh
9. Exam Module

Đây là module quan trọng nhất.

Exam có thông tin:

Title
Subject
Teacher
Duration
StartTime
EndTime
Classes
10. Question Module

Quản lý câu hỏi.

Các loại câu:

MCQ
TrueFalse
ShortAnswer
Essay
Drawing
11. Attempt Module

Xử lý khi học sinh làm bài.

Flow:

Start exam
→ create attempt
→ answer question
→ submit exam
12. Grading Module

Chấm bài.

Có 2 kiểu:

Auto grading
MCQ
True/False
Short answer
Manual grading
Essay
Drawing
13. Report Module

Báo cáo.

Ví dụ:

điểm trung bình lớp
phổ điểm
ranking
14. Kiến trúc code trong backend

Dùng Clean Architecture.

Structure:

src
│
├── API
│   ├── Controllers
│
├── Application
│   ├── Services
│   ├── DTO
│
├── Domain
│   ├── Entities
│
├── Infrastructure
│   ├── EFCore
│   ├── Repositories
15. Database (đơn giản hơn)

Chỉ cần khoảng 20–25 bảng.

Ví dụ:

Users
Roles

Teachers
Students

Classes
ClassStudents

Subjects
TeachingAssignments

Exams
ExamClasses

Questions
QuestionOptions

ExamAttempts
AttemptAnswers

ManualGradings

Notifications
Files
16. File Storage

Cần lưu:

bài vẽ học sinh
ảnh đề thi
file import

Giải pháp:

MinIO

hoặc

Local storage
17. Chịu tải khi thi cùng lúc

Giả sử:

400 học sinh thi cùng lúc

Server:

4 CPU
8GB RAM

chạy:

ASP.NET + PostgreSQL

vẫn rất ổn.

18. Server triển khai

Chỉ cần:

1 VPS

Cấu hình:

4 CPU
8GB RAM
80GB SSD

Chi phí:

~300k / tháng
19. Docker Setup

Services:

api
postgres
redis
minio

Redis dùng để:

session
cache
20. Kiến trúc production cuối cùng
Internet
   │
Cloudflare
   │
Nginx
   │
ASP.NET API
   │
PostgreSQL
   │
MinIO
21. Điểm quan trọng nhất của hệ thống này

Phần khó nhất không phải backend.

Mà là:

Exam Player (UI làm bài)

Phải xử lý:

autosave
timer
canvas drawing
question navigation
anti cheat
22. Tổng độ lớn hệ thống

Nếu làm chuẩn:

Backend
~25 tables
~80 API endpoints

Frontend:

~30 pages
23. Lời khuyên thực tế

Với hệ thống này Cốt nên:

Modular Monolith
ASP.NET
PostgreSQL
React

đừng làm microservice.

mô tả tính năng:
1. Các vai trò trong hệ thống

Hệ thống chỉ cần 3 loại tài khoản:

1. Admin trường

Quản lý toàn bộ hệ thống.

2. Giáo viên

tạo bài kiểm tra

chấm bài

xem điểm học sinh

3. Học sinh

làm bài kiểm tra

xem điểm

xem lịch kiểm tra

2. Module quản lý tài khoản
2.1 Đăng nhập

Người dùng đăng nhập bằng:

username
password

Sau khi đăng nhập hệ thống sẽ chuyển tới dashboard tương ứng với vai trò.

2.2 Đổi mật khẩu

Người dùng có thể:

đổi mật khẩu
2.3 Reset mật khẩu

Admin có thể:

reset password cho giáo viên hoặc học sinh
3. Module quản lý giáo viên

Admin có thể:

Thêm giáo viên

Nhập thông tin:

Mã giáo viên
Họ tên
Bộ môn
Chức vụ
Số điện thoại
Email
Chỉnh sửa giáo viên

Admin có thể cập nhật:

bộ môn
chức vụ
thông tin liên hệ
Import danh sách giáo viên

Admin có thể:

import Excel danh sách giáo viên
4. Module quản lý học sinh

Admin có thể:

Thêm học sinh

Thông tin học sinh:

Mã học sinh
Họ tên
Lớp
Số điện thoại
Email
Import danh sách học sinh

Admin import bằng:

Excel

Ví dụ file:

MaHS | HoTen | Lop
5. Module quản lý lớp học

Admin có thể:

Tạo lớp

Ví dụ:

10A1
10A2
11A1

Thông tin lớp:

Tên lớp
Khối
Giáo viên chủ nhiệm
Gán học sinh vào lớp

Admin có thể:

thêm học sinh vào lớp
xóa học sinh khỏi lớp
6. Module phân công giáo viên bộ môn

Admin gán:

Giáo viên A → dạy Toán lớp 10A1
Giáo viên B → dạy Văn lớp 10A1

Chỉ giáo viên được phân công mới tạo bài kiểm tra cho lớp đó.

7. Module tạo bài kiểm tra

Giáo viên có thể tạo bài kiểm tra.

Thông tin bài kiểm tra:

Tên bài kiểm tra
Môn học
Thời gian làm bài
Ngày giờ bắt đầu
Ngày giờ kết thúc
Lớp tham gia

Ví dụ:

Kiểm tra 15 phút – Chương 1
Môn: Toán
Thời gian: 15 phút
Bắt đầu: 08:00
Lớp: 10A1
8. Module quản lý câu hỏi

Giáo viên có thể thêm câu hỏi vào bài kiểm tra.

Các loại câu hỏi
1. Trắc nghiệm

Ví dụ:

1. Thủ đô Việt Nam là?

A. Huế
B. Hà Nội
C. Đà Nẵng
D. Hải Phòng

Giáo viên chọn:

đáp án đúng
2. Đúng / Sai

Ví dụ:

Trái đất quay quanh mặt trời
True / False
3. Trả lời ngắn

Ví dụ:

2 + 2 = ?

Học sinh nhập:

4
4. Tự luận

Ví dụ:

Phân tích bài thơ Tây Tiến

Học sinh nhập:

text dài
5. Vẽ / giải toán

Học sinh có thể:

viết tay
vẽ
ghi công thức

Canvas có:

bút
tẩy
undo
đổi màu
9. Module import đề kiểm tra

Giáo viên có thể import đề từ:

Word
PDF
Excel

Hệ thống sẽ:

parse câu hỏi
tạo câu hỏi tự động
10. Module xem đề dạng A4

Giáo viên có thể xem:

đề thi dạng in

Giống đề giấy.

Có thể:

in PDF
11. Module làm bài kiểm tra

Học sinh vào hệ thống và thấy:

Danh sách bài kiểm tra

Ví dụ:

Kiểm tra 15 phút – Toán
Bắt đầu: 08:00
Bắt đầu làm bài

Học sinh bấm:

Start Exam

Hệ thống sẽ:

bắt đầu timer
12. Module giao diện làm bài

Trong khi làm bài:

Học sinh thấy:

Danh sách câu hỏi
Thời gian còn lại
Thanh điều hướng câu hỏi

Ví dụ:

Câu 1
Câu 2
Câu 3
13. Auto save bài làm

Hệ thống tự động:

lưu bài làm mỗi vài giây

để tránh mất dữ liệu.

14. Nộp bài

Học sinh có thể:

submit bài

Hoặc khi hết giờ:

auto submit
15. Chấm bài

Có 2 dạng chấm.

Chấm tự động

Áp dụng cho:

trắc nghiệm
đúng sai
trả lời ngắn

Hệ thống tự tính điểm.

Chấm tự luận

Giáo viên vào phần:

Chấm bài

Hệ thống hiển thị:

Câu hỏi
Bài làm học sinh

Giáo viên có thể:

vẽ lên bài
ghi nhận xét
nhập điểm
16. Xem kết quả

Sau khi chấm xong:

Học sinh có thể xem:

điểm
đáp án
nhận xét giáo viên
17. Thống kê điểm

Giáo viên có thể xem:

điểm trung bình
phổ điểm
bảng điểm lớp

Ví dụ:

Điểm TB: 7.2
Điểm cao nhất: 10
Điểm thấp nhất: 3
18. Xuất báo cáo

Có thể xuất:

Excel

Bao gồm:

danh sách học sinh
điểm
xếp hạng
19. Lịch kiểm tra

Học sinh có thể xem:

lịch kiểm tra

Ví dụ:

08:00 Toán
10:00 Anh
20. Thông báo

Hệ thống gửi thông báo:

Cho học sinh:

Sắp đến giờ kiểm tra

Cho giáo viên:

Có bài cần chấm
21. Nhật ký hoạt động

Admin có thể xem:

ai tạo bài kiểm tra
ai sửa bài kiểm tra
ai chấm bài
22. Tính năng chống gian lận (cơ bản)

Có thể phát hiện:

đổi tab
rời khỏi trang

Hệ thống ghi log.

23. Các tính năng nâng cao (tùy chọn)

Sau này có thể thêm:

Random đề
shuffle câu hỏi
shuffle đáp án
Ngân hàng câu hỏi

Giáo viên lưu câu hỏi để dùng lại.

AI chấm tự luận

AI gợi ý điểm cho giáo viên.

Kết luận

Hệ thống cho 1 trường duy nhất sẽ có khoảng:

10 module

và khoảng:

20 – 25 bảng database

Đây là quy mô rất hợp lý để 1 dev xây dựng trong 3–4 tháng.

Phần Exam Player (giao diện làm bài thi) là phần quan trọng nhất của toàn hệ thống, vì nó phải đảm bảo:

Không mất bài

Không lag

Không gian lận dễ

Trải nghiệm giống thi thật

Hoạt động ổn trên cả PC + Tablet + điện thoại

Tôi sẽ thiết kế theo chuẩn production của các hệ thống thi lớn.

1. Tổng quan kiến trúc Exam Player

Exam Player gồm 5 module chính

Exam Player
│
├── Exam Loader
├── Question Renderer
├── Answer Manager
├── Autosave Engine
├── Timer Engine
└── Navigation Panel

Luồng hoạt động:

Student mở bài thi
        ↓
Load exam data
        ↓
Render câu hỏi
        ↓
Student làm bài
        ↓
Autosave liên tục
        ↓
Timer đếm ngược
        ↓
Submit bài
2. Layout giao diện chuẩn

Layout chuẩn giống các hệ thống thi quốc gia.

--------------------------------------------------------
|  Exam title                | Time left: 29:21        |
--------------------------------------------------------
|                                                    |
|              Question area                         |
|                                                    |
|  Câu 5: Tính giá trị của biểu thức...              |
|                                                    |
|  A. 12                                            |
|  B. 14                                            |
|  C. 15                                            |
|  D. 18                                            |
|                                                    |
|                                                    |
|  [Previous]        [Mark for review]      [Next]   |
--------------------------------------------------------
| Question navigation                               |
| 1 2 3 4 5 6 7 8 9 10                               |
| [Submit Exam]                                      |
--------------------------------------------------------
3. Navigation Panel (điều hướng câu hỏi)

Panel giúp học sinh biết trạng thái câu hỏi.

Ví dụ:

1  2  3  4  5  6  7  8
□  ■  ■  △  □  ■  □  □

Legend:

Icon	Meaning
□	chưa làm
■	đã trả lời
△	đánh dấu xem lại
●	câu hiện tại
4. Question Renderer

Hệ thống phải render nhiều loại câu hỏi

Question Types
MULTIPLE_CHOICE
TRUE_FALSE
SHORT_ANSWER
ESSAY_TEXT
ESSAY_CANVAS
UPLOAD_FILE
4.1 Trắc nghiệm
Câu 3: 2 + 3 = ?

○ A. 4
● B. 5
○ C. 6
○ D. 7

Component:

RadioGroup
4.2 Đúng / Sai
Câu 4:

Phương trình x² = 4 có nghiệm ±2

( ) Đúng
( ) Sai
4.3 Short answer
Câu 5:

Giá trị của 5 + 7 = ?

[_____________]
4.4 Tự luận text
Câu 6:

Hãy phân tích bài thơ ...

[ Rich Text Editor ]
4.5 Tự luận vẽ (canvas)

Dùng cho Toán / Vật lý / Hình học

---------------------------------
|                               |
|          Canvas               |
|                               |
---------------------------------

Tools:
✏ Pen
🖌 Color
⬛ Eraser
↩ Undo

Canvas lưu dạng:

vector strokes

hoặc

image PNG
5. Canvas Drawing Engine

Tính năng:

Pen
Color
Size
Eraser
Undo
Redo
Clear

Library nên dùng:

fabric.js
konva.js
excalidraw engine

Data lưu:

JSON strokes

ví dụ

[
 { "tool":"pen", "points":[10,20,30,40], "color":"black" }
]
6. Timer Engine

Timer cực quan trọng.

Ví dụ:

Time Left: 29:59

Logic:

server_start_time
exam_duration

client_time_left =
duration - (now - start_time)

Không dùng timer client đơn thuần.

Timer Events
5 phút cuối → warning
1 phút cuối → warning đỏ
0 → auto submit
7. Autosave Engine (rất quan trọng)

Autosave để không mất bài.

Autosave khi:

change answer
5-10 giây / lần
change question
canvas change
Flow autosave
student answer
     ↓
update local state
     ↓
send to API
     ↓
server save
Autosave API
POST /exam-attempt/{id}/save

Body:

{
 question_id: 5,
 answer: "B"
}
Debounce autosave
debounce 2s

tránh spam server.

8. Local backup

Trong trường hợp:

mất mạng
reload browser

Hệ thống lưu local:

localStorage

Ví dụ

exam_attempt_123
9. Submit Exam

Submit có 2 dạng:

1 Manual submit
[ Submit Exam ]

Popup confirm:

Bạn chắc chắn nộp bài?
Còn 3 câu chưa làm
2 Auto submit
Timer = 0

Server tự submit.

10. Anti-cheating cơ bản

Có thể thêm:

1 Disable copy
disable Ctrl+C
disable right click
2 Detect tab switch
document.visibilitychange

Log:

student switched tab
3 Fullscreen mode
start exam → fullscreen
11. State management frontend

Frontend nên dùng:

React + Zustand

Exam state:

exam
questions
answers
currentQuestion
timeLeft
flaggedQuestions
12. API cần thiết cho Exam Player
Load exam
GET /student/exam/{id}
Save answer
POST /exam-attempt/save
Submit exam
POST /exam-attempt/submit
Heartbeat
POST /exam-attempt/heartbeat

server biết học sinh còn online.

13. Performance (rất quan trọng)

Nếu bài thi:

50 - 100 câu

Phải:

Lazy render

Chỉ render:

current question
+ next question
Virtual navigation

Panel câu hỏi:

virtualized list
14. Data structure exam

Ví dụ:

Exam
 ├ questions[]
 │
 │   ├ question_id
 │   ├ type
 │   ├ content
 │   ├ options
 │   ├ points
 │
 └ settings
15. Flow toàn bộ
Login
   ↓
Student Dashboard
   ↓
Click Exam
   ↓
Load Exam Player
   ↓
Start Timer
   ↓
Answer Questions
   ↓
Autosave
   ↓
Submit
   ↓
Show Result
16. Trải nghiệm UX tốt

Nên có thêm:

review mode
highlight unanswered
flag question
jump question
17. Công nghệ nên dùng

Frontend:

Next.js
React
Tailwind
Zustand
Konva.js (canvas)

Backend:

NestJS
PostgreSQL
Redis
18. Nếu làm đúng chuẩn production

Hệ thống này sẽ tương đương:

Google Form Quiz

Azota

Shub Classroom

Moodle Quiz

Dưới đây là thiết kế API Backend đầy đủ (~120 API) cho hệ thống Web App thi kiểm tra trong trường học (1 trường duy nhất).
API được thiết kế theo chuẩn Production System: RESTful + JWT Auth + Role Based Access.

Roles trong hệ thống:

SUPER_ADMIN (bạn – người quản lý hệ thống)

SCHOOL_ADMIN

TEACHER

STUDENT

1️⃣ Authentication APIs

Khoảng 10 API

Login / Session
Method	API	Mô tả
POST	/auth/login	đăng nhập (teacher / student / admin)
POST	/auth/logout	logout
POST	/auth/refresh-token	refresh JWT
GET	/auth/me	lấy thông tin user
POST	/auth/change-password	đổi mật khẩu
POST	/auth/forgot-password	quên mật khẩu
POST	/auth/reset-password	reset mật khẩu
POST	/auth/verify-session	kiểm tra session
POST	/auth/login-student-code	login bằng mã học sinh
POST	/auth/login-teacher-code	login bằng mã giáo viên
2️⃣ User Management APIs

Khoảng 15 API

Teacher
Method	API
GET	/teachers
GET	/teachers/{id}
POST	/teachers
PUT	/teachers/{id}
DELETE	/teachers/{id}
GET	/teachers/{id}/classes
GET	/teachers/{id}/subjects
Student
Method	API
GET	/students
GET	/students/{id}
POST	/students
PUT	/students/{id}
DELETE	/students/{id}
GET	/students/{id}/scores
GET	/students/{id}/exams
GET	/students/{id}/class
3️⃣ School Structure APIs

Khoảng 10 API

Classes
Method	API
GET	/classes
GET	/classes/{id}
POST	/classes
PUT	/classes/{id}
DELETE	/classes/{id}
Class relationships
Method	API
GET	/classes/{id}/students
GET	/classes/{id}/teachers
GET	/classes/{id}/subjects
POST	/classes/{id}/assign-teacher
POST	/classes/{id}/assign-students
4️⃣ Subject APIs

Khoảng 5 API

Method	API
GET	/subjects
POST	/subjects
PUT	/subjects/{id}
DELETE	/subjects/{id}
GET	/subjects/{id}/teachers
5️⃣ Exam Management APIs

Khoảng 15 API

Exam CRUD
Method	API
GET	/exams
GET	/exams/{id}
POST	/exams
PUT	/exams/{id}
DELETE	/exams/{id}
Exam settings
Method	API
POST	/exams/{id}/publish
POST	/exams/{id}/unpublish
POST	/exams/{id}/start
POST	/exams/{id}/stop
POST	/exams/{id}/duplicate
GET	/exams/{id}/preview
Exam class assignment
Method	API
POST	/exams/{id}/assign-class
DELETE	/exams/{id}/remove-class
GET	/exams/{id}/classes
6️⃣ Question Management APIs

Khoảng 20 API

Question CRUD
Method	API
GET	/questions
GET	/questions/{id}
POST	/questions
PUT	/questions/{id}
DELETE	/questions/{id}
Question options
Method	API
POST	/questions/{id}/options
PUT	/questions/options/{id}
DELETE	/questions/options/{id}
Question types
Method	API
GET	/question-types

Các loại:

MULTIPLE_CHOICE

TRUE_FALSE

SHORT_ANSWER

ESSAY

DRAWING

Import questions
Method	API
POST	/questions/import/pdf
POST	/questions/import/docx
POST	/questions/import/latex
POST	/questions/import/excel
7️⃣ Exam Question APIs

Khoảng 10 API

Method	API
GET	/exams/{id}/questions
POST	/exams/{id}/questions
PUT	/exams/{id}/questions/{questionId}
DELETE	/exams/{id}/questions/{questionId}
POST	/exams/{id}/reorder-questions
Exam preview
Method	API
GET	/exams/{id}/preview/a4
GET	/exams/{id}/preview/web
8️⃣ Exam Player APIs (Học sinh làm bài)

Khoảng 15 API

Start exam
Method	API
POST	/exam-attempts/start

Response

{
 attemptId,
 examId,
 startTime,
 endTime
}
Load exam questions
Method	API
GET	/exam-attempts/{id}/questions
Save answers (Autosave)
Method	API
POST	/exam-attempts/{id}/answers

Body

{
 questionId,
 answer
}
Drawing answer
Method	API
POST	/exam-attempts/{id}/canvas

Upload:

PNG

SVG

JSON strokes

Exam navigation
Method	API
POST	/exam-attempts/{id}/flag-question
POST	/exam-attempts/{id}/unflag-question
Submit exam
Method	API
POST	/exam-attempts/{id}/submit
Resume exam
Method	API
GET	/exam-attempts/{id}/resume
9️⃣ Autosave APIs

Khoảng 5 API

Method	API
POST	/autosave
GET	/autosave/{attemptId}
DELETE	/autosave/{attemptId}
POST	/autosave/batch
GET	/autosave/status
🔟 Grading APIs (Chấm bài)

Khoảng 10 API

List attempts
Method	API
GET	/grading/exams/{examId}/attempts
View attempt
Method	API
GET	/grading/attempts/{id}
Grade essay
Method	API
POST	/grading/attempts/{id}/score

Body

{
 questionId,
 score,
 comment
}
Teacher annotation
Method	API
POST	/grading/attempts/{id}/annotation
Finalize grading
Method	API
POST	/grading/attempts/{id}/finalize
11️⃣ Score APIs

Khoảng 10 API

Method	API
GET	/scores/student/{id}
GET	/scores/class/{id}
GET	/scores/exam/{id}
GET	/scores/exam/{id}/ranking
GET	/scores/exam/{id}/statistics
GET	/scores/exam/{id}/distribution
12️⃣ Notification APIs

Khoảng 5 API

Method	API
GET	/notifications
POST	/notifications
PUT	/notifications/{id}/read
DELETE	/notifications/{id}
POST	/notifications/send-class
13️⃣ Dashboard APIs

Khoảng 5 API

Teacher Dashboard
Method	API
GET	/dashboard/teacher

Return:

upcoming exams

classes

recent submissions

Student Dashboard
Method	API
GET	/dashboard/student

Return:

upcoming exams

scores

notifications

14️⃣ File Upload APIs

Khoảng 5 API

Method	API
POST	/upload/image
POST	/upload/pdf
POST	/upload/exam-doc
POST	/upload/canvas
GET	/files/{id}
15️⃣ System Admin APIs

Khoảng 5 API

Method	API
GET	/admin/system-stats
GET	/admin/logs
POST	/admin/backup
POST	/admin/restore
GET	/admin/health
📊 Tổng số API
Module	APIs
Auth	10
User	15
School	10
Subject	5
Exam	15
Question	20
Exam Question	10
Exam Player	15
Autosave	5
Grading	10
Score	10
Notification	5
Dashboard	5
Upload	5
Admin	5

✅ Tổng ≈ 145 API

🧠 API Design Best Practices (Production)
Authentication
Authorization: Bearer JWT_TOKEN
Response format
{
 success: true,
 data: {},
 message: "",
 error: null
}
Pagination
GET /students?page=1&limit=20
Error
{
 success:false,
 error:{
   code:"EXAM_NOT_FOUND",
   message:"Exam not found"
 }
}
🚀 Backend Stack đề xuất (Production)
Framework
NestJS (best choice)
hoặc
FastAPI
Database
PostgreSQL
Cache
Redis
Storage
S3 / MinIO
Queue
Bull