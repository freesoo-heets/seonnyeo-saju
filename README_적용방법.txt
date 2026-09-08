선녀사주 - 내 상담내역 / 관리자 닉네임 표시 패치

[반영 내용]
1. 로그인 회원이 신청한 상담을 requester_id로 계정과 연결
2. /member/readings 신규 페이지
3. 회원 메인에 "내 상담내역" 메뉴 추가
4. 상담 접수 완료 화면에 "내 상담내역" 버튼 추가
5. /admin 사주 상담록에 로그인 닉네임 + 상담자 이름 표시
6. 관리자 상담 상세에 신청 당시 닉네임 표시
7. 관리자 계정도 /member/readings에서 본인 상담 확인 가능

[중요: 먼저 DB 변경]
Supabase Dashboard > SQL Editor에서
database/20260909_link_readings_to_members.sql 내용을 1회 실행하세요.

[파일 적용]
이 ZIP의 app, components 폴더를
C:\dev\seonnyeo-saju\
에 병합/덮어쓰기하세요.

[그 다음]
npm run build

빌드 성공 후 Git commit/push 하세요.

[기존 상담]
이번 변경 전에 비로그인으로 접수된 상담에는 requester_id가 없기 때문에
내 상담내역에 자동으로 연결되지 않습니다.
관리자 상담록에서는 해당 건의 닉네임이 "미연결"로 표시됩니다.
