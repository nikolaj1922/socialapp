import { ExtendedUserType, IPost } from "@/types/types";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import PostHeader from "./PostHeader";
import { useSession } from "next-auth/react";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  id: string;
  comment: IPost;
  postId: string;
}

const Comment = ({ id, comment, postId }: Props) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState<DocumentData[]>([]);
  const [liked, setLiked] = useState(false);

  console.log(comment);

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", postId, "comments", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, postId, id]);

  useEffect(() => {
    setLiked(
      likes.findIndex(
        (like) => like.id === (session?.user as ExtendedUserType).uid
      ) !== -1
    );
  }, [likes]);

  const likeComment = async () => {
    if (liked) {
      await deleteDoc(
        doc(
          db,
          "posts",
          postId,
          "comments",
          id,
          "likes",
          (session?.user as ExtendedUserType).uid as string
        )
      );
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          postId,
          "comments",
          id,
          "likes",
          (session?.user as ExtendedUserType).uid as string
        ),
        {
          username: session?.user?.name,
        }
      );
    }
  };

  return (
    <div className="p-3 flex cursor-pointer border-b border-gray-700">
      <img
        src={comment?.userImg}
        alt="Profile pic"
        className="h-11 w-11 rounded-full mr-4"
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex justify-between">
          <PostHeader post={comment} />
          <div className="icon group flex-shrink-0">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        {comment.image && (
          <div className="relative flex justify-start rounded-md">
            <Image
              src={comment.image}
              alt="Comment image"
              className="object-contain rounded-md"
              height={250}
              width={200}
            />
          </div>
        )}
        <div className="text-[#6e767d] flex justify-between items-center w-10/12">
          {comment.id === (session?.user as ExtendedUserType).uid ? (
            <div
              className="group flex items-center space-x-1"
              onClick={async () => {
                await deleteDoc(doc(db, "posts", postId, "comments", id));
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="group flex items-center space-x-1">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={likeComment}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`text-sm group-hover:text-pink-600  ${
                  liked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
