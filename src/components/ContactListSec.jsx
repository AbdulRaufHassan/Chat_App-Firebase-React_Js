import React, { useState } from "react";
import "../css/chatPage.css";
import { MdGroups, MdPersonAddAlt1 } from "react-icons/md";

function ContactListSec() {
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <section className="bg-blue-950 border-r border-gray-400 relative contactListSec">
      <header className="fixed top-0 left-0 border-b border-gray-400 z-50">
        <div className="w-full bg-slate-300 border-r border-gray-400 p-2 flex items-center justify-between box-border">
          <div className="h-14 w-14 rounded-full bg-slate-500"></div>
          <div className="flex items-center">
            <button className="flex flex-col items-center">
              <MdPersonAddAlt1 className="text-blue-950 text-3xl" />
              <h6 className="text-xs text-blue-950">Add Contact</h6>
            </button>
            <button className="flex flex-col items-center mx-5">
              <MdGroups className="text-blue-950 text-3xl" />
              <h6 className="text-xs text-blue-950">Create Group</h6>
            </button>
            <div className="relative">
              <button
                className={`p-3 mr-2 h-12 w-12 flex flex-col justify-center items-center ${
                  showDropDown && "bg-blue-950 rounded-full"
                }`}
                onClick={() => setShowDropDown(!showDropDown)}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    showDropDown ? "bg-slate-300" : "bg-blue-950"
                  }`}
                ></div>
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    showDropDown ? "bg-slate-300" : "bg-blue-950"
                  }`}
                  style={{ margin: "2px 0px" }}
                ></div>
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    showDropDown ? "bg-slate-300" : "bg-blue-950"
                  }`}
                ></div>
              </button>
              {showDropDown && (
                <div className="absolute top-9 right-8 bg-white p-2 mt-2 rounded shadow-lg">
                  <ul>
                    <li>profile</li>
                    <li>logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center px-2 box-border">
          <input
            type="text"
            className="bg-slate-300 my-2 py-2 px-3 w-11/12 rounded-lg text-blue-950 text-lg focus:outline-none placeholder:text-gray-500"
            placeholder="Search Friend"
          />
        </div>
      </header>
    </section>
  );
}

export default ContactListSec;
