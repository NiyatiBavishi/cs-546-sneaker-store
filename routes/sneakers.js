const express = require("express");
const router = express.Router();
const data = require("../data");
const sneakersData = data.sneakers;
const reviewData = data.reviews;
const qAndAData = data.qAndA;
const users = data.users;

const { ObjectId } = require("mongodb");
//User listed sneakers
router.get("/listedBy/:id", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAllListedBy(req.params.id);

    res.render("store/sneakerListedby", {
      sneakers: sneakers,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
//getall sneakers
router.get("/", async (req, res) => {
  try {
    const sneakers = await sneakersData.getAll();
    res.render("store/sneakersList", {
      sneakers: sneakers,
      partial: "empty-scripts",
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
//Changes from "/:id" to add search functionality || Hamza
router.get("/sneaker/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.get(req.params.id);
    let rev = [];
    for (const x of sneaker.reviews) {
      rev.push(await reviewData.get(x));
    }
    let qAndA = await qAndAData.getAll(sneaker._id);

    res.render("store/sneakerBuy", {
      title: "Shop",
      sneaker: sneaker,
      review: rev,
      qAndAs: qAndA,
      partial: "shop-scripts",
    });
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" + e });
  }
});
//User updates sneaker
router.get("/listedByUpdate/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const sneaker = await sneakersData.get(req.params.id);
    console.log(sneaker);

    res.render("store/sneakerUpdate", {
      sneaker: sneaker,
      partial: "empty-scripts",
    });
    //  console.log("hell2");
  } catch (e) {
    res.status(404).json({ message: " There is no Sneaker with that ID" });
  }
});
router.get("/BuyList/:id", async (req, res) => {
  try {
    const sneaker = await sneakersData.getAllBuyList(req.params.id);

    res.render("store/sneakerBuyList", {
      title: "Shop",
      sneaker: sneaker,
      partial: "shop-scripts",
    });
    // console.log("hell2");
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
    //console.log(sneakers);
    if (sneakers.length > 0) {
      res.render("store/sneakersList", {
        sneakers: sneakers,
        partial: "empty-scripts",
      });
    } else {
      res.render("store/sneakersList", {
        sneakers: sneakers,
        error: "No results found",
        partial: "empty-scripts",
      });
    }
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/buy", async (req, res) => {
  try {
    let sneakerId = req.body.id;
    let size = req.body.size;
    //   console.log(req.body);
    const sneakers = await sneakersData.buySneaker(
      "61a6ba5f5bbbf22fa2eb3341",
      sneakerId,
      size
    );
    //   console.log(sneakers);
    //   res.render("store/sneakersList", { sneakers: sneakers });
    res.redirect("/sneakers/BuyList/61a6ba5f5bbbf22fa2eb3341");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
module.exports = router;
