import { ClientSafeProvider } from "next-auth/react/types";
import { signIn, getProviders } from "next-auth/react";
import { GetServerSideProps } from "next";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";
import Head from "next/head";
import { ReactElement } from "react";

const Login = ({ providers }: { providers: ClientSafeProvider }) => {
  return (
    <div className="flex flex-col items-center space-y-20 pt-48">
      <Head>
        <title>Social</title>
        <link rel="icon" href="/twitterLogo.svg" />
      </Head>
      <IoLogoTwitter color="white" size="9rem" />
      <div className="space-y-4">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-blue-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with
              </span>
              {provider.name === "Google" ? (
                <FcGoogle className="ml-1 z-10" size="2em" />
              ) : (
                <FaGithub className="ml-1 z-10" size="2em" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};

export default Login;

Login.getLayout = function PageLayout(page : ReactElement) {
  return <>{page}</>;
};
