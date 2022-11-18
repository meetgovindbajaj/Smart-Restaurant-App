const Menu = require("../model/menuSchema");
const TodaySpecial = require("../model/todaySpecialSchema");

const authenticate2 = async (req, res, next) => {
  try {
    const rootMenu = await Menu.find();
    const rootTodaySpecial = await TodaySpecial.find();
    if (!rootMenu) {
      throw new Error("Menu not found");
    }
    req.rootMenu = rootMenu;
    req.menuID = rootMenu._id;
    req.rootTodaySpecial = rootTodaySpecial;
    req.todaySpecialID = rootTodaySpecial._id;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token provided");
  }
};

module.exports = authenticate2;
