import { errorResponse } from "../../../services/errorResponse.js";
import Global_brand from "../models/global_brand.js";

export async function create(req, res) {
  try {

    const getGlobalBrand = await Global_brand.findAll();

    if (getGlobalBrand.length !== 0) {
      const updateGlobalBrand = await Global_brand.update(req.body, {
        where: { id: getGlobalBrand[0].id },
        returning: true,
      });

      return res.status(200).send({
        message: "Global brand updated",
        data: updateGlobalBrand[1][0],
      });
    } else {
      const globalBrand = await Global_brand.create(req.body);

      return res.status(200).send({
        message: "Global brand created successfully",
        data: globalBrand,
      });
    }
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}

export async function find(req, res) {
  try {


    const globalBrand = await Global_brand.findOne({ include: ["favicon", "logo_dark", "logo_light"] });

    if (!globalBrand) {
      return res.status(404).send({ error: "Global brand not found" });
    }

    return res.status(200).send({ data: globalBrand });
  } catch (error) {
    console.log(error);
    return errorResponse(res, {
      status: 500,
      message: "Internal server Error",
      details: error.message,
    });
  }
}
