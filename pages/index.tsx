import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Modal from "@/components/Modal";
import { useAppSelector } from "@/store";

export default function Home() {
  const { data: session } = useSession();
  const { isOpen } = useAppSelector((state) => state.modal);
  return (
    <>
      <Head>
        <title>Social App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex max-w-[1500px]">
        <Sidebar />
        <Feed />

        {/* Widgets */}
        {isOpen && <Modal />}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

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
      session,
    },
  };
};
