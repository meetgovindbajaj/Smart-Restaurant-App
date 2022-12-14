import React, { useState } from "react";
import { NavLink } from "react-router-dom";
function AdminMessage() {
  const [mess, setMess] = useState({
    Messages: [],
  });
  const userRequests = async () => {
    try {
      const res = await fetch("https://royalmadrasiserver.vercel.app/Message", {
        method: "GET",
        headers: {"Origin":"https://royalmadrasi.vercel.app/",
          "Content-Type": "application/json",
        },credentials: 'include'
      });
      const data = await res.json();
      setMess({ Messages: data });
    } catch (err) {
      console.log(err);
    }
  };
  userRequests();
  const deleteMessage = async () => {
    try {
      const res = await fetch("https://royalmadrasiserver.vercel.app/Delete", {
        method: "GET",
        headers: {"Origin":"https://royalmadrasi.vercel.app/",
          "Content-Type": "application/json",
        },credentials: 'include'
      });
      await res.json();
    } catch (err) {
      console.log(err);
    }
  };
  const deleteItem = async (table, message) => {
    const res = await fetch(`https://royalmadrasiserver.vercel.app/Message/Delete`, {
      method: "POST",
      headers: {"Origin":"https://royalmadrasi.vercel.app/",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table,
        message,
      }),credentials: 'include'
    });
    await res.json();
    document.getElementById("mssgDel").checked = false;
  };
  let but;

  return (
    <>
      <div className="message-notification">Notifications</div>
      <div className="message-container-box">
        {mess.Messages.map((message) => {
          but = message.message;
          return (
            <div className="message-container">
              <p className="message row">
                <div
                  title={message.message}
                  className="col-10"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                  }}
                >
                  <input
                    id="mssgDel"
                    type={"checkbox"}
                    onClick={() => deleteItem(message.table, message.message)}
                  ></input>{" "}
                  Table-{message.table}: {message.message}
                </div>
                <div className="col-2">
                  <NavLink
                    to={{
                      pathname: "/printpage",
                      list: [message.table, message.message],
                    }}
                  >
                    <img
                      alt=""
                      width={15}
                      height={15}
                      src="https://img.icons8.com/ios-glyphs/50/000000/print.png"
                    />
                  </NavLink>
                </div>
              </p>
            </div>
          );
        })}
      </div>
      <div className="message-delete">
        {but ? (
          <button
            className="message-delete-button"
            onClick={() => deleteMessage()}
          >
            X
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default AdminMessage;
