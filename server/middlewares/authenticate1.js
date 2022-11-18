const jwt = require("jsonwebtoken");
const Admin = require("../model/adminSchema");
const key = process.env.SECRET_KEY;
const Info=require("../model/infoSchema");
const Invoice=require("../model/invoiceSchema");
const authenticate1 = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, key);
    const rootAdmin = await Admin.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootAdmin) {
      throw new Error("Admin not found");
    }
    const rootInfo=await Info.find();
    const rootInvoice=await Invoice.find();
    req.token = token;
    req.rootAdmin = rootAdmin;
    req.adminID = rootAdmin._id;
    req.rootInfo=rootInfo;
    req.infoID=rootInfo._id;
    req.rootInvoice=rootInvoice;
    req.InvoiceID=rootInvoice._id;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token provided");
  }
};

module.exports = authenticate1;
