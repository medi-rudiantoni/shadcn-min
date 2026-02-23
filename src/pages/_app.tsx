import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import AdminLayout from "./adminLayout";
import AuthLayout from "./authLayout";
import { wrapper, store } from "../redux/store";
import "../i18n/config";

import { AuthContextProvider } from "../authentication/AuthContext";

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const router = useRouter();
  const { pathname } = router;

  const renderLayout = () => {
    if (
      pathname == "/" ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/forgotPassword") ||
      pathname.startsWith("/login")
    ) {
      return (
        <UserProvider profileUrl="/">
          <AuthContextProvider>
            <AuthLayout>
              <Component {...pageProps} />
            </AuthLayout>
          </AuthContextProvider>
        </UserProvider>
      );
    } else {
      return (
        <UserProvider profileUrl="/">
          <AuthContextProvider>
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          </AuthContextProvider>
        </UserProvider>
      );
    }
  };

  return (
    <>
      <Provider store={store}>
        <Head>
          <title>
            Admin{" "}
            {process.env.NEXT_PUBLIC_ENV == "development" ? "Dev" : "Dashboard"}{" "}
            - Service Hub Indonesia
          </title>
          <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        </Head>
        {renderLayout()}
      </Provider>
    </>
  );
}

export default App;
