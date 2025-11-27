import express from "express";
import cors from "cors";
import multer from "multer";
import { removeBackground } from "rembg-js";

const app = express();
const upload = multer();

app.use(cors());

// مسار إزالة الخلفية
app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    const inputBuffer = req.file.buffer;

    const outputBuffer = await removeBackground(inputBuffer, {
      model: "u2net_human_seg",
      alpha_matting: true,
      alpha_matting_foreground_threshold: 240,
      alpha_matting_background_threshold: 10,
      alpha_matting_erode_size: 10,
      post_process: true,
    });

    const base64 = outputBuffer.toString("base64");
    res.json({ image: base64 });

  } catch (err) {
    console.log("Error removing background:", err);
    res.status(500).json({ error: "Error removing background" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Background removal server running on port ${PORT}`);
});
