import React from "react";
import MesssageSec from "../components/MesssageSec";
import ContactListSec from "../components/ContactListSec";

function ChatPage() {
  return (
    <div className="w-full min-h-screen	max-h-fit	flex bg-slate-400">
      <ContactListSec />
      <MesssageSec />
    </div>
  );
}

export default ChatPage;
