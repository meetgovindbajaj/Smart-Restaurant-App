// USER SEARCH PAGE MODULE
import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const handleSearch = async () => {
    if (search) {
      const res = await fetch(`https://royalmadrasiserver.vercel.app/home/search`, {
        method: "POST",
        headers: {"Origin":"https://royalmadrasi.vercel.app/",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search,
        }),credentials: 'include'
      });
      const data = await res.json();
      setSearchData(data.data);
    }
  };
  let daata = [];
  Object.assign(daata, searchData);
  const handleAdd = async (index) => {
    const res = await fetch(`https://royalmadrasiserver.vercel.app/Home/Menu`, {
      method: "POST",
      headers: {"Origin":"https://royalmadrasi.vercel.app/",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: daata[index].title,
        price: daata[index].price,
        img: daata[index].img,
        quantity: daata[index].quantity,
      }),credentials: 'include'
    });
    const data = await res.json();
    if (data.status === 422) {
      toast.error("Some Error Occured!");
    } else if (data.status === 421) {
      toast.warning("Item already in cart");
    } else {
      toast.success("item added to cart!");
    }
  };
  return (
    <div className="search-body">
      <div className="search-box">
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            name="search"
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch();
            }}
          />
          <Button variant="outline-success" onClick={handleSearch}>
            Search
          </Button>
        </Form>
      </div>
      <div className="search-container">
        {daata?.map((currItem, index) => {
          return (
            <div className="menu-box">
              <div className="menu-image-container">
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
                  {currItem.description}
                </div>
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
                  className="menu-box-button menu-box-btn"
                  onClick={() => handleAdd(index)}
                >
                  ADD TO CART
                </button>
              </p>
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
    </div>
  );
};

export default SearchPage;
