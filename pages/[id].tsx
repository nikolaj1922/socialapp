import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import Modal from "@/components/Modal";
import { useAppSelector } from "@/store";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { IPost } from "@/types/types";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Post from "@/components/Post";
import { useEffect, useState } from "react";
import Comment from "@/components/Comment";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import Widgets from "@/components/Widgets";

interface Props {
  post: IPost | DocumentData;
}

const PostPage = ({ post }: Props) => {
  const { isOpen } = useAppSelector((state) => state.modal);
  const router = useRouter();
  const [comments, setComments] = useState<IPost[] | DocumentData[] | null>(
    null
  );
  const { id } = router.query;

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id as string, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            commentId: doc.id,
            ...doc.data(),
          }))
        );
      }
    );
  }, [db, id]);

  return (
    <>
      <Head>
        <title>
          {post?.username} on Social: "{post?.text}"
        </title>
        <link rel="icon" href="./public/twitterLogo.jpg" />
      </Head>
      <main className="min-h-screen flex max-w-[1500px]">
        <Sidebar />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            Tweet
          </div>
          <Post id={id as string} post={post} postPage />
          {comments ? (
            comments.length > 0 && (
              <div className="pb-44 sm:pb-0">
                {comments.map((comment) => (
                  <Comment
                    key={comment.commentId}
                    id={comment.commentId}
                    comment={comment as IPost}
                    postId={id as string}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="flex justify-center mt-12">
              <CircularProgress size={32} sx={{ color: grey[600] }} />
            </div>
          )}
        </div>
        <Widgets />
        {isOpen && <Modal />}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const post = await getDoc(doc(db, "posts", params?.id as string));
  const session = await getSession(res);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post.data())),
      session,
    },
  };
};

export default PostPage;
