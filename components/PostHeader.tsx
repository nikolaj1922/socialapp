import { IPost } from "@/types/types";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";

interface Props {
  postPage?: boolean;
  post: IPost | DocumentData;
}

const PostHeader = ({ postPage = false, post }: Props) => {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const getTimestamp = () => {
      setSeconds(post?.timestamp?.seconds);
      setDate(new Date((seconds as number) * 1000));
    };

    if (!post && !seconds) return;

    getTimestamp();
  }, [post, seconds]);

  return (
    <div className="text-[#6e767d] max-w-[520px]">
      <div className="inline-block group">
        <h4
          className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
            !postPage && "inline-block"
          }`}
        >
          {post?.username}
        </h4>
        <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>
          @{post?.userTag}
        </span>
      </div>{" "}
      ·{" "}
      <span className="hover:underline text-sm sm:text-[15px]">
        {seconds && <Moment fromNow>{date as Date}</Moment>}
      </span>
      {!postPage && (
        <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5 w-full break-words">
          {post?.text}
        </p>
      )}
    </div>
  );
};

export default PostHeader;
