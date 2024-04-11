"use client";

import FormBtn from "@/components/button";
import FormInput from "@/components/input";
import Link from "next/link";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);
  return (
    <div className="max-w-screen-sm w-full mx-auto">
      <div className="flex flex-col gap-10 py-8">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">회원가입</h1>
          <h2 className="text-xl">Fill in the form below to join!</h2>
        </div>
        <div />
        <form action={action} className="flex flex-col gap-3">
          <FormInput
            name="username"
            placeholder="username"
            type="text"
            required
            errors={state?.fieldErrors.username}
          />
          <FormInput
            name="email"
            placeholder="Email"
            type="email"
            required
            errors={state?.fieldErrors.email}
          />
          <FormInput
            name="password"
            placeholder="Password"
            type="password"
            required
            errors={state?.fieldErrors.password}
          />
          <FormInput
            name="password2"
            placeholder="Confirm Password"
            type="password"
            required
            errors={state?.fieldErrors.password2}
          />
          <FormBtn text="Create Account" />
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
