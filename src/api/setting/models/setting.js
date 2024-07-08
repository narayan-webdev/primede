import { DataTypes } from "sequelize";
import store_types from "../../../constants/store_types.js";
import sequelize from '../../../../database/index.js';
const Setting = sequelize.define("Setting", {
  store_type: {
    type: DataTypes.ENUM(...store_types),
  },
  primary_color: {
    type: DataTypes.STRING,
  },
  nav_bg_color: {
    type: DataTypes.STRING,
    defaultValue: "#FFFFFF"
  },
  nav_text_color: {
    type: DataTypes.STRING,
    defaultValue: "#222222"
  },
  secondary_color: {
    type: DataTypes.STRING,
  },
  bg_color: {
    type: DataTypes.STRING,
    defaultValue: "#222222"
  },
  text_color: {
    type: DataTypes.STRING,
  },
  button_color: {
    type: DataTypes.STRING,
  },
  is_app_enabled: {
    type: DataTypes.BOOLEAN,
  },
  is_maintenance_mode: {
    type: DataTypes.BOOLEAN,
  },
  is_store_active: {
    type: DataTypes.BOOLEAN,
  },
  store_inactive_message: {
    type: DataTypes.TEXT,
  },
  store_maintenance_message: {
    type: DataTypes.TEXT,
  },
  is_pricing_visible: {
    type: DataTypes.BOOLEAN,
  },
  is_cart_enabled: {
    type: DataTypes.BOOLEAN,
  },
  is_wallet_enabled: {
    type: DataTypes.BOOLEAN,
  },
  product_card_style: {
    type: DataTypes.ENUM(["PORTRAIT", "SQUARE"]),
  },
  category_card_style: {
    type: DataTypes.ENUM(["LANDSCAPE", "SQUARE"]),
  },
  product_list_span_mobile: {
    type: DataTypes.INTEGER,
  },
  product_list_span_desktop: {
    type: DataTypes.INTEGER,
  },
  show_marquee: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  show_collection: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  show_banner: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  show_stories: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});
Setting.sync();
export default Setting;
