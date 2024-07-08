import { DataTypes } from "sequelize";
import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Variant = sequelize.define("Variant", {
  name: {
    type: DataTypes.STRING,
    require: true,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    require: true,
  },
  strike_price: {
    type: DataTypes.DECIMAL,
    require: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Variant.sync();
export default Variant;