import { DataTypes } from "sequelize";
import sequelize from "../../../../database/index.js";

const Global = sequelize.define(
  "Global",
  {
    subscription_price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    cod_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    cod_prepaid: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: true,
    },
    cod_prepaid_type: {
      type: DataTypes.ENUM("PRICE", "PERCENTAGE"),
      allowNull: true,
      defaultValue: "PRICE",
    },
    prepaid_discount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      allowNull: true,
    },
    prepaid_discount_type: {
      type: DataTypes.ENUM("PRICE", "PERCENTAGE"),
      allowNull: true,
      defaultValue: "PRICE",
    },
    shipping_value: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    shipping_value_type: {
      type: DataTypes.ENUM("PRICE", "PERCENTAGE"),
      defaultValue: "PRICE",
    },
    razorpay_key: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "rzp_test_X862k3ZFG0a9mY"
    },
    razorpay_secret: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "igRAhI6pszT6iXlD743eOM3O"
    },
    withdraw_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    razorpayX_account_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shiprocket_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shiprocket_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_shiprocket_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    shiprocket_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    selected_payment_gateway: {
      type: DataTypes.ENUM("RAZORPAY", "CASHFREE", "PHONEPE", "NONE"),
      defaultValue: "RAZORPAY",
    },
    selected_shipment: {
      type: DataTypes.ENUM("CUSTOM_COURIER", "SHIPROCKET", "BLUE_DART"),
      defaultValue: "CUSTOM_COURIER",
    },
    cashfree_client_secret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cashfree_client_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phonepe_merchant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phonepe_merchant_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phonepe_key_index: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firebase_auth: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    firebase_topic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_verification_method: {
      type: DataTypes.ENUM("FIREBASE", "MSG91", "INTERAKT"),
      allowNull: true,
      defaultValue: "INTERAKT"
    },
    msg91_template_id: {
      type: DataTypes.STRING,
    },
    msg91_api_key: {
      type: DataTypes.STRING,
    },
    return_request: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    return_request_period: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    store_link: {
      type: DataTypes.STRING,
    },
    personal_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notification_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    interakt_api_key: {
      type: DataTypes.STRING,
      defaultValue: "MjVFdVlrTXB2UlpWdjFtcm1adnozaURRNlNTLTNrcEtfenVJck9pNGNTdzo="
    },
    otp_template_id: {
      type: DataTypes.STRING,
      defaultValue: "send_otp"
    },
    campaign_template_id: {
      type: DataTypes.STRING,
    },
    order_template_id: {
      type: DataTypes.STRING,
    },
    product_template_id: {
      type: DataTypes.STRING,
    },
    collection_template_id: {
      type: DataTypes.STRING,
    },
    subscription_template_id: {
      type: DataTypes.STRING,
    },
    payout_template_id: {
      type: DataTypes.STRING,
    },
    facebook_pixel: {
      type: DataTypes.STRING,
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["id"],
      },
    ],
  }
);

Global.sync();
export default Global
