import { store } from "@/store";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import MobileLayout from "@/layouts/mobileLayout";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
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
