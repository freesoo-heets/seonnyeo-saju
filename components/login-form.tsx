"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  cn,
} from "@/lib/utils";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [nickname, setNickname] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const router =
    useRouter();

  async function handleLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          "/api/auth/nickname-login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                nickname,
                password,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "로그인에 실패했습니다."
        );
      }

      router.push(
        result.redirectTo ??
          "/protected"
      );

      router.refresh();

    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다."
      );

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card className="border-neutral-200 shadow-sm">

        <CardHeader className="text-center">

          <div className="mb-2 text-4xl">
            ✦
          </div>

          <CardTitle className="text-2xl">
            선녀사주 로그인
          </CardTitle>

          <CardDescription>
            닉네임과 비밀번호를 입력해주세요.
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleLogin}
          >
            <div className="flex flex-col gap-5">

              <div className="grid gap-2">

                <Label htmlFor="nickname">
                  닉네임
                </Label>

                <Input
                  id="nickname"
                  type="text"
                  placeholder="닉네임"
                  autoComplete="username"
                  required
                  value={nickname}
                  onChange={(event) =>
                    setNickname(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="grid gap-2">

                <Label htmlFor="password">
                  비밀번호
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                />

              </div>


              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}


              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? "로그인 중..."
                  : "로그인"}
              </Button>

            </div>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-neutral-500">
            회원 계정은 관리자가 생성합니다.
          </p>

        </CardContent>

      </Card>
    </div>
  );
}
