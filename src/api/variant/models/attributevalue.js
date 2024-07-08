import { DataTypes } from "sequelize";
import sequelize from "../../../../database/index.js";
const AttributeValue = sequelize.define("AttributeValue", {
    value: {
        type: DataTypes.STRING
    },
    hex_code: {
        type: DataTypes.STRING,
        allowNull: true
    }
})
AttributeValue.sync();
export default AttributeValue;