import { errorResponse } from "../../../services/errorResponse.js";
import Setting from "../models/setting.js";


export async function create(req, res) {
  try {

    const getStoreSetting = await Setting.findAll();

    if (getStoreSetting.length !== 0) {
      const updateStoreSetting = await Setting.update(req.body, {
        where: { id: getStoreSetting[0].id },
        returning: true,
      });

      return res.status(200).send({
        message: "Store setting updated",
        data: updateStoreSetting[1][0],
      });
    } else {
      const storeSetting = await Setting.create(req.body);
      return res.status(200).send({
        message: "Store setting Created Successfully",
        data: storeSetting,
      });
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

export async function find(req, res) {
  try {

    const storeSetting = await Setting.findOne();
    return res.status(200).send({ data: storeSetting });
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
