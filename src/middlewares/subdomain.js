import app from "../../server.js";
// import { B2B, MAIN_API, ECOMMERCE, RESELLER_ECOM } from "../constants/api.js";
import * as constantAPIs from "../constants/api.js";
import { errorResponse } from "../services/errorResponse.js";
import dbCache from "../utils/dbCache.js";
import dbConnection from "../utils/dbConnection.js";

export default async (req, res, next) => {
  let sharedRoutes = [
    "products",
    "marquees",
    "stories",
    "product-reviews",
    "product-policies",
    "promotional-messages",
    "variants",
    "store-info",
    "uploads",
    "categories",
    "search",
    "store-banners",
    "leads",
    "privacy-policy",
    "about-us",
    "return-orders",
    "terms",
    "tags",
    "cart",
    "store-transactions",
    "contact-us",
    "campaigns",
    "tutorial",
    "bulk-pricing",
    "collections",
    "collection-static",
    "product-metrics",
    "sub-categories",
    "store-policy",
    "store-setting",
    "collection-static",
    "sub-categories",
    "store-policy",
    "store-settings",
    "groups",
    "store-users",
    "address",
    "orders",
    "order-variants",
    "testimonials",
    "payment-log",
    "public",
    "order-variant",
    "custom-courier",
    "wallets",
    "roles",
    "permissions",
    "store-permissions",
    "store-plans",
    "store-roles",
    "store-subscriptions",
    "store-globals",
    "store-support-tickets",
    "ship-rocket-orders",
    "ship-rocket-order-items",
    "ship-rocket-returns",
    "store-leads",
    "store-roles",
    "bulk-pricings",
    "store-activity-logs",
    "global-brands",
    "store-global-brands",
    "store-free-plans",
    "coupons"
  ];
  const parts = req.hostname.split(".");

  console.log(parts);
  if (parts.length > 1) {
    console.log("greater");
    let api = req.url.split("?")[0].split("/")[2];
    console.log(api);
    if (!sharedRoutes.includes(api)) {
      return res.status(404).send({
        error: {
          status: 404,
          name: "Not found!",
          messge: "The page your'e looking for does not exists in sub-domain",
        },
      });
    } else {
      req.subdomain = parts[0];
      const main_instance = await dbConnection(null);
      const user = await main_instance.models.User.findOne({
        where: { subdomain: req.subdomain },
      });
      if (!user) {
        console.log("this is not a");
        return res.status(404).send(
          errorResponse({
            status: 404,
            message: "Requested api endpoint does not exists because of user",
          })
        );
      }

      const storeType = user.store_type;
      const APIS = constantAPIs[storeType];

      if (!APIS.includes(api) || user.is_active === false) {
        console.log("api not matched");
        return res.status(400).send(
          errorResponse({
            message: `${user.is_active === false
              ? "store is in_active"
              : "This api does not exists for store type" + storeType
              } `,
          })
        );
      } else {
        next();
      }
    }
  } else {
    let api = req.url.split("?")[0].split("/")[2];
    if (!_MAIN_API.includes(api))
      return res.status(404).send({
        error: {
          status: 404,
          name: "Not found!",
          messge:
            "The page your'e looking for does not  exists in admin domain !",
        },
      });
    req.subdomain = null;
    next();
  }
};
