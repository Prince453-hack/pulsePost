import { SparklesIcon } from "@heroicons/react/24/outline";
import Input from "./Input";
import Post from "./Post";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { AnimatePresence, motion } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => setPosts(snapshot.docs)
      ),
    []
  );

  return (
    <div className="text-white xl:ml-[370px] border-l border-r xl:min-w-[670px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-30 bg-gray-900 border-b">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="hoverEffect flex items-center justify-center px-1 w-9 h-9 py-0 ml-auto">
          <SparklesIcon className="h-5" />
        </div>
      </div>
      <Input />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post post={post} id={post.id} key={post.id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
