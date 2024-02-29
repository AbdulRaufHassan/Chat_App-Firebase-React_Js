import React from "react";
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
      .then(async (userCredential) => {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName: data.fullName,
          emailAddress: data.email,
          uid: auth.currentUser.uid,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
    reset();
  };
  return (
    <div className="flex items-center justify-center min-h-screen max-h-fit pt-7 pb-4 bg-blue-950">
      <div className="bg-gray-50 flex flex-col px-4 pb-4 items-center inner_Div">
        <img src={CHAT_ICON} />
        <h1 className="text-slate-600 font-black text-5xl h-auto josefin-font">
          Signup
        </h1>
        <form onSubmit={handleSubmit(signup)}>
          <input
            type="text"
            className={
              errors.fullName &&
              "border-2 border-red-800 focus:border-2 focus:border-red-800"
            }
            placeholder="Full Name"
            {...register("fullName", {
              required: "Required",
              minLength: {
                value: 4,
                message: "Full name must be at least 4 characters long",
              },
              maxLength: {
                value: 20,
                message: "Full name cannot exceed 20 characters",
              },
            })}
          />
          {errors.fullName && (
            <h6 className="text-red-800	mb-4 mx-4 font-medium">
              {errors.fullName.message}
            </h6>
          )}
          <input
            type="email"
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
          <button type="submit" className="josefin-font">
            Signup
          </button>
        </form>
        <span className="text-slate-600 mb-5 text-lg">
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
