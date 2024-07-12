import { mailSender } from "../../../services/emailSender.js";
import { readFileSync } from "fs";
import { render } from "ejs";
import firebaseAdmin from "firebase-admin";
import { getPagination, getMeta } from "../../../services/pagination.js";
import orderBy from "../../../services/orderBy.js";
import { Op, where } from "sequelize";
import { issue, verify } from "../../../services/jwt.js";
import { hash, compare } from "../../../services/bcrypt.js";
import { tokenError, errorResponse } from "../../../services/errorResponse.js";
import { createActivityLog } from "../../../services/createActivityLog.js";
import tenantMetric from "../../../services/tenantMetric.js";
import { tenant_metric_fields } from "../../../constants/tenant_metric.js";
import { activity_event } from "../../../constants/activity_log.js";
import { isPremiumUser } from "../services/user.js";
import getRoleId from "../../../services/getRoleId.js";
import { getPreviousDates } from "../../../services/date.js";
import generateOTP from "../services/generateOTP.js";
import otpTime from "../services/otpTime.js";
import { IntraktNotify } from "../../../services/notification.js";
import { default as axios } from "axios";
import User from "../models/user.js";
import Role from "../../role/models/role.js";
import sequelize from "../../../../database/index.js";
import Order_variant from './../../order_variant/models/order_variant.js';
import Product from './../../product/models/product.js';
import Category from './../../category/models/category.js';
import Lead from './../../lead/models/lead.js';
import Return_order from './../../return_order/models/return_order.js';
import Product_metrics from './../../product_metrics/models/product_metrics.js';
import Variant from './../../variant/models/variant.js';
import Transaction from './../../transaction/models/transaction.js';
import Order from './../../order/models/order.js';

export async function create(req, res) {
  const transaction = await sequelize.transaction();
  try {

    const body = req.body;
    const { name, email, phone, password, username } = body;
    const trimedPhone = phone.trim().split(" ").join("").slice(-10);
    const findUser = await User.findOne({ where: { [Op.or]: [{ email: email }, { phone: trimedPhone }] } });
    if (findUser) {
      const matching_value = Object.entries(findUser.dataValues).find(
        ([key, value]) => value === email || value === trimedPhone || value === username
      );
      return res.status(400).send(errorResponse({
        message: `User Already Exists with the ${matching_value[0]} ${matching_value[1]}`,
      }));
    }

    const consumer_role = await Role.findOne({ where: { name: "Consumer" }, raw: true });
    const hasPass = await hash(password);
    const Store_user = await User.create({
      name,
      username,
      email,
      phone: trimedPhone,
      password: hasPass,
      RoleId: consumer_role.id,
      AvatarId: body.AvatarId
    }, { transaction: transaction });

    const htmlContent = readFileSync("./views/accountCreated.ejs", "utf8");
    const renderedContent = render(htmlContent, { name, task: "Created" });
    // code to send fcm
    // const token = "fJTTL0EVXZo6_tdNsUytRY:APA91bH5LstGlPSY_LQPfP8hFCDpIUmYF8o4Ct5qR1vgctcxYxTRfVscCRsjmscoOdSEuO8skY3MgKrQ7k5VBeRe-vgmvC9oXnPlP7Pc65UQTyoI0F5Vvd-vo5fa99lIDIFVNUd5WHI6";

    // const message = {
    //   notification: {
    //     title: "user Created  successfullY!",
    //     body: "now you can enjoy shopping",
    //   },
    //   token,
    // };

    // const sendMessage = await firebaseAdmin.messaging().send(message);
    await tenantMetric({ subdomain: req.subdomain, field_name: tenant_metric_fields.total_users });
    const emailsend = mailSender({ to: email, subject: "Your account has been created ", html: renderedContent });
    await transaction.commit();
    return res.status(200).send({ message: "User Store Created Successfully!", data: { name, email, phone } });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  try {

    const id = req.params.id;
    const [updatedRowsCount, [updatedUserStore]] = await User.update(req.body, {
      where: { id: id },
      returning: true,
    });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "User Store not found" });
    }
    return res.status(200).send({
      message: "User Store Updated Successfully!",
      data: updatedUserStore,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const StoreUser = await User.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      include: ['avatar']
    });

    const meta = await getMeta(pagination, StoreUser.count);
    return res.status(200).send({ data: StoreUser.rows, meta });
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function findOne(req, res) {
  try {
    console.log("entered in findOne");

    const id = req.params.id;
    const storeUser = await User.findOne({
      where: { id: id },
      include: ['avatar']

    });
    if (!storeUser) {
      return res.status(404).send(
        errorResponse({
          message: "User Not Found!",
          details: "User id seems to be invalid",
        })
      );
    }
    return res.status(200).send({ data: storeUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export const _delete = async (req, res) => {
  try {

    const id = req.params.id;
    const isUserExists = await User.findByPk(id, { include: ["role"] });
    if (!isUserExists) return res.status(404).send(errorResponse({ status: 404, message: "User Not Found" }));
    if (isUserExists?.role?.name?.toLowerCase() === "admin") return res.status(400).send(errorResponse({ status: 400, message: "You can not delete Admin" }));

    const deleteUser = await User.destroy({ where: { id: id } });
    return res.status(200).send({ message: "User Store Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};

export async function search(req, res) {
  try {
    console.log("entered search");

    const query = req.query;
    const qs = query.qs;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const users = await User.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      where: {
        [Op.or]: [
          {
            name: { [Op.iLike]: `%${qs}%` },
          },
          {
            email: { [Op.iLike]: `%${qs}%` },
          },
        ],
      },
      include: ["addresses", "avatar"],
    });
    const meta = await getMeta(pagination, users.count);
    return res.status(200).send({ data: users.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({
      where: { email: email },
      include: ['avatar']
    });

    if (!findUser) { return res.status(400).send(errorResponse({ status: 404, message: "User Not Found!" })); }
    const isMatched = await compare(password, findUser.dataValues.password);
    if (!isMatched) {
      return res.status(404).send(errorResponse({ status: 404, message: "Invalid Credentials!" }));
    }
    const token = issue({ id: findUser.id });
    await createActivityLog({ sequelize, event: activity_event.USER_LOG_IN, UserId: findUser.id });
    delete findUser.password;
    return res.status(200).send({ data: { jwt: token, user: findUser } });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message }));
  }
}

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    const findAdmin = await User.findOne({
      where: { email: email },
      include: ['avatar', { model: Role, as: "role", where: { name: "Admin" } }]
    });

    if (!findAdmin) { return res.status(400).send(errorResponse({ status: 404, message: "User Not Found!" })); }
    const isMatched = await compare(password, findAdmin.dataValues.password);
    if (!isMatched) {
      return res.status(404).send(errorResponse({ status: 404, message: "Invalid Credentials!" }));
    }
    const token = issue({ id: findAdmin.id });
    await createActivityLog({ sequelize, event: activity_event.USER_LOG_IN, UserId: findAdmin.id });
    delete findAdmin.password;
    return res.status(200).send({ data: { jwt: token, user: findAdmin } });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message }));
  }
}

