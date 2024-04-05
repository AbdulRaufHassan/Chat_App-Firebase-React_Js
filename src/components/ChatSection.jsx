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
} from "../config/index.js";
import { Spin } from "antd";
import CHAT_ICON from "../assets/images/chat_icon.svg";
import { FaXmark } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import ProfileDrawer from "./ProfileDrawer.jsx";

function ChatSection({
  allContacts,
  currentContact,
  currentUserDoc,
  currentGroup,
  generateChatId,
  allGroups,
  activeTab,
  setCurrentGroup,
  setCurrentContact,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageInputVal, setMessageInputVal] = useState("");
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [allMessages, setAllMessages] = useState([]);
  const [allGroupMembers, setAllGroupMembers] = useState([]);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  let messageInputRef = useRef();
  let isContact = currentContact?.uid;
  let isGroup = currentGroup?.groupId;

  const sendMsg = async () => {
    setMessageInputVal("");
    setShowEmojiPicker(false);
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
          groupId: currentGroup.groupId,
          sendTime: serverTimestamp(),
        });
        await updateDoc(doc(db, "groups", currentGroup.groupId), {
          lastMessage: {
            lastMessage: messageInputVal.trim(),
            senderUid: currentUserDoc.uid,
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
    if (currentGroup?.groupId) {
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
    }
  };

  const openProfileInfoDrawer = () => {
    setOpenProfileDrawer(true);
  };

  useEffect(() => {
    getAllMessages();
  }, [currentContact, currentGroup]);

  useEffect(() => {
    isGroup && getAllGroupMembers();
  }, [currentGroup]);

  useEffect(() => {
    messageInputRef &&
      messageInputRef.current &&
      messageInputRef.current.focus();
  }, [showEmojiPicker]);

  return (
    <section
      className={`${
        isContact || isGroup
          ? "bg-slate-400 showRightSection"
          : "bg-slate-300 flex justify-center items-center hideRightSection"
      } flex-1 MessageSec relative box-border rightSection`}
    >
      {isContact || isGroup ? (
        <>
          <header className="w-full bg-slate-300 flex items-center">
            <button
              className="ml-4 text-blue-950 chatSecBackBtn"
              onClick={() => {
                isContact ? setCurrentContact({}) : setCurrentGroup({});
              }}
            >
              <IoArrowBackOutline size={25} />
            </button>
            <div
              className="h-14 w-14 rounded-full bg-blue-950 ml-4 mr-3 flex items-center justify-center text-slate-300 roboto-font text-2xl font-semibold cursor-pointer"
              onClick={openProfileInfoDrawer}
            >
              {isContact ? (
                currentContact?.profilePicture ? (
                  <img
                    src={currentContact.profilePicture}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  currentContact.fullName?.charAt(0).toUpperCase()
                )
              ) : currentGroup?.profilePicture ? (
                <img
                  src={currentGroup.profilePicture}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentGroup.groupName?.charAt(0).toUpperCase()
              )}
            </div>
            <h1
              className="roboto-font font-semibold text-blue-950 text-xl tracking-wider cursor-pointer"
              onClick={openProfileInfoDrawer}
            >
              {isContact ? currentContact.fullName : currentGroup.groupName}
            </h1>
          </header>
          <ProfileDrawer
            openProfileDrawer={openProfileDrawer}
            setOpenProfileDrawer={setOpenProfileDrawer}
            currentUserDoc={currentUserDoc}
            currentContact={currentContact}
            currentGroup={currentGroup}
            allGroupMembers={allGroupMembers}
            setCurrentGroup={setCurrentGroup}
            allContacts={allContacts}
          />
          <section
            onClick={() => showEmojiPicker && setShowEmojiPicker(false)}
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
                    className={`flex items-end h-fit w-fit my-7 msg_parent_div ${
                      v.senderId == currentUserDoc.uid
                        ? "self-end outgoingMsg"
                        : "self-start incomingMsg"
                    }`}
                  >
                    <div
                      className="flex flex-col"
                      style={{
                        maxWidth: "calc(100% - 56px)",
                        minWidth: "calc(100% - 56px)",
                      }}
                    >
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
                        className="relative flex justify-center items-center px-3 pb-8 box-border min-h-fit max-h-fit msg_style"
                      >
                        <p className="mt-3 leading-normal break-words text-center text-base tracking-wide w-full josefin-font">
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
                        {isContact ? (
                          v.senderId == currentUserDoc.uid ? (
                            currentUserDoc?.profilePicture ? (
                              <img
                                src={currentUserDoc.profilePicture}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              currentUserDoc.fullName?.charAt(0).toUpperCase()
                            )
                          ) : currentContact?.profilePicture ? (
                            <img
                              src={currentContact.profilePicture}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            currentContact.fullName?.charAt(0).toUpperCase()
                          )
                        ) : member[0]?.profilePicture ? (
                          <img
                            src={member[0].profilePicture}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          member[0]?.fullName?.charAt(0).toUpperCase()
                        )}
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
              onClick={() => {
                messageInputRef.current.focus();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="text-4xl text-blue-950 ml-3 emojiPickerBtn"
            >
              {showEmojiPicker ? <FaXmark /> : <MdOutlineEmojiEmotions />}
            </button>
            <input
              type="text"
              ref={messageInputRef}
              className="flex-1 p-3 mx-4 bg-gray-500 rounded-xl text-xl box-border text-white placeholder:text-slate-300 focus:outline-none josefin-font msgInput"
              value={messageInputVal}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (messageInputVal.trim()) {
                    sendMsg();
                  }
                }
              }}
              onChange={(e) => setMessageInputVal(e.target.value)}
              placeholder="Type a message"
            />
            <div>
              <button
                className="p-3 bg-blue-950 rounded-full mr-3 msgSendBtn"
                onClick={sendMsg}
              >
                <MdSend className="text-3xl text-slate-300" />
              </button>
            </div>
          </footer>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <img src={CHAT_ICON} className="sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
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
            left: "05px",
            zIndex: "2000",
          }}
          width="350px"
          height="400px"
          onEmojiClick={(emojiObject) => {
            setMessageInputVal((prevVal) => prevVal + emojiObject.emoji);
          }}
        />
      )}
    </section>
  );
}

export default ChatSection;
