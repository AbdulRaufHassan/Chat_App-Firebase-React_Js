import React, { useState } from "react";
import "../css/chatPage.css";
import { MdGroups, MdPersonAddAlt1 } from "react-icons/md";
import { auth, signOut } from "../config";
import AddContactModal from "./AddContactModal";

function ContactListSec() {
  const [openModal, setOpenModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);

  return (
    <section className="bg-blue-950 border-r border-gray-400 contactListSec">
      <header className="w-full border-b border-gray-400">
        <div className="w-full bg-slate-300 border-r border-gray-400 p-2 flex items-center justify-between box-border">
          <div className="h-14 w-14 rounded-full bg-blue-950"></div>
          <div className="flex items-center">
            <button
              className="flex flex-col items-center"
              onClick={() => setOpenModal(true)}
            >
              <MdPersonAddAlt1 className="text-blue-950 text-3xl" />
              <h6 className="text-xs text-blue-950 josefin-font">
                Add Contact
              </h6>
            </button>
            <AddContactModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              allContacts={allContacts}
              setAllContacts={setAllContacts}
            />
            <button
              className="flex flex-col items-center mx-6"
              onClick={() => signOut(auth)}
            >
              <MdGroups className="text-blue-950 text-3xl" />
              <h6 className="text-xs text-blue-950 josefin-font">
                Create Group
              </h6>
            </button>
            <div className="mr-5 ml-2">
              <div className="flex flex-col justify-center items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-950"></div>
                <div
                  className="h-1.5 w-1.5 rounded-full bg-blue-950"
                  style={{ margin: "2px 0px" }}
                ></div>
                <div className="h-1.5 w-1.5 rounded-full bg-blue-950"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center px-2 box-border">
          <input
            type="text"
            className="border border-slate-300 bg-transparent my-2 py-2 px-3 w-11/12 rounded-lg text-slate-300 text-lg focus:outline-none placeholder:text-slate-300"
            placeholder="Search Contact"
          />
        </div>
      </header>
      <ul className="contact_list mt-2">
        {allContacts.map((contact) => (
          <li
            key={contact.uid}
            className="w-full h-20 flex items-center pl-2 pr-4 box-border hover:bg-slate-500"
          >
            <div className="h-14 w-14 rounded-full bg-slate-300"></div>
            <div className="ml-4 h-full border-t border-slate-500 flex justify-between flex-1">
              <div className="flex-1 mt-4">
                <h1 className="roboto-font font-semibold text-slate-300 text-xl tracking-wider">
                  {contact.fullName}
                </h1>
                <p className="josefin-font text-gray-400">
                  Lorem, ipsum dolor sit elit...
                </p>
              </div>
              <div className="w-auto mt-4">
                <span className="inline-block text-gray-400 roboto-font">
                  4:48 PM
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ContactListSec;
