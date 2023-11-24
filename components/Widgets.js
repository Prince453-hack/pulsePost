import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import News from "./News";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Widgets({ newsResult, randomUsers }) {
  const [articleNum, setArticleNum] = useState(3);
  const [randomUserNum, setRandomUserNum] = useState(4);

  return (
    <div className="text-white xl:w-[600px] hidden lg:inline ml-8 space-y-5">
      <div className="w-[90%] xl:w-[75%] sticky top-0 py-1.5 z-50 bg-black">
        <div className="flex items-center p-3 rounded-full relative">
          <MagnifyingGlassIcon className="h-5 z-50 text-gray-300" />
          <input
            type="text"
            placeholder="Search Twitter"
            className="absolute inset-0 rounded-full bg-black pl-11 border-gray-300 text-gray-200"
          />
        </div>
      </div>

      <div className="space-y-3 bg-gray-600 rounded-xl pt-2 w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4 mb-3">What's Happening..?</h4>
        <AnimatePresence>
          {newsResult.slice(0, articleNum).map((article) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <News article={article} key={article.title} />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex justify-between text-blue-300 pl-4 pb-3 pr-4 ">
          <button
            className="hover:text-blue-400"
            onClick={() => setArticleNum(articleNum + 3)}
          >
            Show More
          </button>
          <button
            disabled={articleNum <= 3}
            className={`text-blue-300 hover:text-blue-400 ${
              articleNum <= 3 && `text-blue-200 hidden`
            }`}
            onClick={() => setArticleNum(articleNum - 3)}
          >
            Show Less
          </button>
        </div>
      </div>

      <div className="sticky top-16 space-y-3 bg-gray-600 pt-2 rounded-xl w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        <AnimatePresence>
          {randomUsers.slice(0, randomUserNum).map((randomUser) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              key={randomUser.login.username}
            >
              <div
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700"
                key={randomUser.login.username}
              >
                <img
                  className="rounded-full"
                  width={40}
                  src={randomUser.picture.thumbnail}
                />
                <div className="truncate ml-4 leading-5">
                  <h4 className="font-bold hover:underline text-[14px] truncate">
                    {randomUser.login.username}
                  </h4>
                  <h5 className="text-[13px] text-gray-400 truncate">
                    {randomUser.name.first + " " + randomUser.name.last}
                  </h5>
                </div>
                <button className="ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                  Follow
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex justify-between text-blue-300 pl-4 pb-3 pr-4 ">
          <button
            className="hover:text-blue-400"
            onClick={() => setRandomUserNum(randomUserNum + 2)}
          >
            Show More
          </button>
          <button
            disabled={randomUserNum <= 4}
            className={`text-blue-300 hover:text-blue-400 ${
              randomUserNum <= 4 && `text-blue-200 hidden`
            }`}
            onClick={() => setRandomUserNum(randomUserNum - 2)}
          >
            Show Less
          </button>
        </div>
      </div>
    </div>
  );
}
