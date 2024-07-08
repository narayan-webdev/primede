import { DataTypes } from "sequelize";
// const Format = require('./format')

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Media = sequelize.define("Media", {
  name: {
    type: DataTypes.STRING,
    require: true,
  },
  url: {
    type: DataTypes.STRING,
    require: true,
  },
  // width: {
  //   type: DataTypes.INTEGER,
  //   require: true,
  // },
  // height: {
  //   type: DataTypes.INTEGER,
  //   require: true,
  // },
  // size: {
  //   type: DataTypes.DECIMAL,
  //   require: true,
  // },
});

Media.sync();
export default Media;
