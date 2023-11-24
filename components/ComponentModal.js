import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import Modal from "react-modal";
import {
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ComponentModal() {
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const filePickerRef = useRef(null);
  const router = useRouter();

  async function sendComment() {
    await addDoc(collection(db, "posts", postId, "comments"), {
      comments: input,
      name: session.user.name,
      usernames: session.user.username,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
      userId: session.user.uid,
    });

    setOpen(false);
    setInput("");
    router.push(`/posts/${postId}`);
  }

  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot);
    });
  }, [postId, db]);

  return (
    <div className="">
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] border-1 bg-black rounded-xl shadow-md text-white"
        >
          <div className="p-1">
            <div className="border-b border-gray-400 py-1.5 px-1">
              <div
                className="hoverEffect w-9 h-9 flex items-center justify-center p-2"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="h-[22px]" />
              </div>
            </div>
            <div className="p-2 flex items-center space-x-1 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-white" />
              <img
                src={post?.data()?.userImg}
                alt="user-image"
                className="h-11 w-11 rounded-full mr-5 ml-1"
              />
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {post?.data()?.name}
              </h4>
              <span className="text-sm sm:text=[15px]">
                @{post?.data()?.usernames} -
              </span>
              <span className="text-sm sm:text-[15px] hover:underline">
                <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
              </span>
            </div>
            <p className="text-gray-300 text-[15px] sm:text-[16px] mb-2 ml-20">
              {post?.data()?.text}
            </p>
            <div className="flex p-3 space-x-3">
              <img
                src={session?.user?.image}
                alt="Profile"
                className="h-11 w-11 rounded-full hover:brightness-95"
              />
              <div className="w-full divide-y divide-gray-800">
                <div className="">
                  <textarea
                    rows={2}
                    placeholder="Reply Something..."
                    className="w-full border-none focus:ring-0 text-md placeholder:text-gray-600 tracking-wide min-h-[50px] resize-none rounded-sm bg-black"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between pt-2.5">
                  <div className=" flex">
                    <div>
                      <PhotoIcon
                        className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100"
                        onClick={() => filePickerRef?.current?.click()}
                      />
                      {/* <input
                        type="file"
                        ref={filePickerRef}
                        onChange={addImageRef}
                        hidden
                      /> */}
                    </div>
                    <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                    disabled={!input.trim()}
                    onClick={sendComment}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
