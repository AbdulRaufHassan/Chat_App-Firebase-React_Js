import React from "react";
import "../css/signin_signup_page.css";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth, signInWithEmailAndPassword } from "../config";

function SigninPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const signin = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error.message);
      });
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen max-h-fit pt-7 pb-4 signin_main_Div">
      <div className="bg-gray-50 flex flex-col px-4 pb-4 items-center inner_Div">
        <img src={CHAT_ICON} />
        <h1 className="text-slate-600 font-black text-5xl h-auto">Signin</h1>
        <form onSubmit={handleSubmit(signin)}>
          <input
            type="text"
            className={
              errors.email &&
              "border-2 border-red-800 focus:border-2 focus:border-red-800"
            }
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium">Required</h6>
          )}
          <input
            type="password"
            className={
              errors.password &&
              "border-2 border-red-800 focus:border-2 focus:border-red-800"
            }
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium">Required</h6>
          )}
          <button type="submit">Signin</button>
        </form>
        <span className="text-slate-600 mb-5 text-lg">
          Don't have an account?
          <Link to={"/"} className="ml-2">
            Signup
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SigninPage;
