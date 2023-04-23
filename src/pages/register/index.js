import React, { useState } from "react";
import withNoAuth from "~/HOC/withNoAuth";
import Link from "next/link";
import routes from "~/utils/routes";
import { useForm } from "react-hook-form";
import CustomInput from "~/components/CustomInput/index2";
import AuthSideComponent from "~/components/AuthSideComponent";
import Button from "~/components/Button";
import { registerAPI } from "~/apis/authentication";
import Router from "next/router";
import useUser from "~/contexts/userContext";
import { toast } from "react-toastify";
import loginStyles from "~/pages/login/login.module.css";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setToken, setUserData } = useUser();

  const [loading, setLoading] = useState(false);

  const handleRegister = async ({
    email,
    firstName,
    lastName,
    password,
    terms,
  }) => {
    if (!terms) {
      toast.error("Please accept our Terms of use before continuing.");
      return;
    }

    setLoading(true);

    const response = await registerAPI({
      email,
      firstName,
      lastName,
      password,
    });
    if (response.isSuccess()) {
      toast.success("User created Successfully");
      toast.success("Logging you in...");
      const { token, user } = response.success() || {};
      if (!token) {
        setLoading(false);
        return;
      }
      setUserData(user);
      setToken(token);
      Router.push(routes.home);
      // Router.push(routes.login);
    } else {
      const msg =
        response.fail()?.response?.data?.error ||
        "Unable to create user. Please try again later";
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
            <h1 className={"h1"}>Create an Account</h1>
            <p className={`${loginStyles.subText} font-medium text-black`}>
              Already have an account?
              <Link href={routes.login} className={`${loginStyles.link} link`}>
                Login
              </Link>
            </p>
            <form
              className={loginStyles.form}
              onSubmit={handleSubmit(handleRegister)}
            >
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  type={"email"}
                  label={"Email *"}
                  name={"email"}
                  error={errors.email}
                  {...register("email", { required: true })}
                />
              </div>
              <div className={"mb-6 grid grid-cols-2 gap-x-6"}>
                <CustomInput
                  variant={"floating"}
                  type={"text"}
                  label={"Name *"}
                  name={"firstName"}
                  error={errors.firstName}
                  {...register("firstName", { required: true })}
                />
                <CustomInput
                  variant={"floating"}
                  type={"text"}
                  label={"Surname *"}
                  name={"lastName"}
                  error={errors.lastName}
                  {...register("lastName", { required: true })}
                />
              </div>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  type={"password"}
                  label={"Password *"}
                  name={"password"}
                  error={errors.password}
                  {...register("password", { required: true })}
                />
              </div>
              <div className={"mb-6 flex items-start justify-start gap-x-4 "}>
                <input id={"terms"} type="checkbox" {...register("terms")} />
                <label
                  htmlFor={"terms"}
                  className={`${loginStyles.linkText} linkText`}
                >
                  If you click in “Create Account” means that you have read and
                  accept our{" "}
                  <a
                    href={"https://www.clickout.io/legal/privacy"}
                    target={"_blank"}
                    className={"link"}
                    rel="noreferrer"
                  >
                    Terms of use
                  </a>
                  .
                </label>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  type={"submit"}
                  disabled={loading}
                  className={`w-full ${loginStyles.btnSubmit}`}
                >
                  Create Account
                </Button>
              </div>
            </form>
            {/*<div className={'line-text mt-16 mb-6'}>*/}
            {/*  <span>or</span>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*  <Button*/}
            {/*    variant={'outline'}*/}
            {/*    className={loginStyles.googleSignin}*/}
            {/*    icon={googleIcon}*/}
            {/*  >*/}
            {/*    Register with Google*/}
            {/*  </Button>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </>
  );
};

Register.propTypes = {};

export default withNoAuth(Register);
