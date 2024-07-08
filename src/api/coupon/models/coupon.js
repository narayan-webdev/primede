import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Coupon = sequelize.define("Coupon", {
  coupon_code: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.STRING,
  },
  discount_value: {
    type: DataTypes.DECIMAL,
  },
  valid_from: {
    type: DataTypes.DATE,
  },
  valid_to: {
    type: DataTypes.DATE,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  discount_type: {
    type: DataTypes.ENUM("FLAT", "PERCENTAGE"),
    default: "FLAT",
  },
});

// Define associations or additional methods as needed

Coupon.sync();
export default Coupon;
