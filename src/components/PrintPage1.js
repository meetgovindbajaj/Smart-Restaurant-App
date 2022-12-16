// ADMIN PRINT MODULE 2
import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "./css/app.css";

let trigger = false;
const PrintPage1 = () => {
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  // eslint-disable-next-line
  const [userData, setuserData] = useState({});
  let location = useLocation();
  let table = 0;
  let items = [{}];
  if (location.state) {
    table = location.state.table;
    items = location.state.items;
  }

  const callAboutPage = async () => {
    try {
      const res = await fetch("/restroInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setuserData(data);
      if (!res.status === 200) {
        history.push("/Adminlogin");
        const error = new Error(res.error);
        throw error;
      } else {
        dispatch({ type: "ADMIN", payload: true });
      }
    } catch (err) {
      history.push("/Adminlogin");
      console.log(err);
    }
  };
  callAboutPage();
  let dataa = [];
  Object.assign(dataa, userData);
  console.log(dataa);
  if (trigger === true && table !== 0) {
    window.print();
    trigger = false;
    history.push("/AdminUserAccess");
    window.location.reload();
  } else if (table === 0) {
    trigger = false;
    history.push("/AdminUserAccess");
    window.location.reload();
  }
  if (dataa.length !== 0) {
    trigger = true;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          overflow: "hidden",
          paddingBottom: "15px",
        }}
      >
        <div style={{ fontWeight: "bolder" }}>{dataa[0].title}</div>
        <div>
          {"("}
          {dataa[0].category}
          {")"}
        </div>
        <div style={{ borderBottom: "1px solid black" }}>{dataa[0].phone}</div>
        <div
          style={{
            borderBottom: "1px solid black",
            borderTop: "1px bolid black",
            fontWeight: "bold",
          }}
        >
          Table- {table}
        </div>
        <div>
          <div
            className="row"
            style={{ borderBottom: "1px solid black", fontWeight: "bold" }}
          >
            <div className="col-8" style={{ textAlign: "start" }}>
              Description
            </div>
            <div className="col-4">Qty</div>
          </div>
          {items.map((i) => {
            return (
              <div className="row">
                <div className="col-8" style={{ textAlign: "start" }}>
                  {i.title}
                </div>
                <div className="col-4">{i.quantity}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default PrintPage1;
