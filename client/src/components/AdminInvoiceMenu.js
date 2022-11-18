import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import swal from "sweetalert";

const AdminInvoiceMenu = (props) => {
  let [user, setUser] = useState();
  user = props.items;
  const sub = (index) => {
    if (user[index].quantity > 1) {
      setUser(
        (user[index].quantity = Number(user[index].quantity) - Number(1))
      );
    }
  };
  const add = (index) => {
    setUser((user[index].quantity = Number(user[index].quantity) + Number(1)));
  };
  const handleAdd = async (items) => {
    const addFile = await swal({
      title: "Are you sure?",
      text: "You want to order these items?",
      buttons: true,
      dangerMode: false,
    });
    if (addFile) {
      const res = await fetch(`/AdminInvoiceAdd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice:props.invoice,
          items: items,
        }),
      });
      const data = await res.json();
      if (data.status === 400) {
        toast.error("Some Error Occured!");
      } else if (data.status === 201) {
        for (let i = 0; i < user.length; i++) {
          setUser((user[i].quantity = Number(1)));
        }
        document.getElementById("edit").style.display = "none";
        swal("Saved Successfully", {
          icon: "success",
        });
        // history.push("/home/menu");
      }
    } else {
      swal("Canceled!");
    }
  };
  return (
    <div
      className="menu-body"
      style={{ position: "relative", background: "black", padding: "10px" }}
    >
      <div style={{ margin: "0", padding: "0", background: "black" }}>
        {props.category.map((i) => {
          return (
            <div
              style={{
                margin: "0",
                padding: "0",
                background: "black",
                paddingBottom: "50px",
                display: `${props.category[0] === i ? "block" : "none"}`,
              }}
              id={i}
            >
              <h3
                style={{
                  backgroundColor: "black",
                  color: "white",
                  textTransform: "uppercase",
                  fontWeight: "bolder",
                  textAlign: "center",
                }}
              >
                {i}
              </h3>
              <div className="menu-container">
                {user.map((currItem, index) => {
                  if (i === currItem.category) {
                    return (
                      <div className="menu-box-1">
                        <p className="menu-box-body">
                          <div
                            className="menu-box-title"
                            style={{ width: "100vw" }}
                          >
                            <h5
                              className="card-title"
                              style={{ fontWeight: "bolder" }}
                            >
                              {currItem.title}
                            </h5>
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <button
                              className="cart-btn cart-sub"
                              style={{background:'red',color:"white",fontSize:"2em" }}
                              onClick={() => sub(index)}
                            >
                              -
                            </button>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:".1em 1em"}}>{currItem.quantity - 1}</div>
                            
                            <button
                              className="cart-btn cart-add"
                              style={{background:'green',color:"white",fontSize:"2em"  }}
                              onClick={() => add(index)}
                            >
                              +
                            </button>
                          </div>
                        </p>
                      </div>
                    );
                  }
                })}
                <button
                  className="menu-box-button menu-box-btn save-btn"
                  style={{ background: "green", margin: "auto" }}
                  onClick={() => {
                    let arr = [];
                    for (i = 0; i < user.length; i++) {
                      if (user[i].quantity > 1) {
                        arr = arr.concat({
                          title: user[i].title,
                          price: Number(user[i].price),
                          img: user[i].img,
                          quantity: Number(user[i].quantity) - Number(1),
                        });
                      }
                    }
                    handleAdd(arr);
                  }}
                >
                  SAVE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      <div className="menu-dropdown">
        <Dropdown>
          <Dropdown.Toggle variant="info">MENU</Dropdown.Toggle>
          <Dropdown.Menu>
            {props.category.map((dat) => {
              return (
                <Dropdown.Item
                  onClick={() => {
                    document.getElementById(dat).style.display = "block";
                    for (let i = 0; i < props.category.length; i++) {
                      if (props.category[i] !== dat) {
                        document.getElementById(
                          props.category[i]
                        ).style.display = "none";
                      }
                    }
                  }}
                >
                  {dat}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default AdminInvoiceMenu;
