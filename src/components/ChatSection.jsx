import React, { useRef } from "react";
import "../css/chatPage.css";
import {
  MdOutlineEmojiEmotions,
  MdOutlinePhotoLibrary,
  MdSend,
} from "react-icons/md";
import { Spin } from "antd";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { FaXmark } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";

function ChatSection({
  allContacts,
  currentContact,
  allMessages,
  msgsLoading,
  currentUserDoc,
  showEmojiPicker,
  setShowEmojiPicker,
  messageInputVal,
  setMessageInputVal,
  sendMsg,
}) {
  let messageInputRef = useRef();

  return (
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
              allMessages.length && !msgsLoading
                ? "flex-col-reverse"
                : "items-center justify-center"
            }`}
          >
            {msgsLoading ? (
              <Spin size="large" />
            ) : allMessages.length > 0 ? (
              allMessages.map((v, i) => (
                <div
                  key={i}
                  className={`flex items-end h-fit w-fit my-3 msg_parent_div ${
                    v.senderId == currentUserDoc.uid
                      ? "self-end outgoingMsg"
                      : "self-start incomingMsg"
                  }`}
                >
                  <div>
                    <h6
                      className={`${
                        v.senderId == currentUserDoc.uid
                          ? "text-end mr-9"
                          : "ml-9"
                      } text-gray-700 roboto-font`}
                    >
                      {v.senderId == currentUserDoc.uid
                        ? "You"
                        : currentContact.fullName}
                    </h6>
                    <div
                      key={i}
                      className="relative p-3 box-border min-h-32 max-h-fit min-w-60 max-w-fit flex justify-center items-center msg_style"
                    >
                      <p className="z-50 text-center text-lg tracking-wide josefin-font">
                        {v.msg}
                      </p>
                    </div>
                  </div>
                  <div className="h-full">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center roboto-font text-2xl font-semibold">
                      {v.senderId == currentUserDoc.uid
                        ? `${currentUserDoc.fullName?.charAt(0).toUpperCase()}`
                        : `${currentContact.fullName?.charAt(0).toUpperCase()}`}
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
              onClick={() => {
                messageInputRef.current.focus();
                setShowEmojiPicker(!showEmojiPicker);
              }}
            >
              {showEmojiPicker ? (
                <FaXmark className="text-4xl text-blue-950" />
              ) : (
                <MdOutlineEmojiEmotions className="text-4xl text-blue-950" />
              )}
            </button>
            <input
              type="text"
              ref={messageInputRef}
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
          <h1 className="text-3xl mt-3 text-gray-600 josefin-font">
            {allContacts.length > 0
              ? "No chat selected"
              : "Welcome to my chat app"}
          </h1>
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
            console.log(emojiObject);
            setMessageInputVal((prevVal) => prevVal + emojiObject.emoji);
          }}
        />
      )}
    </section>
  );
}

export default ChatSection;
