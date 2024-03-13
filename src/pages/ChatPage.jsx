import React, { useEffect, useState } from "react";
import "../css/chatPage.css";
import { MdGroups, MdPersonAddAlt1 } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
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
import AddContactModal from "../components/AddContactModal.jsx";
import ContactList from "../components/ContactList.jsx";
import ChatSection from "../components/ChatSection.jsx";
import CreateGroupModal from "../components/CreateGroupModal.jsx";
import { Tabs } from "antd";

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
  const [activeTab, setActiveTab] = useState("1");

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

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Tab 1",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <div className="w-full min-h-screen max-h-screen overflow-y-hidden flex bg-slate-400">
      <section className="bg-blue-950 border-r border-gray-400 contactListSec">
        <header className="w-full">
          <div className="w-full bg-slate-300 border-r border-gray-400 p-2 flex items-center justify-between box-border">
            <div className="h-14 w-14 rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-2xl roboto-font">
              {currentUserDoc.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center">
              {activeTab == "1" ? (
                <>
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
                </>
              ) : (
                <>
                  <button
                    className="flex flex-col items-center"
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
                    allContacts={allContacts}
                  />
                </>
              )}
              <button className="flex flex-col items-center mx-6">
                <CgProfile className="text-blue-950" size="27px" />
                <h6 className="text-xs text-blue-950 mt-1 josefin-font">
                  Profile
                </h6>
              </button>
              <button
                className="flex flex-col items-center mr-3"
                onClick={() => signOut(auth)}
              >
                <RiLogoutCircleLine className="text-blue-950" size="27px" />
                <h6 className="text-xs text-blue-950 mt-1 josefin-font">
                  Logout
                </h6>
              </button>
            </div>
          </div>
          <Tabs
            defaultActiveKey="1"
            centered={true}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                key: "1",
                label: "Contacts",
                children: (
                  <ContactList
                    loading={loading}
                    allContacts={allContacts}
                    currentContact={currentContact}
                    setCurrentContact={setCurrentContact}
                  />
                ),
              },
              { key: "2", label: "Groups", children: "" },
            ]}
          />
        </header>
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
