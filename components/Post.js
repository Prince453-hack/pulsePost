import { modalState, postIdState } from "@/atom/modalAtom";
import { db, storage } from "@/firebase";
import {
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as FilledHeart } from "@heroicons/react/24/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
//All Imports required for this component

//Export Function Component
export default function Post({ post, id }) {
  const signInPage = useRef();
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  async function likePost() {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user?.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", session?.user?.uid), {
          usernames: session.user.username,
        });
      }
    } else {
      signInPage.current.click();
    }
  }

  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data().image) {
        deleteObject(ref(storage, `posts/"${id}/image`));
      }
      router.push("/");
    }
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      <img
        src={post?.data()?.userImg}
        alt="user-image"
        className="h-11 w-11 rounded-full mr-5 ml-1"
      />

      <div className="mr-2 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 whitespace-nowrap items-center">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {post?.data().name}
            </h4>
            <span className="text-sm sm:text=[15px]">
              @{post?.data().usernames} -
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>
          <EllipsisHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-200 hover:text-sky-500 p-2" />
        </div>
        <p
          onClick={() => router.push(`/posts/${id}`)}
          className="text-[15px] sm:text-[15px] mb-2"
        >
          {post?.data().text}
        </p>
        <img
          onClick={() => router.push(`posts/${id}`)}
          src={post?.data().image}
          className="rounded-md mr-2"
        />

        <div className="flex justify-between p-2 text-gray-400">
          <div className="flex items-center">
            <ChatBubbleOvalLeftEllipsisIcon
              onClick={() => {
                if (!session) {
                  signInPage.current.click();
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
              className="h-9 p-2 w-9 hover:text-sky-500"
            />
            <span className="text-sm">
              {comments.length > 0 && comments.length}
            </span>
          </div>

          {session?.user?.uid === post?.data().id && (
            <TrashIcon
              onClick={deletePost}
              className="h-9 p-2 w-9 hover:text-red-600"
            />
          )}

          <div className="flex items-center">
            <a href="/auth/signIn" hidden ref={signInPage}>
              a
            </a>
            {hasLiked ? (
              <FilledHeart
                onClick={likePost}
                className="h-9 p-2 w-9 hover:text-red-600 text-red-600"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="h-9 p-2 w-9 hover:text-red-600"
              />
            )}
            {likes.length > 0 && (
              <span
                className={`text-sm select-none ${hasLiked && "text-red-600"}`}
              >
                {likes.length}
              </span>
            )}
          </div>
          <ShareIcon className="h-9 p-2 w-9 hover:text-sky-500" />
          <ChartBarIcon className="h-9 p-2 w-9 hover:text-sky-500" />
        </div>
      </div>
    </div>
  );
}
