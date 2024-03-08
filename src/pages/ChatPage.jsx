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
  addDoc,
  auth,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  signOut,
  where,
} from "../config";
import { Spin } from "antd";
import AddContactModal from "../components/AddContactModal";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import EmojiPicker from "emoji-picker-react";

function ChatPage() {
  const [openModal, setOpenModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [currentUserDoc, setCurrentUserDoc] = useState({});
  const [messageInputVal, setMessageInputVal] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentContact, setCurrentContact] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const generateChatId = (contactUid) => {
    let chatId;
    if (currentUserDoc.uid < contactUid) {
      chatId = `${currentUserDoc.uid}${contactUid}`;
    } else {
      chatId = `${contactUid}${currentUserDoc.uid}`;
    }
    return chatId;
  };

  const sendMsg = async () => {
    if (messageInputVal.trim()) {
      await addDoc(collection(db, "messages"), {
        msg: messageInputVal.trim(),
        senderId: currentUserDoc.uid,
        receiverId: currentContact.uid,
        chatId: generateChatId(currentContact.uid),
        sendTime: serverTimestamp(),
      });
    }
    setMessageInputVal("");
  };

  const getAllMessages = () => {
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", generateChatId(currentContact.uid)),
      orderBy("sendTime", "asc")
    );
    onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.unshift(doc.data());
      });
      setAllMessages(messages);
    });
  };

  useEffect(() => {
    getAllContacts();
  }, [loading]);

  useEffect(() => {
    getAllMessages();
  }, [currentContact]);

  return (
    <div className="w-full min-h-screen max-h-screen overflow-y-hidden flex bg-slate-400">
      <section className="bg-blue-950 border-r border-gray-400 contactListSec">
        <header className="w-full">
          <div className="w-full bg-slate-300 border-r border-gray-400 p-2 flex items-center justify-between box-border">
            <div className="h-14 w-14 rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-2xl roboto-font">
              {currentUserDoc.fullName?.charAt(0).toUpperCase()}
            </div>
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
                className="josefin-font border border-slate-300 bg-transparent my-2 py-2 px-3 w-11/12 rounded-lg text-slate-300 text-lg focus:outline-none placeholder:text-slate-300"
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
      </section>
      <section
        className={`${
          Object.keys(currentContact).length
            ? "bg-slate-400"
            : "bg-slate-300 flex justify-center items-center"
        } flex-1 MessageSec relative`}
      >
        {Object.keys(currentContact).length > 0 ? (
          <>
            <header className="w-full bg-slate-300 flex items-center">
              <div className="h-14 w-14 rounded-full bg-blue-950 ml-4 mr-3 flex items-center justify-center text-slate-300 roboto-font text-2xl font-semibold">
                {currentContact.fullName?.charAt(0).toUpperCase()}
              </div>
              <h1 className="roboto-font font-semibold text-blue-950 text-xl tracking-wider">
                {currentContact.fullName}
              </h1>
            </header>
            <section
              className={`flex py-10 px-3 box-border allMsgsParentDiv ${
                allMessages.length
                  ? "flex-col-reverse"
                  : "items-center justify-center"
              }`}
            >
              {allMessages.length ? (
                allMessages.map((v, i) => (
                  <div
                    key={i}
                    className={`flex items-end msg_parent_div ${
                      v.senderId == currentUserDoc.uid
                        ? "self-end outgoingMsg"
                        : "self-start incomingMsg"
                    }`}
                  >
                    <div
                      key={i}
                      className="relative min-h-32 max-h-fit min-w-60 max-w-fit flex justify-center items-center msg_style"
                    >
                      <p className="z-50 w-4/5 h-4/5 text-center text-lg tracking-wide josefin-font">
                        {v.msg}
                      </p>
                    </div>
                    <div>
                      <div className="h-14 w-14 rounded-full flex items-center justify-center roboto-font text-2xl font-semibold">
                        {v.senderId == currentUserDoc.uid
                          ? `${currentUserDoc.fullName
                              ?.charAt(0)
                              .toUpperCase()}`
                          : `${currentContact.fullName
                              ?.charAt(0)
                              .toUpperCase()}`}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-6xl text-blue-950 font-semibold josefin-font">
                  Say Hi! 👋
                </h1>
              )}
            </section>
            <footer className="w-full bg-slate-300 absolute bottom-0 right-0 flex justify-center items-center">
              <button className="ml-3 mr-6">
                <MdOutlinePhotoLibrary className="text-4xl text-blue-950" />
              </button>
              <button
                className="mr-6"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
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
                  onClick={sendMsg}
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
        {showEmojiPicker && (
          <EmojiPicker
            style={{
              position: "absolute",
              bottom: "82px",
              left: "20px",
              zIndex: "2000",
            }}
            width="350px"
            height="400px"
            onEmojiClick={(emojiObject) => {
              setMessageInputVal(messageInputVal + emojiObject.emoji);
            }}
          />
        )}
      </section>
    </div>
  );
}

export default ChatPage;
