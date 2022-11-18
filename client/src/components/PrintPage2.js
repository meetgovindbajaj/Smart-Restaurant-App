import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
let trigger = false;
const PrintPage2 = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  // eslint-disable-next-line
  const [userData, setuserData] = useState({});
  let location = useLocation();
  let table = 0;
  let items = [{}];
  let cgst = 0;
  let date = "";
  let discount = 0;
  let invoice = 0;
  let kot = 0;
  let sgst = 0;
  let time = "";
  let total = 0;
  let cg = 0;
  let sg = 0;
  let dis = 0;
  let net = 0;
  if (location.state) {
    table = Number(location.state.table);
    items = location.state.items;
    cgst = Number(location.state.cgst);
    date = location.state.date;
    discount = Number(location.state.discount);
    invoice = Number(location.state.invoice);
    kot = Number(location.state.kot);
    sgst = Number(location.state.sgst);
    time = location.state.time;
    total = Number(location.state.total);
    // console.log(location.list, a, quantity, item);
    dis = (Number(discount) / 100) * Number(total).toFixed(2);
    cg = (cgst / 100) * total;
    cg = Number(Math.floor(cg * 100) / 100);
    cg = Number(cg.toFixed(2));
    sg = (sgst / 100) * total;
    sg = Number(Math.floor(sg * 100) / 100);
    sg = Number(sg.toFixed(2));
    net = total + cg + sg - dis;
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
    history.push(location.state.pathname);
    window.location.reload();
  } else if (table === 0) {
    trigger = false;
    if (location.state) {
      history.push(location.state.pathname);
    } else {
      history.push("/adminuseraccess");
    }
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
          fontSize: "smaller",
        }}
      >
        <div>||OM||</div>
        <div style={{ fontWeight: "900", fontSize: "1.2em" }}>
          {dataa[0].title}
        </div>
        <div>
          {"("}
          {dataa[0].category}
          {")"}
        </div>
        <div>{dataa[0].address}</div>
        <div>GST NO.: {dataa[0].gst}</div>
        <div>PHONE NO.: {dataa[0].phone}</div>
        <div
          style={{
            borderTop: "2px dashed black",
            height: "1px",
          }}
        ></div>
        <div>
          <div
            className="row"
            style={{
              borderTop: "2px dashed black",
              fontWeight: "bolder",
            }}
          >
            <div className="col col-5" style={{ textAlign: "start" }}>
              Date
            </div>
            <div className="col col-3" style={{ textAlign: "center" }}>
              Table
            </div>
            <div className="col col-4" style={{ textAlign: "end" }}>
              Invoice No.
            </div>
          </div>
          <div
            className="row"
            style={{
              borderBottom: "1px dashed black",
            }}
          >
            <div
              className="col col-5"
              style={{
                textAlign: "start",
                fontSize: "smaller",
                fontWeight: "bold",
              }}
            >
              {date} {time}
            </div>
            <div className="col col-3" style={{ textAlign: "center" }}>
              {table}
            </div>
            <div className="col col-4" style={{ textAlign: "end" }}>
              {invoice}
            </div>
          </div>
        </div>
        <div>
          <div
            className="row"
            style={{
              borderBottom: "1px dashed black",
              borderTop: "1px dashed black",
              fontWeight: "bolder",
            }}
          >
            <div className="col col-6" style={{ textAlign: "start" }}>
              Description
            </div>
            <div className="col col-1" style={{ textAlign: "start" }}>
              Qty
            </div>
            <div className="col col-2" style={{ textAlign: "end" }}>
              Rate
            </div>
            <div className="col col-3" style={{ textAlign: "end" }}>
              Amount
            </div>
          </div>
          {items.map((i) => {
            return (
              <div className="row">
                <div
                  className="col col-6"
                  style={{ textAlign: "start", textTransform: "capitalize" }}
                >
                  {i.item}
                </div>
                <div className="col col-1" style={{ textAlign: "center" }}>
                  {i.quantity}
                </div>
                <div className="col col-2" style={{ textAlign: "end" }}>
                  {Number(i.price).toFixed(2)}
                </div>
                <div className="col col-3" style={{ textAlign: "end" }}>
                  {(Number(i.price) * Number(i.quantity)).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "left", borderTop: "1px dashed black" }}>
          Kot No.:{kot}
        </div>
        <div
          style={{
            borderBottom: "1px dashed black",
          }}
        >
          <div className="row">
            <div className="col col-2"></div>
            <div className="col col-5" style={{ fontWeight: "bolder" }}>
              Gross Amount
            </div>
            <div className="col col-2"></div>
            <div className="col col-3">{Number(total).toFixed(2)}</div>
          </div>
          <div className="row">
            <div className="col col-2"></div>
            <div className="col col-5" style={{ fontWeight: "bolder" }}>
              CGST @{cgst}%
            </div>
            <div className="col col-2"></div>
            <div className="col col-3">{Number(cg).toFixed(2)}</div>
          </div>
          <div className="row">
            <div className="col col-2"></div>
            <div className="col col-5" style={{ fontWeight: "bolder" }}>
              SGST @{sgst}%
            </div>
            <div className="col col-2"></div>
            <div className="col col-3">{Number(sg).toFixed(2)}</div>
          </div>
        </div>
        <div
          style={{
            borderBottom: "1px dashed black",
          }}
        >
          <div
            className="row"
            style={{ fontWeight: "bolder", fontSize: "1.15em" }}
          >
            <div className="col col-2"></div>
            <div className="col col-5">Net Amount</div>
            <div className="col col-2">₹</div>
            <div className="col col-3">{Number(net).toFixed(2)}</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            margin: "0",
            padding: "0",
            paddingBottom: "20px",
          }}
        >
          <div>Thank You, Visit Again</div>
          <div>Subject to Jodhpur Jurisdiction</div>
          <div>SAC CODE: 9963</div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default PrintPage2;
