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
}) {
  const [nameEditDisabled, setNameEditDisabled] = useState(true);
  const [nameInputValue, setNameInputValue] = useState("");
  const [selectedPhotoSrc, setSelectedPhotoSrc] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  let nameInputRef = useRef();

  const nameEdit = async () => {
    await updateDoc(doc(db, "users", currentUserDoc.uid), {
      fullName: nameInputValue.trim(),
    });
  };

  const removeProfilePicture = async () => {
    await updateDoc(doc(db, "users", currentUserDoc.uid), {
      profilePicture: deleteField(),
    });
  };

  const profilePicture_change = () => {
    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${currentUserDoc.uid}`);
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
          await updateDoc(doc(db, "users", currentUserDoc.uid), {
            profilePicture: url,
          });
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
    setNameInputValue(currentUserDoc.fullName);
  }, [currentUserDoc]);

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
        title="Profile"
        onClose={onClose}
        open={openProfileDrawer}
        placement="left"
        width="400px"
        style={{ backgroundColor: "rgb(203 213 225)" }}
      >
        <div className="w-full flex flex-col items-center profile_drawer">
          <div className="h-48 w-48 relative rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-6xl roboto-font avatar">
            {selectedPhotoSrc || currentUserDoc?.profilePicture ? (
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
            )}
            {uploading && (
              <div className="absolute top-0 left-0 w-full h-full rounded-full flex justify-center items-center" style={{backgroundColor: 'rgba(107, 114, 128,0.5)'}}>
                  <Spin />
              </div>
            )}
            {selectedPhotoSrc && !uploading ? (
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
            ) : (
              !uploading && (
                <span
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
            )}
          </div>
          {currentUserDoc?.profilePicture && (
            <button
              className="roboto-font mt-5 text-gray-700 text-base"
              onClick={removeProfilePicture}
            >
              Remove Profile Picture
            </button>
          )}
          <div className="w-full mt-14">
            <h6 className="josefin-font text-gray-500 text-lg">Your name</h6>
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
              {nameEditDisabled ? (
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
                <>
                  <button>
                    <FaXmark
                      size={25}
                      className="text-gray-500 mr-3"
                      onClick={() => {
                        setNameEditDisabled(true);
                        setNameInputValue(currentUserDoc.fullName);
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
              )}
            </span>
          </div>
          <div className="w-full mt-6">
            <h6 className="josefin-font text-gray-500 text-lg">
              Email address
            </h6>
            <span className="flex">
              <input value={currentUserDoc.emailAddress} disabled={true} />
            </span>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default ProfileDrawer;
