import React, { useState } from "react";
import "../css/signin_signup_page.css";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth, signInWithEmailAndPassword } from "../config";
import { emailRegex } from "../contants";
import { Spin } from "antd";
import { message } from "antd";

function SigninPage() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const signin = (data) => {
    setButtonDisabled(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        message.success(
          {
            type: "success",
            content: "You have successfully signed in",
          },
          2
        );
      })
      .catch((error) => {
        console.log(error.message);
        if (error.code == "auth/invalid-credential") {
          message.error(
            {
              type: "error",
              content:
                "Your account does not exist. Please sign up to create a new account",
            },
            4
          );
        } else if (error.code == "auth/network-request-failed") {
          message.error(
            {
              type: "error",
              content: "No internet connection",
            },
            2
          );
        }
        setButtonDisabled(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen max-h-fit pt-7 pb-4 bg-blue-950">
      <div className="bg-slate-300 flex flex-col px-4 pb-4 items-center inner_Div">
        <img src={CHAT_ICON} />
        <h1 className="text-slate-600 font-black text-5xl h-auto josefin-font">
          Signin
        </h1>
        <form onSubmit={handleSubmit(signin)}>
          <input
            type="text"
            className={`josefin-font autofill_input_bg_white
              ${
                errors.email
                  ? "border-2 border-red-800 focus:border-2 focus:border-red-800"
                  : "focus:border-2 border-gray-500"
              }
            `}
            placeholder="Email"
            {...register("email", {
              required: "Required",
              pattern: {
                value: emailRegex,
                message: "Invalid Email",
              },
            })}
          />
          {errors.email && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium validation_text">
              {errors.email.message}
            </h6>
          )}
          <input
            type="password"
            className={`josefin-font autofill_input_bg_white
              ${
                errors.password
                  ? "border-2 border-red-800 focus:border-2 focus:border-red-800"
                  : "focus:border-2 focus:border-gray-500"
              }
            `}
            placeholder="Password"
            {...register("password", {
              required: "Required",
            })}
          />
          {errors.password && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium validation_text">
              {errors.password.message}
            </h6>
          )}
          <button
            type="submit"
            className="josefin-font text-white"
            disabled={buttonDisabled}
          >
            {buttonDisabled ? <Spin /> : "Signin"}
          </button>
        </form>
        <span className="text-gray-500 mb-5 text-lg roboto-font">
          Don't have an account?
          <Link to={"/"} className="ml-2 josefin-font text-blue-950">
            Signup
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SigninPage;
