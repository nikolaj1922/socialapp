import { ClientSafeProvider } from "next-auth/react/types";
import { signIn, getProviders } from "next-auth/react";
import Logo from "../public/twitterLogo.jpg";
import Image from "next/image";
import { GetServerSideProps } from "next";

const Login = ({ providers }: { providers: ClientSafeProvider }) => {

  return (
    <div className="flex flex-col items-center space-y-20 pt-48">
      <Image
        src={Logo}
        width={150}
        height={150}
        className="object-contain"
        alt="logo"
      />
      <div className="space-y-4">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-blue-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with {provider.name}
              </span>
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
