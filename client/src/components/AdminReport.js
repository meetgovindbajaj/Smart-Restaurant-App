import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useLocation } from "react-router-dom";
ChartJS.register(
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

let loader = true;
const AdminReport = () => {
  let location = useLocation();
  // console.log(location.state.loader);
  if (location.state) {
    if (location.state.loader) {
      loader = true;
      location.state.loader = false;
    }
  }
  const [userData, setUserData] = useState({});
  const [userData1, setUserData1] = useState({});
  const getData = async () => {
    try {
      const res = await fetch("/Menu", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res1 = await fetch("/TodaySpecial", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const data1 = await res1.json();
      setUserData(data);
      setUserData1(data1);
      loader = false;
    } catch (err) {
      console.log(err);
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
  let daata = [],
    daata1 = [],
    total = 0;
  Object.assign(daata, userData);
  Object.assign(daata1, userData1);
  daata.push(...daata1);

  useEffect(() => {
    getData();
    setInterval(() => {
      getData();
    }, 5000);
  }, []);
  const m = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let todayItemList = [],
    monthlyItemList = [],
    yearlyItemList = [],
    allYearRevenueList = [];
  // eslint-disable-next-line
  daata.map((currItem, index) => {
    const c = new Date();
    function convertTZ(date, tzString) {
      return new Date(
        (typeof date === "string" ? new Date(date) : date).toLocaleString(
          "en-US",
          { timeZone: tzString }
        )
      );
    }
    const d = convertTZ(c, "Asia/Kolkata");
    const currDate = d.getDate(),
      currMonth = m[d.getMonth()],
      currYear = d.getFullYear();
    let name = "",
      mname = "",
      yname = "",
      date,
      month,
      tquantity = 0,
      mquantity = 0,
      yYear,
      yquantity = 0,
      xquantity = 0,
      innerDate,
      innerMonth,
      quantity = 0,
      a = [];
    if (currItem["orderList"]) {
      // eslint-disable-next-line
      currItem["orderList"].map((item, i) => {
        quantity = Number(quantity) + Number(item.quantity);

        //todays item list
        if (
          currDate === item.date &&
          currMonth === item.month &&
          currYear === item.year
        ) {
          if (name === "") {
            name = currItem.title;
          }
          tquantity = Number(tquantity) + Number(item.quantity);
        }

        //monthly item list
        if (
          Number(currYear) === Number(item.year) &&
          currMonth === item.month
        ) {
          mquantity = Number(mquantity) + Number(item.quantity);
          if (mname === "") {
            mname = currItem.title;
            date = Number(item.date);
          }
          innerDate = Number(item.date);
          if (innerDate !== date) {
            monthlyItemList = monthlyItemList.concat({
              item: mname,
              date: date,
              quantity: mquantity,
            });
            mquantity = Number(item.quantity);
            date = innerDate;
          }
        }

        //yearly item list
        if (currYear === item.year) {
          xquantity = Number(xquantity) + Number(item.quantity);
          if (yname === "") {
            yname = currItem.title;
            month = item.month;
          }
          innerMonth = item.month;
          if (innerMonth !== month) {
            yearlyItemList = yearlyItemList.concat({
              item: yname,
              month: month,
              quantity: xquantity,
            });
            xquantity = Number(item.quantity);
            month = innerMonth;
          }
        }

        //all year item list
        if (item.year) {
          yquantity = Number(yquantity) + Number(item.quantity);
          if (!yYear) {
            yYear = item.year;
          }
          if (yYear !== item.year) {
            allYearRevenueList = allYearRevenueList.concat({
              year: yYear,
              revenue: Number(yquantity) * Number(currItem.price),
            });
            yquantity = Number(item.quantity);
            yYear = item.year;
          }
        }
      });

      if (name !== "") {
        todayItemList = todayItemList.concat({
          item: name,
          quantity: tquantity,
        });
      }

      if (mname !== "") {
        monthlyItemList = monthlyItemList.concat({
          item: mname,
          date: date,
          quantity: mquantity,
        });
      }

      if (yname !== "") {
        yearlyItemList = yearlyItemList.concat({
          item: yname,
          month: month,
          quantity: xquantity,
        });
      }

      if (yYear) {
        allYearRevenueList = allYearRevenueList.concat({
          year: yYear,
          revenue: Number(yquantity) * Number(currItem.price),
        });
      }
    }

    allYearRevenueList.sort(dynamicSort("year"));
    allYearRevenueList.reduce(function (res, value) {
      if (!res[value.year]) {
        res[value.year] = { year: value.year, revenue: 0 };
        a.push(res[value.year]);
      }
      res[value.year].revenue =
        Number(res[value.year].revenue) + Number(value.revenue);
      return res;
    }, {});
    allYearRevenueList = a;
    todayItemList.sort(dynamicSort("item"));
    monthlyItemList.sort(dynamicSort("item"));
    monthlyItemList.sort(dynamicSort("date"));
    yearlyItemList.sort(dynamicSort("item"));

    const monthss = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    yearlyItemList.sort(function (a, b) {
      return monthss[a.month] - monthss[b.month];
    });
  });

  /**
   * today chart
   */
  let todayItemArr = [];
  let todayQuantityArr = [];
  todayItemList.forEach(function (obj) {
    todayItemArr.push(obj.item);
    todayQuantityArr.push(obj.quantity);
  });

  /**
   * monthly chart 1
   */
  let monthlyDateQuantity = monthlyItemList;
  let monthlyItemArr = [],
    monthlyDateArr = [],
    monthlyQuantityArr = [],
    q = [];
  monthlyItemList.reduce(function (res, value) {
    if (!res[value.item]) {
      res[value.item] = { item: value.item, quantity: 0 };
      q.push(res[value.item]);
    }
    res[value.item].quantity =
      Number(res[value.item].quantity) + Number(value.quantity);
    return res;
  }, {});
  monthlyItemList = q;
  monthlyItemList.sort(dynamicSort("item"));
  monthlyItemList.forEach(function (obj) {
    monthlyItemArr.push(obj.item);
    monthlyDateArr.push(obj.date);
    monthlyQuantityArr.push(obj.quantity);
  });

  /**
   * monthly chart 2
   */
  let a = [];
  monthlyDateQuantity.reduce(function (res, value) {
    if (!res[value.date]) {
      res[value.date] = { date: value.date, quantity: 0 };
      a.push(res[value.date]);
    }
    res[value.date].quantity =
      Number(res[value.date].quantity) + Number(value.quantity);
    return res;
  }, {});
  monthlyDateQuantity = a;
  let monthlyDArr = [],
    monthlyQArr = [];
  monthlyDateQuantity.forEach(function (obj) {
    monthlyDArr.push(obj.date);
    monthlyQArr.push(obj.quantity);
  });

  /**
   * yearly chart 1
   */
  let yearlyMonthQuantity = yearlyItemList;
  let yearlyMonthArr = [],
    yearlyItemArr = [],
    yearlyQuantityArr = [],
    w = [];
  yearlyItemList.reduce(function (res, value) {
    if (!res[value.item]) {
      res[value.item] = { item: value.item, quantity: 0 };
      w.push(res[value.item]);
    }
    res[value.item].quantity =
      Number(res[value.item].quantity) + Number(value.quantity);
    return res;
  }, {});
  yearlyItemList = w;
  yearlyItemList.sort(dynamicSort("item"));
  yearlyItemList.forEach(function (obj) {
    yearlyMonthArr.push(obj.month);
    yearlyItemArr.push(obj.item);
    yearlyQuantityArr.push(obj.quantity);
  });

  /**
   * yearly chart 2
   */
  let b = [];
  yearlyMonthQuantity.reduce(function (res, value) {
    if (!res[value.month]) {
      res[value.month] = { month: value.month, quantity: 0 };
      b.push(res[value.month]);
    }
    res[value.month].quantity =
      Number(res[value.month].quantity) + Number(value.quantity);
    return res;
  }, {});
  yearlyMonthQuantity = b;
  let yearlyMArr = [],
    yearlyQArr = [];
  yearlyMonthQuantity.forEach(function (obj) {
    yearlyMArr.push(obj.month);
    yearlyQArr.push(obj.quantity);
  });

  /**
   * all years chart
   */
  let allYearNameArr = [],
    allYearQuantityArr = [];
  allYearRevenueList.forEach(function (obj) {
    allYearNameArr.push(obj.year);
    allYearQuantityArr.push(obj.revenue);
    total = Number(total) + Number(obj.revenue);
  });

  // const todayData = {
  //   labels: todayItemArr,
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: todayQuantityArr,
  //       backgroundColor: generateColors(todayItemArr),
  //     },
  //   ],
  // };
  // const monthlyData = {
  //   labels: monthlyItemArr,
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: monthlyQuantityArr,
  //       backgroundColor: generateColors(monthlyItemArr),
  //     },
  //   ],
  // };
  // const yearlyData = {
  //   labels: yearlyItemArr,
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: yearlyQuantityArr,
  //       backgroundColor: generateColors(yearlyMonthArr),
  //     },
  //   ],
  // };
  // const allYearData = {
  //   labels: allYearNameArr,
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: allYearQuantityArr,
  //       backgroundColor: generateColors(allYearNameArr),
  //     },
  //   ],
  // };

  return loader ? (
    <div
      className="menu-body-1"
      style={{ position: "relative", background: "black" }}
    >
      <div class="loader"></div>
    </div>
  ) : (
    <div className="admin-analytics-container">
      <div className="admin-analytics-graph-data">
        <div className="admin-analytics-graph-data-container">
          <div className="admin-analytics-graph-data-container-in">
            <Bar
              data={{
                labels: todayItemArr,
                datasets: [
                  {
                    minBarLength: 20,
                    label: "No. of Orders",
                    data: todayQuantityArr,
                    backgroundColor: "rgba(0,0,0,.7)",
                    // borderColor: "black",
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                  y: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                },
                maintainAspectRatio: false,
                indexAxis: "x",
                elements: {
                  bar: {
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Items Ordered Today (Items-Orders Relation)",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="admin-analytics-graph-data-container">
          <div className="admin-analytics-graph-data-container-in">
            <Bar
              data={{
                labels: monthlyItemArr,
                datasets: [
                  {
                    label: "No. of Orders",
                    data: monthlyQuantityArr,
                    // backgroundColor: "red",
                    backgroundColor: "rgba(0,0,0,.7)",
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                  y: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                },
                maintainAspectRatio: false,
                indexAxis: "x",
                elements: {
                  bar: {
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Items Ordered This Month (Items-Orders Relation)",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="admin-analytics-graph-data-container">
          <div className="admin-analytics-graph-data-container-in">
            <Bar
              data={{
                labels: monthlyDArr,
                datasets: [
                  {
                    label: "No. of Orders",
                    data: monthlyQArr,
                    // backgroundColor: "blue",
                    backgroundColor: "rgba(0,0,0,.7)",
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                  y: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                },
                maintainAspectRatio: false,
                indexAxis: "x",
                elements: {
                  bar: {
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Items Ordered This Month (Dates-Orders Relation)",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="admin-analytics-graph-data-container">
          <div className="admin-analytics-graph-data-container-in">
            <Bar
              data={{
                labels: yearlyItemArr,
                datasets: [
                  {
                    label: "No. of Orders",
                    data: yearlyQuantityArr,
                    // backgroundColor: "red",
                    backgroundColor: "rgba(0,0,0,.7)",
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                  y: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                },
                maintainAspectRatio: false,
                indexAxis: "x",
                elements: {
                  bar: {
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Items Ordered This Year (Items-Orders Relation)",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="admin-analytics-graph-data-container">
          <div className="admin-analytics-graph-data-container-in">
            <Bar
              data={{
                labels: yearlyMArr,
                datasets: [
                  {
                    label: "No. of Orders",
                    data: yearlyQArr,
                    // backgroundColor: "blue",
                    backgroundColor: "rgba(0,0,0,.7)",
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                  y: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                },
                maintainAspectRatio: false,
                indexAxis: "x",
                elements: {
                  bar: {
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Items Ordered This Year (Months-Orders Relation)",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="admin-analytics-graph-data-container">
          <div className="admin-analytics-graph-data-container-in">
            <Bar
              data={{
                labels: allYearNameArr,
                datasets: [
                  {
                    label: "Revenue Generated",
                    data: allYearQuantityArr,
                    // backgroundColor: "red",
                    backgroundColor: "rgba(0,0,0,.7)",
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                  y: {
                    grid: {
                      offset: true,
                    },
                    beginAtZero: true,
                  },
                },
                maintainAspectRatio: false,
                indexAxis: "x",
                elements: {
                  bar: {
                    borderWidth: 0,
                    borderRadius: 4,
                  },
                },
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Yearly Revenue (Years-Revenue Relation)",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <h1 className="admin-analytics-total">
        Total Revenue Generated: {total} INR
      </h1>
    </div>
  );
};

export default AdminReport;
