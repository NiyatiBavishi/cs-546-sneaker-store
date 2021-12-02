const express = require("express");
const router = express.Router();
const data = require("../data");
const sneakersData = data.sneakers;
const reviewData = data.reviews;
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

router.post("/photo/upload", upload.single("image"), async (req, res) => {
  try {
    console.log(req);
    res.send("Single File Upload Success");
  } catch (e) {
    res.sendStatus(500);
  }
});

const { ObjectId } = require("mongodb");

router.get("/listedBy/:id", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAllListedBy(req.params.id);

    res.render("store/sneakerListedby", { sneakers: sneakers });
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAll();
    res.render("store/sneakersList", { sneakers: sneakers });
  } catch (e) {
    res.sendStatus(500);
  }
});
router.get("buy/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.get(req.params.id);
    let rev = [];
    for (const x of sneaker.reviews) {
      rev.push(await reviewData.get(x));
    }

    res.render("store/sneakerBuy", { sneaker: sneaker, review: rev });
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" + e });
  }
});
router.get("/listedByUpdate/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const sneaker = await sneakersData.get(req.params.id);
    console.log(sneaker);

    res.render("store/sneakerUpdate", { sneaker: sneaker });
    console.log("hell2");
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" });
  }
});
router.get("/delete/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.remove(req.params.id);
    res.redirect("/sneakers/");
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "There is no Restaurant with that ID" });
  }
});

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const sneakers = await sneakersData.getName(searchTerm);
    console.log(sneakers);
    res.render("store/sneakersList", { sneakers: sneakers });
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/sell", async (req, res) => {
  try {
    res.render("store/sneakerSell");
  } catch (e) {
    res.sendStatus(500);
  }
});
module.exports = router;
