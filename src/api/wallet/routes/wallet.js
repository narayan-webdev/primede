import { Router } from "express";
const router = Router();
import { create, find, findOne, withdraw } from "../controllers/wallet.js";
import { validateWithdraw, validateRequest } from "../middlewares/wallet.js";
import StoreRBAC from "../../../middlewares/StoreRBAC.js";

const permissions = [
  {
    api: "wallets",
    endpoint: "/api/wallets",
    method: "POST",
    handler: "Create Wallet",
  },
  {
    api: "wallets",
    endpoint: "/api/wallets",
    method: "GET",
    handler: "List Wallets",
  },
  {
    api: "wallets",
    endpoint: "/api/wallets/:id",
    method: "GET",
    handler: "Find One Wallet",
  },
  {
    api: "wallets",
    endpoint: "/api/wallets/withdraw",
    method: "POST",
    handler: "Withdraw from Wallet",
  },
];

export default (app) => {
  router.post("/", [StoreRBAC, validateRequest], create);
  router.get("/", StoreRBAC, find);
  router.get("/:id", [StoreRBAC], findOne);
  router.post("/withdraw", [StoreRBAC, validateWithdraw], withdraw);
  // router.put("/:id", walletController.update);
  // router.delete("/:id", walletController.delete);

  app.use("/api/wallets", router);
};
const _permissions = permissions;
export { _permissions as permissions };
