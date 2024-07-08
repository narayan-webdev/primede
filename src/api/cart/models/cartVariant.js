import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const CartVariant = sequelize.define("CartVariant", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

CartVariant.sync();
export default CartVariant;
