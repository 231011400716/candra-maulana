const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_BASE_URL = "https://suitmedia-backend.suitdev.com/api";

app.get("/api/ideas", async (req, res) => {
  try {
    const { page_number, page_size, sort } = req.query;

    const response = await axios.get(`${API_BASE_URL}/ideas`, {
      params: {
        "page[number]": page_number || 1,
        "page[size]": page_size || 10,
        "append[]": "small_image",
        "append[]": "medium_image",
        sort: sort || "-published_at",
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server berjalan di port ${PORT}`);
});
