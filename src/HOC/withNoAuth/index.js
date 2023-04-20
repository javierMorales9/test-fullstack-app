import React, { useEffect } from "react";
import Loader from "~/components/Loader";
import routes from "~/utils/routes";
import Router from "next/router";
import useUser from "~contexts/userContext";

const withNoAuth = (Component) => {
  const NoAuthComponent = () => {
    const { loading, userData } = useUser();

    useEffect(() => {
      if (!loading && userData) {
        Router.push(routes.home);
      }
    }, [loading]);

    if (loading || userData) {
      return <Loader fullScreen />;
    }

    return <Component />; // Render whatever you want while the authentication occurs
  };

  return NoAuthComponent;
};

export default withNoAuth;
