const Property = require("../models/Property");

const parseTypeFilter = (q) => {
  let t = q["type[]"] ?? q.type;
  if (!t) return null;
  if (Array.isArray(t)) return t;
  return String(t).replace(/[\[\]]/g, "")
                  .split(",")
                  .map(s => s.trim())
                  .filter(Boolean);
};

exports.create = async (req, res) => {
  try {
    const doc = await Property.create(req.body);
    res.status(201).json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.grid = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1",10), 1);
    const rows = Math.min(Math.max(parseInt(req.query.rows || "20",10), 1), 100);

    const typeArr = parseTypeFilter(req.query);
    const city = req.query["location.city"];
    const state = req.query["location.state"];
    const minprice = req.query.minprice ? Number(req.query.minprice) : undefined;
    const maxprice = req.query.maxprice ? Number(req.query.maxprice) : undefined;

    const query = {};
    if (typeArr?.length) query.type = { $in: typeArr };
    if (city) query["location.city"] = new RegExp(city, "i");
    if (state) query["location.state"] = new RegExp(state, "i");
    if (minprice != null || maxprice != null) {
      query.price = {};
      if (minprice != null) query.price.$gte = minprice;
      if (maxprice != null) query.price.$lte = maxprice;
    }

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * rows)
      .limit(rows);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / rows),
      properties
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.detail = async (req, res) => {
  try {
    const doc = await Property.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const doc = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.bulkDelete = async (req, res) => {
  try {
    const ids = req.body.ids || [];
    if (!ids.length) return res.status(400).json({ error: "ids required" });
    await Property.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Bulk delete done" });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
