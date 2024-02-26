import React from "react";
import "../css/chatPage.css";
// import { MdPersonAddAlt1 } from "react-icons/md";

function ContactListSec() {
  return (
    <section className="bg-blue-950 border-r border-gray-400 relative contactListSec">
      <header className="fixed top-0 left-0 border-b border-gray-400 z-50">
        <div className="w-full bg-slate-300 border-r border-gray-400 p-2 flex items-center box-border">
          <div className="h-14 w-14 rounded-full bg-slate-500"></div>
          <h1 className="text-blue-950 text-lg font-semibold ml-2">
            Full Name
          </h1>
        </div>
        <div className="w-full flex items-center justify-center">
          <input
            type="text"
            className="bg-slate-300 my-4 py-3 px-3 w-11/12 rounded-lg text-blue-950 text-lg focus:outline-none placeholder:text-gray-500"
            placeholder="Search Friend"
          />
          {/* <button>
            <MdPersonAddAlt1 className=""/>
          </button> */}
        </div>
      </header>
    </section>
  );
}

export default ContactListSec;
