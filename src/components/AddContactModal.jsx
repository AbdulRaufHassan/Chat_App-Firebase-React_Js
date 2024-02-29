import React, { useState } from "react";
import { Modal } from "antd";
import { MdPersonAddAlt1 } from "react-icons/md";
import "../css/chatPage.css";
import { useForm } from "react-hook-form";
import { emailRegex } from "../contants";
import { auth, collection, db, getDocs } from "../config";

function AddContactModal({ allContacts, setAllContacts }) {
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  const addContact = async ({ contactEmail }) => {
    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach((user) => {
      if (
        user.data().emailAddress === contactEmail &&
        user.data().uid != auth.currentUser.uid
      ) {
        console.log(user.data());
        setAllContacts([...allContacts, user.data()]);
      }
    });
    reset();
  };

  const closeModal = () => {
    clearErrors();
    reset();
    setOpenModal(false);
  };

  return (
    <>
      <button
        className="flex flex-col items-center"
        onClick={() => setOpenModal(true)}
      >
        <MdPersonAddAlt1 className="text-blue-950 text-3xl" />
        <h6 className="text-xs text-blue-950 josefin-font">Add Contact</h6>
      </button>

      <Modal open={openModal} footer={null} onCancel={closeModal}>
        <div>
          <h1 className="roboto-font text-blue-950 font-semibold text-2xl">
            Add Contact
          </h1>
          <form onSubmit={handleSubmit(addContact)}>
            <input
              type="email"
              {...register("contactEmail", {
                required: "Required",
                pattern: {
                  value: emailRegex,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-3 mt-4 border border-gray-500 bg-transparent rounded-xl text-xl box-border text-gray-600 placeholder:text-gray-500 focus:outline-none josefin-font"
              placeholder="Enter Contact Email Address"
            />
            {errors.contactEmail && (
              <h6 className="text-red-800 mt-2 font-medium">
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
                onClick={addContact}
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
