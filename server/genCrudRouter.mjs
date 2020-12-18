import express from "express";
import bodyParser from "body-parser";

export const genCrudRouter = (model) => {
  const router = express.Router();

  const list = "/list";
  const listOne = "/:id";
  const createOne = "/create";
  const updateOne = "/:id";
  const deleteOne = "/:id";

  const parseJSONBody = bodyParser.json();

  router.use((req, _, next) => {
    req.model = model;
    return next();
  });

  router.get(list, (req, res) => {
    const page = req.query.page || undefined;
    const perPage = req.query.per_page || undefined;
    const filterKey = req.query.filter_key || undefined;
    const filterValue = req.query.filter_value || undefined;
    const sortBy = req.query.sort_by || undefined;
    const order = req.query.order || undefined;
    const data = req.model.read({
      page,
      perPage,
      filter: { key: filterKey, value: filterValue },
      sort: { sortBy, order },
    });
    if (data.length) {
      return res.status(200).json(data);
    } else {
      return res.status(200).json([]);
    }
  });

  router.get(listOne, (req, res) => {
    const id = req.params.id;
    const record = req.model.read({ filter: { key: "id", value: id } });
    if (record.length) {
      return res.status(200).json(record[0]);
    } else {
      return res.status(404).json({ message: "student not found" });
    }
  });

  router.use(createOne, parseJSONBody);
  router.post(createOne, (req, res) => {
    const data = req.body;
    const record = req.model.add(data);
    return res.status(201).json(record);
  });

  router.use(updateOne, parseJSONBody);
  router.put(updateOne, (req, res) => {
    const idx = req.params.id;
    const { id: _ = null, ...uRecord } = req.body;
    const record = req.model.update(idx, uRecord);
    return res.status(200).json(record);
  });

  router.delete(deleteOne, (req, res) => {
    const id = req.params.id;
    if (req.model.read({ filter: { key: "id", value: id } }).length) {
      req.model.delete(id);
      return res.status(204).json();
    }
    return res.status(404).json({ message: "record not found" });
  });

  router.use((err, req, res, next) => {
    if (err) {
      return res.status(500).send({
        message: err.message,
        display: `Internal server error on ${req.url}`,
      });
    }
    return next();
  });

  return router;
};
