import React, { useState } from "react";
import withNoAuth from "~/HOC/withNoAuth";
import Link from "next/link";
import Router from "next/router";
import routes from "~/utils/routes";
import CustomInput from "~/components/CustomInput/index2";
import AuthSideComponent from "~/components/AuthSideComponent";
import Button from "~/components/Button";
import useUser from "~/contexts/userContext";
import { loginAPI } from "~/apis/authentication";
import { useForm } from "react-hook-form";
import loginStyles from "./login.module.css";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setToken, setUserData } = useUser();
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    const response = await loginAPI({
      email,
      password,
    });
    if (response.isSuccess()) {
      const { token, user } = response.success() || {};
      if (!token) {
        setLoading(false);
        return;
      }
      setUserData(user);
      setToken(token);
      // toast.success('Logging you in...');
      Router.push(routes.home);
    } else {
      const msg = response.fail()?.data?.error || "Something went wrong!";
      toast.error(msg);
    }
    setLoading(false);
  };
  return (
    <>
      <div className={"grid h-full grid-cols-1 gap-y-8 lg:grid-cols-2"}>
        <AuthSideComponent />
        <div className={loginStyles.right}>
          <div className={loginStyles.formWrapper}>
            <h1 className={"h1"}>Login</h1>
            <p className={`${loginStyles.subText} font-medium text-black`}>
              Don’t have an account?
              <Link
                href={routes.register}
                className={`${loginStyles.link} link`}
              >
                Create One
              </Link>
            </p>
            <form
              className={loginStyles.form}
              onSubmit={handleSubmit(handleLogin)}
            >
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  type={"email"}
                  label={"Email *"}
                  name={"email"}
                  {...register("email", { required: true })}
                />
              </div>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  type={"password"}
                  label={"Password *"}
                  name={"password"}
                  {...register("password", { required: true })}
                />
              </div>
              <div className="flex items-center justify-end">
                {/*<Link href={routes.forgotPassword}>*/}
                {/*  <a className={`link text-sm`}>Forgot my password</a>*/}
                {/*</Link>*/}
                <Button
                  type={"submit"}
                  disabled={loading}
                  className={loginStyles.btnSubmit}
                >
                  Enter
                </Button>
              </div>
            </form>
            {/*<div className={'line-text mt-4 mb-6'}>*/}
            {/*  <span>or</span>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <Button*/}
            {/*    variant={'outline'}*/}
            {/*    icon={googleIcon}*/}
            {/*    className={loginStyles.googleSignin}*/}
            {/*  >*/}
            {/*    Connect with Google*/}
            {/*  </Button>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </>
  );
};

Login.propTypes = {};

export default withNoAuth(Login);
