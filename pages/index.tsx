import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Modal from "@/components/Modal";
import { useAppSelector } from "@/store";
import Widgets from "@/components/Widgets";

export default function Home() {
  const { isOpen } = useAppSelector((state) => state.modal);
  return (
    <>
      <Head>
        <title>Social</title>
        <link rel="icon" href="/twitterLogo.svg" />
      </Head>
      <main className="min-h-screen flex max-w-[1500px]">
        <Sidebar />
        <Feed />
        <Widgets />
        {isOpen && <Modal />}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
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
      session,
    },
  };
};
