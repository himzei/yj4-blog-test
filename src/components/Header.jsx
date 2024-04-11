import { getUser } from "@/lib/getUser";
import getSession from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaPencilAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

export default async function Header() {
  const user = await getUser();
  const logout = async () => {
    "use server";
    console.log("click");
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <header className="relative flex justify-between items-center px-4 py-3 shadow">
      <Link href="/">
        <h1 className="text-2xl font-bold">YJ4 BLOG</h1>
      </Link>
      <nav className="absolute left-1/2 -translate-x-1/2 flex gap-5 *:uppercase *:font-semibold">
        <Link href="/">home</Link>
        <Link href="/profile">profile</Link>
        <Link href="/posts">posts</Link>
        <Link href="/contact">contact</Link>
      </nav>
      <>
        {user?.id ? (
          <div className="h-full flex items-center gap-3">
            <div>
              <Image
                className="rounded-full"
                width={40}
                height={40}
                src={user?.avatar}
                alt="avatar_profile"
              />
            </div>
            <span>{user?.email}</span>
            <Link href="/posts/add" className="outline-btn">
              <FaPencilAlt />
            </Link>
            <form action={logout}>
              <button className="outline-btn">
                <IoLogOut size="24" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex *:text-sm gap-4 ">
            <Link href="/login" className="">
              로그인
            </Link>
            <Link href="/create-account" className="">
              회원가입
            </Link>
          </div>
        )}
      </>
    </header>
  );
}
