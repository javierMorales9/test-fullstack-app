import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/global.css";
import React from "react";
import { UserProvider } from "~/contexts/userContext";
import "public/css/modal.css";
import "highlight.js/styles/atom-one-dark.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <div id={"main"}>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          //pauseOnVisibilityChange={false}
          pauseOnHover={false}
          theme="colored"
        />
      </div>
    </UserProvider>
  );
};

export default api.withTRPC(MyApp);
