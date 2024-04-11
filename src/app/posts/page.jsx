import LikesComments from "@/components/likes-comments";
import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      photo: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return posts;
}

export const metadata = {
  title: "영진블로그 포스트",
};

export default async function page() {
  const posts = await getPosts();

  return (
    <div className="max-w-screen-xl w-full mx-auto flex flex-col gap-5">
      <div className="w-full flex justify-start uppercase font-bold">
        Featured Post
      </div>
      <div className="w-full grid grid-cols-4 gap-5">
        {posts.map((post, index) => (
          <Link
            href={`/posts/${post.id}`}
            key={index}
            className="shadow-md w-full aspect-square flex flex-col"
          >
            <div className="bg-neutral-400 w-full aspect-video overflow-hidden">
              <Image
                className="object-cover object-center w-full"
                src={post.photo}
                alt={post.title}
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
            {/* 내용 */}
            <div className="p-4 flex flex-col text-neutral-700 gap-1">
              <span className="text-xs flex justify-end text-neutral-400">
                {formatToTimeAgo(post.created_at.toString())}
              </span>
              <div className="flex flex-col text-center">
                <h1 className="text-center font-semibold">{post.title}</h1>
                <p className="font-light">{post.content} </p>
              </div>
              <LikesComments
                id={post.id}
                likes={post._count.likes}
                comments={post._count.comments}
                views={post.views}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
