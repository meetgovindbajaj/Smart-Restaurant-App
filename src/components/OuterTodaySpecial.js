import React, { useState, useContext } from "react";
import { UserContext } from "../App";
import "../components/css/app.css";
import {useLocation} from 'react-router-dom'

let loader=true;
export default function OuetrTodaySpecial() {
  let location=useLocation();
  // console.log(location.state.loader);
  if(location.state){
    if(location.state.loader){
      loader=true;
      location.state.loader=false;
    }
  }
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [userData, setuserData] = useState({});

  const callAboutPage = async () => {
    try {
      const res = await fetch("/TodaySpecial", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setuserData(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      } else {
        loader=false;
        dispatch({ type: "ADMIN", payload: true });
      }
    } catch (err) {
      console.log(err);
    }
  };
  callAboutPage();
  let daata = [];
  Object.assign(daata, userData);
  function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      if (sortOrder === -1) {
        return b[property].toString().localeCompare(a[property]);
      } else {
        return a[property].toString().localeCompare(b[property]);
      }
    };
  }
  daata.sort(dynamicSort("title"));
  return (loader?<div
    className="menu-body-1"
    style={{ position: "relative", background: "black" }}
    ><div class="loader"></div></div>:
    <>
      <div className="menu-container">
        {daata.map((currItem) => {
          return (
            <div className="menu-box">
              <div className="menu-image-container">
                <img
                  loading="lazy"
                  src={currItem.img}
                  alt="jsx-a11y/alt-text"
                  className="menu-image"
                />
              </div>
              <p className="menu-box-body">
                <div className="menu-box-title">
                  <h5 className="card-title" style={{ fontWeight: "bolder" }}>
                    {currItem.title}
                  </h5>
                </div>
                <div
                  className="container-fluid menu-box-description"
                  style={{ color: "silver" }}
                >
                  <>{currItem.description}</>
                </div>
                <h5>
                  Price:
                  <span style={{ color: "greenyellow" }}>
                    {" "}
                    {currItem.price} INR
                  </span>
                </h5>
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
