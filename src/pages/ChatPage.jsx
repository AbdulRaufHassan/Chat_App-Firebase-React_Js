import React, { useEffect, useRef, useState } from "react";
import "../css/chatPage.css";
import { MdGroups, MdPersonAddAlt1 } from "react-icons/md";
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
import AddContactModal from "../components/AddContactModal";
import ContactList from "../components/ContactList.jsx";
import ChatSection from "../components/ChatSection.jsx";
import CreateGroupModal from "../components/CreateGroupModal.jsx";

function ChatPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [currentUserDoc, setCurrentUserDoc] = useState({});
  const [messageInputVal, setMessageInputVal] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [currentContact, setCurrentContact] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const getAllContacts = async () => {
    const currentUserRef = doc(db, "users", auth.currentUser.uid);
    const currentUserDoc = await getDoc(currentUserRef);
    setCurrentUserDoc(currentUserDoc.data());
    if (currentUserDoc.data().contacts.length > 0) {
      const contactsQuery = query(
        collection(db, "users"),
        where("uid", "in", currentUserDoc.data().contacts)
      );
      const querySnapshot = await getDocs(contactsQuery);
      const tempArr = querySnapshot.docs.map((doc) => doc.data());
      setLoading(false);
      setAllContacts(tempArr);
    } else {
      setLoading(false);
      setAllContacts([]);
    }
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
    setMsgsLoading(true);
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
      setMsgsLoading(false);
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
                onClick={() => setOpenGroupModal(true)}
              >
                <MdGroups className="text-blue-950 text-3xl" />
                <h6 className="text-xs text-blue-950 josefin-font">
                  Create Group
                </h6>
              </button>
              <CreateGroupModal
                openGroupModal={openGroupModal}
                setOpenGroupModal={setOpenGroupModal}
              />
              <button onClick={() => signOut(auth)}>
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
              </button>
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
        <ContactList
          loading={loading}
          allContacts={allContacts}
          currentContact={currentContact}
          setCurrentContact={setCurrentContact}
        />
      </section>
      <ChatSection
        allContacts={allContacts}
        currentContact={currentContact}
        currentUserDoc={currentUserDoc}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        allMessages={allMessages}
        msgsLoading={msgsLoading}
        messageInputVal={messageInputVal}
        setMessageInputVal={setMessageInputVal}
        sendMsg={sendMsg}
      />
    </div>
  );
}

export default ChatPage;
