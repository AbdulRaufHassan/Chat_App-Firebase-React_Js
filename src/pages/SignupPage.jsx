import React from "react";
import "../css/signin_signup_page.css";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth, createUserWithEmailAndPassword } from "../config";

function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const signup = (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error.message);
      });
    reset();
  };
  return (
    <div className="flex items-center justify-center min-h-screen max-h-fit pt-7 pb-4 signup_main_Div">
      <div className="bg-gray-50 flex flex-col px-4 pb-4 items-center inner_Div">
        <img src={CHAT_ICON} />
        <h1 className="text-slate-600 font-black text-5xl h-auto">Signup</h1>
        <form onSubmit={handleSubmit(signup)}>
          <input
            type="text"
            className={errors.fullName && "border-2 border-red-800"}
            placeholder="Full Name"
            {...register("fullName", { required: true })}
          />
          {errors.fullName && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium">Required</h6>
          )}
          <input
            type="text"
            className={errors.email && "border-2 border-red-800"}
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium">Required</h6>
          )}
          <input
            type="password"
            className={errors.password && "border-2 border-red-800"}
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium">Required</h6>
          )}
          <button type="submit">Signup</button>
        </form>
        <span className="text-slate-600 mb-5 text-lg">
          Already have an account?
          <Link to={"/signin"} className="text-indigo-700 ml-2">
            SignIn
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SignupPage;
