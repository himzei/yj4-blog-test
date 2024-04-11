"use client";
import { useFormStatus } from "react-dom";

export default function Button({ text }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:cursor-not-allowed "
      disabled={pending}
    >
      {pending ? "loading..." : text}
    </button>
  );
}
