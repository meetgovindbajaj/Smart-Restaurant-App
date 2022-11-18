import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import moment from "moment";
let loader = true;
let reve = true;
let todaydata = false;
let weekdata = false;
let monthdata = false;
let yeardata = false;
let lastweekdata = false;
let lastmonthdata = false;
let lastyeardata = false;
let tabrev = false;
let netrev = false;
let nettabrev = false;
let nettabrev1 = false;
let toggler = true;
let outcount = 100000;
let allData = true;
let ItemSalesItemSort = true;
let ItemSalesQuantitySort = false;
let ItemSalesItemRevSort = false;
let ItemSalesQuantityRevSort = false;
let ItemSalesAmountSort = false;
let ItemSalesAmountRevSort = false;
let ItemSalesRateSort = false;
let ItemSalesRateRevSort = false;
let ItemSalesDisSort = false;
let ItemSalesDisRevSort = false;
const AdminUserDataAccess = () => {
  const c = new Date();
  function convertTZ(date, tzString) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  }
  const datess = convertTZ(c, "Asia/Kolkata");
  let location = useLocation();
  // console.log(location.state.loader);
  if (location.state) {
    if (location.state.loader) {
      loader = true;
      location.state.loader = false;
    }
  }

  const [userData, setUserData] = useState({});
  const getData = async () => {
    try {
      const res = await fetch("/invoiceInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUserData(data[0]);
      loader = false;
    } catch (err) {
      console.log(err);
    }
  };
  getData();
  let incount = 0;
  let dataa = [];
  let ItemSales = [];
  Object.assign(dataa, userData);
  const filterByLaunchDateLastWeek = (launches) => {
    const c = new Date();
    function convertTZ(date, tzString) {
      return new Date(
        (typeof date === "string" ? new Date(date) : date).toLocaleString(
          "en-US",
          { timeZone: tzString }
        )
      );
    }
    const todayDate = convertTZ(c, "Asia/Kolkata");
    const mont = todayDate.getMonth();
    let lastmont = Number(mont - 1) >= 0 ? Number(mont - 1) : Number(11);
    let filteryear = launches.filter((i) => i.year === datess.getFullYear());
    const startDayOfPrevWeek = moment().subtract(7, "days").calendar();
    let arr = startDayOfPrevWeek.split("/");
    return filteryear.filter(
      (i) =>
        (i.month === mont && i.date >= Number(arr[1]) + 1) ||
        (i.month === lastmont && i.date >= Number(arr[1]) + 1)
    );
  };
  const filterByLastWeek = (launches) => {
    const c = new Date();
    function convertTZ(date, tzString) {
      return new Date(
        (typeof date === "string" ? new Date(date) : date).toLocaleString(
          "en-US",
          { timeZone: tzString }
        )
      );
    }
    const todayDate = convertTZ(c, "Asia/Kolkata");
    const mont = todayDate.getMonth();
    let lastmont = Number(mont - 1) >= 0 ? Number(mont - 1) : Number(11);
    let filteryear = launches.filter((i) => i.year === datess.getFullYear());
    const startDayOfPrevWeek = moment().subtract(13, "days").calendar();
    const endDayOfPrevWeek = moment().subtract(7, "days").calendar();
    let arr = startDayOfPrevWeek.split("/");
    let arr1 = endDayOfPrevWeek.split("/");
    return filteryear.filter(
      (i) =>
        (i.month === mont &&
          i.date >= Number(arr[1]) &&
          i.date <= Number(arr1[1])) ||
        (Number(arr[0]) === lastmont + 1 &&
          Number(arr1[0]) === lastmont + 1 &&
          i.month === lastmont &&
          i.date >= Number(arr[1]) &&
          i.date <= Number(arr1[1])) ||
        (Number(arr[0]) === lastmont + 1 &&
          Number(arr1[0]) === mont + 1 &&
          ((i.date >= Number(arr[1]) && i.date <= 31) ||
            (i.date <= Number(arr1[1]) && i.date >= 1)))
    );
  };
  const filterByLaunchDateLastMonth = (launches) => {
    const c = new Date();
    function convertTZ(date, tzString) {
      return new Date(
        (typeof date === "string" ? new Date(date) : date).toLocaleString(
          "en-US",
          { timeZone: tzString }
        )
      );
    }
    const todayDate = convertTZ(c, "Asia/Kolkata");
    const mont = todayDate.getMonth();
    const year = todayDate.getFullYear();
    const lastyear = year - 1;
    let lastmont = Number(mont - 1) >= 0 ? Number(mont - 1) : Number(11);
    return launches.filter(
      (i) =>
        (i.year === year && Number(i.month) - 1 === lastmont) ||
        (i.year === lastyear && i.month === 11)
    );
  };
  const filterByLaunchDateLastYear = (launches) => {
    const c = new Date();
    function convertTZ(date, tzString) {
      return new Date(
        (typeof date === "string" ? new Date(date) : date).toLocaleString(
          "en-US",
          { timeZone: tzString }
        )
      );
    }
    const todayDate = convertTZ(c, "Asia/Kolkata");
    const lastyr = Number(todayDate.getFullYear()) - 1;
    return launches.filter((i) => i.year === lastyr);
  };
  if (reve === true) {
    tabrev = false;
    netrev = false;
    nettabrev = false;
    nettabrev1 = false;
    dataa = dataa.reverse();
  }
  const che = (a) => {
    if (a === "todaydata") {
      todaydata = true;
      weekdata = false;
      monthdata = false;
      yeardata = false;
      lastweekdata = false;
      lastmonthdata = false;
      lastyeardata = false;
      allData = false;
    } else if (a === "weekdata") {
      todaydata = false;
      weekdata = true;
      monthdata = false;
      yeardata = false;
      lastweekdata = false;
      lastmonthdata = false;
      lastyeardata = false;
      allData = false;
    } else if (a === "lastweekdata") {
      todaydata = false;
      weekdata = false;
      monthdata = false;
      yeardata = false;
      lastweekdata = true;
      lastmonthdata = false;
      lastyeardata = false;
      allData = false;
    } else if (a === "monthdata") {
      todaydata = false;
      weekdata = false;
      monthdata = true;
      yeardata = false;
      lastweekdata = false;
      lastmonthdata = false;
      lastyeardata = false;
      allData = false;
    } else if (a === "lastmonthdata") {
      todaydata = false;
      weekdata = false;
      monthdata = false;
      yeardata = false;
      lastweekdata = false;
      lastmonthdata = true;
      lastyeardata = false;
      allData = false;
    } else if (a === "yeardata") {
      todaydata = false;
      weekdata = false;
      monthdata = false;
      yeardata = true;
      lastweekdata = false;
      lastmonthdata = false;
      lastyeardata = false;
      allData = false;
    } else if (a === "lastyeardata") {
      todaydata = false;
      weekdata = false;
      monthdata = false;
      yeardata = false;
      lastweekdata = false;
      lastmonthdata = false;
      lastyeardata = true;
      allData = false;
    } else if (a === "alldata") {
      todaydata = false;
      weekdata = false;
      monthdata = false;
      yeardata = false;
      lastweekdata = false;
      lastmonthdata = false;
      lastyeardata = false;
      allData = true;
    } else if (a === "tabrev") {
      netrev = false;
      reve = false;
      nettabrev = false;
      nettabrev1 = false;
      tabrev = true;
    } else if (a === "netrev") {
      tabrev = false;
      reve = false;
      nettabrev = false;
      nettabrev1 = false;
      netrev = true;
    } else if (a === "nettabrev") {
      tabrev = false;
      reve = false;
      nettabrev = true;
      nettabrev1 = false;
      netrev = false;
    } else if (a === "nettabrev1") {
      tabrev = false;
      reve = false;
      nettabrev = false;
      nettabrev1 = true;
      netrev = false;
    } else if (a === "ItemSalesItemSort") {
      ItemSalesItemRevSort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesItemSort = true;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesItemRevSort") {
      ItemSalesItemSort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesItemRevSort = true;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesQuantitySort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesQuantitySort = true;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesQuantityRevSort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesQuantityRevSort = true;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesAmountSort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesAmountSort = true;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesAmountRevSort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = true;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesRateSort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = true;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesRateRevSort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = true;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesDisSort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = true;
      ItemSalesDisRevSort = false;
    } else if (a === "ItemSalesDisRevSort") {
      ItemSalesItemSort = false;
      ItemSalesItemRevSort = false;
      ItemSalesQuantitySort = false;
      ItemSalesQuantityRevSort = false;
      ItemSalesAmountSort = false;
      ItemSalesAmountRevSort = false;
      ItemSalesRateSort = false;
      ItemSalesRateRevSort = false;
      ItemSalesDisSort = false;
      ItemSalesDisRevSort = true;
    }
  };
  if (allData === true) {
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  } else if (todaydata === true) {
    let filteryear = dataa.filter((i) => i.year === datess.getFullYear());
    let filtermonth = filteryear.filter((i) => i.month === datess.getMonth());
    let filterdate = filtermonth.filter((i) => i.date === datess.getDate());
    dataa = filterdate;
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  } else if (weekdata === true) {
    dataa = filterByLaunchDateLastWeek(dataa);
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  } else if (lastweekdata === true) {
    dataa = filterByLastWeek(dataa);
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  } else if (monthdata === true) {
    let filteryear = dataa.filter((i) => i.year === datess.getFullYear());
    let filtermonth = filteryear.filter((i) => i.month === datess.getMonth());
    dataa = filtermonth;
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  } else if (lastmonthdata === true) {
    dataa = filterByLaunchDateLastMonth(dataa);
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  } else if (yeardata === true) {
    let filteryear = dataa.filter((i) => i.year === datess.getFullYear());
    dataa = filteryear;
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  } else if (lastyeardata === true) {
    dataa = filterByLaunchDateLastYear(dataa);
    for (let x = 0; x < dataa.length; x++) {
      for (let y = 0; y < dataa[x].orderList.length; y++) {
        let poll1 = true;
        if (ItemSales.length !== 0) {
          for (let z = 0; z < ItemSales.length; z++) {
            let poll = false;
            if (ItemSales[z].item === dataa[x].orderList[y].item) {
              poll = true;
            }
            if (poll === true) {
              ItemSales[z].quantity =
                Number(ItemSales[z].quantity) +
                Number(dataa[x].orderList[y].quantity);
              ItemSales[z].discount =
                Number(ItemSales[z].discount) + Number(dataa[x].discount);
              poll1 = false;
              break;
            }
          }
        }
        if (poll1 === true) {
          ItemSales = ItemSales.concat({
            item: dataa[x].orderList[y].item,
            quantity: dataa[x].orderList[y].quantity,
            discount: dataa[x].discount,
            price: dataa[x].orderList[y].price,
          });
        }
      }
    }
  }
  if (tabrev === true) {
    dataa = dataa.sort((a, b) => parseFloat(a.table) - parseFloat(b.table));
  }
  if (netrev === true) {
    dataa = dataa.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
  }
  if (nettabrev === true) {
    dataa = dataa.sort((a, b) => parseFloat(b.table) - parseFloat(a.table));
  }
  if (nettabrev1 === true) {
    dataa = dataa.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));
  }
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
  if (ItemSalesItemSort === true) {
    ItemSales.sort(dynamicSort("item"));
  }
  if (ItemSalesItemRevSort === true) {
    ItemSales.sort(dynamicSort("item"));
    ItemSales = ItemSales.reverse();
  }
  if (ItemSalesQuantitySort === true) {
    ItemSales = ItemSales.sort(
      (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
    );
  }
  if (ItemSalesQuantityRevSort === true) {
    ItemSales = ItemSales.sort(
      (a, b) => parseFloat(b.quantity) - parseFloat(a.quantity)
    );
  }
  if (ItemSalesAmountSort === true) {
    ItemSales = ItemSales.sort(
      (a, b) =>
        parseFloat(
          a.price * a.quantity - (a.discount / 100) * (a.price * a.quantity)
        ) -
        parseFloat(
          b.price * b.quantity - (b.discount / 100) * (b.price * b.quantity)
        )
    );
  }
  if (ItemSalesAmountRevSort === true) {
    ItemSales = ItemSales.sort(
      (a, b) =>
        parseFloat(
          b.price * b.quantity - (b.discount / 100) * (b.price * b.quantity)
        ) -
        parseFloat(
          a.price * a.quantity - (a.discount / 100) * (a.price * a.quantity)
        )
    );
  }
  if (ItemSalesRateSort === true) {
    ItemSales = ItemSales.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
  }
  if (ItemSalesRateRevSort === true) {
    ItemSales = ItemSales.sort(
      (a, b) => parseFloat(b.price) - parseFloat(a.price)
    );
  }
  if (ItemSalesDisSort === true) {
    ItemSales = ItemSales.sort(
      (a, b) =>
        parseFloat((a.discount / 100) * (a.price * a.quantity)) -
        parseFloat((b.discount / 100) * (b.price * b.quantity))
    );
  }
  if (ItemSalesDisRevSort === true) {
    ItemSales = ItemSales.sort(
      (a, b) =>
        parseFloat((b.discount / 100) * (b.price * b.quantity)) -
        parseFloat((a.discount / 100) * (a.price * a.quantity))
    );
  }
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
        overflow: "hidden",
        width: "100vw",
        background: "black",
      }}
    >
      {toggler ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            margin: "0",
            padding: "0",
          }}
        >
          <div className="row row1">
            <div
              className="col col-1 c1 c1-but"
              onClick={() => {
                if (reve === true) {
                  reve = false;
                } else {
                  reve = true;
                }
              }}
            >
              <header>invoice</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
            <div className="col col-3 c1">date</div>
            <div className="col col-3 c1">time</div>
            <div
              className="col col-2 c1 c1-but"
              onClick={() => {
                if (tabrev === false) {
                  che("tabrev");
                } else {
                  che("nettabrev");
                }
              }}
            >
              <header>table</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
            <div
              className="col col-2 c1 c1-but"
              onClick={() => {
                if (netrev === false) {
                  che("netrev");
                } else {
                  che("nettabrev1");
                }
              }}
            >
              <header>net</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
            <div className="col col-1 c1">edit</div>
          </div>
          <div
            style={{
              overflow: "hidden",
              overflowY: "scroll",
              height: "70.5vh",
            }}
          >
            {dataa.map((i) => {
              // console.log(i);
              if (incount < outcount) {
                incount = incount + 1;
                //calculate net total

                let cg = (i.cgst / 100) * i.total;
                cg = Number(Math.floor(cg * 100) / 100);
                cg = Number(cg.toFixed(2));
                let sg = (i.sgst / 100) * i.total;
                sg = Number(Math.floor(sg * 100) / 100);
                sg = Number(sg.toFixed(2));
                let dis = (i.discount / 100) * (i.total + cg + sg);
                let t = i.total + cg + sg - dis;
                t = Math.floor(t * 100) / 100;
                t = t.toFixed(2);
                //time 24=>12
                let a = [];
                a = i.time.split(":");
                let t1 = a[0] % 12;
                let tx = a[0] > 12 ? "PM" : "AM";
                let n = `${t1 < 10 ? "0" + t1 : t1}:${a[1]} ${tx}`;
                // console.log(i);
                return (
                  <div
                    className="row row2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      textAlign: "center",
                    }}
                  >
                    <div className="col-1 c2">{i.invoiceNumber}</div>
                    <div className="col-3 c2">
                      {i.date}-{i.month + 1}-{i.year}
                    </div>
                    <div className="col-3 c2">{n}</div>
                    <div className="col-2 c2">
                      {i.table < 10 ? "0" + i.table : i.table}
                    </div>
                    <div className="col-2 c2">{t}</div>
                    <div className="col-1 c2">
                      <NavLink
                        to={{
                          pathname: "/printpage2",
                          state: {
                            table: i.table,
                            items: i.orderList,
                            cgst: i.cgst,
                            date: `${i.date}-${i.month + 1}-${i.year}`,
                            discount: i.discount,
                            invoice: i.invoiceNumber,
                            kot: i.kotNumber,
                            sgst: i.sgst,
                            time: n,
                            total: i.total,
                            pathname: "/Adminuserdataaccess",
                          },
                        }}
                      >
                        <img
                          width={25}
                          height={25}
                          src="https://img.icons8.com/color/48/000000/print.png"
                        />
                      </NavLink>
                      <NavLink
                        className=""
                        to={{
                          pathname: "/AdminInvoiceEdit",
                          state: { list: i, loader: true },
                        }}
                      >
                        <img
                          height={20}
                          width={20}
                          style={{ marginLeft: "5px" }}
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA8ElEQVRIie2SvW3DMBBG3ylawLNwACcTpA5ck00WSGUrSJUmrYTTFp5AHoCjBJlAoBsTASQqYCQ2AfJV/H0PPB789UgJiLXWisgR2IUQznVdP7dt+wVQb4U75xrgFOci8jSOYwAOANVWwUIeuVVntcBauwdQ1QZ4nWx/AmG1wDnXiMhwK09K8hYHd2vgfNf83hgj3vvBez8YYwS4qOpHPP+rLpp+aEwI4b3v+5fUnWzBEjymqqqHruuG2XoJONCk4JDxghy4qk67KE+wFf6joAR8UVAKnhSUhM8EpeEwb9Oi8JSgKDxXsBqeI9gE/09Wru9NZvVHWi5aAAAAAElFTkSuQmCC"
                        />{" "}
                      </NavLink>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            margin: "0",
            padding: "0",
          }}
        >
          <div
            className="row row1"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <div
              className="col col-4 c1 c1-but"
              onClick={() => {
                if (ItemSalesItemSort === true) {
                  che("ItemSalesItemRevSort");
                } else {
                  che("ItemSalesItemSort");
                }
              }}
            >
              <header>Items</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
            <div
              className="col col-2 c1 c1-but"
              onClick={() => {
                if (
                  (ItemSalesItemSort === true ||
                    ItemSalesItemRevSort === true) &&
                  ItemSalesQuantitySort === false
                ) {
                  che("ItemSalesQuantitySort");
                } else if (ItemSalesQuantitySort === true) {
                  che("ItemSalesQuantityRevSort");
                } else {
                  che("ItemSalesQuantitySort");
                }
              }}
            >
              <header>quantity</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
            <div
              className="col col-2 c1 c1-but"
              onClick={() => {
                if (
                  (ItemSalesItemSort === true ||
                    ItemSalesItemRevSort === true) &&
                  ItemSalesRateSort === false
                ) {
                  che("ItemSalesRateSort");
                } else if (ItemSalesRateSort === true) {
                  che("ItemSalesRateRevSort");
                } else {
                  che("ItemSalesRateSort");
                }
              }}
            >
              <header>Rate</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
            <div
              className="col col-2 c1 c1-but"
              onClick={() => {
                if (
                  (ItemSalesItemSort === true ||
                    ItemSalesItemRevSort === true) &&
                  ItemSalesDisSort === false
                ) {
                  che("ItemSalesDisSort");
                } else if (ItemSalesDisSort === true) {
                  che("ItemSalesDisRevSort");
                } else {
                  che("ItemSalesDisSort");
                }
              }}
            >
              <header>Discount</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
            <div
              className="col col-2 c1 c1-but"
              onClick={() => {
                if (
                  (ItemSalesItemSort === true ||
                    ItemSalesItemRevSort === true) &&
                  ItemSalesAmountSort === false
                ) {
                  che("ItemSalesAmountSort");
                } else if (ItemSalesAmountSort === true) {
                  che("ItemSalesAmountRevSort");
                } else {
                  che("ItemSalesAmountSort");
                }
              }}
            >
              <header>Amount</header>
              <img
                height={15}
                width={15}
                src="https://img.icons8.com/ios-glyphs/30/000000/sort.png"
              />
            </div>
          </div>
          <div
            style={{
              overflow: "hidden",
              overflowY: "scroll",
              height: "70.5vh",
            }}
          >
            {ItemSales.map((i) => {
              if (incount < outcount) {
                incount = incount + 1;
                return (
                  <div
                    className="row row2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      textAlign: "center",
                    }}
                  >
                    <div className="col col-4 c2">{i.item}</div>
                    <div className="col col-2 c2">{i.quantity}</div>
                    <div className="col col-2 c2">{i.price.toFixed(2)}</div>
                    <div className="col col-2 c2">
                      {((i.discount / 100) * (i.price * i.quantity)).toFixed(2)}
                    </div>
                    <div className="col col-2 c2">
                      {(
                        i.price * i.quantity -
                        (i.discount / 100) * (i.price * i.quantity)
                      ).toFixed(2)}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      <div className="menu-dropdown-2">
        <DropdownButton
          drop="up"
          title={(() => {
            if (outcount === 100000) {
              return "Length";
            } else if (outcount === 10) {
              return "First 10";
            } else if (outcount === 20) {
              return "First 20";
            } else if (outcount === 50) {
              return "First 50";
            } else if (outcount === 100) {
              return "First 100";
            } else {
              return "Length";
            }
          })()}
          variant="warning"
        >
          <Dropdown.Item
            onClick={() => {
              outcount = 100000;
            }}
          >
            Show All
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              outcount = 10;
            }}
          >
            First 10
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              outcount = 20;
            }}
          >
            First 20
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              outcount = 50;
            }}
          >
            First 50
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              outcount = 100;
            }}
          >
            First 100
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="menu-dropdown-3">
        <DropdownButton
          drop="up"
          title={(() => {
            if (todaydata === true) {
              return "Today";
            } else if (weekdata === true) {
              return "This Week";
            } else if (monthdata === true) {
              return "This Month";
            } else if (yeardata === true) {
              return "This Year";
            } else if (lastweekdata === true) {
              return "Last Week";
            } else if (lastmonthdata === true) {
              return "Last Month";
            } else if (lastyeardata === true) {
              return "Last Year";
            } else {
              return "Sort";
            }
          })()}
          variant="info"
        >
          <Dropdown.Item
            onClick={() => {
              che("alldata");
            }}
          >
            Show All
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              che("todaydata");
            }}
          >
            Today
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              che("weekdata");
            }}
          >
            This Week
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => {
              che("monthdata");
            }}
          >
            This Month
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => {
              che("yeardata");
            }}
          >
            This Year
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              che("lastweekdata");
            }}
          >
            Last Week
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              che("lastmonthdata");
            }}
          >
            Last Month
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              che("lastyeardata");
            }}
          >
            Last Year
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="menu-dropdown-4">
        <DropdownButton
          drop="up"
          variant="success"
          title={(() => {
            if (toggler === true) {
              return "Invoice Report";
            } else {
              return "Item Sales Report";
            }
          })()}
        >
          <Dropdown.Item
            onClick={() => {
              toggler = true;
            }}
          >
            Invoice Report
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              toggler = false;
            }}
          >
            Item Sales Report
          </Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
};

export default AdminUserDataAccess;
