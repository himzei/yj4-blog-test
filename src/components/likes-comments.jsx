import { FaComments, FaEye } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

export default async function LikesComments({ likes, comments, views, id }) {
  return (
    <div className="flex gap-4 items-center *:text-sm justify-center *:text-neutral-500 ">
      <div className="flex gap-1 items-center">
        <FaHeart />
        <span>{likes}</span>
      </div>
      <div className="flex gap-1 items-center">
        <FaComments />
        <span>{comments}</span>
      </div>
      <div className="flex gap-1 items-center">
        <FaEye />
        <span>{views}</span>
      </div>
    </div>
  );
}
