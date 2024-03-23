import { Drawer } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { db, updateDoc, doc } from "../config";

function ProfileDrawer({
  openProfileDrawer,
  setOpenProfileDrawer,
  currentUserDoc,
}) {
  const [nameEditDisabled, setNameEditDisabled] = useState(true);
  const [nameInputValue, setNameInputValue] = useState("");
  let nameInputRef = useRef();

  const nameEdit = async () => {
    await updateDoc(doc(db, "users", currentUserDoc.uid), {
      fullName: nameInputValue.trim(),
    });
  };

  const onClose = () => {
    setNameEditDisabled(true);
    setOpenProfileDrawer(false);
  };

  useEffect(() => {
    setNameInputValue(currentUserDoc.fullName);
  }, [currentUserDoc]);

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
          <div className="h-48 w-48 relative rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-6xl roboto-font">
            {currentUserDoc?.fullName?.charAt(0).toUpperCase()}
            <span
              className="cursor-pointer flex items-center justify-center absolute bottom-2 right-5 w-10 h-10 rounded-full bg-gray-400 text-blue-950"
              style={{ transform: "rotate(-17deg)" }}
            >
              <label htmlFor="profile_picture" className="cursor-pointer mb-1">
                <MdEdit size={25} />
              </label>
              <input type="file" id="profile_picture" className="hidden" />
            </span>
          </div>
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
                      nameInputRef.current.focus();
                      setNameEditDisabled(false);
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
