import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Collection = sequelize.define("Collection", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Collection.sync();
export default Collection;
