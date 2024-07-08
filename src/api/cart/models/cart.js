// cart.model.js
import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Cart = sequelize.define("Cart", {
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

Cart.sync();
export default Cart;