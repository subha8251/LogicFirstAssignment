const router = require("express").Router();
const c = require("../controllers/propertyController");

router.get("/grid", c.grid);
router.get("/detail/:id", c.detail);
router.post("/create", c.create);
router.put("/update/:id", c.update);
router.delete("/delete/:id", c.remove);
router.delete("/bulk-delete", c.bulkDelete);

module.exports = router;
