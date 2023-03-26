import { store } from "@/store";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import MobileLayout from "@/layouts/mobileLayout";
import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.getLayout) {
    return Component.getLayout(
      <Provider store={store}>
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        <MobileLayout>
          <Component {...pageProps} />
        </MobileLayout>
      </SessionProvider>
    </Provider>
  );
}
