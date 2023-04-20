import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import routes from "~/utils/routes";
import { getUserAPI } from "~/apis/authentication";
import { getCookie, deleteCookie, setCookie } from "cookies-next";

const UserContext = React.createContext({
  userData: null,
  setUserData: () => {},
  accountData: null,
  setAccountData: () => {},
  token: "",
  setToken: () => {},
  logout: () => {},
  verifyUser: () => {},
  loading: true,
});

export const UserProvider = ({ children, token: t }) => {
  const [userData, setUser] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(t);

  const verifyUser = async () => {
    setLoading(true);
    const tkn = token || getCookie("token");
    if (tkn) {
      const res = await getUserAPI(tkn);
      if (res.isSuccess()) {
        setUserData(res.success());
        setToken(tkn);
      } else {
        logOutFromAll();
      }
    }
    setLoading(false);
    return Promise.resolve(true);
  };

  const setUserData = (data = {}) => {
    const { id, firstName, lastName, email, account } = data;
    const d = { id, email, firstName, lastName };
    setAccountData(account);
    setUser(d);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    deleteCookie("token");
    Router.push(routes.login);
  };

  const logOutFromAll = () => {
    logout();
    window.localStorage.setItem("logout", Date.now().toLocaleString());
  };

  useEffect(() => {
    window.addEventListener("storage", ({ key }) => {
      if (key === "logout") {
        logout();
      }
    });
    verifyUser();
  }, []);

  const setTokenAndCookie = (tkn) => {
    setToken(tkn);
    setCookie("token", tkn);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        accountData,
        setAccountData,
        token,
        setToken: setTokenAndCookie,
        logout: logOutFromAll,
        loading,
        verifyUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  token: PropTypes.string,
};

const useUser = () => useContext(UserContext);

export default useUser;
