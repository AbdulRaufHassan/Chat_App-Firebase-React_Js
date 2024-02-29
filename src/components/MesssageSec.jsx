import React from "react";
import "../css/chatPage.css";
import {
  MdOutlineEmojiEmotions,
  MdOutlinePhotoLibrary,
  MdSend,
} from "react-icons/md";

function MesssageSec() {
  return (
    <section className="bg-slate-400 flex-1 MessageSec relative">
      <header className="w-full bg-slate-300 flex items-center">
        <div className="h-14 w-14 rounded-full bg-blue-950 ml-4 mr-3"></div>
        <h1 className="roboto-font font-semibold text-blue-950 text-xl tracking-wider">
          Contact Name
        </h1>
      </header>
      <footer className="w-full bg-slate-300 absolute bottom-0 right-0 flex justify-center items-center">
        <button className="ml-3 mr-6">
          <MdOutlinePhotoLibrary className="text-4xl text-blue-950" />
        </button>
        <button className="mr-6">
          <MdOutlineEmojiEmotions className="text-4xl text-blue-950" />
        </button>
        <input
          type="text"
          className="w-9/12 p-3 bg-gray-500 rounded-xl text-xl box-border text-white placeholder:text-slate-300 focus:outline-none josefin-font"
          placeholder="Type a message"
        />
        <div>
          <button className="p-3 bg-blue-950 rounded-full ml-4 mr-3">
            <MdSend className="text-3xl text-slate-300" />
          </button>
        </div>
      </footer>
    </section>
  );
}

export default MesssageSec;
