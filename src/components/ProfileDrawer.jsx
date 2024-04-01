import { Drawer, Popconfirm, Select, Spin, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import {
  db,
  updateDoc,
  doc,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  storage,
  deleteField,
  arrayRemove,
  getDocs,
  query,
  collection,
  deleteDoc,
  writeBatch,
  where,
} from "../config/index.js";

function ProfileDrawer({
  openProfileDrawer,
  setOpenProfileDrawer,
  currentUserDoc,
  currentContact,
  currentGroup,
  allGroupMembers,
  setCurrentGroup,
  allContacts,
}) {
  const [nameEditDisabled, setNameEditDisabled] = useState(true);
  const [nameInputValue, setNameInputValue] = useState("");
  const [emailAdddress, setEmailAddress] = useState("");
  const [selectedPhotoSrc, setSelectedPhotoSrc] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [sortedGroupMembers, setSortedGroupMembers] = useState([]);
  const [inputValidationMsg, setInputValidationMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [nonGroupMembers, setNonGroupMembers] = useState([]);
  const [selectedMembersUids, setSelectedMembersUids] = useState([]);
  const [addMemberBtnLoading, setAddMemberBtnLoading] = useState(false);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [popconfirmBtnLoading, setpopconfirmBtnLoading] = useState(false);
  let nameInputRef = useRef();

  const nameEdit = async () => {
    if (!currentGroup?.groupId) {
      await updateDoc(doc(db, "users", currentUserDoc.uid), {
        fullName: nameInputValue.trim(),
      });
      setNameInputValue(currentUserDoc.fullName);
    } else {
      await updateDoc(doc(db, "groups", currentGroup.groupId), {
        groupName: nameInputValue.trim(),
      });
      setCurrentGroup({ ...currentGroup, groupName: nameInputValue.trim() });
    }
  };

  const handleNameInputValidation = () => {
    if (!nameInputValue.trim()) {
      setInputValidationMsg("Required");
    } else if (nameInputValue.trim().length < 4) {
      if (!currentGroup?.groupId) {
        setInputValidationMsg("Full name must be at least 4 characters long");
      } else {
        setInputValidationMsg("Group name must be at least 4 characters long");
      }
    } else if (nameInputValue.trim().length > 25) {
      if (!currentGroup?.groupId) {
        setInputValidationMsg("Full name should not exceed 25 characters");
      } else {
        setInputValidationMsg("Group name should not exceed 25 characters");
      }
    } else {
      nameEdit();
      setNameEditDisabled(true);
    }
  };

  const removeProfilePicture = async () => {
    if (currentGroup?.groupId) {
      await updateDoc(doc(db, "groups", currentGroup.groupId), {
        profilePicture: deleteField(),
      });
      setCurrentGroup({ ...currentGroup, profilePicture: "" });
    } else {
      await updateDoc(doc(db, "users", currentUserDoc.uid), {
        profilePicture: deleteField(),
      });
    }
  };

  const profilePicture_change = () => {
    setUploading(true);
    const storageRef = ref(
      storage,
      currentGroup?.groupId
        ? `groupProfilePictures/${currentGroup.groupId}`
        : `profilePictures/${currentUserDoc.uid}`
    );
    const uploadTask = uploadBytesResumable(storageRef, selectedPhotoFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        setSelectedPhotoSrc("");
        setUploading(false);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          if (currentGroup?.groupId) {
            await updateDoc(doc(db, "groups", currentGroup.groupId), {
              profilePicture: url,
            });
            setCurrentGroup({ ...currentGroup, profilePicture: url });
          } else {
            await updateDoc(doc(db, "users", currentUserDoc.uid), {
              profilePicture: url,
            });
          }
          setSelectedPhotoSrc("");
          setUploading(false);
        });
      }
    );
  };

  const handleAddMember = () => {
    let tempArr = [];
    allContacts.forEach((contact) => {
      if (!currentGroup.members.includes(contact.uid)) {
        tempArr.push(contact);
      }
    });
    if (tempArr.length > 0) {
      setNonGroupMembers(tempArr);
    } else {
      message.destroy();
      message.info({
        type: "info",
        content: "All your contacts are already members of this group",
        duration: 3,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhotoSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMember = async () => {
    setAddMemberBtnLoading(true);
    const updatedMembers = [...currentGroup.members, ...selectedMembersUids];
    await updateDoc(doc(db, "groups", currentGroup.groupId), {
      members: updatedMembers,
    });
    setCurrentGroup({
      ...currentGroup,
      members: updatedMembers,
    });
    setAddMemberBtnLoading(false);
    setNonGroupMembers([]);
    setSelectedMembersUids([]);
  };

  const onClose = () => {
    setNameEditDisabled(true);
    setInputValidationMsg("");
    setNonGroupMembers([]);
    setSelectedMembersUids([]);
    setHoveredMember(null);
    setOpenProfileDrawer(false);
  };

  const terminateGroup = async () => {
    setpopconfirmBtnLoading(true);
    try {
      await deleteDoc(doc(db, "groups", currentGroup.groupId));
      const messagesQuery = query(
        collection(db, "groupMessages"),
        where("groupId", "==", currentGroup.groupId)
      );
      const messageSnapshot = await getDocs(messagesQuery);
      const batch = writeBatch(db);
      messageSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setpopconfirmBtnLoading(false);
      setCurrentGroup({});
      onclose();
      message.success("Group terminated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const removeMember = async (memberUid) => {
    setpopconfirmBtnLoading(true);
    await updateDoc(doc(db, "groups", currentGroup.groupId), {
      members: arrayRemove(memberUid),
    });
    setHoveredMember(null);
    let updatedMembers = currentGroup.members.filter(
      (member) => member != memberUid
    );
    setpopconfirmBtnLoading(false);
    setCurrentGroup({ ...currentGroup, members: updatedMembers });
  };

  const leaveGroup = async () => {
    await updateDoc(doc(db, "groups", currentGroup.groupId), {
      members: arrayRemove(currentUserDoc.uid),
    });
    currentGroup({});
    onclose();
  };

  useEffect(() => {
    if (!currentContact?.uid && !currentGroup?.groupId) {
      setNameInputValue(currentUserDoc.fullName);
      setEmailAddress(currentUserDoc.emailAddress);
    } else if (currentContact?.uid) {
      setNameInputValue(currentContact.fullName);
      setEmailAddress(currentContact.emailAddress);
    } else {
      setNameInputValue(currentGroup.groupName);
      setEmailAddress("");
    }
  }, [currentUserDoc, currentGroup, currentContact, openProfileDrawer]);

  useEffect(() => {
    if (!nameEditDisabled && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [nameEditDisabled]);

  useEffect(() => {
    if (currentGroup?.groupId) {
      const sortedArray = allGroupMembers.slice().sort((a, b) => {
        if (a.uid === currentGroup.adminUID) return -1;
        if (b.uid === currentGroup.adminUID) return 1;
        return 0;
      });
      setSortedGroupMembers(sortedArray);
    }
  }, [currentGroup, allGroupMembers]);

  let options = nonGroupMembers.map((member) => ({
    value: member.uid,
    label: (
      <div className="flex items-center">
        <div className="h-9 w-9 rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-lg roboto-font">
          {member?.profilePicture ? (
            <img
              src={member.profilePicture}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            member.fullName?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="mx-2 text-xl font-semibold">{member.fullName}</div>
      </div>
    ),
  }));

  return (
    <>
      <Drawer
        title={
          !currentContact?.uid && !currentGroup?.groupId ? (
            "Profile"
          ) : currentContact?.uid ? (
            "Contact info"
          ) : (
            <div className="flex items-center justify-between">
              <h1>Group info</h1>
              {currentGroup.adminUID == currentUserDoc.uid ? (
                <Popconfirm
                  title="Terminate Group"
                  description="Are you sure you want to terminate this group?"
                  onConfirm={terminateGroup}
                  okButtonProps={{ loading: popconfirmBtnLoading }}
                >
                  <button className="text-white bg-red-600 rounded-2xl px-3 py-1">
                    Terminate Group
                  </button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="Leave Group"
                  description="Are you sure you want to Leave this group?"
                  placement="bottomRight"
                  onConfirm={leaveGroup}
                  okButtonProps={{ loading: popconfirmBtnLoading }}
                >
                  <button className="text-white bg-red-600 rounded-2xl px-3 py-1">
                    Leave Group
                  </button>
                </Popconfirm>
              )}
            </div>
          )
        }
        onClose={onClose}
        maskClosable={selectedMembersUids.length > 0 ? false : true}
        open={openProfileDrawer}
        placement={
          !currentContact?.uid &&
          ((currentGroup?.groupId &&
            currentGroup.adminUID == currentUserDoc.uid) ||
            !currentGroup?.groupId)
            ? "left"
            : "right"
        }
        width="400px"
        style={{ backgroundColor: "rgb(203 213 225)" }}
      >
        <div className="w-full flex flex-col items-center profile_drawer">
          <div className="h-48 w-48 relative rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-6xl roboto-font avatar">
            {!currentContact?.uid && !currentGroup?.groupId ? (
              selectedPhotoSrc || currentUserDoc?.profilePicture ? (
                <img
                  src={
                    !selectedPhotoSrc
                      ? currentUserDoc.profilePicture
                      : selectedPhotoSrc
                  }
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentUserDoc?.fullName?.charAt(0).toUpperCase()
              )
            ) : currentContact?.uid ? (
              currentContact?.profilePicture ? (
                <img
                  src={currentContact.profilePicture}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentContact?.fullName?.charAt(0).toUpperCase()
              )
            ) : selectedPhotoSrc || currentGroup?.profilePicture ? (
              <img
                src={
                  !selectedPhotoSrc
                    ? currentGroup.profilePicture
                    : selectedPhotoSrc
                }
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              currentGroup?.groupName?.charAt(0).toUpperCase()
            )}

            {uploading && (
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full flex justify-center items-center"
                style={{ backgroundColor: "rgba(107, 114, 128,0.5)" }}
              >
                <Spin />
              </div>
            )}

            {selectedPhotoSrc && !uploading && (
              <div className="absolute bottom-4 right-0 w-full h-auto flex justify-center">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-slate-300 mr-2"
                  onClick={() => setSelectedPhotoSrc("")}
                >
                  <FaXmark size={25} />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-950 ml-2">
                  <FaCheck
                    size={25}
                    className="text-blue-950"
                    onClick={profilePicture_change}
                  />
                </button>
              </div>
            )}
            {!currentContact?.uid &&
            ((currentGroup?.groupId &&
              currentGroup.adminUID == currentUserDoc.uid) ||
              !currentGroup?.groupId)
              ? !selectedPhotoSrc &&
                !uploading && (
                  <span
                    htmlFor="profile_picture"
                    className="cursor-pointer flex items-center justify-center absolute bottom-2 right-5 w-10 h-10 rounded-full bg-gray-400 text-blue-950"
                    style={{ transform: "rotate(-17deg)" }}
                  >
                    <label
                      htmlFor="profile_picture"
                      className="cursor-pointer mb-1"
                    >
                      <MdEdit size={25} />
                    </label>
                    <input
                      type="file"
                      id="profile_picture"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </span>
                )
              : null}
          </div>
          {!currentContact?.uid &&
          !uploading &&
          !selectedPhotoSrc &&
          ((currentGroup?.adminUID == currentUserDoc.uid &&
            currentGroup?.profilePicture) ||
            (currentUserDoc?.profilePicture && !currentGroup?.groupId)) ? (
            <button
              className="roboto-font mt-5 text-gray-700 text-base"
              onClick={removeProfilePicture}
            >
              Remove Profile Picture
            </button>
          ) : null}
          <div className="w-full mt-14">
            <h6 className="josefin-font text-gray-500 text-lg">
              {!currentContact?.uid && !currentGroup?.groupId
                ? "Your name"
                : currentContact?.uid
                ? "Contact name"
                : "Group Name"}
            </h6>
            <span className="flex">
              <input
                ref={nameInputRef}
                disabled={nameEditDisabled}
                value={nameInputValue}
                onChange={(e) => {
                  setNameInputValue(e.target.value);
                  setInputValidationMsg("");
                }}
                className={`mr-3 focus:outline-none ${
                  inputValidationMsg
                    ? "border-b-2 border-red-800"
                    : !nameEditDisabled && "border-b-2 border-blue-950"
                }`}
              />
              {!currentContact?.uid &&
              ((currentGroup?.groupId &&
                currentGroup.adminUID == currentUserDoc.uid) ||
                !currentGroup?.groupId) &&
              nameEditDisabled ? (
                <button style={{ transform: "rotate(-15deg)" }}>
                  <MdEdit
                    size={25}
                    className="text-blue-950"
                    onClick={() => {
                      setNameEditDisabled(false);
                      nameInputRef.current.focus();
                    }}
                  />
                </button>
              ) : (
                !currentContact?.uid &&
                ((currentGroup?.groupId &&
                  currentGroup.adminUID == currentUserDoc.uid) ||
                  !currentGroup?.groupId) && (
                  <>
                    <button>
                      <FaXmark
                        size={25}
                        className="text-gray-500 mr-3"
                        onClick={() => {
                          setNameEditDisabled(true);
                          setInputValidationMsg("");
                          if (!currentGroup?.groupId) {
                            setNameInputValue(currentUserDoc.fullName);
                          } else {
                            setNameInputValue(currentGroup.groupName);
                          }
                        }}
                      />
                    </button>
                    <button>
                      <FaCheck
                        size={25}
                        className="text-blue-950"
                        onClick={handleNameInputValidation}
                      />
                    </button>
                  </>
                )
              )}
            </span>
            {inputValidationMsg && (
              <p className="text-red-800 font-semibold text-md mb-2 mt-2">
                {inputValidationMsg}
              </p>
            )}
          </div>
          {currentGroup?.groupId && nonGroupMembers.length == 0 ? (
            <div className="w-full mt-8">
              <div className="flex items-center justify-between">
                <h6 className="josefin-font text-gray-500 text-lg">Members</h6>
                {currentGroup.adminUID == currentUserDoc.uid && (
                  <button
                    className="px-3 py-1 text-blue-950 border border-blue-950 rounded-3xl bg-transparent hover:bg-white roboto-font"
                    onClick={handleAddMember}
                  >
                    Add member
                  </button>
                )}
              </div>
              <ul>
                {sortedGroupMembers.map((member) => (
                  <li
                    key={member.uid}
                    className="flex items-center justify-between my-4"
                    onMouseEnter={() => setHoveredMember(member.uid)}
                    onMouseLeave={() =>
                      !hoveredMember && setHoveredMember(null)
                    }
                  >
                    <span className="flex items-center justify-between">
                      <div className="h-14 w-14 rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-2xl roboto-font">
                        {member?.profilePicture ? (
                          <img
                            src={member.profilePicture}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          member.fullName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="mx-2 text-xl font-semibold">
                        {member.uid == currentUserDoc.uid
                          ? "You"
                          : member.fullName.length > 15
                          ? `${member.fullName.slice(0, 18)}...`
                          : member.fullName}
                      </div>
                    </span>
                    {currentGroup.adminUID === currentUserDoc.uid &&
                      currentGroup.adminUID != member.uid &&
                      hoveredMember === member.uid && (
                        <Popconfirm
                          title="Remove Member"
                          description="Are you sure you want to remove this member from the group?"
                          onConfirm={() => removeMember(member.uid)}
                          onCancel={() => setHoveredMember(null)}
                          okButtonProps={{ loading: popconfirmBtnLoading }}
                        >
                          <MdDelete
                            size={25}
                            className="cursor-pointer ml-2 text-red-600"
                          />
                        </Popconfirm>
                      )}
                    {currentGroup.adminUID == member.uid && (
                      <span
                        className="mt-2 px-3 pt-1 box-border bg-gray-500 text-white rounded-xl josefin-font"
                        style={{ paddingBottom: "0.5px" }}
                      >
                        Admin
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : currentGroup?.groupId &&
            currentGroup.adminUID == currentUserDoc.uid &&
            nonGroupMembers.length > 0 ? (
            <div className="w-full h-auto mt-6">
              <h1 className="josefin-font text-gray-500 text-lg">Add member</h1>
              <Select
                mode="multiple"
                size="middle"
                allowClear={true}
                placeholder="Select Members"
                showSearch={false}
                className={`text-xl text-gray-600 mt-2 font-semibold josefin-font ${
                  false && "red_membersSelect_border"
                }`}
                style={{
                  width: "100%",
                }}
                onChange={(selectedMembers) => {
                  setSelectedMembersUids(selectedMembers.map((uid) => uid));
                }}
                dropdownStyle={{ zIndex: 2000 }}
                options={options}
              />

              <div className="flex items-center justify-around mt-4">
                <button
                  onClick={() => {
                    setNonGroupMembers([]);
                    setSelectedMembersUids([]);
                  }}
                  className="py-2 w-32 rounded-lg text-white bg-gray-500 roboto-font text-lg"
                >
                  Cancel
                </button>
                <button
                  disabled={
                    selectedMembersUids.length == 0 || addMemberBtnLoading
                  }
                  className="py-2 w-32 rounded-lg bg-blue-950 text-white ml-3 roboto-font text-lg"
                  onClick={addMember}
                >
                  {addMemberBtnLoading ? <Spin /> : "Add"}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full mt-6">
              <h6 className="josefin-font text-gray-500 text-lg">
                Email address
              </h6>
              <span className="flex">
                <input value={emailAdddress} disabled={true} />
              </span>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default ProfileDrawer;
