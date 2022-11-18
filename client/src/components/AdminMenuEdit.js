import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "../components/css/app.css";
import swal from "sweetalert";
import { Dropdown } from "react-bootstrap";
import {useLocation} from 'react-router-dom'
let loader=true;
const AdminMenuEdit = (title) => {
  let location=useLocation();
  // console.log(location.state.loader);
  if(location.state){
    if(location.state.loader){
      loader=true;
      location.state.loader=false;
    }
  }
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [userData, setuserData] = useState({});

  const callAboutPage = async () => {
    try {
      const res = await fetch("/AdminMenuEdit", {
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
      history.push("/AdminRegister");
      console.log(err);
    }
  };
  callAboutPage();

  let daata = [];
  Object.assign(daata, userData);
  const handleDelete = async (title) => {
    const deleteFile = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover it!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (deleteFile) {
      const res = await fetch(`/AdminMenuEdit/Delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      });
      const data = await res.json();
      if (data.status === 400) {
        toast.error("Some Error Occured!");
      } else if (data.status === 201) {
        swal("Poof! Menu Item has been deleted!", {
          icon: "success",
        });
      }
    } else {
      swal("Your Item is safe!");
    }
  };
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
  daata.sort(dynamicSort("category"));
  let category = [];
  daata.map((i) => {
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

  return (loader?<div
    className="menu-body-1"
    style={{ position: "relative", background: "black" }}
    ><div class="loader"></div></div>:
    <div
      className="menu-body"
      style={{ position: "relative", background: "black" }}
    >
      <div
        style={{
          margin: "0",
          padding: "0",
          background: "black",
          minHeight: "78vh",
        }}
      >
        {category.map((i) => {
          return (
            <div
              style={{
                margin: "0",
                padding: "0",
                background: "black",
                paddingBottom: "50px",
              }}
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
              <div className="menu-container" id={i}>
                {daata.map((currItem, index) => {
                  if (i === currItem.category) {
                    return (
                      <div
                        className="menu-box-1"
                      >
                        {/* <div className="menu-image-container">
                          <img
                            loading="lazy"
                            src={currItem.img}
                            alt="jsx-a11y/alt-text"
                            className="menu-image"
                            // onClick={handleClick}
                          />
                          <button
                            className="menu-image-button"
                            onClick={() => handleAdd(index)}
                          >
                            ADD TO CART
                          </button>
                        </div> */}
                        <p className="menu-box-body">
                          <div className="menu-box-title">
                            <h5
                              className="card-title"
                              style={{ fontWeight: "bolder" }}
                            >
                              {currItem.title}
                            </h5>
                          </div>
                          {/* <div
                            className="container-fluid menu-box-description"
                            style={{ color: "silver" }}
                          >
                            {currItem.description}
                          </div> */}
                          <h5 className="menu-box-price">
                            Price:
                            <span
                              style={{
                                color: "greenyellow",
                                backgroundColor: "rgb(34, 34, 36)",
                              }}
                            >
                              {" "}
                              {currItem.price} INR
                            </span>
                          </h5>
                          <button
                            className="menu-box-button menu-box-btn sp-btn"
                            onClick={() => handleDelete(daata[index].title)}
                          >
                            DELETE
                          </button>
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="menu-dropdown-1">
        <Dropdown>
          <Dropdown.Toggle variant="info">MENU</Dropdown.Toggle>
          <Dropdown.Menu>
            {category.map((dat) => {
              let cat = `#${dat}`;
              return (
                <Dropdown.Item
                  onClick={() => {
                    let e = document.getElementById(dat);
                    window.scrollTo(e.offsetLeft, e.offsetTop);
                  }}
                >
                  {dat}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
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
    </div>
  );
};

export default AdminMenuEdit;
