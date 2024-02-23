import React from "react";
import "../css/signin_signup_page.css";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { Link } from "react-router-dom";

function SigninPage() {
  return (
    <div className="flex items-center justify-center bg-blue-900 min-h-screen max-h-fit pt-28 pb-4 signin_main_Div">
      <div className="bg-gray-50 flex flex-col p-4 items-center inner_Div">
        <img src={CHAT_ICON} />
        <h1 className="text-slate-600 font-black text-5xl h-auto">Signin</h1>
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="Password" />
        <button>Signin</button>
        <span className="text-slate-600 mb-5 text-lg">
          Don't have an account?
          <Link to={"/"} className="text-indigo-700 ml-2">
            Signup
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SigninPage;
