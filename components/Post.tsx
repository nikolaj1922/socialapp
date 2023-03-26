import { useState, useEffect } from "react";
import { IPost } from "@/types/types";
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
import {
  deleteDoc,
  doc,
  DocumentData,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useAppDispatch, setId, openModal } from "@/store";
import { useRouter } from "next/router";
import { db } from "@/firebase";
import { ExtendedUserType } from "@/types/types";
import PostHeader from "./PostHeader";

interface Props {
  id: string;
  post: IPost | DocumentData;
  postPage?: boolean;
}

const Post = ({ id, post, postPage = false }: Props) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [comments, setComments] = useState<DocumentData[]>([]);
  const [likes, setLikes] = useState<DocumentData[]>([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db, id]);

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db, id]);

  useEffect(() => {
    setLiked(
      likes.findIndex(
        (like) => like.id === (session?.user as ExtendedUserType).uid
      ) !== -1
    );
  }, [likes]);

  const likePost = async () => {
    if (liked) {
      await deleteDoc(
        doc(
          db,
          "posts",
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
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700 max-w-2xl"
      onClick={() => router.push(`/${id}`)}
    >
      {!postPage && (
        <img
          src={post?.userImg}
          alt="Profile pic"
          className="h-11 w-11 rounded-full mr-3"
        />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt="Profile pic"
              className="h-11 w-11 rounded-full mr-3"
            />
          )}
          <PostHeader post={post} postPage={postPage} />
          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        {postPage && (
          <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5 w-full break-words px-4">
            {post?.text}
          </p>
        )}
        <div
          className={`flex max-h-[350px] ${
            postPage && "justify-center max-h-[430px]"
          }`}
        >
          {/* <img
            src={post?.image}
            alt=""
            className="h-full max-w-[90%] rounded-md"
          /> */}
        </div>
        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setId(id));
              dispatch(openModal());
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {(session?.user as ExtendedUserType).uid === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                if (postPage) {
                  router.push("/");
                }
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
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
                className={`text-sm group-hover:text-pink-600 ${
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

export default Post;
