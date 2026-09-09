선녀사주 UI/상담표시 개선 패치

반영 내용
1) 관리자 상담록: '신청자 닉네임'과 '사주 대상'을 명확히 분리
2) 로그인 상담은 requester_id / requester_nickname 기준으로 신청자 표시
3) 사주 원국: 오행 글자색 중심 표시 -> 천간/지지 칸 전체를 오행 배경색으로 표시
4) 일주(나 자신) 강조 배지 및 테두리 적용
5) 오행 분포 / 지장간도 동일한 오행 색상 체계 적용
6) 관리자, 회원, 상담신청, 로그인, 결과 페이지 디자인 톤 통일
7) 모바일/PC 관리자 상담록 레이아웃 보완 및 검색/상태 필터 정리

적용 방법
- ZIP 안의 app, components 폴더를 C:\dev\seonnyeo-saju 에 병합/덮어쓰기 합니다.
- 기존 프로젝트 폴더 전체를 삭제하지 마세요.
- database SQL은 선택사항입니다. requester_id는 있으나 requester_nickname이 비어 있는 기존 상담을 보정할 때만 Supabase SQL Editor에서 1회 실행하세요.
- requester_id가 없는 과거 비회원 상담은 안전상 자동으로 특정 회원과 연결하지 않습니다.

적용 후
npm run build

빌드 성공 후
 git add -A
 git commit -m "Polish saju UI and requester labels"
 git push origin main
