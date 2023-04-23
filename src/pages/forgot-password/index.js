import React from "react";
import Link from "next/link";
import routes from "~/utils/routes";
import CustomInput from "~/components/CustomInput/index2";
import AuthSideComponent from "~/components/AuthSideComponent";
import Button from "~/components/Button";
import styles from "~/pages/login/login.module.css";

const ForgotPassword = () => {
  return (
    <>
      <div className={"grid h-full grid-cols-1 gap-y-8 lg:grid-cols-2"}>
        <AuthSideComponent />
        <div className={styles.right}>
          <div className={`${styles.formWrapper} ${styles.forgotPassword}`}>
            <h1 className={"h1"}>Forgot my password</h1>
            <p className={`${styles.subText} font-medium text-black`}>
              We will send you a link to restore your password to the desired
              email
            </p>
            <form className={`${styles.form} mt-16`} action="">
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  type={"email"}
                  label={"Email"}
                  name={"email"}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className={`${styles.subText} font-medium text-black`}>
                  Go back to{" "}
                  <Link href={routes.login} className={`link text-sm`}>
                    Login
                  </Link>
                </p>

                <Button type={"submit"} className={styles.btnSubmit}>
                  Restore
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

ForgotPassword.propTypes = {};

export default ForgotPassword;
