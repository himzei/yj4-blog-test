"use server";

import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";

const postSchema = z.object({
  title: z.string({
    required_error: "필수 입력사항입니다.",
  }),
  photo: z.string({
    required_error: "필수 입력사항입니다.",
  }),
  content: z.string({
    required_error: "필수 입력사항입니다.",
  }),
});

export async function uploadPost(_, formData) {
  const data = {
    title: formData.get("title"),
    photo: formData.get("photo"),
    content: formData.get("content"),
  };
  console.log(data);
  // if (data.photo instanceof File) {
  //   const photoData = await data.photo.arrayBuffer();
  //   await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
  //   data.photo = `/${data.photo.name}`;
  // }
  const result = postSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const post = await db.post.create({
        data: {
          title: result.data.title,
          content: result.data.content,
          photo: result.data.photo,
          writer: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect("/");
    }
  }
}

export async function getUploadUrl() {}
