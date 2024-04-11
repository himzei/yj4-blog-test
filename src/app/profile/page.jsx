import { getUser } from "@/lib/getUser";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();
  const logout = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col ">
        <div>안녕하세요 {user?.username} 님</div>
        <form action={logout}>
          <button>로그아웃</button>
        </form>
      </div>
    </div>
  );
}
