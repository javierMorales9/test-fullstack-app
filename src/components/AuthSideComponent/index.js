import React from "react";
import Image from "next/image";
import bgImage from "public/images/bg.png";
import logo from "public/images/logo.svg";
import styles from "./side-component.module.css";

const AuthSideComponent = () => {
  return (
    <div className={"center relative"}>
      <Image
        layout={"fill"}
        objectFit={"cover"}
        objectPosition={"center"}
        src={bgImage}
        alt="Index"
      />
      <div className={styles.logoWrapper}>
        <Image
          src={logo}
          layout={"fill"}
          objectFit={"contain"}
          objectPosition={"center"}
          alt={"Clickout"}
        />
      </div>
    </div>
  );
};

AuthSideComponent.propTypes = {};

export default AuthSideComponent;
