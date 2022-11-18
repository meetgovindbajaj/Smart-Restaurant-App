import React, { useState, useContext, useEffect, useRef } from "react";
// eslint-disable-next-line
import { ToastContainer, toast } from "react-toastify";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import AdminUserMenu from "./AdminUserMenu";
import { tab } from "./AdminUserMenu";
import { useLocation } from "react-router-dom";
import AdminInvoiceMenu from "./AdminInvoiceMenu";
let loader = true;
let x = [];
x = document.cookie.split("=");
let disc = false;
const AdminInvoiceEdit = (props) => {
  let i = {};
  let location = useLocation();
  // console.log(location.state.loader);
  if (location.state) {
    loader = true;
    location.state.loader = false;
    if (location.state.list) {
      i = location.state.list;
      disc = true;
      document.cookie = `invoice=${i.invoiceNumber}`;
    }
  }
  const [menuData, setMenuData] = useState({});
  const [todayData, setTodayData] = useState({});
  const [userData, setUserData] = useState({});
  const getData = async () => {
    try {
      const res = await fetch(`/invoiceinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoId: disc ? i.invoiceNumber : x[1],
        }),
      });
      const data = await res.json();
      if (data.status === 201) {
        setUserData(data.data);
      }

      if (data.status === 400) {
        toast.error("Some Error Occured!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   useEffect(() => {
  getData();
  // eslint-disable-next-line
  //   }, []);

  let dataa = [];
  Object.assign(dataa, userData);
  if (dataa.invoiceNumber) {
    loader = false;
  }
  //calculate net total
  let cg = 0,
    sg = 0,
    dis = 0,
    t = 0,
    a = [],
    t1,
    tx,
    n;
  if (dataa) {
    cg = (dataa.cgst / 100) * dataa.total;
    cg = Number(Math.floor(cg * 100) / 100);
    cg = Number(cg.toFixed(2));
    sg = (dataa.sgst / 100) * dataa.total;
    sg = Number(Math.floor(sg * 100) / 100);
    sg = Number(sg.toFixed(2));
    dis = (dataa.discount / 100) * dataa.total;
    t = dataa.total + cg + sg - dis;
    t = Math.floor(t * 100) / 100;
    t = t.toFixed(2);
    //time 24=>12
    if (dataa.time) {
      a = dataa.time.split(":");
      t1 = a[0] % 12;
      tx = a[0] > 12 ? "PM" : "AM";
      n = `${t1 < 10 ? "0" + t1 : t1}:${a[1]} ${tx}`;
    }
  }
  const callAboutPage1 = async () => {
    try {
      const res1 = await fetch("/adminMenuspecial", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data1 = await res1.json();
      setMenuData(data1[0]);
      setTodayData(data1[1]);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    callAboutPage1();
    // eslint-disable-next-line
  }, []);

  let adminMenu = [],
    adminSpecial = [];
  Object.assign(adminMenu, menuData);
  Object.assign(adminSpecial, todayData);
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
  adminMenu.sort(dynamicSort("title"));
  adminMenu.sort(dynamicSort("category"));
  adminSpecial.sort(dynamicSort("title"));
  let category = [];
  adminMenu.map((i) => {
    if (category.length === 0) {
      category.push(i.category);
    } else {
      let check = false;
      for (let j = 0; j < category.length; j++) {
        if (category[j] === i.category) {
          check = true;
        }
      }
      if (check === false) {
        category.push(i.category);
      }
    }
  });
  adminSpecial.map((i) => {
    if (category.length === 0) {
      category.push(i.category);
    } else {
      let check = false;
      for (let j = 0; j < category.length; j++) {
        if (category[j] === i.category) {
          check = true;
        }
      }
      if (check === false) {
        category.push(i.category);
      }
    }
  });
  let itemss = [];
  itemss = itemss.concat(adminMenu);
  itemss = itemss.concat(adminSpecial);

  return loader ? (
    <div
      className="menu-body-1"
      style={{ position: "relative", background: "black" }}
    >
      <div class="loader"></div>
    </div>
  ) : (
    <>
      <NavLink
        className="menu-back"
        to={{
          pathname: "/Adminuserdataaccess",
          state: { loader: true },
        }}
      >
        back
      </NavLink>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            className="row row1"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="col-1 c1">invoice No.</div>
            <div className="col-1 c1">date</div>
            <div className="col-1 c1">time</div>
            <div className="col-1 c1">table</div>
            <div className="col-1 c1">gross</div>
            <div className="col-1 c1">net</div>
            <div className="col-1 c1">cgst</div>
            <div className="col-1 c1">sgst</div>
            <div className="col-1 c1">discount</div>
            <div className="col-1 c1">name</div>
            <div className="col-1 c1">phone</div>
            <div className="col-1 c1">edit</div>
          </div>
          <div
            className="row row2"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="col-1 c2">{dataa.invoiceNumber}</div>
            <div className="col-1 c2">
              {dataa.date}-{dataa.month + 1}-{dataa.year}
            </div>
            <div className="col-1 c2">{n}</div>
            <div className="col-1 c2">
              IN-{dataa.table < 10 ? "0" + dataa.table : dataa.table}
            </div>
            <div className="col-1 c2">
              {dataa.total ? dataa.total.toFixed(2) : ""}
            </div>
            <div className="col-1 c2">{t}</div>
            <div className="col-1 c2">{cg.toFixed(2)}</div>
            <div className="col-1 c2">{sg.toFixed(2)}</div>
            <div className="col-1 c2">{dis}</div>
            <div className="col-1 c2">{dataa.cname}</div>
            <div className="col-1 c2">
              {dataa.phone !== 0 ? dataa.phone : ""}
            </div>
            <div className="col-1 c2">
              <img
              className="c2-but"
                onClick={async () => {
                  let name = "",
                    phone = null,
                    disco = 0;
                  const { value: formValues } = await Swal.fire({
                    title: "User Details",
                    width: "90%",
                    heightAuto: false,
                    height: "90vh",
                    html:
                      '<input id="swal-input1" type="text" placeholder="Name" class="swal2-input">' +
                      '<input id="swal-input2" type="tel" placeholder="Phone No." class="swal2-input">' +
                      '<input id="swal-input3" type="number" placeholder="Discount @val%" class="swal2-input">',
                    focusConfirm: false,
                    confirmButtonText: "Save",
                    // showDenyButton: true,
                    backdrop: true,
                    preConfirm: () => {
                      return [
                        document.getElementById("swal-input1").value,
                        document.getElementById("swal-input2").value,
                        document.getElementById("swal-input3").value,
                      ];
                    },
                  });
                  if (formValues) {
                    for (let i = 0; i < formValues.length; i++) {
                      if (i === 0 && formValues[i] !== "") {
                        name = formValues[i];
                      }
                      if (i === 1 && formValues[i] !== 0) {
                        phone = formValues[i];
                      }
                      if (i === 2 && formValues[i] !== 0) {
                        disco = formValues[i];
                      }
                    }
                    const res = await fetch(`/AdminDiscount`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        invoice: dataa.invoiceNumber,
                        name: name,
                        phone: phone,
                        discount: disco,
                      }),
                    });
                    await res.json();
                  }
                }}
                height={20}
                width={20}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAClElEQVRIibWWzUsbURDAf29fVAh+XAtGaWkPogsVCnr3UlpJtcG1h1aK1Hvjpce29i/wKrRS0MOSmICfRy8qmktPmlIoIlT0KgoG3eybHnRD/Eg0fsztvZn5zbzZtzNPUUYcx2kWkR6lVDfwEIicqraBLWBOaz3tuu6/UgxVAtwIfAY+ALpcEoBRSqUsy/rkuu7WlQH6+/t7RWQCqL0CfF4OgHfJZHKmePNMdo7jfATGgZpKyOFwGBGpMca8sW17b2NjIxPoCic4zTwFWNcFa60ZGhqiq6uL4+NjxsbGWF5eNsDr4CQKIBaLRbTWv6mwLNFolIGBgcL66OiIwcFB8vn8gda6xXXdHQsgFAp9qwSutaa2tpaFhQUymUI1qK6upqqqCqDOGDMCoB3Haeak7tcqjdaaeDxONBpldXWVpaUlmpqaiEQiLC4usra2Fpg+bWlpGde2bb8HXlYC7+zspKGhgfb29kKQw8NDEokEIhKYW1rrTd3a2voVeFIJPJAgyMrKCuvr68XwgoSuCx8eHqajo+OCbnd3l1wuV8r1sQU8uCk8k8kwOjqK7/ul3BvLfthbwgGMBezcExxgxwI27wkOsGkB8+fh8Xj8LuAAc5bWehooeNTX15+5ireA533fn7VOh8XPcpY3gKOU+pFOp7eDW/SFk35+J3BgP5/Pj0BRu+7r63uhlJpVSulwOFywzOVyGGMqgRulVG8ikZiFooGTzWb/2ra9JyLPPc9Tnufhed6lv385uIjEk8nkRLBxYWQ6jvMKmATqKiED+yLydmpqaq5488JAz2azf9ra2r6LSI1S6hlXt3EDTPq+35tKpX6dV176qggkFotFQqFQj4h0A484+2zZFJF5Y8xMOp3eLsX4D/hzMvfAS6zSAAAAAElFTkSuQmCC"
              ></img>
            </div>
          </div>
          <button
            className="c2-but-1"
            onClick={() => {
              document.getElementById("edit").style.display = "block";
            }}
          >
            add items
          </button>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div
            className="row row1"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="col-3 c1">item</div>
            <div className="col-3 c1">price</div>
            <div className="col-3 c1">total</div>
            <div className="col-3 c1">quantity</div>
          </div>
          {dataa.orderList
            ? dataa.orderList.map((j) => {
                return (
                  <div
                    className="row row2"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div className="col-3 c2">{j.item}</div>
                    <div className="col-3 c2">{j.price}</div>
                    <div className="col-3 c2">
                      {Number(j.price) * Number(j.quantity)}
                    </div>
                    <div className="col-2 c2">{j.quantity}</div>
                    <div className="col-1 c2">
                      <img
                        className="c2-but"
                        onClick={async () => {
                          const quantity = await swal("ENTER QUANTITY", {
                            content: {
                              element: "input",
                              attributes: {
                                type: "text",
                              },
                            },
                            showCancelButton: true,
                          });
                          if (quantity !== "") {
                            const res = await fetch(`/AdminInvoiceEdit`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                invoice: dataa.invoiceNumber,
                                item: j.item,
                                quantity: Number(quantity),
                              }),
                            });
                            const data = await res.json();
                            if (data.status === 401) {
                              swal("Last Item", {
                                icon: "error",
                              });
                            }
                          } else {
                            swal("Invalid Input", {
                              icon: "error",
                            });
                          }
                        }}
                        height={20}
                        width={20}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAClElEQVRIibWWzUsbURDAf29fVAh+XAtGaWkPogsVCnr3UlpJtcG1h1aK1Hvjpce29i/wKrRS0MOSmICfRy8qmktPmlIoIlT0KgoG3eybHnRD/Eg0fsztvZn5zbzZtzNPUUYcx2kWkR6lVDfwEIicqraBLWBOaz3tuu6/UgxVAtwIfAY+ALpcEoBRSqUsy/rkuu7WlQH6+/t7RWQCqL0CfF4OgHfJZHKmePNMdo7jfATGgZpKyOFwGBGpMca8sW17b2NjIxPoCic4zTwFWNcFa60ZGhqiq6uL4+NjxsbGWF5eNsDr4CQKIBaLRbTWv6mwLNFolIGBgcL66OiIwcFB8vn8gda6xXXdHQsgFAp9qwSutaa2tpaFhQUymUI1qK6upqqqCqDOGDMCoB3Haeak7tcqjdaaeDxONBpldXWVpaUlmpqaiEQiLC4usra2Fpg+bWlpGde2bb8HXlYC7+zspKGhgfb29kKQw8NDEokEIhKYW1rrTd3a2voVeFIJPJAgyMrKCuvr68XwgoSuCx8eHqajo+OCbnd3l1wuV8r1sQU8uCk8k8kwOjqK7/ul3BvLfthbwgGMBezcExxgxwI27wkOsGkB8+fh8Xj8LuAAc5bWehooeNTX15+5ireA533fn7VOh8XPcpY3gKOU+pFOp7eDW/SFk35+J3BgP5/Pj0BRu+7r63uhlJpVSulwOFywzOVyGGMqgRulVG8ikZiFooGTzWb/2ra9JyLPPc9Tnufhed6lv385uIjEk8nkRLBxYWQ6jvMKmATqKiED+yLydmpqaq5488JAz2azf9ra2r6LSI1S6hlXt3EDTPq+35tKpX6dV176qggkFotFQqFQj4h0A484+2zZFJF5Y8xMOp3eLsX4D/hzMvfAS6zSAAAAAElFTkSuQmCC"
                      ></img>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      <div className="edit-container" id="edit" style={{ background: "black" }}>
        <button
          className="menu-back-1"
          onClick={() => {
            let x = document.getElementById("edit").style;
            x.display = "none";
          }}
        >
          back
        </button>
        <AdminInvoiceMenu
          category={category}
          adminMenu={adminMenu}
          adminSpecial={adminSpecial}
          table={dataa.table}
          invoice={dataa.invoiceNumber}
          items={itemss}
        />
      </div>
    </>
  );
};

export default AdminInvoiceEdit;
