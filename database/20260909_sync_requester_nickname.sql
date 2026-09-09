-- requester_id가 이미 연결된 상담 중 requester_nickname이 비어 있는 행만 안전하게 보정합니다.
-- requester_id 자체가 없는 과거 비회원 상담은 임의 연결하지 않습니다.
update public.readings r
set requester_nickname = p.nickname
from public.profiles p
where r.requester_id = p.id
  and (r.requester_nickname is null or btrim(r.requester_nickname) = '');
