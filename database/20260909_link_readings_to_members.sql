-- 선녀사주: 상담내역을 로그인 계정과 연결하기 위한 컬럼 추가
-- Supabase Dashboard > SQL Editor에서 1회 실행하세요.

alter table public.readings
  add column if not exists requester_id uuid
    references public.profiles(id)
    on delete set null;

alter table public.readings
  add column if not exists requester_nickname text;

create index if not exists readings_requester_id_created_at_idx
  on public.readings (requester_id, created_at desc);

comment on column public.readings.requester_id is
  '상담을 신청한 로그인 회원의 profiles.id';

comment on column public.readings.requester_nickname is
  '상담 신청 당시 닉네임 스냅샷';
