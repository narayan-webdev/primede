import { Router } from "express";
const router = Router();
import { create, find, streamVideo, findOne, update, _delete } from "../controllers/upload.js";
// const upload = require("../../../services/fileUploader");
import { fileFormat } from "../middlewares/upload.js";
import multer from 'multer';
import aws_s3_uploader from "../../../services/aws_s3.js";
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024
  }
})
const permissions = [
  {
    api: "uploads",
    endpoint: "/api/uploads",
    method: "POST",
    handler: "Create Upload",
  },
  {
    api: "uploads",
    endpoint: "/api/uploads",
    method: "GET",
    handler: "List Uploads",
  },
  {
    api: "uploads",
    endpoint: "/api/uploads/:id",
    method: "GET",
    handler: "Find One Upload",
  },
  {
    api: "uploads",
    endpoint: "/api/uploads/:id",
    method: "PUT",
    handler: "Update Upload",
  },
  {
    api: "uploads",
    endpoint: "/api/uploads/:id",
    method: "DELETE",
    handler: "Delete Upload",
  },
  {
    api: "uploads",
    endpoint: "/api/uploads/:name/stream",
    method: "GET",
    handler: "Stream Video",
  },
];

export default (app) => {
  router.post("/", [upload.array("file", 10)], create);
  router.get("/", find);
  router.get("/:filename/stream", streamVideo);
  router.get("/:id", findOne);
  router.put("/:id", [fileFormat], update);
  router.delete("/:id", _delete);
  app.use("/api/uploads", router);
};

const _permissions = permissions;
export { _permissions as permissions };
