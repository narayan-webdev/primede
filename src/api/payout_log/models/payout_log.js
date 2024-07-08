
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Payout_log = sequelize.define("Payout_log", {
  payout_id: {
    type: DataTypes.STRING,
  },
  fund_account_id: {
    type: DataTypes.STRING,
  },
  account_type: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.STRING,
  },
  currency: {
    type: DataTypes.STRING,
  },
  mode: {
    type: DataTypes.STRING,
  },
  purpose: {
    type: DataTypes.STRING,
  },
  vpa: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING,
  },
  contact: {
    type: DataTypes.STRING,
  },
  contact_id: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  reference_id: {
    type: DataTypes.STRING,
  },
  fund_account_contact_id: {
    type: DataTypes.STRING,
  },
  fund_bank_account_ifsc: {
    type: DataTypes.STRING,
  },
  fund_bank_account_number: {
    type: DataTypes.STRING,
  },
  fund_bank_name: {
    type: DataTypes.STRING,
  },
});

Payout_log.sync();
export default Payout_log;