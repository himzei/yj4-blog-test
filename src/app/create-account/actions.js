"use server";
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUniqueUsername = async (username) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: { id: true },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "username must be a String",
        required_error: "반드시 작성",
      })
      .min(3, "too short!!!")
      .max(10, "too long!!!")
      .refine(checkUniqueUsername, "this username is already taken"),
    email: z
      .string()
      .email()
      .refine(
        checkUniqueEmail,
        "there is an account already registered with that email"
      ),
    password: z.string().min(4),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    password2: z.string().min(4),
  })
  .refine(({ password, password2 }) => password === password2, {
    message: "패스워드와 패스워드2는 같아야 합니다.",
    path: ["password2"],
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "아이디는 이미 사용중입니다.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export async function createAccount(prevState, formData) {
  console.log(cookies());
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    password2: formData.get("password2"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    // check if username is taken(ZOD)
    // check if the email is already used(ZOD)
    // hash password
    const hashedPassord = await bcrypt.hash(result.data.password, 5);

    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassord,
      },
      select: {
        id: true,
      },
    });

    // log the user in
    const cookie = await getSession();

    cookie.id = user.id;
    await cookie.save();
    // redirect

    redirect("/");
  }
}
