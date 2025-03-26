const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Item } = require("./models/items");
const bcrypt = require("bcrypt");
const { User } = require("./models/users");
dotenv.config();
const app = express();

const port = 3000;
app.use(express.json());

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.log(error);
  }
});

app.post("/items", async (req, res) => {
  const { name, price, vendor } = req.body;
  const item = new Item({ name, price, vendor });
  await item.save();
  res.json(item);
});

app.get("/items/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).send("Item not found.");
  res.json(item);
});

app.put("/items/:id", async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!item) return res.status(404).send("Item not found.");
  res.json(item);
});

app.delete("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).send("Item not found.");
    res.json(item);
  } catch (error) {
    console.log(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const comparePassword = await bcrypt.compare(password, user.password);
    if (comparePassword) {
      res.json({
        message: "login successful",
        id: user.id,
        email: user.email,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
