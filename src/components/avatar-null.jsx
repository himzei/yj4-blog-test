import { MdPerson } from "react-icons/md";

export default function AvatarNull({ size }) {
  return (
    <div
      className={`mx-auto rounded-full flex justify-center items-center text-white ${size} bg-neutral-300 p-2`}
    >
      <MdPerson size="100%" />
    </div>
  );
}
