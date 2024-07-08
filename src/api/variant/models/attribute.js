import { DataTypes } from "sequelize";
import sequelize from "../../../../database/index.js";


const Attribute = sequelize.define("Attribute", {
    name: {
        type: DataTypes.STRING
    },
})
Attribute.sync();
export default Attribute;