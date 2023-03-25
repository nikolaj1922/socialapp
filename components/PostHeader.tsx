import { IPost } from "@/types/types";
import { DocumentData } from "firebase/firestore";
import React from "react";
import Moment from "react-moment";

interface Props {
  postPage?: boolean;
  post: IPost | DocumentData;
}

const PostHeader = ({ postPage = false, post }: Props) => {
  return (
    <div className="text-[#6e767d]">
      <div className="inline-block group">
        <h4
          className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
            !postPage && "inline-block"
          }`}
        >
          {post?.username}
        </h4>
        <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>
          @{post?.tag}
        </span>
      </div>{" "}
      ·{" "}
      <span className="hover:underline text-sm sm:text-[15px]">
        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
      </span>
      {!postPage && (
        <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
          {post?.text}
        </p>
      )}
    </div>
  );
};

export default PostHeader;