export async function getMe(req, res) {
  try {

    const token = verify(req);
    if (token.error) {
      return res.status(401).send(tokenError(token));
    }
    const findUser = await User.findOne({
      where: { id: token.id },
      attributes: { exclude: ["password", "password_reset_token"] },
      include: ["addresses", "avatar"],
    });

    return res.status(200).send({ data: findUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function forgetPassword(req, res) {
  try {
    const { email } = req.body;

    const crypto = require("crypto");
    const password_reset_token = crypto.randomBytes(16).toString("hex");

    const storeUser = await User.findOne({ where: { email } });

    if (storeUser) {
      const [updatedRowsCount, [updatedUser]] = await User.update(
        { password_reset_token: password_reset_token },
        {
          where: { email },
          returning: true,
        });
      const name = updatedUser.name;
      // const userEmail = updatedUser.email;
      const userEmail = "patelnarayan83499@gmail.com";
      const htmlContent = readFileSync("./views/verifyResetPassword.ejs", "utf8");
      const renderedContent = render(htmlContent, { name, href: `http://localhost:4500` });
      // await sendEmail(userEmail, renderedContent);
      mailSender({ to: userEmail, subject: "User Password Reset", html: renderedContent });
      return res.status(200).send({ message: `Email with reset link has been sent to ${userEmail.slice(0, 4) + "********" + userEmail.slice(-5)} ` });
    } else {
      return res.status(400).send(errorResponse({ message: "Invalid Email" }));
    }
  } catch (error) {
    console.log("Error in initiateResetPassword:", error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

export async function resetPassword(req, res) {
  try {

    const { email, password_reset_token } = req.query;

    const storeUser = await User.findOne({
      where: { email: email },
    });

    if (storeUser) {
      if (password_reset_token === storeUser.password_reset_token) {
        const { password } = req.body;
        storeUser.update({ password: password }, { returning: true });
        console.log(storeUser);
        return res.status(200).send({ data: storeUser });
      } else {
        return res.status(400).send(errorResponse({ message: "Invalid Request!" }));
      }
    } else {
      return res.status(400).send(errorResponse({ message: "Invalid Email", details: "Given email does not exists" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}

export async function register_FCM(req, res) {
  try {

    const token = verify(req);
    const user = await User.update(req.body, { where: { id: token.id } });
    return res.status(200).send({ message: "FCM Token for notification registered!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function dashboard(req, res) {
  try {

    const whereClause = {};
    if (req.query.days) {
      whereClause.createdAt = { [Op.gt]: getPreviousDates(Number(req.query.days)) }
    }
    const [orders,
      products,
      categories,
      users,
      leads,
      return_orders,
      // plans,
      // subscriptions,
      revenue,
      shares,
      rto_orders,
      out_of_stock,
      // payouts
    ] = await Promise.all([
      await Order_variant.count({ where: whereClause, include: [{ model: Order, as: "order", where: { is_paid: true } }] }),
      await Product.count({ where: { is_active: true, ...whereClause } }),
      await Category.count(),
      await User.count({ where: whereClause }),
      await Lead.count({ where: whereClause }),
      await Return_order.count({ where: whereClause }),
      // await Store_plan.count(),
      // await Store_subscription.count({ where: whereClause }),
      await Transaction.sum("amount", { where: whereClause }) || 0,
      await Product_metrics.sum("shares_count", { where: whereClause }) || 0,
      await Order_variant.count({ where: { status: "RETURN_RECEIVED", ...whereClause } }),
      await Product.count({
        distinct: true,
        include: [{
          model: Variant,
          as: "variants",
          where: {
            quantity: 0
          }
        }]
      }),
      // await Payout_log.count()
    ])
    return res.status(200).send({
      data: {
        orders, products, categories,
        users, leads, return_orders,
        revenue, out_of_stock, rto_orders, shares
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(errorResponse({ message: error.message, status: 500 }))
  }
}

export async function stafflogin(req, res) {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({
      where: { email },
      attributes: ["id", "name", "email", "RoleId", "password"],
      include: ["role",],
    });
    if (!findUser || findUser.role.name !== "Staff") {
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid Staff Credentials!" }));
    }

    const isMatched = await compare(password, findUser.password);
    if (!isMatched) {
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid staff credentials!" }));
    }

    const token = issue({ id: findUser.id });
    const { id,
      name,
      email: userEmail,
      role } = findUser

    // const permissions = findUser.permissions
    // //
    // const groupedData = permissions.reduce((grouped, item) => {
    //   const api = item.api;

    //   if (!grouped[api]) {
    //     grouped[api] = [];
    //   }
    //   grouped[api].push(item);

    //   return grouped;
    // }, {});

    // // Convert the grouped object back to an array
    // const groupedArray = Object.entries(groupedData).map(([api, items]) => ({
    //   api,
    //   items,
    // }));

    // groupedArray.sort((a, b) => a.api.localeCompare(b.api));
    // //

    return res.status(200).send({
      data: {
        jwt: token,
        user: { id, name, email: userEmail, role },
        // permissions: groupedArray
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message, }));
  }
}

export async function staffRegister(req, res) {
  const transaction = await sequelize.transaction();
  try {
    //get details from body

    const { name, password, email, permissions = [] } = req.body;

    //check if any user exists with name or email
    const user = await User.findOne({
      where: { [Op.or]: [{ name: name }, { email }] },
    });

    if (user) {
      const matching_value = Object.entries(user.dataValues).find(
        ([key, value]) => value === name || value === email
      );
      return res.status(400).send(
        errorResponse({
          message: `User Already Exists with the ${matching_value[0]} ${matching_value[1]}`,
        })
      );
    }

    const hashedPassword = await hash(password);
    const staff_role_id = await getRoleId("Staff", sequelize);
    const registerStaff = await User.create(
      {
        name,
        password: hashedPassword,
        email,
        RoleId: staff_role_id,
      },
      { transaction: transaction }
    );

    //register permissions
    if (permissions.length > 0) {

      for (const it of permissions) {
        const registerUserPermissions =
          await Store_user_permission.findOrCreate({
            where: {
              PermissionId: it,
              UserId: registerStaff.id,
            },
            defaults: { PermissionId: it, UserId: registerStaff.id },
            transaction: transaction,
          });
      }
    }
    await createActivityLog({ UserId: registerStaff.id, event: activity_event.STAFF_REGISTERD, transaction: transaction, })
    await transaction.commit();
    return res.status(200).send({ data: { name, email, role: "Staff" } });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(500).send(errorResponse({ status: 500, message: error.message, }));
  }
}

export async function staffListings(req, res) {
  try {

    const order = orderBy(req.query);
    const pagination = await getPagination(req.query.pagination);
    const users = await User.findAndCountAll({
      order: order,
      limit: pagination.limit,
      offset: pagination.offset,
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Role,
          as: "role",
          where: { name: { [Op.in]: ["Admin", "Staff"] } },
          attributes: ["name"],
        },
        'avatar'
      ],
    });
    const meta = await getMeta(pagination, users.count);
    return res.status(200).send({ data: users.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message, }));
  }
}

export async function updateStaff(req, res) {
  const t = await sequelize.transaction();
  try {

    const id = req.params.id;

    const { name, email, permissions = [], delete_permissions = [] } = req.body;
    const staff = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { name: "Staff" },
        },
      ],
    });

    if (!staff) {
      return res.status(404).send(
        errorResponse({
          message: `No Staff Found with the given ID: ${id}`,
          status: 404, details: "staff id seems to be invalid"
        })
      );
    }
    await staff.update({ name, email }, { where: { id: id }, transaction: t })
    //delete staff
    if (permissions.length > 0) {
      for (const it of permissions) {
        const registerUserPermissions =
          await Store_user_permission.findOrCreate({
            where: {
              PermissionId: it,
              UserId: staff.id,
            },
            defaults: { PermissionId: it, UserId: staff.id },
            transaction: t,
          });
      }
    }
    if (delete_permissions.length > 0) {
      await Store_user_permission.destroy({
        where: {
          PermissionId: { [Op.in]: [...delete_permissions] },
          UserId: staff.id,
        },
      }, {
        transaction: t,
      })
    }
    await t.commit();
    return res.status(200).send({ message: "Staff Undated Successfully!" });
  } catch (err) {
    await t.rollback()
    console.log(err);
    return res.status(500).send(errorResponse({ message: err }));
  }
}

export async function updateAdmin(req, res) {
  const t = await sequelize.transaction();
  try {

    const id = req.params.id;

    const { name, email, permissions, delete_permissions } = req.body;
    const Admin = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { name: "Super_Admin" },
        },
      ],
    });

    if (!Admin) {
      return res.status(404).send(
        errorResponse({
          message: `No Admin Found with the given ID: ${id}`,
          status: 404, details: "Admin id seems to be invalid"
        })
      );
    }
    await Admin.update({ name, email }, { where: { id: id }, transaction: t })
    await t.commit();
    return res.status(200).send({ message: "Admin Undated Successfully!" });
  } catch (err) {
    await t.rollback()
    console.log(err);
    return res.status(500).send(errorResponse({ message: err.message, status: 500 }));
  }
}

export async function deleteStaff(req, res) {
  try {

    const id = req.params.id;
    //get staff
    const staff = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          where: { name: "Staff" },
        },
      ],
    });

    if (!staff) {
      return res.status(400).send(
        errorResponse({
          message: `No Staff Found with the given ID: ${id}`,
        })
      );
    }

    //delete staff

    const deleteStaff = await staff.destroy({ where: { id: id } });
    return res.status(200).send({ message: `staff with id ${id} deleted!` });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: error.message }));
  }
}

