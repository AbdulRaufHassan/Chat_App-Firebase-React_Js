import { Modal, Select } from "antd";
import React, { useState } from "react";
import "../css/chatPage.css";
import { useForm } from "react-hook-form";
import { whiteSpaceRegex } from "../contants";

function CreateGroupModal({ openGroupModal, setOpenGroupModal, allContacts }) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const closeModal = () => {
    clearErrors();
    setOpenGroupModal(false);
  };

  const options = allContacts.map((contact) => ({
    value: contact.uid,
    label: (
      <div className="flex items-center">
        <div className="h-9 w-9 rounded-full bg-blue-950 text-slate-300 flex items-center justify-center font-semibold text-lg roboto-font">
          {contact.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="mx-2 text-xl font-semibold">{contact.fullName}</div>
      </div>
    ),
  }));

  const handleChange = (value) => {
    console.log(value);
  };

  const createGroup = () => {};

  return (
    <Modal open={openGroupModal} footer={null} onCancel={closeModal}>
      <div>
        <h1 className="roboto-font text-blue-950 font-semibold text-2xl">
          Create Group
        </h1>
        <form onSubmit={handleSubmit(createGroup)}>
          <input
            type="text"
            {...register("groupName", {
              required: "Required",
              minLength: {
                value: 4,
                message: "Group name must be at least 4 characters long",
              },
              maxLength: {
                value: 25,
                message: "Group name should not exceed 25 characters",
              },
              pattern: {
                value: whiteSpaceRegex,
                message: "Group Name should not start or end with a whitespace",
              },
            })}
            className={`w-full p-3 mt-4 mb-1 bg-white rounded-xl text-xl box-border text-gray-600 placeholder:text-gray-500 focus:outline-none josefin-font autofill_input_bg_white ${
              errors.groupName
                ? "border-2 border-red-800 focus:border-2 focus:border-red-800"
                : "focus:border-2 focus:border-gray-500"
            }`}
            placeholder="Enter Group Name"
          />
          {errors.groupName && (
            <h6 className="text-red-800 font-semibold text-lg mb-2">
              {errors.groupName.message}
            </h6>
          )}
          <Select
            mode="multiple"
            size="middle"
            placeholder="Select Members"
            showSearch={false}
            onChange={handleChange}
            className={`text-xl text-gray-600 mt-3 font-semibold josefin-font ${errors.selectedContacts && 'red_membersSelect_border'}`}
            style={{
              width: "100%",
              height: "60px",
            }}
            options={options}
            {...register("selectedContacts", {
              validate: {
                minContacts: (value) =>
                  (value && value.length >= 2) || "Select at least 2 members",
              },
            })}
          />
          {errors.selectedContacts && (
            <h6 className="text-red-800 font-semibold text-lg mt-1">
              {errors.selectedContacts.message}
            </h6>
          )}
          <div className="w-full flex justify-end mt-5">
            <button
              type="reset"
              className="py-2 px-4 rounded-lg text-white bg-gray-500 roboto-font text-lg"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 w-32 rounded-lg bg-blue-950 text-white ml-3 roboto-font text-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateGroupModal;
