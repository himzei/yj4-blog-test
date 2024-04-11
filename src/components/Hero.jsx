import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/getUser";
import AvatarNull from "./avatar-null";

export default async function Hero() {
  const user = await getUser();
  console.log(user?.avatar);
  return (
    <section className="text-center">
      {user?.avatar ? (
        <Image
          className="rounded-full mx-auto outline outline-neutral-400 ring-2 ring-yellow-600 ring-offset-4"
          src={user?.avatar}
          alt="Picture of the author"
          width={160}
          height={160}
          priority
        />
      ) : (
        <AvatarNull />
      )}

      <h2 className="text-3xl font-bold mt-2">
        안녕하세요 나는 {user?.username}입니다
      </h2>
      <h3 className="text-xl font-semibold">Full-stack Engineer</h3>
      <p>꿈을 코딩하는 사람, 드림코더 엘리</p>
      <Link href="/contact">
        <button className="bg-yellow-500 font-bold rounded-xl py-1 px-4 mt-2">
          Contact Me
        </button>
      </Link>
    </section>
  );
}
