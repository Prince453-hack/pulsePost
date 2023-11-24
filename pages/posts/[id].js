import Comment from "@/components/Comment";
import ComponentModal from "@/components/ComponentModal";
import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import { db } from "@/firebase";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PostPage({ newsResult, randomUsers }) {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot);
      }),
    [db, id]
  );

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);

  return (
    <div className="flex min-h-screen mx-auto ">
      <Sidebar />

      <div className="text-white xl:ml-[370px] border-l border-r xl:min-w-[670px] sm:ml-[73px] flex-grow max-w-xl">
        <div className="flex py-2 px-3 sticky top-0 z-30 bg-gray-900 border-b items-center space-x-2">
          <div className="hoverEffect">
            <ArrowLeftIcon className="h-5" onClick={() => router.push("/")} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Tweet</h2>
        </div>
        <Post id={id} post={post} />
        {comments.length > 0 && (
          <div className="">
            {comments.map((comment) => (
              <Comment
                comment={comment.data()}
                key={comment.id}
                originalPostId={id}
                commentId={comment.id}
              />
            ))}
          </div>
        )}
      </div>

      <Widgets
        newsResult={newsResult?.articles}
        randomUsers={randomUsers?.results}
      />

      <ComponentModal />
    </div>
  );
}

export async function getServerSideProps() {
  const newsResult = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/in.json"
  ).then((res) => res.json());

  const randomUsers = await fetch(
    "https://randomuser.me/api/?nat=IN&results=30&inc=name,login,picture"
  ).then((res) => res.json());

  return {
    props: {
      newsResult,
      randomUsers,
    },
  };
}
