import React, { useEffect, useState } from "react";
import "../css/chatPage.css";
import { MdGroups, MdPersonAddAlt1 } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import {
  auth,
  collection,
  db,
  doc,
  onSnapshot,
  query,
  signOut,
  where,
} from "../config/index.js";
import AddContactModal from "../components/AddContactModal.jsx";
import ChatSection from "../components/ChatSection.jsx";
import CreateGroupModal from "../components/CreateGroupModal.jsx";
import { Tabs, message } from "antd";
import GroupList from "../components/GroupList.jsx";
import ProfileDrawer from "../components/ProfileDrawer.jsx";
import ContactList from "../components/ContactList.jsx";

function ChatPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [currentUserDoc, setCurrentUserDoc] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentContact, setCurrentContact] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [groupListLoading, setGroupListLoading] = useState(true);
  const [allGroups, setAllGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({});

  const getCurrentUser = async () => {
    const currentUserRef = doc(db, "users", auth.currentUser.uid);
    onSnapshot(currentUserRef, (doc) => {
      setCurrentUserDoc(doc.data());
    });
  };

  const getAllContacts = async () => {
    if (currentUserDoc.contacts.length > 0) {
      const contactsQuery = query(
        collection(db, "users"),
        where("uid", "in", currentUserDoc.contacts)
      );
      onSnapshot(contactsQuery, (querySnapshot) => {
        const tempArr = [];
        querySnapshot.forEach((doc) => {
          tempArr.push(doc.data());
        });
        setAllContacts(tempArr);
        setLoading(false);
      });
    } else {
      setLoading(false);
      setAllContacts([]);
    }
  };

  const getAllGroups = async () => {
    const groupsQuery = query(
      collection(db, "groups"),
      where("members", "array-contains", currentUserDoc.uid)
    );
    onSnapshot(groupsQuery, (querySnapshot) => {
      const tempArr = [];
      querySnapshot.docs.forEach((doc) => {
        tempArr.push(doc.data());
        if (
          currentGroup?.groupId &&
          currentGroup.groupId === doc.data().groupId
        ) {
          console.log(doc.data())
          setCurrentGroup(doc.data());
        }
      });
      setAllGroups(tempArr);
      setGroupListLoading(false);
    });
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserDoc?.uid) {
      getAllContacts();
    }
  }, [currentUserDoc]);

  useEffect(() => {
    if (currentUserDoc?.uid) {
      getAllGroups();
    }
  }, [currentUserDoc]);

  const generateChatId = (contactUid) => {
    let chatId;
    if (currentUserDoc.uid < contactUid) {
      chatId = `${currentUserDoc.uid}${contactUid}`;
    } else {
      chatId = `${contactUid}${currentUserDoc.uid}`;
    }
    return chatId;
  };

  return (
    <div className="w-full min-h-screen max-h-screen overflow-y-hidden flex bg-slate-400">
      <section className="bg-blue-950 border-r border-gray-400 contactListSec">
        <header className="w-full">
          <div className="w-full bg-slate-300 border-r border-gray-400 p-2 flex items-center justify-between box-border">
            <div
              className="h-14 w-14 cursor-pointer rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-2xl roboto-font"
              onClick={() => setOpenProfileDrawer(true)}
            >
              {currentUserDoc?.profilePicture ? (
                <img
                  src={currentUserDoc.profilePicture}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentUserDoc?.fullName?.charAt(0).toUpperCase()
              )}
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
                  />
                </>
              ) : (
                <>
                  <button
                    className="flex flex-col items-center"
                    onClick={() => {
                      if (currentUserDoc.contacts.length < 2) {
                        message.destroy();
                        message.info({
                          type: "info",
                          content:
                            "At least two contacts required in your list to create a group",
                        });
                      } else {
                        setOpenGroupModal(true);
                      }
                    }}
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
                    currentUserDoc={currentUserDoc}
                  />
                </>
              )}
              <button
                className="flex flex-col items-center mx-6"
                onClick={() => setOpenProfileDrawer(true)}
              >
                <CgProfile className="text-blue-950" size="27px" />
                <h6 className="text-xs text-blue-950 mt-1 josefin-font">
                  Profile
                </h6>
              </button>
              <ProfileDrawer
                openProfileDrawer={openProfileDrawer}
                setOpenProfileDrawer={setOpenProfileDrawer}
                currentUserDoc={currentUserDoc}
              />
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
            onChange={(key) => {
              setActiveTab(key);
              setCurrentContact({});
              setCurrentGroup({});
            }}
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
                    currentUserDoc={currentUserDoc}
                    generateChatId={generateChatId}
                  />
                ),
              },
              {
                key: "2",
                label: "Groups",
                children: (
                  <GroupList
                    groupListLoading={groupListLoading}
                    allGroups={allGroups}
                    setCurrentGroup={setCurrentGroup}
                    currentGroup={currentGroup}
                  />
                ),
              },
            ]}
          />
        </header>
      </section>
      <ChatSection
        allContacts={allContacts}
        allGroups={allGroups}
        currentContact={currentContact}
        currentUserDoc={currentUserDoc}
        currentGroup={currentGroup}
        generateChatId={generateChatId}
        activeTab={activeTab}
      />
    </div>
  );
}

export default ChatPage;
