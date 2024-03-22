import React, { useState } from "react";
import "../css/signin_signup_page.css";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
} from "../config";
import { emailRegex, whiteSpaceRegex } from "../contants";
import { Spin, message } from "antd";

function SignupPage() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const signup = (data) => {
    setButtonDisabled(true);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        message.success(
          {
            type: "success",
            content: "You have successfully signed up",
          }
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName: data.fullName,
          emailAddress: data.email,
          uid: auth.currentUser.uid,
          about: "Hello, I'm using Rauf 's chat app",
          contacts: []
        });
      })
      .catch((error) => {
        console.log(error.message);
        if (error.code == "auth/email-already-in-use") {
          message.error(
            {
              type: "error",
              content: "Email already in use",
            },
            2
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
          Signup
        </h1>
        <form onSubmit={handleSubmit(signup)}>
          <input
            type="text"
            className={`josefin-font autofill_input_bg_white ${
              errors.fullName
                ? "border-2 border-red-800 focus:border-2 focus:border-red-800"
                : "focus:border-2 focus:border-gray-500"
            }`}
            placeholder="Full Name"
            {...register("fullName", {
              required: "Required",
              minLength: {
                value: 4,
                message: "Full name must be at least 4 characters long",
              },
              maxLength: {
                value: 25,
                message: "Full name should not exceed 25 characters",
              },
              pattern: {
                value: whiteSpaceRegex,
                message: "Full Name should not start or end with a whitespace",
              },
            })}
          />
          {errors.fullName && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium validation_text">
              {errors.fullName.message}
            </h6>
          )}
          <input
            type="text"
            className={`josefin-font autofill_input_bg_white ${
              errors.email
                ? "border-2 border-red-800"
                : "focus:border-2 focus:border-gray-500"
            }`}
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
            className={`josefin-font autofill_input_bg_white ${
              errors.password
                ? "border-2 border-red-800"
                : "focus:border-2 focus:border-gray-500"
            }`}
            placeholder="Password"
            {...register("password", {
              required: "Required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
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
            {buttonDisabled ? <Spin /> : "Signup"}
          </button>
        </form>
        <span className="text-gray-500 mb-5 text-lg roboto-font">
          Already have an account?
          <Link to={"/signin"} className="text-blue-950 ml-2 josefin-font">
            SignIn
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SignupPage;
