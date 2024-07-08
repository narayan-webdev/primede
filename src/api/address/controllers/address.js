import { errorResponse, tokenError } from "../../../services/errorResponse.js";
import { verify } from "../../../services/jwt.js";
import { getPagination, getMeta } from "../../../services/pagination.js";
import Address from "../models/address.js";

export async function create(req, res) {
  try {

    const token = verify(req);
    const address = await Address.create({
      ...req.body,
      UserId: token.id
    });

    return res.status(200).send({ message: "Address Created Successfully!", data: address });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some internal server error occured!",
      })
    );
  }
}

export async function find(req, res) {
  try {

    const query = req.query;
    const whereCluase = {};
    if (req.headers.authorization) {
      const token = verify(req)
      if (token.error) {
        return res.status(402).send(tokenError(token))
      }
      whereCluase.UserId = token.id
    }
    const pagination = await getPagination(query.pagination);
    const addresses = await Address.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      where: whereCluase,
    });
    const meta = await getMeta(pagination, addresses.count);
    return res.status(200).send({ data: addresses.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some internal server error ocured!",
      })
    );
  }
}

export async function findOne(req, res) {
  try {

    const id = req.params.id;
    const address = await Address.findOne({
      where: { id: id },
    });
    if (!address) {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Address Not Found!",
          details: "address id seems to be invalid",
        })
      );
    }
    return res.status(200).send({ data: address });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some internal server error ocured!",
      })
    );
  }
}

export async function update(req, res) {
  try {

    const id = req.params.id;
    const updateAddress = await Address.update(req.body, {
      where: { id: id },
      returning: true,
    });

    return res.status(200).send({
      message: "Address Updated Successfully!",
      data: updateAddress[1][0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some internal server error ocured!",
      })
    );
  }
}

export const _delete = async (req, res) => {
  try {

    const id = req.params.id;
    const deletedRowCount = await Address.destroy({
      where: { id: id },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Address Not Found!",
          details: "address id seems to be invalid",
        })
      );
    }
    return res.status(200).send({ message: "Address Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some internal server error ocured!",
      })
    );
  }
};

export async function userAddress(req, res) {
  try {

    const token = verify(req);
    const address = await Address.findAll({
      where: { UserId: token.id },
    });
    return res.status(200).send({ data: address });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal Server Error" }));
  }
}

export async function search(req, res) {
  try {

    const query = req.query;
    const qs = query.qs.trim();
    const pagination = await getPagination(query.pagination);

    const address = await Address.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: orderBy(query),
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${qs}%` } }, { phone: { [Op.iLike]: `%${qs}%` } }],
      },
    });

    const meta = await getMeta(pagination, address.count);
    return res.status(200).send({ data: address.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}
