import { usernames } from "../constants/reservedUsernames.js";
import { errorResponse } from "../services/errorResponse.js";

export default async (req, res, next) => {
  let username_patterns = usernames;

  let allow_username = username_patterns.map((pattern) => {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${escapedPattern.replace(/%/g, ".*")}$`, "i");
    return regex.test(req.body.username);
  });

  let allow_email = username_patterns.map((pattern) => {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${escapedPattern.replace(/%/g, ".*")}$`, "i");
    return regex.test(req.body.email);
  });

  let invalid_value = "";
  if (allow_username.includes(true)) invalid_value = req.body.username;
  if (allow_email.includes(true)) invalid_value += `" "+${req.body.email}`;

  if (invalid_value) {
    return res.status(400).send(
      errorResponse({
        message: `${invalid_value} is not allowed`,
      })
    );
  } else {
    return await next();
    // return res.status(200).send({ message: "Username Allowed" });
  }
};
