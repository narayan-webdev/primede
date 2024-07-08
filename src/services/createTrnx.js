import { randomBytes as _randomBytes } from "crypto";
import Transaction from "../api/transaction/models/transaction.js";

const generateTrnId = (prefix) => {
  const randomBytes = _randomBytes(5); // Generate 5 random bytes
  const transactionId =
    (prefix || "WLT") + randomBytes.toString("hex").toUpperCase();
  return transactionId.substring(0, 13); // Take the first 10 characters
};

const remarkGenerator = ({ purpose, mode, amount, txn_type }) => {
  return `transaction of amount ${amount} has been ${txn_type} for purpose ${purpose} through mode ${mode}`;
};

export async function createTransaction({
  purpose,
  mode,
  amount,
  txn_type,
  UserId,
  transaction,
}) {
  try {
    let txn_id = generateTrnId("WLT");
    const remark = remarkGenerator({ purpose, mode, amount, txn_type });
    await Transaction.create(
      {
        purpose,
        txn_id,
        txn_type,
        remark,
        mode,
        amount,
        UserId,
      },
      { transaction }
    );
  } catch (error) {
    console.log(error);
  }
}