import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";

const app = express();
const upload = multer();

app.use(cors());

app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;

    const result = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: (() => {
        const form = new FormData();
        form.append("image_file", req.file.buffer, "image.png");
        form.append("size", "auto");
        return form;
      })(),
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.log("RemoveBG Error:", errorText);
      return res.status(500).json({ error: "Failed to remove background" });
    }

    const buffer = await result.buffer();
    const base64 = buffer.toString("base64");

    res.json({ image: base64 });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
