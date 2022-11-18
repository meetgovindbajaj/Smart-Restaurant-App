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
let xx;
let loader = true;
const AdminUserAccess = () => {
  let location = useLocation();
  // console.log(location.state.loader);
  if (location.state) {
    if (location.state.loader) {
      loader = true;
      location.state.loader = false;
    }
  }
  // console.log(props);
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);

  const [userData, setuserData] = useState({});
  const [menuData, setMenuData] = useState({});
  const [todayData, setTodayData] = useState({});
  const callAboutPage = async () => {
    try {
      const res = await fetch("/AdminUserAccess", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setuserData(data);
      loader = false;
      if (!res.status === 200) {
        history.push("/Adminlogin");
        const error = new Error(res.error);
        throw error;
      } else {
        dispatch({ type: "ADMIN", payload: true });
      }
    } catch (err) {
      console.log(err);
    }
  };
  callAboutPage();
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
  let daata = [];
  let total = 0;
  let totals = [];
  let tables1 = [];
  let adminMenu = [],
    adminSpecial = [];
  Object.assign(daata, userData);
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
  let length = daata.length;
  let i = 0;
  for (i = 0; i < length; i++) {
    let j = 0;
    let items = [];
    for (j = 0; j < daata[i].invoice.length; j++) {
      total = total + daata[i].invoice[j].price * daata[i].invoice[j].quantity;
      items = items.concat({
        item: daata[i].invoice[j].title,
        price: daata[i].invoice[j].price,
        quantity: daata[i].invoice[j].quantity,
      });
    }
    totals = totals.concat({
      table: daata[i].table,
      total: total,
      items: items,
    });
    total = 0;
  }
  totals.sort((a, b) => {
    return a.table - b.table;
  });
  const sort = () => {
    let j = 0;
    let k = 0;
    for (j = 0; j < totals.length; j++) {
      if (j === 0) {
        tables1 = tables1.concat({
          table: totals[j].table,
          total: totals[j].total,
          items: totals[j].items,
        });
        k = k + 1;
      } else {
        if (totals[j].table === totals[j - 1].table) {
          tables1[k - 1].total = tables1[k - 1].total + totals[j].total;
          tables1[k - 1].items = tables1[k - 1].items.concat(totals[j].items);
        } else {
          tables1 = tables1.concat({
            table: totals[j].table,
            total: totals[j].total,
            items: totals[j].items,
          });
          k = k + 1;
        }
      }
    }
  };
  sort();
  function SortArray(x, y) {
    if (x.item < y.item) {
      return -1;
    }
    if (x.item > y.item) {
      return 1;
    }
    return 0;
  }
  for (let a = 0; a < tables1.length; a++) {
    let axe = [];
    let axe1 = [];
    let k = 0;
    for (let b = 0; b < tables1[a].items.length; b++) {
      axe = axe.concat({
        item: tables1[a].items[b].item,
        price: tables1[a].items[b].price,
        quantity: tables1[a].items[b].quantity,
      });
    }
    axe.sort(SortArray);
    for (let c = 0; c < axe.length; c++) {
      if (c === 0) {
        axe1 = axe1.concat({
          item: axe[c].item,
          price: axe[c].price,
          quantity: axe[c].quantity,
        });
        k += 1;
      } else {
        if (axe[c].item === axe[c - 1].item) {
          axe1[k - 1].quantity += axe[c].quantity;
        } else {
          axe1 = axe1.concat({
            item: axe[c].item,
            price: axe[c].price,
            quantity: axe[c].quantity,
          });
          k += 1;
        }
      }
    }
    tables1[a].items = axe1;
  }
  const DeleteTable = async (table, items, discount) => {
    const deleteFile = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover it!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (deleteFile) {
      let name = "",
        phone = null;
      if (items.total !== 0) {
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
          confirmButtonText: "Clear",
          showDenyButton: true,
          backdrop: true,
          denyButtonText: `Clear Anyways`,
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
              phone = Number(formValues[i]);
            }
            if (i === 2 && formValues[i] !== 0) {
              discount = Number(formValues[i]);
            }
          }
        }
      }
      const res = await fetch(`/AdminUserAccess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: table,
          items: items,
          total: items.total,
          discount: discount,
          name: name,
          phone: phone,
        }),
      });
      const data = await res.json();
      // console.log(data);
      if (data.status === 400) {
        toast.error("Some Error Occured!");
      } else if (data.status === 201) {
        history.push({
          pathname: "/printpage2",
          state: {
            table: data.table,
            items: data.items,
            cgst: data.cgst,
            date: data.date,
            discount: data.discount,
            invoice: data.invoiceNumber,
            kot: data.kotNumber,
            sgst: data.sgst,
            time: data.time,
            total: data.total,
            pathname: "/adminuseraccess",
          },
        });
      } else if (data.status === 202) {
        swal("Table Deleted", {
          icon: "success",
        });
      }
    } else {
      swal("Table is safe!");
    }
  };
  const del = async (table, item, price, quantity) => {
    // console.log(table, item, price, quantity);
    if (quantity > 1) {
      const res = await fetch(`/delItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table,
          title: item,
          price,
          quantity: Number(quantity),
        }),
      });
      const data = await res.json();
      if (data.status === 400) {
        toast.error("Some Error Occured!");
      }
    }
  };
  const add = async (table, item, price, quantity) => {
    // console.log(table, item, price, quantity);
    const res = await fetch(`/addItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table,
        title: item,
        price,
        quantity: Number(quantity),
      }),
    });
    const data = await res.json();
    if (data.status === 400) {
      toast.error("Some Error Occured!");
    }
  };
  const deleteItem = async (table, title, price, quantity) => {
    const deleteFile = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover it!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (deleteFile) {
      const res = await fetch(`/deleteItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table,
          title,
          price,
          quantity,
        }),
      });
      const data = await res.json();
      if (data.status === 400) {
        toast.error("Some Error Occured!");
      } else if (data.status === 201) {
        swal("Item deleted from table", {
          icon: "success",
        });
        // setuserData({ title: "", price: "", quantity: "" });
      }
    } else {
      swal("Your Item is safe!");
    }
  };
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
    <div
      style={{
        margin: "0",
        padding: "0",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {tables1[0] ? (
        <>
          <div className="user-table-container">
            {tables1.map((data, index) => {
              let it = data.items;
              return (
                <div className="user-table">
                  <div style={{ display: "block" }} className="user-table-no">
                    table- {data.table}
                    <div style={{ display: "flex" }}>
                      <button
                        className="cart-btn cart-sub"
                        style={{ marginRight: "5px" }}
                        onClick={async () => {
                          const cTable = await swal("Enter New Table:", {
                            content: "input",
                          });
                          if (cTable) {
                            const res = await fetch(`/swap`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                table: data.table,
                                newTable: Number(cTable),
                              }),
                            });
                            const data1 = await res.json();
                            if (data1.status === 400) {
                              toast.error("Some Error Occured!");
                            }
                          }
                        }}
                      >
                        <img
                          width={20}
                          height={20}
                          src="https://img.icons8.com/wired/64/000000/replace.png"
                        />
                      </button>
                      <button
                        className="edit cart-btn cart-add"
                        onClick={() => {
                          tab(data.table);
                          document.getElementById("edit").style.display =
                            "block";
                        }}
                      >
                        <img src="https://img.icons8.com/external-those-icons-fill-those-icons/24/000000/external-add-applications-windows-those-icons-fill-those-icons.png" />
                      </button>
                    </div>
                  </div>

                  <div className="user-table-no">total- {data.total} INR</div>
                  <div className="user-table-info">
                    <Dropdown autoClose="outside">
                      <Dropdown.Toggle variant="info">&#8505; </Dropdown.Toggle>
                      <Dropdown.Menu style={{ width: "320px" }}>
                        {it.map((dat) => {
                          return (
                            <Dropdown.Item>
                              <div
                                className="row"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  title={dat.quantity + " x " + dat.item}
                                  className="col-6"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {dat.quantity}x {dat.item}
                                </div>
                                <div
                                  className="col-2"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0",
                                  }}
                                >
                                  <button
                                    className="cart-btn-1 cart-sub"
                                    style={{ background: "red", margin: "0" }}
                                    onClick={() =>
                                      del(
                                        tables1[index].table,
                                        dat.item,
                                        dat.price,
                                        dat.quantity
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                </div>
                                <div
                                  className="col-2"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0",
                                  }}
                                >
                                  <button
                                    className="cart-btn-1 cart-add"
                                    style={{ background: "green", margin: "0" }}
                                    onClick={() =>
                                      add(
                                        tables1[index].table,
                                        dat.item,
                                        dat.price,
                                        dat.quantity
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                                <div
                                  className="col-2"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0",
                                  }}
                                >
                                  <button
                                    className="cart-btn-1 cart-sub"
                                    style={{ margin: "0" }}
                                    onClick={() =>
                                      deleteItem(
                                        tables1[index].table,
                                        dat.item,
                                        dat.price,
                                        dat.quantity
                                      )
                                    }
                                  >
                                    <img
                                      width={22}
                                      height={22}
                                      src="https://img.icons8.com/ios-glyphs/30/fa314a/filled-trash.png"
                                    />{" "}
                                  </button>
                                </div>
                              </div>
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <button
                    className="user-table-button"
                    onClick={async () => {
                      let dis = 0;
                      DeleteTable(tables1[index].table, data, dis);
                    }}
                  >
                    clean Table
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="cart-empty" style={{ marginInline: "auto" }}>
          <div className="cart-empty-heading">NO TABLES BOOKED</div>
        </div>
      )}
      <button
        style={{
          position: "absolute",
          height: "5vh",
          width: "10vw",
          zIndex: "2000",
          bottom: "10px",
          right: "10px",
        }}
        className="user-table-button"
        onClick={async () => {
          const cTable = await swal("Enter New Table:", {
            content: "input",
          });
          if (cTable) {
            const res = await fetch("/Register1", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                table: Number(cTable),
                name: "",
                phone: "",
              }),
            });
            await res.json();
          }
        }}
      >
        <img
          width={25}
          height={25}
          color="green"
          src="https://img.icons8.com/ios/50/000000/restaurant-table.png"
        />
      </button>
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
        <AdminUserMenu
          category={category}
          adminMenu={adminMenu}
          adminSpecial={adminSpecial}
          table={xx}
          items={itemss}
        />
      </div>
    </div>
  );
};

export default AdminUserAccess;
