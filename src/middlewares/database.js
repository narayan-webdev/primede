// middlewares/database.js
import { errorResponse } from "../services/errorResponse.js";
import createDbConnection from "../utils/dbConnection.js";

export default async (req, res, next) => {
  // Access the subdomain from the request object
  const subdomain = req.subdomain;
  const sequelize = await createDbConnection(subdomain);
  if (!sequelize) return res.status(400).send(errorResponse({ message: "Invalid Site Address", details: "Requested subdomain not found" }));
  req.db = sequelize;
  let api = req.url.split("?")[0];
  req.api = api;
  console.log(api);
  next();
};
