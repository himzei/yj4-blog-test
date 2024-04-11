"use client";

import Input from "@/components/input";
import { useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { uploadPost } from "./actions";
import Button from "@/components/button";
import { useFormState } from "react-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";

export default function AddPosts() {
  const [preview, setPreview] = useState("");
  const onImageChange = (event) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const interceptAction = async (_, formData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }

    const locationRef = ref(storage, `posts/${Date.now()}`);
    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(locationRef, file, metadata);

    const url = await getDownloadURL(snapshot.ref);
    formData.set("photo", url);
    return uploadPost(_, formData);
  };
  const [state, action] = useFormState(interceptAction, null);
  return (
    <div className="max-w-screen-lg w-full ">
      <form action={action} className="flex flex-col gap-4">
        <label
          htmlFor="photo"
          className="border-2 aspect-video flex items-center justify-center flex-col cursor-pointer text-neutral-300 border-neutral-200 border-dashed bg-cover bg-center"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <FaPhotoVideo size="140" />
              <div>사진을 추가해 주세요 </div>
              {state?.fieldErrors.photo}
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept="image/*"
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <div className="flex flex-col">
          <textarea
            name="content"
            required
            placeholder="내용"
            className="primary-input h-80 py-4"
          ></textarea>
          <span className="text-red-500 font-medium">
            {state?.fieldErrors.content}
          </span>
        </div>
        <Button text="작성완료" />
      </form>
    </div>
  );
}
