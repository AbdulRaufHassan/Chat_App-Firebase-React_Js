import { Modal } from "antd";
import React from "react";
import "../css/chatPage.css";
import { useForm } from "react-hook-form";
import { emailRegex } from "../contants";

function CreateGroupModal({ openGroupModal, setOpenGroupModal }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const closeModal = () => {
    setOpenGroupModal(false);
    reset();
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
            className={`w-full p-3 mt-4 mb-2 bg-white rounded-xl text-xl box-border text-gray-600 placeholder:text-gray-500 focus:outline-none josefin-font autofill_input_bg_white ${
              errors.contactEmail
                ? "border-2 border-red-800 focus:border-2 focus:border-red-800"
                : "focus:border-2 focus:border-gray-500"
            }`}
            placeholder="Enter Group Name"
          />
          {errors.contactEmail && (
            <h6 className="text-red-800 font-semibold text-lg">
              {errors.contactEmail.message}
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
              Create Group
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateGroupModal;
