import sequelize from '../../../../database/index.js';
import { DataTypes } from 'sequelize';
const Banner = sequelize.define("Banner", {
  action: {
    type: DataTypes.ENUM(["COLLECTION", "LINK", "PRODUCT"]),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM("HEADER", "SEPARATOR","PROMOTIONAL",),
    defaultValue: "HEADER"
  },
  data: {
    type: DataTypes.STRING
  }
});
Banner.sync();
export default Banner;
