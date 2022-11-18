import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "./css/app.css";

let trigger = false;
const PrintPage = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  // eslint-disable-next-line
  const [userData, setuserData] = useState({});
  let location = useLocation();
  let a=[0,""];
  let quantity=0;
  let item="";
  if(location.list){
    a = location.list[1].split("x");
    quantity = Number(a[0]);
    item = a[1];
    // console.log(location.list, a, quantity, item);
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
  if (trigger === true && quantity!==0) {
    window.print();
    trigger=false;
    history.push("/AdminDashboard");
    window.location.reload();
  }else if(quantity===0){
    trigger=false;
    history.push("/AdminDashboard");
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
          paddingBottom:"15px"
        }}
      >
        {/* <div>||OM||</div> */}
        <div style={{fontWeight:"bolder" }}>{dataa[0].title}</div>
        <div>
          {"("}
          {dataa[0].category}
          {")"}
        </div>
        {/* <div>{dataa[0].address}</div>
        <div>GST NO.: {dataa[0].gst}</div> */}
        <div style={{ borderBottom: "1px solid black" }}>{dataa[0].phone}</div>
        <div
          style={{
            borderBottom: "1px solid black",
            borderTop: "1px bolid black",fontWeight:"bold" 
          }}
        >
          Table- {location.list[0]}
        </div>
        <div>
          <div className="row" style={{ borderBottom: "1px solid black",fontWeight:"bold" }}>
            <div className="col-8" style={{ textAlign:"start" }}>Description</div>
            <div className="col-4">Qty</div>
          </div>
          <div className="row">
            <div className="col-8" style={{ textAlign:"start" }}>{item}</div>
            <div className="col-4">{quantity}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default PrintPage;
