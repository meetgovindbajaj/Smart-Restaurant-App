const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      required: true,
    },
    kotNumber: {
      type: Number,
      required: true,
    },
    table: {
      type: Number,
      required: true,
    },
    cname: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      default: "",
    },
    cgst: {
      type: Number,
      required: true,
    },
    sgst: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderList: [
      {
        item: {
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
      },
    ],
  },
  {
    timestamps: true,
  }
);
invoiceSchema.methods.invoiceItems = async function (items) {
  try {
    let t = this.total;
    for (let i = 0; i < items.length; i++) {
      let check = true;
      for (let j = 0; j < this.orderList.length; j++) {
        if (this.orderList[j].item === items[i].title) {
          this.orderList[j].quantity =
            Number(this.orderList[j].quantity) + Number(items[i].quantity);
          check = false;
          t = Number(t) + Number(items[i].price) * Number(items[i].quantity);
          break;
        }
      }
      if (check) {
        this.orderList = this.orderList.concat({
          item: items[i].title,
          price: items[i].price,
          quantity: items[i].quantity,
        });
        t = Number(t) + Number(items[i].price) * Number(items[i].quantity);
      }
    }
    this.total = Number(t);
    await this.save();
    return this.orderList;
  } catch (err) {
    console.log(err);
  }
};

invoiceSchema.methods.updateQuantity = async function (item, quantity) {
  try {
    let result = false;
    if (Number(quantity) === 0) {
      if (this.orderList.length <= 1) {
        return result;
      }
      let filter = this.orderList.filter((i) => i.item !== item);
      this.orderList = filter;
      result = true;
    } else {
      for (let i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i].item === item) {
          this.orderList[i].quantity = Number(quantity);
          result = true;
          break;
        }
      }
    }
    let t = 0;
    for (let i = 0; i < this.orderList.length; i++) {
      t =
        Number(t) +
        Number(this.orderList[i].quantity) * Number(this.orderList[i].price);
    }
    this.total = Number(t);
    await this.save();
    return result;
  } catch (e) {
    console.log(e);
  }
};

invoiceSchema.methods.updateDiscount = async function (name, phone, discount) {
  if (name !== "") {
    this.cname = name;
  }
  if (phone !== "") {
    this.phone = Number(phone);
  }
  if (discount !== "") {
    this.discount = Number(discount);
  }
  await this.save();
  return true;
};
const Invoice = mongoose.model("INVOICE", invoiceSchema);
module.exports = Invoice;
