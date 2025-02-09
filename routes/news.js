const {Router} = require("express");
const multer = require("multer");
const {protect, adminProtect} = require("../middleware/auth"); // Admin check middleware
const {createNews, getNews, getSingleNews, updateNews, deleteNews} = require("../controllers/news");

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({storage});

router.get("/", getNews);
router.get("/:id", getSingleNews);

router.post("/", protect, adminProtect, upload.array("images", 3), createNews);
router.put("/:id", protect, adminProtect, upload.array("images", 3), updateNews);
router.delete("/:id", protect, adminProtect, deleteNews);

module.exports = router;
