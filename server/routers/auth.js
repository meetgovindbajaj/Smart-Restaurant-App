const express = require("express");
const router = express.Router();
require("../db/conn");
const hashing = require("bcryptjs");
const User = require("../model/userSchema");
const Menu = require("../model/menuSchema");
const Admin = require("../model/adminSchema");
const authenticate = require("../middlewares/authenticate");
const authenticate1 = require("../middlewares/authenticate1");
const authenticate2 = require("../middlewares/authenticate2");
const TodaySpecial = require("../model/todaySpecialSchema");
const Message = require("../model/messageSchema");
const Info = require("../model/infoSchema");
const Invoice = require("../model/invoiceSchema");
let count = 0;
//USER ROUTERS-----------------------------------------------------//
router.post(`/Register`, async (req, res) => {
  const { table, name, phone } = req.body;
  if (!table) {
    return res
      .status(422)
      .json({ status: 422, error: "please fill all required field" });
  }
  // try {
  let token;
  const userExist = await User.findOne({ table: table });
  if (userExist) {
    token = await userExist.generateAuthToken();
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    res
      .status(201)
      .json({ status: 201, message: "user registered successfully" });
  } else {
    const user = new User({
      table,
      name: name ? name : "",
      phone: phone ? phone : "",
    });
    await user.save();
    const userExist1 = await User.findOne({ table: table });
    if (userExist1) {
      token = await userExist1.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      });
      res
        .status(201)
        .json({ status: 201, message: "user registered successfully" });
    }
  }
  // } catch (err) {
  //   console.log(err);
  // }
});
router.post(`/Register1`, async (req, res) => {
  const { table, name, phone } = req.body;
  if (!table) {
    return res
      .status(422)
      .json({ status: 422, error: "please fill all required field" });
  }
  const user = new User({
    table,
    name: name ? name : "",
    phone: phone ? phone : "",
  });
  await user.save();
  // const userExist1 = await User.findOne({ table: table });
  // if (userExist1) {
  //   token = await userExist1.generateAuthToken();
  //   res.cookie("jwtoken", token, {
  //     expires: new Date(Date.now() + 3600000),
  //     httpOnly: true,
  //   });
  //   res
  //     .status(201)
  //     .json({ status: 201, message: "user registered successfully" });
  // }
  res
    .status(201)
    .json({ status: 201, message: "user registered successfully" });
});
router.get(`/Home`, authenticate, async (req, res) => {
  return res.send(req.rootUser);
});
router.get("/getdata", authenticate, async (req, res) => {
  return res.send(req.rootUser);
});
router.post(`/Home/Menu`, authenticate, async (req, res) => {
  try {
    const { title, price, img, quantity } = req.body;
    const userExist = await User.findOne({ _id: req.userID });
    if (userExist) {
      let findItem = await userExist.findItem(title);
      if (!findItem) {
        let itemName = await userExist.addItems(title, price, img, quantity);
        if (itemName) {
          return res
            .status(201)
            .json({ status: 201, message: "item added to cart" });
        } else {
          return res
            .status(421)
            .json({ status: 422, error: "Some Error Occured!" });
        }
      } else {
        return res
          .status(422)
          .json({ status: 421, error: "item already in cart" });
      }
    }
  } catch (err) {
    res.send("error adding to cart");
  }
});
router
  .get("/Home/Cart", authenticate, async (req, res) => {
    return res.send(req.rootUser);
  })
  .post(`/Home/Cart`, authenticate, async (req, res) => {
    try {
      const { items } = req.body;
      const userExist = await User.findOne({ _id: req.userID });
      await userExist.invoiceItems();
      const userCart = await User.updateOne(
        { _id: req.userID },
        { $pull: { cart: {} } }
      );
      // for (let i = 0; i < items.length; i++) {
      //   const findItem = await Menu.findOne({ title: items[i].title });
      //   if (findItem) {
      //     await findItem.addDate(items[i].quantity);
      //   } else {
      //     const findItem1 = await TodaySpecial.findOne({
      //       title: items[i].title,
      //     });
      //     await findItem1.addDate(items[i].quantity);
      //   }
      // }
      if (userCart) {
        return res
          .status(201)
          .json({ status: 201, error: "Ordered successfully" });
      } else {
        return res
          .status(422)
          .json({ status: 400, error: "Some Error Occured!" });
      }
    } catch (err) {
      res.send("error adding to cart");
    }
  })
  .post(`/Home/Cart/Delete`, authenticate, async (req, res) => {
    const { title, price } = req.body;
    const userExist = await User.updateOne(
      { _id: req.userID },
      { $pull: { cart: { title, price } } }
    );
    if (userExist) {
      return res.status(201).json({ status: 201, error: "item removed" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  })
  .post(`/Home/Cart/Add`, authenticate, async (req, res) => {
    try {
      const { title, price, quantity } = req.body;
      const userExist = await User.findOne({
        _id: req.userID,
        title: title,
        price: price,
      });
      let addd = await userExist.addquantity(title, price, quantity);
      if (addd) {
        return res.status(201).json({
          status: 201,
          error: "item added",
          quantity: addd.quantity,
          index: addd.index,
          title: addd.title,
          price: addd.price,
        });
      } else {
        return res
          .status(422)
          .json({ status: 400, error: "Some Error Occured!" });
      }
    } catch (err) {
      console.log(err);
    }
  })
  .post(`/Home/Cart/Sub`, authenticate, async (req, res) => {
    try {
      const { title, price, quantity } = req.body;
      const userExist = await User.findOne({
        _id: req.userID,
        title: title,
        price: price,
      });
      let addd = await userExist.subquantity(title, price, quantity);
      if (addd) {
        return res.status(201).json({
          status: 201,
          error: "item removed",
          quantity: addd.quantity,
          index: addd.index,
          title: addd.title,
          price: addd.price,
        });
      } else {
        return res
          .status(422)
          .json({ status: 400, error: "Some Error Occured!" });
      }
    } catch (err) {
      console.log(err);
    }
  });
router.get("/Home/Invoice", authenticate, async (req, res) => {
  return res.send(req.rootUser);
});
router.get("/Message", async (req, res) => {
  try {
    let data = await Message.find();
    return res.json(data);
  } catch (err) {
    console.log(err);
  }
});
router.post("/Message", authenticate, async (req, res) => {
  try {
    const { table, message } = req.body;
    const userExist = await User.findOne({ _id: req.userID });
    if (userExist) {
      if (typeof message === "object") {
        message.map(async (i) => {
          const sendMessage = new Message({
            table,
            message: `${i.quantity} x ${i.title}`,
          });
          await sendMessage.save();
        });
      } else {
        const sendMessage = new Message({ table, message });
        await sendMessage.save();
      }
    }
    return res
      .status(201)
      .json({ status: 201, message: "message send successfully" });
  } catch (err) {
    console.log(err);
  }
});
router.post("/message/delete", authenticate1, async (req, res) => {
  const { table, message } = req.body;
  const userExist = await Message.deleteOne({ table, message });
  if (userExist) {
    return res.status(201).json({ status: 201, error: "item removed" });
  } else {
    return res.status(422).json({ status: 400, error: "Some Error Occured!" });
  }
});
router.get("/Delete", async (req, res) => {
  try {
    const userExist = await Message.deleteMany({});
    if (userExist) {
      return res.status(201).json({ status: 201, error: "item removed" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  } catch (err) {
    console.log(err);
  }
});

//ADMIN ROUTERS----------------------------------------------------//
router.post(`/AdminRegister`, async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  if (!name || !email || !phone || !password || !cpassword) {
    return res
      .status(422)
      .json({ status: 422, error: "please fill all required field" });
  }
  try {
    const userEmailExist = await Admin.findOne({ email: email });
    const userPhoneExist = await Admin.findOne({ phone: phone });
    if (userEmailExist) {
      return res
        .status(422)
        .json({ status: 400, error: "Email already registered!" });
    } else if (userPhoneExist) {
      return res
        .status(422)
        .json({ status: 401, error: "Phone no. already registered!" });
    } else if (password != cpassword) {
      return res
        .status(422)
        .json({ status: 402, error: "passwords are not matching" });
    }
    const user = new Admin({ name, email, phone, password, cpassword }); //taking input
    await user.save(); //saving input
    res
      .status(201)
      .json({ status: 201, message: "user registered successfully" });
  } catch (err) {
    console.log(err);
  }
});
router.post("/Adminlogin", async (req, res) => {
  let token;
  const { email, password, key } = req.body;
  if (!email || !password || !key) {
    return res
      .status(422)
      .json({ status: 422, error: "please fill all required field" });
  }
  try {
    const userExist = await Admin.findOne({ email: email }); //checking email validation
    if (!userExist) {
      return res
        .status(422)
        .json({ status: 400, error: "invalid credentails" });
    } else if (Number(key) !== Number(2597)) {
      return res
        .status(422)
        .json({ status: 400, error: "invalid credentails" });
    } else {
      const isMatch = await hashing.compare(password, userExist.password); //checking password credentials
      token = await userExist.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 2589200000),
        httpOnly: true,
      });
      if (!isMatch) {
        return res
          .status(422)
          .json({ status: 400, error: "invalid credentails" });
      } else {
        return res
          .status(200)
          .json({ status: 200, message: "login successful" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
router.get("/Adminlogout", authenticate1, async (req, res) => {
  res.clearCookie("jwtoken", { path: "/admindashboard" });
  await Admin.updateOne({ _id: req.adminID }, { $pull: { tokens: {} } });
  return res.status(200).send("Logout Successful");
});
router.get("/Admingetdata", authenticate1, async (req, res) => {
  return res.send(req.rootAdmin);
});
router.get("/Admininfo", authenticate1, async (req, res) => {
  const data = await Admin.find();
  return res.send(data);
});
router.post("/AdminInfoDel", authenticate1, async (req, res) => {
  const { email, code } = req.body;
  const data = req.rootAdmin;
  if (data.email === email) {
    return res.status(400).send({ status: 400 });
  } else if (email === "admin@gmail.com" && code !== 259700) {
    return res.status(401).send({ status: 401 });
  } else if (email !== "admin@gmail.com" && code !== 2597) {
    return res.status(401).send({ status: 401 });
  }
  const del = await Admin.findOneAndDelete({ email });
  if (del) {
    return res.status(200).send({ status: 200 });
  }
});
router.get("/Menu", authenticate2, async (req, res) => {
  return res.send(req.rootMenu);
});
router.get("/TodaySpecial", authenticate2, async (req, res) => {
  return res.send(req.rootTodaySpecial);
});
router.get("/adminMenuspecial", authenticate2, async (req, res) => {
  return res.send([req.rootMenu, req.rootTodaySpecial]);
});
router.post("/Adminhome", authenticate1, async (req, res) => {
  try {
    const { title, price, quantity, img, description, category } = req.body;
    const userContact = await Admin.findOne({ _id: req.adminID });
    if (userContact) {
      const item = new Menu({
        title,
        price,
        quantity,
        img,
        description,
        category,
      }); //taking input
      await item.save();
      return res
        .status(201)
        .json({ status: 201, message: "item added successfully" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/Admintodayspecial", authenticate1, async (req, res) => {
  try {
    const { title, price, quantity, img, description, category } = req.body;
    const userContact = await Admin.findOne({ _id: req.adminID });
    if (userContact) {
      const item = new TodaySpecial({
        title,
        price,
        quantity,
        img,
        description,
        category,
      }); //taking input
      await item.save();
      return res
        .status(201)
        .json({ status: 201, message: "item added successfully" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  } catch (err) {
    console.log(err);
  }
});
router
  .get("/AdminUserAccess", authenticate1, async (req, res) => {
    try {
      const data = await User.find();
      return res.send(data);
    } catch (err) {
      console.log(err);
    }
  })
  .post("/AdminUserAccess", authenticate1, async (req, res) => {
    try {
      const { table, items, total, discount, name, phone } = req.body;
      if (items.items.length === 0) {
        const userExist = await User.deleteMany({ table: table });
        if (userExist) {
          return res.status(202).json({ status: 202, error: "item removed" });
        } else {
          return res
            .status(422)
            .json({ status: 400, error: "Some Error Occured!" });
        }
      }
      const exist = await User.findOne({ table: table });
      if (exist) {
        const a = await Info.findOne((_id = req.infoID));
        const data = await a.updateInvoice();
        // console.log(data, items);
        if (data.result === true) {
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
          const inv = new Invoice({
            invoiceNumber: data.invoiceId,
            kotNumber: data.kotNo,
            table: table,
            cname: name,
            phone: Number(phone),
            cgst: data.cgst,
            sgst: data.sgst,
            discount: discount + data.discount,
            time: `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
            day: d.getDay(),
            date: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            total: total,
            orderList: items.items,
          });
          await inv.save();
          if (inv) {
            const userExist = await User.deleteMany({ table: table });
            if (userExist) {
              return res.status(201).json({
                status: 201,
                error: "item removed",
                invoiceNumber: data.invoiceId,
                kotNumber: data.kotNo,
                table: table,
                date: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
                time: `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
                items: items.items,
                cgst: data.cgst,
                sgst: data.sgst,
                total: total,
                discount: discount + data.discount,
              });
            } else {
              return res
                .status(422)
                .json({ status: 400, error: "Some Error Occured!" });
            }
          } else {
            return res
              .status(422)
              .json({ status: 400, error: "Some Error Occured!" });
          }
        } else {
          return res
            .status(422)
            .json({ status: 400, error: "Some Error Occured!" });
        }
      } else {
        return res
          .status(422)
          .json({ status: 400, error: "Some Error Occured!" });
      }
    } catch (err) {
      console.log(err);
    }
  });
router.post("/delItem", authenticate1, async (req, res) => {
  try {
    const { table, title, price, quantity } = req.body;
    // console.log(table, title, price, quantity);
    const userExist = await User.findOne({
      table: table,
    });
    if (userExist) {
      const del = await userExist.adminDel(title, price, quantity);
      if (del) {
        // const findItem = await Menu.findOne({ title: title });
        // if (findItem) {
        //   await findItem.remDate1(quantity);
        // } else {
        //   const findItem1 = await TodaySpecial.findOne({
        //     title,
        //   });
        //   await findItem1.remDate1(quantity);
        // }
        return res.status(201).json({
          status: 201,
          error: "item removed",
          quantity: del.quantity,
          index: del.index,
          title: del.title,
          price: del.price,
        });
      } else {
        return res
          .status(422)
          .json({ status: 400, error: "Some Error Occured!" });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
router.post("/addItem", authenticate1, async (req, res) => {
  try {
    const { table, title, price, quantity } = req.body;
    // console.log(table, title, price, quantity);
    const userExist = await User.findOne({
      table: table,
    });
    if (userExist) {
      const del = await userExist.adminAdd(title, price, quantity);
      if (del) {
        // let items = [];
        // items = items.concat({
        //   title: title,
        //   price: price,
        //   quantity: Number(1),
        // });
        // for (let i = 0; i < items.length; i++) {
        //   const findItem = await Menu.findOne({ title: items[i].title });
        //   if (findItem) {
        //     await findItem.addDate1(quantity);
        //   } else {
        //     const findItem1 = await TodaySpecial.findOne({
        //       title: items[i].title,
        //     });
        //     await findItem1.addDate1(quantity);
        //   }
        // }
        return res.status(201).json({
          status: 201,
          error: "item added",
          quantity: del.quantity,
          index: del.index,
          title: del.title,
          price: del.price,
        });
      } else {
        return res
          .status(422)
          .json({ status: 400, error: "Some Error Occured!" });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
router.post("/deleteItem", authenticate1, async (req, res) => {
  try {
    const { table, title, price, quantity } = req.body;
    const userExist = await User.updateOne(
      { table },
      { $pull: { invoice: { title, price } } }
    );
    if (userExist) {
      // const findItem = await Menu.findOne({ title: title });
      // if (findItem) {
      //   await findItem.remDate(quantity);
      // } else {
      //   const findItem1 = await TodaySpecial.findOne({
      //     title,
      //   });
      //   await findItem1.remDate(quantity);
      // }
      return res.status(201).json({ status: 201, error: "item removed" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  } catch (e) {
    console.log(e);
  }
});
router.post("/swap", authenticate1, async (req, res) => {
  try {
    const { table, newTable } = req.body;
    const userExist = await User.updateMany({ table }, { table: newTable });
    if (userExist) {
      return res.status(201).json({ status: 201, error: "table swaped" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  } catch (e) {
    console.log(e);
  }
});
router.post("/AdminUserItemAdd", authenticate1, async (req, res) => {
  try {
    const { table, items } = req.body;
    const userExist = await User.findOne({ table });
    if (userExist) {
      await userExist.invoiceItems1(items);
      // for (let i = 0; i < items.length; i++) {
      //   const findItem = await Menu.findOne({ title: items[i].title });
      //   if (findItem) {
      //     await findItem.addDate(items[i].quantity);
      //   } else {
      //     const findItem1 = await TodaySpecial.findOne({
      //       title: items[i].title,
      //     });
      //     await findItem1.addDate(items[i].quantity);
      //   }
      // }
      return res.status(201).json({ status: 201, error: "Saved successfully" });
    }
  } catch (e) {
    console.log(e);
  }
});
router
  .get("/AdminMenuEdit", authenticate2, async (req, res) => {
    return res.send(req.rootMenu);
  })
  .post("/adminMenuEdit/Delete", authenticate1, async (req, res) => {
    const { title } = req.body;
    const userExist = await Menu.deleteOne({ title: title });
    if (userExist) {
      return res.status(201).json({ status: 201, error: "item removed" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  });
router
  .get("/AdminTodaySpecialEdit", authenticate2, async (req, res) => {
    return res.send(req.rootTodaySpecial);
  })
  .post("/AdminTodaySpecialEdit/Delete", authenticate1, async (req, res) => {
    const { title } = req.body;
    const userExist = await TodaySpecial.deleteOne({ title: title });
    if (userExist) {
      return res.status(201).json({ status: 201, error: "item removed" });
    } else {
      return res
        .status(422)
        .json({ status: 400, error: "Some Error Occured!" });
    }
  });
router
  .get("/restroInfo", authenticate1, async (req, res) => {
    return res.send(req.rootInfo);
  })
  .post("/restroInfoEdit", authenticate1, async (req, res) => {
    try {
      const {
        title,
        email,
        phone,
        landline,
        address,
        gst,
        category,
        cgst,
        sgst,
        discount,
      } = req.body;
      const userContact = await Info.findOne((_id = req.infoID));
      if (userContact) {
        const result = await userContact.setInfo(
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
        );
        if (result) {
          return res
            .status(201)
            .json({ status: 201, message: "Info Updated Successfully" });
        } else {
          return res
            .status(400)
            .json({ status: 400, error: "Some Error Occured!" });
        }
      } else {
        return res
          .status(400)
          .json({ status: 400, error: "Some Error Occured!" });
      }
    } catch (err) {
      console.log(err);
    }
  });
router
  .get("/invoiceInfo", authenticate1, authenticate2, async (req, res) => {
    return res.send([req.rootInvoice,req.rootMenu,req.rootTodaySpecial]);
  })
  .post("/invoiceInfo", authenticate1, async (req, res) => {
    try {
      const { invoId } = req.body;
      const Exist = await Invoice.findOne({ invoiceNumber: invoId });
      if (Exist) {
        res.status(201).send({ status: 201, data: Exist });
      } else {
        res.status(400).send({ status: 400 });
      }
    } catch (e) {
      console.log(e);
    }
  })
  .post("/AdminInvoiceAdd", authenticate1, async (req, res) => {
    try {
      const { invoice, items } = req.body;
      const invo = await Invoice.findOne({ invoiceNumber: invoice });
      if (invo) {
        await invo.invoiceItems(items);
        return res
          .status(201)
          .json({ status: 201, error: "Saved successfully" });
      }
    } catch (e) {
      console.log(e);
    }
  })
  .post("/AdminInvoiceEdit", authenticate1, async (req, res) => {
    try {
      const { invoice, item, quantity } = req.body;
      const Exist = await Invoice.findOne({ invoiceNumber: invoice });
      if (Exist) {
        const update = await Exist.updateQuantity(item, quantity);
        if (update) {
          return res.status(201).send({ status: 201 });
        } else {
          return res.status(401).send({ status: 401 });
        }
      }
    } catch (e) {
      console.log(e);
    }
  })
  .post("/AdminDiscount", authenticate1, async (req, res) => {
    try {
      const { invoice, name, phone, discount } = req.body;
      const Exist = await Invoice.findOne({ invoiceNumber: invoice });
      if (Exist) {
        const update = await Exist.updateDiscount(name, phone, discount);
        if (update) {
          return res.status(201).send({ status: 201 });
        } else {
          return res.status(401).send({ status: 401 });
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

module.exports = router;
