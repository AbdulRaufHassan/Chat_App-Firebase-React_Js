import React, { useEffect, useState } from "react";
import "../css/chatPage.css";
import {
  MdGroups,
  MdPersonAddAlt1,
  MdOutlineEmojiEmotions,
  MdOutlinePhotoLibrary,
  MdSend,
} from "react-icons/md";
import {
  auth,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  query,
  signOut,
  where,
} from "../config";
import { Spin } from "antd";
import AddContactModal from "../components/AddContactModal";
import CHAT_ICON from "../assets/images/chat_icon.svg";

function ChatPage() {
  const [openModal, setOpenModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [currentUserDoc, setCurrentUserDoc] = useState({});
  const [messageInputVal, setMessageInputVal] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllContacts = async () => {
    const currentUserRef = doc(db, "users", auth.currentUser.uid);
    const currentUserDoc = await getDoc(currentUserRef);
    setCurrentUserDoc(currentUserDoc.data());
    const contactsQuery = query(
      collection(db, "users"),
      where("uid", "in", currentUserDoc.data().contacts)
    );
    const querySnapshot = await getDocs(contactsQuery);
    const tempArr = querySnapshot.docs.map((doc) => doc.data());
    setLoading(false);
    setAllContacts(tempArr);
  };

  useEffect(() => {
    getAllContacts();
    console.log("get contacts render");
  }, [loading]);

  const sendMsg = () => {
    setAllMessages([
      ...allMessages,
      {
        message: messageInputVal,
      },
    ]);
    setMessageInputVal("");
  };

  return (
    <div className="w-full min-h-screen max-h-screen overflow-y-hidden flex bg-slate-400">
      <section className="bg-blue-950 border-r border-gray-400 contactListSec">
        <header className="w-full">
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
                currentUserDoc={currentUserDoc}
                openModal={openModal}
                setOpenModal={setOpenModal}
                setLoading={setLoading}
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
          {allContacts.length > 0 && (
            <div className="w-full flex items-center justify-center px-2 box-border  border-b border-gray-400">
              <input
                type="text"
                className="border border-slate-300 bg-transparent my-2 py-2 px-3 w-11/12 rounded-lg text-slate-300 text-lg focus:outline-none placeholder:text-slate-300"
                placeholder="Search Contact"
              />
            </div>
          )}
        </header>
        {loading ? (
          <div className="w-full flex items-center justify-center contacts_loading">
            <Spin size="large" />
          </div>
        ) : allContacts.length ? (
          <ul className="contact_list mt-2">
            {allContacts.map((contact) => (
              <li
                key={contact.uid}
                className="w-full h-20 flex items-center pl-2 pr-4 box-border hover:bg-slate-500"
                onClick={() => setCurrentChat(contact)}
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
        ) : (
          <div className="w-4/5 mx-auto flex flex-col justify-center items-center text-xl josefin-font text-slate-300 zeroContactMsg">
            <p>You have no contact</p>
            <p>Add contact to start chatting</p>
          </div>
        )}
      </section>
      <section
        className={`${
          allContacts.length
            ? "bg-slate-400"
            : "bg-slate-300 flex justify-center items-center"
        } flex-1 MessageSec relative`}
      >
        {allContacts.length ? (
          <>
            <header className="w-full bg-slate-300 flex items-center">
              <div className="h-14 w-14 rounded-full bg-blue-950 ml-4 mr-3"></div>
              <h1 className="roboto-font font-semibold text-blue-950 text-xl tracking-wider">
                Contact Name
              </h1>
            </header>
            <section className="flex flex-col-reverse pt-5 py-10 px-3 box-border allMsgsParentDiv">
              {allMessages.map((v, i) => (
                <div className="flex items-end self-end msg_parent_div">
                  <div
                    key={i}
                    className="min-h-32 max-h-fit min-w-60 max-w-fit bg-slate-300 flex justify-center items-center msg_style"
                  >
                    <p className="z-50 w-4/5 h-4/5 text-center josefin-font">
                      {v.message}
                    </p>
                  </div>
                  <div>
                    <div className="h-14 w-14 rounded-full bg-blue-950"></div>
                  </div>
                </div>
              ))}
            </section>
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
                value={messageInputVal}
                onChange={(e) => setMessageInputVal(e.target.value)}
                placeholder="Type a message"
              />
              <div>
                <button
                  className="p-3 bg-blue-950 rounded-full ml-4 mr-3"
                  onClick={() => sendMsg()}
                >
                  <MdSend className="text-3xl text-slate-300" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <img src={CHAT_ICON} className="h-96 w-96" />
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatPage;
