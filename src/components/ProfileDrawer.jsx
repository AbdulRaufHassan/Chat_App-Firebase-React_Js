import { Drawer } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

function ProfileDrawer({
  openProfileDrawer,
  setOpenProfileDrawer,
  currentUserDoc,
}) {
  const [nameEditDisabled, setNameEditDisabled] = useState(true);
  const [aboutEditDisabled, setAboutEditDisabled] = useState(true);
  const [nameInputValue, setNameInputValue] = useState("");
  const [aboutInputValue, setAboutInputValue] = useState("");
  let nameInputRef = useRef();
  let aboutInputRef = useRef();

  const onClose = () => {
    setNameEditDisabled(true);
    setAboutEditDisabled(true);
    setOpenProfileDrawer(false);
  };

  useEffect(() => {
    setNameInputValue(currentUserDoc.fullName);
    setAboutInputValue(currentUserDoc.about);
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
          <div className="h-48 w-48 rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-6xl roboto-font">
            {currentUserDoc?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="w-full mt-14">
            <h6 className="josefin-font text-gray-500 text-lg">Your name</h6>
            <span className="flex">
              <input
                disabled={nameEditDisabled}
                value={nameInputValue}
                onChange={(e) => setNameInputValue(e.target.value)}
                className="focus:outline-none focus:border-b-2 focus:border-blue-950"
              />
              {nameEditDisabled ? (
                <button>
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
                    <FaCheck size={25} className="text-blue-950" />
                  </button>
                </>
              )}
            </span>
          </div>
          <div className="w-full my-6">
            <h6 className="josefin-font text-gray-500 text-lg">
              Email address
            </h6>
            <span className="flex">
              <input value={currentUserDoc.emailAddress} disabled={true} />
            </span>
          </div>
          <div className="w-full">
            <h6 className="josefin-font text-gray-500 text-lg">About</h6>
            <span className="flex">
              <input
                value={aboutInputValue}
                disabled={aboutEditDisabled}
                placeholder="Enter your about"
                onChange={(e) => setAboutInputValue(e.target.value)}
              />
              {aboutEditDisabled ? (
                <button>
                  <MdEdit
                    size={25}
                    className="text-blue-950"
                    onClick={() => {
                      aboutInputRef.current.focus();
                      setAboutEditDisabled(false);
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
                        setAboutEditDisabled(true);
                        setAboutInputValue(currentUserDoc.about);
                      }}
                    />
                  </button>
                  <button>
                    <FaCheck size={25} className="text-blue-950" />
                  </button>
                </>
              )}
            </span>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default ProfileDrawer;
