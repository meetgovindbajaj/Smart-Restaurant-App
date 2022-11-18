const mongoose = require("mongoose");
const infoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    landLine: {
      type: Number,
    },
    address: {
      type: String,
    },
    gst: {
      type: String,
    },
    category: {
      type: String,
    },
    cgst: {
      type: Number,
    },
    sgst: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    invoiceId: {
      type: Number,
    },
    kotId: [
      {
        kotNo: {
          type: Number,
        },
        kotDate: {
          type: Number,
        },
      },
    ],
    date: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
infoSchema.methods.setInfo = async function (
  title,
  email,
  phone,
  landline,
  address,
  gst,
  category,
  cgst,
  sgst,
  discount
) {
  try {
    let result = false;
    if (title !== "") {
      result = true;
      this.title = title;
    }
    if (email !== "") {
      result = true;
      this.email = email;
    }
    if (phone !== "") {
      result = true;
      this.phone = Number(phone);
    }
    if (landline !== "") {
      result = true;
      this.landLine = Number(landline);
    }
    if (address !== "") {
      result = true;
      this.address = address;
    }
    if (gst !== "") {
      result = true;
      this.gst = gst;
    }
    if (category !== "") {
      result = true;
      this.category = category;
    }
    if (cgst !== "") {
      result = true;
      this.cgst = Number(cgst);
    }
    if (sgst !== "") {
      result = true;
      this.sgst = Number(sgst);
    }
    if (discount !== "") {
      result = true;
      this.discount = Number(discount);
    }
    await this.save();
    return result;
  } catch (e) {
    console.log(e);
  }
};
infoSchema.methods.updateInvoice = async function () {
  try {
    let result = false;
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
    this.date = d.getDate();
    if (Number(this.date) === Number(this.kotId[0].kotDate)) {
      this.kotId[0].kotNo = Number(this.kotId[0].kotNo) + Number(1);
    } else {
      this.kotId[0].kotDate = this.date;
      this.kotId[0].kotNo = Number(1);
    }
    this.invoiceId = Number(this.invoiceId) + Number(1);
    result = true;
    await this.save();
    return {
      result: result,
      invoiceId: this.invoiceId,
      kotNo: this.kotId[0].kotNo,
      phone: this.phone,
      gst: this.gst,
      cgst: this.cgst,
      sgst: this.sgst,
      discount: this.discount,
      address: this.address,
    };
  } catch (e) {
    console.log(e);
  }
};
const Info = mongoose.model("INFO", infoSchema);
module.exports = Info;
