import React from "react";
import { Spin } from "antd";
import "../css/chatPage.css";

function ContactList({
  loading,
  allContacts,
  currentContact,
  setCurrentContact,
}) {
  return (
    <>
      {loading ? (
        <div className="w-full flex items-center justify-center contacts_loading">
          <Spin size="large" />
        </div>
      ) : allContacts.length ? (
        <ul className="contact_list mt-2">
          {allContacts.map((contact) => {
            let contactIdMatch = currentContact.uid == contact.uid;
            return (
              <li
                key={contact.uid}
                className={`w-full h-20 flex items-center pl-2 pr-4 box-border cursor-pointer ${
                  contactIdMatch ? "bg-slate-300" : "hover:bg-slate-600"
                }`}
                onClick={() => setCurrentContact(contact)}
              >
                <div
                  className={`h-14 w-14 rounded-full flex items-center justify-center roboto-font text-2xl font-semibold ${
                    contactIdMatch
                      ? "bg-blue-950 text-slate-300"
                      : "bg-slate-300 text-blue-950"
                  }`}
                >
                  {contact.fullName?.charAt(0).toUpperCase()}
                </div>
                <div
                  className={`ml-4 h-full border-t ${
                    contactIdMatch ? "border-slate-300" : "border-slate-600"
                  } flex justify-between flex-1`}
                >
                  <div className="flex-1 mt-4">
                    <h1
                      className={`roboto-font font-semibold ${
                        contactIdMatch ? "text-blue-950" : "text-slate-300"
                      } text-xl tracking-wider`}
                    >
                      {contact.fullName}
                    </h1>
                    <p
                      className={`josefin-font ${
                        contactIdMatch ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Lorem, ipsum dolor sit elit...
                    </p>
                  </div>
                  <div className="w-auto mt-4">
                    <span
                      className={`inline-block ${
                        contactIdMatch ? "text-gray-500" : "text-gray-400"
                      } roboto-font`}
                    >
                      4:48 PM
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="w-4/5 mx-auto flex flex-col justify-center items-center text-xl josefin-font text-slate-300 zeroContactMsg">
          <p>You have no contact</p>
          <p>Add contact to start chatting</p>
        </div>
      )}
    </>
  );
}

export default ContactList;
