import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Order_variant = sequelize.define("Order_variant", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      "NEW",
      "ACCEPTED",
      "DECLINED",
      "PROCESSING",
      "INTRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "COMPLETED",
      "PAYOUT_DONE",
      "RTO",
      "RETURN_REQUEST",
      "RETURN_ACCEPTED",
      "RETURN_DECLINED",
      "RETURN_RECEIVED",
      "RETURN_PENDING"
    ),
    allowNull: false,
  },
  is_cod_paid: {
    type: DataTypes.BOOLEAN,
  },
  note: {
    type: DataTypes.TEXT,
  },
});

Order_variant.sync();
export default Order_variant;