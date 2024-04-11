import Image from "next/image";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import getSession from "@/lib/session";
import AvatarNull from "@/components/avatar-null";
import { formatToTimeAgo } from "@/lib/utils";
import { AiFillLike } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

async function getIsLiked(postId) {
  const session = await getSession();
  const like = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id,
      },
    },
  });
  return Boolean(like);
}

async function getPost(id) {
  // findUnique
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        writer: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        comments: {
          select: {
            payload: true,
            created_at: true,
            writer: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    return post;
  } catch (error) {
    return null;
  }
}

export default async function PostDetail({ params }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getPost(id);
  if (!post) {
    return notFound();
  }
  console.log(post);
  const likePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.create({
        data: {
          postId: id,
          userId: session.id,
        },
      });
      revalidatePath(`/posts/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const dislikePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id,
          },
        },
      });
      revalidatePath(`/posts/${id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const commentForm = async (formData) => {
    "use server";
    try {
      const content = formData.get("content");
      const session = await getSession();

      await db.comment.create({
        data: {
          payload: content,
          writer: {
            connect: {
              id: session.id,
            },
          },
          post: {
            connect: {
              id,
            },
          },
        },
      });
      revalidatePath(`/posts/${id}`);
    } catch (e) {
      console.log(e);
    }
  };
  const isLiked = await getIsLiked(id);

  return (
    <div className="max-w-screen-xl w-full flex flex-col gap-8">
      {/* 내용 */}
      <div className=" w-full mx-auto bg-neutral-50 p-8 flex flex-col gap-8">
        {/* 타이틀 */}
        <div className="flex justify-between">
          <div className="flex flex-col justify-start">
            <div className="flex gap-2 items-end *:text-neutral-500">
              <h1 className="font-bold text-2xl text-yellow-900">
                {post.title}
              </h1>
              <div className="w-1 h-full bg-yellow-500" />
              <h2>posted by {post.writer.username}</h2>
              <div>|</div>
              <p>{formatToTimeAgo(post.created_at.toString())}</p>
            </div>
          </div>
          <div className="flex items-start">
            <form action={isLiked ? dislikePost : likePost}>
              <button
                className={`flex items-center gap-2 text-neutral-400 text-xm border border-neutral-400 rounded-full py-2 px-4 hover:bg-neutral-500 transition hover:text-white`}
              >
                <AiFillLike size={20} color={isLiked ? "tomato" : "gray"} />
                <span>좋아요({post._count.likes})</span>
              </button>
            </form>
          </div>
        </div>
        {/* 이미지 */}
        <div className="w-full aspect-video bg-neutral-400">
          <Image
            src={post.photo}
            alt={post.title}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full "
          />
        </div>
        {/* 본문내용 */}
        <div>{post.content}</div>
      </div>
      {/* 이전 다음 페이지 */}
      <div className="grid grid-cols-2 gap-8">
        {/* left */}
        <div className="w-full border-2 border-neutral-200 shadow-md flex justify-between items-center py-6 px-4">
          <div>
            <FaChevronLeft />
          </div>
          <div className="flex flex-col items-end">
            <h2 className="uppercase text-neutral-400 text-sm font-bold">
              prev
            </h2>
            <p>제목입니다.안녕하세요 이전페이지</p>
          </div>
        </div>
        {/* right */}
        <div className="w-full border-2 border-neutral-200 shadow-md flex justify-between items-center py-6 px-4">
          <div className="flex flex-col items-start">
            <h2 className="uppercase text-neutral-400 text-sm font-bold">
              next
            </h2>
            <p>제목입니다.안녕하세요 이전페이지</p>
          </div>
          <div>
            <FaChevronRight />
          </div>
        </div>
      </div>
      {/* 댓글 */}
      <div className="flex flex-col px-2 gap-6">
        {/* 타이틀 */}
        <h3 className="font-bold text-xl">댓글 0</h3>
        {/* 댓글목록 */}
        <div className="w-full flex flex-col gap-4 divide-y">
          {post.comments?.map((comment, i) => (
            <div key={i} className="flex flex-col gap-1 pt-4">
              {/* 아바타 */}
              <div className="flex gap-2 items-center h-full">
                <div>
                  <AvatarNull size="size-8" />
                </div>
                <span className="">{comment.writer.username}</span>
                <div className="w-0.5 h-4 bg-neutral-300"></div>
                <div>{formatToTimeAgo(comment.created_at.toString())}</div>
              </div>
              {/* 댓글내용 */}
              <div className="px-10">{comment.payload} </div>
            </div>
          ))}
        </div>
        {/* 댓글쓰기 */}
        <form action={commentForm}>
          <textarea
            name="content"
            placeholder="댓글을 입력해 주세요"
            className="p-4 w-full border-none outline-none ring-1 ring-neutral-400 rounded-md h-36 focus:ring-2 focus:ring-yellow-500"
          ></textarea>
          <div className="w-full flex justify-end">
            <button className="px-8 py-2 bg-yellow-600 hover:bg-yellow-500 transition text-white rounded-md">
              댓글 입력
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
