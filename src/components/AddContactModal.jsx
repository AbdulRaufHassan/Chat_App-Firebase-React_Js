import React, { useState } from "react";
import { Modal, Spin, message } from "antd";
import "../css/chatPage.css";
import { useForm } from "react-hook-form";
import { emailRegex } from "../contants";
import {
  arrayUnion,
  auth,
  collection,
  db,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "../config";

function AddContactModal({
  currentUserDoc,
  openModal,
  setOpenModal,
  setLoading,
}) {
  const [btnLoading, setBtnLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const closeModal = () => {
    setOpenModal(false);
    reset();
  };

  const addContact = async ({ contactEmail }) => {
    message.destroy();
    setBtnLoading(true);
    if (contactEmail === currentUserDoc.emailAddress) {
      message.error({
        type: "error",
        content: "You cannot add yourself as a contact",
        duration: 1,
      });
    } else {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("emailAddress", "==", contactEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        if (currentUserDoc.contacts.includes(userDoc.data().uid)) {
          message.info({
            type: "info",
            content: "Contact already exists",
            duration: 1,
          });
          setBtnLoading(false);
        } else {
          const currentUserRef = doc(db, `users/${currentUserDoc.uid}`);
          await updateDoc(currentUserRef, {
            contacts: arrayUnion(userDoc.data().uid),
          });
          message.success({
            type: "success",
            content: "Contact added successfully",
            duration: 1,
          });
          setLoading(true);
          closeModal();
        }
      } else {
        message.error({
          type: "error",
          content: "User does not exist",
          duration: 1,
        });
      }
    }
    setBtnLoading(false);
  };

  return (
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
              errors.contactEmail
                ? "border-2 border-red-800 focus:border-2 focus:border-red-800"
                : "focus:border-2 focus:border-gray-500"
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
              type="reset"
              className="py-2 px-4 rounded-lg text-white bg-gray-500 roboto-font text-lg"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={btnLoading}
              className="py-2 w-32 rounded-lg bg-blue-950 text-white ml-3 roboto-font text-lg"
            >
              {btnLoading ? <Spin /> : "Add Contact"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddContactModal;
