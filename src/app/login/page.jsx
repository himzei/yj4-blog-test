"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import Link from "next/link";
import { useFormState } from "react-dom";
import { loginForm } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
  const [state, action] = useFormState(loginForm);
  return (
    <div className="max-w-screen-sm w-full mx-auto">
      <div className="flex flex-col gap-10 py-8">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">로그인</h1>
          <h2 className="text-xl">Fill in the form below to Login!</h2>
        </div>
        <div />
        <form action={action} className="flex flex-col gap-3">
          <Input
            name="email"
            placeholder="Email"
            type="email"
            required
            errors={state?.fieldErrors?.email}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            errors={state?.fieldErrors?.password}
          />
          <Button text="Login" loading={false} />
        </form>
        <div className="w-full h-px bg-neutral-400" />
        <div>
          <Link
            href="kakao"
            className="primary-btn flex h-10 items-center justify-center gap-3 bg-yellow-500"
          >
            <span>Sign up with kakao</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
