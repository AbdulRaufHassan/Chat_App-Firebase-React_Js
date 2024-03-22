import React, { useEffect, useRef, useState } from "react";
import "../css/chatPage.css";
import { MdOutlineEmojiEmotions, MdSend } from "react-icons/md";
import {
  addDoc,
  collection,
  db,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  arrayUnion,
} from "../config";
import { Spin } from "antd";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { FaXmark } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";

function ChatSection({
  allContacts,
  currentContact,
  currentUserDoc,
  currentGroup,
  generateChatId,
  allGroups,
  activeTab,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageInputVal, setMessageInputVal] = useState("");
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [allMessages, setAllMessages] = useState([]);
  const [allGroupMembers, setAllGroupMembers] = useState([]);

  let messageInputRef = useRef();
  let isContact = currentContact?.uid;
  let isGroup = currentGroup?.groupId;

  const sendMsg = async () => {
    setMessageInputVal("");
    if (messageInputVal.trim()) {
      if (isContact) {
        if (!currentContact.contacts.includes(currentUserDoc.uid)) {
          await updateDoc(doc(db, "users", currentContact.uid), {
            contacts: arrayUnion(currentUserDoc.uid),
          });
        }
        await addDoc(collection(db, "messages"), {
          msg: messageInputVal.trim(),
          senderId: currentUserDoc.uid,
          receiverId: currentContact.uid,
          chatId: generateChatId(currentContact.uid),
          sendTime: serverTimestamp(),
        });
        await updateDoc(doc(db, "users", currentUserDoc.uid), {
          [`lastMessages.${generateChatId(currentContact.uid)}`]: {
            lastMessage: messageInputVal.trim(),
            chatId: generateChatId(currentContact.uid),
            senderUid: currentUserDoc.uid,
            sendTime: serverTimestamp(),
          },
        });
        await updateDoc(doc(db, "users", currentContact.uid), {
          [`lastMessages.${generateChatId(currentContact.uid)}`]: {
            lastMessage: messageInputVal.trim(),
            chatId: generateChatId(currentContact.uid),
            senderUid: currentUserDoc.uid,
            sendTime: serverTimestamp(),
          },
        });
      } else {
        await addDoc(collection(db, "groupMessages"), {
          msg: messageInputVal.trim(),
          senderId: currentUserDoc.uid,
          senderFullName: currentUserDoc.fullName,
          groupId: currentGroup.groupId,
          sendTime: serverTimestamp(),
        });
        await updateDoc(doc(db, "groups", currentGroup.groupId), {
          lastMessage: {
            lastMessage: messageInputVal.trim(),
            senderUid: currentUserDoc.uid,
            senderFullName: currentUserDoc.fullName,
            sendTime: serverTimestamp(),
          },
        });
      }
    }
  };

  const getAllMessages = () => {
    setMsgsLoading(true);
    let q;
    if (isContact && currentContact.uid) {
      q = query(
        collection(db, "messages"),
        where("chatId", "==", generateChatId(currentContact.uid)),
        orderBy("sendTime", "asc")
      );
    } else if (isGroup && currentGroup.groupId) {
      q = query(
        collection(db, "groupMessages"),
        where("groupId", "==", currentGroup.groupId),
        orderBy("sendTime", "asc")
      );
    } else {
      setAllMessages([]);
      setMsgsLoading(false);
      return;
    }

    onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.unshift(doc.data());
      });
      setMsgsLoading(false);
      setAllMessages(messages);
    });
  };

  const getAllGroupMembers = async () => {
    const contactsQuery = query(
      collection(db, "users"),
      where("uid", "in", currentGroup.members)
    );
    onSnapshot(contactsQuery, (querySnapshot) => {
      const tempArr = [];
      querySnapshot.forEach((doc) => {
        tempArr.push(doc.data());
      });
      setAllGroupMembers(tempArr);
    });
  };

  useEffect(() => {
    getAllMessages();
  }, [currentContact, currentGroup]);

  useEffect(() => {
    isGroup && getAllGroupMembers();
  }, [currentGroup]);

  messageInputRef && messageInputRef.current && messageInputRef.current.focus();
  return (
    <section
      className={`${
        isContact || isGroup
          ? "bg-slate-400"
          : "bg-slate-300 flex justify-center items-center"
      } flex-1 MessageSec relative`}
      style={{ minWidth: "400px" }}
    >
      {isContact || isGroup ? (
        <>
          <header className="w-full bg-slate-300 flex items-center">
            <div className="h-14 w-14 rounded-full bg-blue-950 ml-4 mr-3 flex items-center justify-center text-slate-300 roboto-font text-2xl font-semibold">
              {isContact
                ? currentContact.fullName?.charAt(0).toUpperCase()
                : currentGroup.groupName?.charAt(0).toUpperCase()}
            </div>
            <h1 className="roboto-font font-semibold text-blue-950 text-xl tracking-wider">
              {isContact ? currentContact.fullName : currentGroup.groupName}
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
              allMessages.map((v, i) => {
                const member =
                  isGroup &&
                  allGroupMembers.filter((member) => member.uid === v.senderId);
                return (
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
                        {isContact
                          ? v.senderId == currentUserDoc.uid
                            ? "You"
                            : currentContact.fullName
                          : v.senderId == currentUserDoc.uid
                          ? "You"
                          : member[0]?.fullName}
                      </h6>
                      <div
                        key={i}
                        className="relative px-3 pt-3 pb-6 box-border min-h-32 max-h-fit min-w-60 max-w-fit flex flex-col justify-center items-center msg_style"
                      >
                        <p className="z-50 mt-3 text-center text-lg tracking-wide josefin-font">
                          {v.msg}
                        </p>
                        <div
                          className={`absolute bottom-1 right-4 text-sm roboto-font sendTime`}
                        >
                          {v.sendTime &&
                            new Date(v.sendTime?.toDate()).toLocaleTimeString(
                              [],
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="h-full">
                      <div className="h-14 w-14 rounded-full flex items-center justify-center roboto-font text-2xl font-semibold">
                        {isContact
                          ? v.senderId == currentUserDoc.uid
                            ? currentUserDoc.fullName?.charAt(0).toUpperCase()
                            : currentContact.fullName?.charAt(0).toUpperCase()
                          : member[0]?.fullName?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1 className="text-6xl text-blue-950 font-semibold josefin-font">
                Say Hi! 👋
              </h1>
            )}
          </section>
          <footer className="w-full bg-slate-300 absolute bottom-0 right-0 flex justify-center items-center">
            <button
              className="mr-4"
              onClick={() => {
                messageInputRef.current.focus();
                setShowEmojiPicker(!showEmojiPicker);
              }}
            >
              {showEmojiPicker ? (
                <FaXmark className="text-4xl text-blue-950 ml-3" />
              ) : (
                <MdOutlineEmojiEmotions className="text-4xl text-blue-950 ml-3" />
              )}
            </button>
            <input
              type="text"
              ref={messageInputRef}
              className="flex-1 p-3 bg-gray-500 rounded-xl text-xl box-border text-white placeholder:text-slate-300 focus:outline-none josefin-font"
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
          {(activeTab == 1 && allContacts.length > 0) ||
          (activeTab == 2 && allGroups.length > 0) ? (
            <h1 className="text-3xl mt-3 text-gray-600 josefin-font">
              No chat selected
            </h1>
          ) : null}
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
