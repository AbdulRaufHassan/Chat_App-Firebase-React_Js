import { Drawer, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
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
} from "../config/index.js";

function ProfileDrawer({
  openProfileDrawer,
  setOpenProfileDrawer,
  currentUserDoc,
  currentContact,
  currentGroup,
  allGroupMembers,
  setCurrentGroup,
}) {
  const [nameEditDisabled, setNameEditDisabled] = useState(true);
  const [nameInputValue, setNameInputValue] = useState("");
  const [emailAdddress, setEmailAddress] = useState("");
  const [selectedPhotoSrc, setSelectedPhotoSrc] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  let nameInputRef = useRef();

  const nameEdit = async () => {
    if (!currentGroup?.groupId) {
      await updateDoc(doc(db, "users", currentUserDoc.uid), {
        fullName: nameInputValue.trim(),
      });
    } else {
      await updateDoc(doc(db, "groups", currentGroup.groupId), {
        groupName: nameInputValue.trim(),
      });
      setCurrentGroup({ ...currentGroup, groupName: nameInputValue.trim() });
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

  useEffect(() => {
    if (!currentContact?.uid && !currentGroup?.groupId) {
      setNameInputValue(currentUserDoc.fullName);
      setEmailAddress(currentUserDoc.emailAddress);
    } else if (currentContact.uid) {
      setNameInputValue(currentContact.fullName);
      setEmailAddress(currentContact.emailAddress);
    } else {
      setNameInputValue(currentGroup.groupName);
      setEmailAddress("");
    }
  }, [currentUserDoc, currentGroup, currentContact]);

  const onClose = () => {
    setNameEditDisabled(true);
    setOpenProfileDrawer(false);
  };

  useEffect(() => {
    if (!nameEditDisabled && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [nameEditDisabled]);

  return (
    <>
      <Drawer
        title={
          !currentContact?.uid && !currentGroup?.groupId
            ? "Profile"
            : currentContact.uid
            ? "Contact info"
            : "Group info"
        }
        onClose={onClose}
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
                  htmlFor="profile_picture"  className="cursor-pointer flex items-center justify-center absolute bottom-2 right-5 w-10 h-10 rounded-full bg-gray-400 text-blue-950"
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
                placeholder="Edit your full name"
                onChange={(e) => setNameInputValue(e.target.value)}
                className={`mr-3 focus:outline-none ${
                  !nameEditDisabled && "border-b-2 border-blue-950"
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
                        onClick={() => {
                          nameEdit();
                          setNameEditDisabled(true);
                        }}
                      />
                    </button>
                  </>
                )
              )}
            </span>
          </div>
          {currentGroup?.groupId ? (
            <div className="w-full mt-6">
              <h6 className="josefin-font text-gray-500 text-lg">Members</h6>
              <ul>
                {allGroupMembers.map((member) => (
                  <div
                    key={member.uid}
                    className="flex items-center justify-between my-4"
                  >
                    <span className="flex items-center">
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
                          : member.fullName}
                      </div>
                    </span>
                    {currentGroup.adminUID == member.uid && (
                      <span
                        className="mt-2 px-3 pt-1 box-border bg-blue-950 text-slate-300 rounded-xl josefin-font"
                        style={{ paddingBottom: "0.5px" }}
                      >
                        Admin
                      </span>
                    )}
                  </div>
                ))}
              </ul>
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
