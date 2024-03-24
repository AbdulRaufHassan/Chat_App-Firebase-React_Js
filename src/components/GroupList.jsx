import { Spin } from "antd";
import React from "react";

function GroupList({
  groupListLoading,
  allGroups,
  setCurrentGroup,
  currentGroup,
  currentUserDoc,
  allGroupMembers,
}) {
  return (
    <>
      {groupListLoading ? (
        <div className="w-full flex items-center justify-center groups_loading">
          <Spin size="large" />
        </div>
      ) : allGroups.length ? (
        <ul className="groups_list">
          {allGroups.map((group) => {
            let groupIdMatch = currentGroup.groupId == group.groupId;
            const member = {}
            return (
              <li
                key={group.groupId}
                className={`w-full h-20 flex items-center pl-2 pr-4 box-border cursor-pointer ${
                  groupIdMatch ? "bg-slate-300" : "hover:bg-slate-600"
                }`}
                onClick={() => setCurrentGroup(group)}
              >
                <div
                  className={`h-14 w-14 rounded-full flex items-center justify-center roboto-font text-2xl font-semibold ${
                    groupIdMatch
                      ? "bg-blue-950 text-slate-300"
                      : "bg-slate-300 text-blue-950"
                  }`}
                >
                  {group.groupName?.charAt(0).toUpperCase()}
                </div>
                <div
                  className={`ml-4 h-full border-t ${
                    groupIdMatch ? "border-slate-300" : "border-slate-600"
                  } flex justify-between flex-1`}
                >
                  <div className="flex-1 flex flex-col justify-center">
                    <h1
                      className={`roboto-font font-semibold ${
                        groupIdMatch ? "text-blue-950" : "text-slate-300"
                      } text-xl tracking-wider`}
                    >
                      {group.groupName}
                    </h1>
                    {group.lastMessage && (
                      <p
                        className={`josefin-font whitespace-nowrap ${
                          groupIdMatch ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {group.lastMessage.lastMessage.length > 25
                          ? ` ${group.lastMessage.lastMessage.slice(0, 26)}...`
                          : ` ${group.lastMessage.lastMessage}`}
                      </p>
                    )}
                  </div>
                  {group.lastMessage?.sendTime && (
                    <div className="w-auto mt-4">
                      <span
                        className={`inline-block ${
                          groupIdMatch ? "text-gray-500" : "text-gray-400"
                        } roboto-font`}
                      >
                        {new Date(
                          group.lastMessage?.sendTime?.toDate()
                        ).getDate() == new Date().getDate()
                          ? new Date(
                              group.lastMessage?.sendTime?.toDate()
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : new Date(
                              group.lastMessage?.sendTime?.toDate()
                            ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="w-4/5 mx-auto flex flex-col justify-center items-center text-xl josefin-font text-slate-300 zeroContactMsg">
          <p>You have no groups</p>
        </div>
      )}
    </>
  );
}

export default GroupList;