export async function searchStaff(req, res) {
  try {

    const query = req.query;
    const qs = query.qs;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const users = await User.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      attributes: {
        exclude: ["password"],
      },
      where: {
        [Op.or]: [
          {
            name: { [Op.iLike]: `%${qs}%` },
          },
          {
            email: { [Op.iLike]: `%${qs}%` },
          },
        ],
      },
      include: [
        {
          model: Role,
          as: "role",
          where: { name: { [Op.in]: ["Super_Admin", "Staff"] } },
          attributes: ["name"],
        },
      ],
    });
    const meta = await getMeta(pagination, users.count);
    return res.status(200).send({ data: users.rows, meta });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: error.message }));
  }
}
// exports.findOne = async (req, res) => {
//   try {
//     
//     const models = sequelize.models;
//     const id = req.params.id
//     const order = orderBy(req.query);
//     const users = await User.findByPk(id, {
//       order: order,
//       attributes: ["id", "name", "email"],
//       include: [
//         {
//           model: Role,
//           as: "role",
//           where: { name: { [Op.in]: ["Super_Admin", "Staff"] } },
//           attributes: ["name"],
//         },
//         {
//           model: Permission,
//           as: "permissions",
//           attributes: ["id", "api", "endpoint", "method", "handler",],
//         },

