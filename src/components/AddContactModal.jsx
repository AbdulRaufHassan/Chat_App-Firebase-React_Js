import React from "react";
import { Modal, message } from "antd";
import "../css/chatPage.css";
import { useForm } from "react-hook-form";
import { emailRegex } from "../contants";
import { auth, collection, db, getDocs } from "../config";

function AddContactModal({
  openModal,
  setOpenModal,
  allContacts,
  setAllContacts,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addContact = async ({ contactEmail }) => {
    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach((user) => {
      if (
        user.data().emailAddress === contactEmail &&
        user.data().uid != auth.currentUser.uid
      ) {
        setOpenModal(false);
        setAllContacts([...allContacts, user.data()]);
      } else {
        message.error({
          type: "error",
          content: "User not exist",
        });
      }
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    reset();
  };

  return (
    <>
      <Modal open={openModal} footer={null} onCancel={closeModal}>
        <div>
          <h1 className="roboto-font text-blue-950 font-semibold text-2xl">
            Add Contact
          </h1>
          <form onSubmit={handleSubmit(addContact)}>
            <input
              type="text"
              {...register("contactEmail", {
                required: "Required",
                pattern: {
                  value: emailRegex,
                  message: "Invalid email address",
                },
              })}
              className={`w-full p-3 mt-4 mb-2 bg-white rounded-xl text-xl box-border text-gray-600 placeholder:text-gray-500 focus:outline-none josefin-font autofill_input_bg_white ${
                errors.contactEmail && "border-2 border-red-800"
              }`}
              placeholder="Enter Contact Email Address"
            />
            {errors.contactEmail && (
              <h6 className="text-red-800 font-semibold text-lg">
                {errors.contactEmail.message}
              </h6>
            )}
            <div className="w-full flex justify-end mt-5">
              <button
                className="py-2 px-4 rounded-lg text-white bg-gray-500 roboto-font text-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded-lg bg-blue-950 text-white ml-3 roboto-font text-lg"
              >
                Add Contact
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default AddContactModal;
