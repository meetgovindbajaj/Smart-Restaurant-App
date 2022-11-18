const mongoose = require("mongoose");

const todaySpecialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  // orderList: [
  //   {
  //     quantity: {
  //       type: Number,
  //       required: true,
  //     },
  //     day: {
  //       type: String,
  //       required: true,
  //     },
  //     date: {
  //       type: Number,
  //       required: true,
  //     },
  //     month: {
  //       type: String,
  //       required: true,
  //     },
  //     year: {
  //       type: Number,
  //       required: true,
  //     },
  //   },
  // ],
});
// todaySpecialSchema.methods.addDate = async function (quantity) {
//   try {
//     const d = new Date();
//     const m = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     let month = m[d.getMonth()];
//     const weekday = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     let day = weekday[d.getDay()];
//     this.orderList = this.orderList.concat({
//       quantity: quantity,
//       day,
//       date: d.getDate(),
//       month,
//       year: d.getFullYear(),
//     });
//     await this.save();
//     return d.getDate();
//   } catch (err) {
//     console.log(err);
//   }
// };
// todaySpecialSchema.methods.addDate1 = async function (quantity) {
//   try {
//     const d = new Date();
//     for (let i = 0; i < this.orderList.length; i++) {
//       if (
//         this.orderList[i].quantity === quantity &&
//         this.orderList[i].date === d.getDate()
//       ) {
//         // console.log(this.orderList[i].quantity);
//         this.orderList[i].quantity =
//           Number(this.orderList[i].quantity) + Number(1);
//         await this.save();
//         // console.log("added",this.orderList[i].quantity);
//         break;
//       }
//     }
//     return d.getDate();
//   } catch (err) {
//     console.log(err);
//   }
// };
// todaySpecialSchema.methods.remDate1 = async function (quantity) {
//   try {
//     const d = new Date();
//     for (let i = 0; i < this.orderList.length; i++) {
//       if (
//         this.orderList[i].quantity === quantity &&
//         this.orderList[i].date === d.getDate()
//       ) {
//         this.orderList[i].quantity =
//           Number(this.orderList[i].quantity) - Number(1);
//         await this.save();
//         break;
//       }
//     }
//     return d.getDate();
//   } catch (err) {
//     console.log(err);
//   }
// };
// todaySpecialSchema.methods.remDate = async function (quantity) {
//   try {
//     const d = new Date();
//     const remm = this.orderList.findIndex((item) =>
//       item.date === d.getDate() ? item.quantity === quantity : false
//     );
//     this.orderList.splice(remm, 1);
//     await this.save();
//     return d.getDate();
//   } catch (err) {
//     console.log(err);
//   }
// };
const TodaySpecial = mongoose.model("TODAYSPECIAL", todaySpecialSchema);
module.exports = TodaySpecial;
