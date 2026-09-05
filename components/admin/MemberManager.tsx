"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Member = {
  id: string;
  nickname: string;
  role: "user" | "admin";
  created_at: string;
};

type MemberListResponse = {
  members?: Member[];
  currentUserId?: string;
  error?: string;
};

async function parseResponse(response: Response) {
  const raw = await response.text();

  if (!raw) {
    throw new Error(
      `서버에서 빈 응답을 받았습니다. (${response.status})`
    );
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(
      `서버 응답을 처리할 수 없습니다. (${response.status})`
    );
  }
}

export function MemberManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [newNickname, setNewNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] =
    useState<"user" | "admin">("user");

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/members",
        {
          cache: "no-store",
        }
      );

      const data: MemberListResponse =
        await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error ??
            "회원 목록을 불러오지 못했습니다."
        );
      }

      setMembers(data.members ?? []);
      setCurrentUserId(
        data.currentUserId ?? ""
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "회원 목록을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      if (!keyword) {
        return members;
      }

      return members.filter((member) =>
        member.nickname
          .toLowerCase()
          .includes(keyword)
      );
    }, [members, search]);

  const adminCount =
    members.filter(
      (member) =>
        member.role === "admin"
    ).length;

  function showSuccess(text: string) {
    setError(null);
    setMessage(text);

    window.setTimeout(() => {
      setMessage(null);
    }, 3000);
  }

  function showError(text: string) {
    setMessage(null);
    setError(text);
  }

  async function createMember() {
    const nickname =
      newNickname.trim();

    if (nickname.length < 2) {
      showError(
        "닉네임은 2자 이상 입력해주세요."
      );
      return;
    }

    if (newPassword.length < 8) {
      showError(
        "비밀번호는 8자 이상 입력해주세요."
      );
      return;
    }

    setWorkingId("create");

    try {
      const response = await fetch(
        "/api/admin/members",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            nickname,
            password: newPassword,
            role: newRole,
          }),
        }
      );

      const data =
        await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error ??
            "회원을 추가하지 못했습니다."
        );
      }

      setNewNickname("");
      setNewPassword("");
      setNewRole("user");

      showSuccess(
        `${nickname} 회원을 추가했습니다.`
      );

      await loadMembers();
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "회원을 추가하지 못했습니다."
      );
    } finally {
      setWorkingId(null);
    }
  }

  async function updateMember(
    id: string,
    payload: Record<string, string>,
    successText: string
  ) {
    setWorkingId(id);

    try {
      const response = await fetch(
        `/api/admin/members/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data =
        await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error ??
            "회원 정보를 수정하지 못했습니다."
        );
      }

      showSuccess(successText);

      await loadMembers();
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "회원 정보를 수정하지 못했습니다."
      );
    } finally {
      setWorkingId(null);
    }
  }

  async function renameMember(
    member: Member
  ) {
    const nickname = window.prompt(
      "변경할 닉네임을 입력해주세요.",
      member.nickname
    );

    if (nickname === null) {
      return;
    }

    const clean =
      nickname.trim();

    if (
      clean === member.nickname
    ) {
      return;
    }

    await updateMember(
      member.id,
      {
        nickname: clean,
      },
      "닉네임을 변경했습니다."
    );
  }

  async function resetPassword(
    member: Member
  ) {
    const password = window.prompt(
      `${member.nickname}님의 새 비밀번호를 입력해주세요.` +
        "\n\n8자 이상 입력해주세요."
    );

    if (password === null) {
      return;
    }

    if (password.length < 8) {
      showError(
        "비밀번호는 8자 이상 입력해주세요."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `${member.nickname}님의 비밀번호를 변경하시겠습니까?`
      );

    if (!confirmed) {
      return;
    }

    await updateMember(
      member.id,
      {
        password,
      },
      "비밀번호를 변경했습니다."
    );
  }

  async function toggleRole(
    member: Member
  ) {
    const nextRole =
      member.role === "admin"
        ? "user"
        : "admin";

    const nextLabel =
      nextRole === "admin"
        ? "관리자"
        : "일반회원";

    const confirmed =
      window.confirm(
        `${member.nickname}님의 권한을 ` +
          `${nextLabel}(으)로 변경하시겠습니까?`
      );

    if (!confirmed) {
      return;
    }

    await updateMember(
      member.id,
      {
        role: nextRole,
      },
      `${member.nickname}님의 권한을 ${nextLabel}(으)로 변경했습니다.`
    );
  }

  async function deleteMember(
    member: Member
  ) {
    const confirmed =
      window.confirm(
        `${member.nickname} 회원을 삭제하시겠습니까?` +
          "\n\n삭제된 계정은 복구할 수 없습니다."
      );

    if (!confirmed) {
      return;
    }

    setWorkingId(member.id);

    try {
      const response = await fetch(
        `/api/admin/members/${member.id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error ??
            "회원을 삭제하지 못했습니다."
        );
      }

      showSuccess(
        `${member.nickname} 회원을 삭제했습니다.`
      );

      await loadMembers();
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "회원을 삭제하지 못했습니다."
      );
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <div className="space-y-6">

      {message && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">

        <div>
          <h2 className="text-lg font-bold">
            회원 추가
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            관리자가 회원 계정을 직접 생성할 수 있습니다.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_150px_auto]">

          <input
            value={newNickname}
            onChange={(event) =>
              setNewNickname(
                event.target.value
              )
            }
            maxLength={20}
            placeholder="닉네임"
            className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-purple-400"
          />

          <input
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            placeholder="초기 비밀번호 (8자 이상)"
            className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-purple-400"
          />

          <select
            value={newRole}
            onChange={(event) =>
              setNewRole(
                event.target.value as
                  | "user"
                  | "admin"
              )
            }
            className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none"
          >
            <option value="user">
              일반회원
            </option>

            <option value="admin">
              관리자
            </option>
          </select>

          <button
            type="button"
            onClick={createMember}
            disabled={
              workingId === "create"
            }
            className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {workingId === "create"
              ? "추가 중..."
              : "회원 추가"}
          </button>

        </div>

      </section>


      <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold">
              회원 목록
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              전체 {members.length}명 · 관리자 {adminCount}명
            </p>
          </div>

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="닉네임 검색"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none sm:w-64"
          />

        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-neutral-400">
            회원 목록을 불러오는 중...
          </div>
        ) : (
          <div className="mt-6 space-y-3">

            {filteredMembers.map(
              (member) => {

                const isMe =
                  member.id ===
                  currentUserId;

                const isWorking =
                  workingId ===
                  member.id;

                return (
                  <div
                    key={member.id}
                    className="rounded-2xl border border-neutral-100 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="font-bold">
                            {member.nickname}
                          </span>

                          {member.role ===
                          "admin" ? (
                            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700">
                              관리자
                            </span>
                          ) : (
                            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                              일반회원
                            </span>
                          )}

                          {isMe && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                              내 계정
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-xs text-neutral-400">
                          가입일{" "}
                          {new Date(
                            member.created_at
                          ).toLocaleDateString(
                            "ko-KR"
                          )}
                        </p>

                      </div>


                      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">

                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() =>
                            renameMember(
                              member
                            )
                          }
                          className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                        >
                          닉네임 변경
                        </button>

                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() =>
                            resetPassword(
                              member
                            )
                          }
                          className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                        >
                          비밀번호 초기화
                        </button>

                        <button
                          type="button"
                          disabled={
                            isWorking ||
                            isMe
                          }
                          onClick={() =>
                            toggleRole(
                              member
                            )
                          }
                          className="rounded-xl border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {member.role ===
                          "admin"
                            ? "관리자 해제"
                            : "관리자 지정"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            isWorking ||
                            isMe
                          }
                          onClick={() =>
                            deleteMember(
                              member
                            )
                          }
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          회원 삭제
                        </button>

                      </div>

                    </div>
                  </div>
                );
              }
            )}

            {filteredMembers.length ===
              0 && (
              <div className="py-12 text-center text-sm text-neutral-400">
                검색 결과가 없습니다.
              </div>
            )}

          </div>
        )}

      </section>

    </div>
  );
}