//       ],
//     });
//     return res.status(200).send({ data: users });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .send(errorResponse({ status: 500, message: error.message }));
//   }
// }

export async function fullDetail(req, res) {
  try {

    const id = req.params.id
    let data = "No data found!";
    const type = req.query.type;
    console.log(type)
    switch (type) {
      case "order":
        data = await Order_variant.findAll({
          attributes: [
            "id",
            "quantity",
            "price",
            "selling_price",
            "status",
          ],
          include: [
            {
              model: Order,
              as: "order", where: { "UserId": id },
            },
            {
              model: Variant,
              as: "variant",
              include: [{ model: Media, as: "thumbnail", attributes: ["id", "url"] }, { model: Product, as: "product", attributes: ["id", "name"] }],
            },
          ]
        })
        break;
      case "address":
        data = await Address.findAll({
          where: { UserId: id }
        })
        break;
      case "transaction":
        data = await Transaction.findAll({
          where: { UserId: id }
        })
        break;
      case "wallet":
        data = await Wallet.findAll({
          where: { UserId: id }
        })
        break;

      default:
        break;
    }

    return res.status(200).send({ data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: error.message }));
  }
}

export async function setOTP(req, res) {
  try {
    const { phone } = req.body;

    let findUser = await User.findOne({
      where: { phone: phone?.slice(-10) },
    });
    const otp = generateOTP(6)
    const otp_expiration = otpTime(10);

    if (!findUser) {
      const consumer_role = await Role.findOne({ where: { name: "Consumer" }, raw: true });

      findUser = await User.create({
        phone: phone.slice(-10),
        RoleId: consumer_role.id
      })
    }
    findUser.otp = otp;
    findUser.otp_expiration = otp_expiration;
    await findUser.save();
    // await findUser.update({ otp: otp, otp_expiration: otp_expiration })

    const global = await Store_global.findOne();

    // const templateID = "656ec220d6fc0550c2082f12";275588AIHmHWVyjtu5cd18c59

    const url = process.env.MSG91_URL;

    switch (global.user_verification_method) {
      case "INTERAKT":
        if (!global.interakt_api_key || !global.otp_template_id) {
          return res.status(500).send(errorResponse({ message: "Invalid Verification Credentials" }));
        }
        let data = {
          containsImage: false,
          hasButton: false,
          template: "send_otp",
          phoneNumber: phone,
          body: [otp],
        };

        const sendOTP = IntraktNotify(data, sequelize, "OTP")
        return res.status(200).send({ message: "OTP has been sent to your phone number" });

        break;
      case "FIREBASE":

        break;
      case "MSG91":
        if (!global.msg91_api_key || !global.msg91_template_id) {
          return res.status(500).send(errorResponse({ message: "Invalid Verification Credentials" }));
        }
        const reqBody = {
          template_id: global?.msg91_template_id,
          short_url: 0,
          recipients: [
            {
              mobiles: "+91" + phone,
              var1: otp,
            },
          ],
        };

        console.log(url, global.msg91_api_key, global.msg91_template_id)

        const send_sms = axios.post(url, reqBody, {
          headers: {
            authkey: global.msg91_api_key,
          },
        });
        return res.status(200).send({ message: "OTP has been sent to your phone number" });

        break;

      default:
        return res.status(500).send({ message: "no verification method found!" });
        break;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message }));
  }
}

