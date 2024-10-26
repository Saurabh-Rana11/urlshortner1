const express = require("express");
const { connectToMongoDB } = require("./routes/connect");
const urlRoute = require("./routes/url");
const URL = require('./models/url'); 
const app = express();
const PORT = 3000;

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB", err)); 

app.use(express.json());

app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            Timestamp: Date.now(),
          },
        },
      },
      { new: true } 
    );

    if (!entry) {
      return res.status(404).send("Short URL not found."); 
    }

    res.redirect(entry.redirectURL); 
  } catch (error) {
    console.error("Error updating visit history", error);
    res.status(500).send("Internal Server Error"); 
  }
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
