import { DataTypes } from "sequelize";
import sequelize from "../../../../database/index.js";
const VariantAttribute = sequelize.define("VariantAttribute", {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    }
})
VariantAttribute.sync();
export default VariantAttribute;