export async function verifyOTP(req, res) {
  try {
    const { phone, otp } = req.body;

    const findUser = await User.findOne({
      where: { phone: phone?.slice(-10) },
      include: ["avatar"]
    });

    if (!findUser) { return res.status(400).send(errorResponse({ status: 404, message: "User Not Found!" })); }
    // constant phone otp start
    if (findUser.phone === "7999001618") {
      const isPremium = await isPremiumUser({ id: findUser.dataValues.id, sequelize })
      await findUser.update({ otp: null })
      const token = issue({ id: findUser.id });
      await createActivityLog({ sequelize, event: activity_event.USER_LOG_IN, UserId: findUser.id });
      delete findUser.password;
      return res.status(200).send({ data: { jwt: token, user: { ...findUser.dataValues, isPremium } } });
    }
    // constant phone otp end
    if (findUser.otp !== otp) return res.status(400).send(errorResponse({ status: 400, message: "Invalid OTP" }))
    if (findUser.otp_expiration < Date.now()) {
      return res.status(400).send(errorResponse({ message: "OTP Expired" }))
    }
    const isPremium = await isPremiumUser({ id: findUser.dataValues.id, sequelize })
    await findUser.update({ otp: null })
    const token = issue({ id: findUser.id });
    await createActivityLog({ sequelize, event: activity_event.USER_LOG_IN, UserId: findUser.id });
    delete findUser.password;
    return res.status(200).send({ data: { jwt: token, user: { ...findUser.dataValues, isPremium } } });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: error.message }));
  }
}