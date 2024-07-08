import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import Privacy_policy from "../models/privacy_policy.js";

/**
 * Create or update Privacy Policy
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function create(req, res) {
  try {

    const getRows = await Privacy_policy.findAll();
    if (getRows.length !== 0) {
      const updatePP = await Privacy_policy.update(req.body, {
        where: { id: getRows[0].id },
        returning: true,
      });
      return res.status(200).send({ message: "Privay Policy Updated!", data: updatePP[1][0] });
    }
    const createPP = await Privacy_policy.create(req.body);
    return res.status(200).send({ message: "Privacy Policy Created!", data: createPP });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Failed to create or update privacy_policy",
        details: error.message,
      })
    );
  }
}

/**
 * Fetch all Privacy Policies
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function find(req, res) {
  try {

    const query = req.query;

    const pagination = await getPagination(query.pagination);
    const getPP = await Privacy_policy.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, getPP.count);

    return res.status(200).send({ data: getPP.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Failed to fetch privacy_policies",
        details: error.message,
      })
    );
  }
}
