const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const key = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
  table: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: Number,
  },
  cart: [
    {
      title: {
        type: String,
      },
      price: {
        type: Number,
      },
      img: {
        type: String,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  invoice: [
    {
      title: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, key);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.addItems = async function (title, price, image, quantity) {
  try {
    this.cart = this.cart.concat({
      title: title,
      price: price,
      img: image,
      quantity: quantity,
    });
    await this.save();
    return title;
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.addquantity = async function (title, price, quantity) {
  try {
    let index;
    for (i = 0; i < this.cart.length; i++) {
      if (this.cart[i].title == title && this.cart[i].quantity == quantity) {
        this.cart[i].quantity = this.cart[i].quantity + 1;
        index = i;
        break;
      }
    }
    await this.save();
    return {
      title: title,
      price: price,
      quantity: this.cart[index].quantity,
      index: index,
    };
  } catch (err) {
    console.log(err);
  }
};
userSchema.methods.findItem = async function (title) {
  try {
    let i = 0;
    let status = false;
    for (i = 0; i < this.cart.length; i++) {
      if (this.cart[i].title === title) {
        status = true;
        break;
      }
    }
    return status;
  } catch (err) {
    console.log(err);
  }
};
userSchema.methods.subquantity = async function (title, price, quantity) {
  try {
    let index;
    for (i = 0; i < this.cart.length; i++) {
      if (this.cart[i].title == title && this.cart[i].quantity == quantity) {
        if (this.cart[i].quantity == 1) {
          index = i;
          break;
        } else {
          this.cart[i].quantity = this.cart[i].quantity - 1;
          index = i;
          break;
        }
      }
    }
    await this.save();
    return {
      title: title,
      price: price,
      quantity: this.cart[index].quantity,
      index: index,
    };
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.invoiceItems = async function () {
  try {
    for (let i = 0; i < this.cart.length; i++) {
      let check = true;
      for (let j = 0; j < this.invoice.length; j++) {
        if (this.invoice[j].title === this.cart[i].title) {
          this.invoice[j].quantity =
            Number(this.invoice[j].quantity) + Number(this.cart[i].quantity);
          check = false;
          break;
        }
      }
      if (check===true) {
        this.invoice = this.invoice.concat({
          title: this.cart[i].title,
          price: this.cart[i].price,
          quantity: this.cart[i].quantity,
        });
      }
      await this.save();
    }
    return this.invoice;
  } catch (err) {
    console.log(err);
  }
};
userSchema.methods.invoiceItems1 = async function (items) {
  try {
    for (let i = 0; i < items.length; i++) {
      let check = true;
      for (let j = 0; j < this.invoice.length; j++) {
        if (this.invoice[j].title === items[i].title) {
          this.invoice[j].quantity =
            Number(this.invoice[j].quantity) + Number(items[i].quantity);
          check = false;
          break;
        }
      }
      if (check===true) {
        this.invoice = this.invoice.concat({
          title: items[i].title,
          price: items[i].price,
          quantity: items[i].quantity,
        });
      }
      await this.save();
    }
    return this.invoice;
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.adminDel = async function (title, price, quantity) {
  try {
    let index;
    for (i = 0; i < this.invoice.length; i++) {
      if (
        this.invoice[i].title === title &&
        this.invoice[i].quantity === quantity
      ) {
        this.invoice[i].quantity = this.invoice[i].quantity - 1;
        index = i;
        break;
      }
    }
    await this.save();
    return {
      title: title,
      price: price,
      quantity: this.invoice[index].quantity,
      index: index,
    };
  } catch (e) {
    console.log(e);
  }
};
userSchema.methods.adminAdd = async function (title, price, quantity) {
  try {
    let index;
    for (i = 0; i < this.invoice.length; i++) {
      if (
        this.invoice[i].title === title &&
        this.invoice[i].quantity === quantity
      ) {
        this.invoice[i].quantity = this.invoice[i].quantity + 1;
        index = i;
        break;
      }
    }
    await this.save();
    return {
      title: title,
      price: price,
      quantity: this.invoice[index].quantity,
      index: index,
    };
  } catch (e) {
    console.log(e);
  }
};
const User = mongoose.model("USERS", userSchema);
module.exports = User;
