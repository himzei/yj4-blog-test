"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "입력하신 이메일이 이미 존재합니다."),
  password: z
    .string({
      required_error: "Password Required",
    })
    .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function loginForm(prevState, formData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // find a user with email
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        password: true,
        id: true,
      },
    });

    // if (user) is found, check password hashed
    const ok = bcrypt.compare(result.data.password, user?.password ?? "");

    // log the user in
    if (ok) {
      const session = await getSession();
      session.id = user?.id;
      await session.save();
      redirect("/");
    } else {
      return {
        fieldError: {
          password: ["잘못된 비밀 번호입니다."],
        },
      };
    }
    // redirect /
  }
}
