import path from "path";
import sharp from "sharp";
import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import getVideoInfo from "../services/getVideoInfo.js";
import aws_s3_uploader from "../../../services/aws_s3.js";
import Media from "../models/media.js";


export async function create(req, res) {
  try {
    // return res.status(200).send({ files: req.uploadedFiles })
    if (!req.files || req.files.length === 0) {
      return res.status(500).send({ error: "No files uploaded" });
    } else {

      const uploadPromises = req.files.map(async (file) => {
        
        const fileURL = await aws_s3_uploader(file)
        const mediaEntity = await Media.create({ name: file.originalname, url: fileURL });
        return mediaEntity;
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      return res.status(200).send(uploadedMedia);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: "Internal server Error",
      error: error.message,
    });
  }
}



// Controller function to get all posts
export async function find(req, res) {
  try {

    const pagination = await getPagination(req.query.pagination);
    const files = await Media.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });
    const meta = await getMeta(pagination, files.count);
    return res.status(200).send({ data: files.rows, meta });
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


export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const upload = await Media.findByPk(id);
    if (upload) {
      return res.status(200).send(upload);
    } else {
      return res.status(404).send(errorResponse({ status: 404, message: "File not found!", details: "id seems to be invalid" }));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: error.message }));
  }
}


export async function update(req, res) {
  try {

    const { id } = req.params;
    const upload = await Media.findByPk(id);
    if (upload) {
      const update = await Media.update(req.body);
      return res.status(200).send({ data: update });
    } else {
      return res.status(404).send(errorResponse({ status: 404, message: "File not found!", details: "id seems to be invalid" }));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


export const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const upload = await Media.findByPk(id);
    if (upload) {
      const destroy = await Media.destroy({
        where: { id: id },
      });
      return res.status(200).send({ message: "File Deleted Successfully" });
    } else {
      return res.status(404).send(errorResponse({ status: 404, message: "File not found!", details: "id seems to be invalid" }));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};

export async function streamVideo(req, res) {
  try {
    const fs = require('fs');
    const path = require('path');

    const { filename } = req.params;
    const videoPath = path.join(process.cwd(), 'public', 'uploads', filename);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.set('Content-Type', 'video/mp4');
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);

  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}
