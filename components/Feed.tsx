import { db } from "@/firebase";
import { SparklesIcon } from "@heroicons/react/outline";
import {
  onSnapshot,
  query,
  orderBy,
  collection,
  DocumentData,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Input from "./Input";
import Post from "./Post";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";

const Feed = () => {
  const [posts, setPosts] = useState<DocumentData[] | null>(null);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, [db]);

  return (
    <div className="text-white flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation flex w-9 h-9 items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="text-white h-5" />
        </div>
      </div>
      <Input />
      {posts ? (
        <div className="pb-72">
          {posts?.map((post) => (
            <Post key={post.id} id={post.id} post={post.data()} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-12">
          <CircularProgress sx={{ color: grey[600] }} />
        </div>
      )}
    </div>
  );
};

export default Feed;
