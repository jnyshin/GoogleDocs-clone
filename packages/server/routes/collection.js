import express from "express";
import Docs from "../schema/docs";
import { v4 as uuidv4 } from "uuid";
import logging from "../logging";
import { ERROR_MESSAGE } from "../store";

const router = express.Router();

router.post("/create", async (req, res) => {
  logging.info("/collection/create route");
  const name = req.body.name;
  const id = uuidv4();
  try {
    logging.info(`created new doc id=${id} route`);
    await Docs.create({
      _id: id,
      id: id,
      name: name,
      data: { ops: [{ insert: "" }] },
    });
    res.send(id);
  } catch (err) {
    logging.error(`failed to created doc with id = ${id}`);
    res.send(ERROR_MESSAGE(`failed to created doc with id = ${id}`));
  }
});

router.post("/delete", async (req, res) => {
  logging.info("/collection/delete route");
  const docId = req.body.docid;
  try {
    await Docs.findByIdAndDelete(docId);
    logging.info(`deleted doc id=${docId} route`);
    res.send();
  } catch (err) {
    logging.error(`failed to delete doc id = ${docId}`);
    res.send(ERROR_MESSAGE(`failed to delete doc id = ${docId}`));
  }
});
router.get("/list", async (req, res) => {
  logging.info("/collection/list route");
  try {
    const docs = await Docs.find().sort({ updatedAt: -1 }).limit(10);
    const ret = [];
    for (const doc of docs) {
      const ele = {
        id: doc.id,
        name: doc.name,
      };
      ret.push(ele);
    }
    logging.info(`sent docs list`);
    logging.info(ret);
    res.send(ret);
  } catch (err) {
    logging.error("failed find all docs");
    res.send(ERROR_MESSAGE("failed find all docs"));
  }
});
export default router;
