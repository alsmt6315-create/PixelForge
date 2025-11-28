import express from "express";
import cors from "cors";
import multer from "multer";
import { removeBackground } from "rembg-js";

const app = express();
const upload = multer();

// تفعيل CORS
app.use(cors());
app.use(express.json());

// مسار إزالة الخلفية
app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file received" });
    }

    const inputBuffer = req.file.buffer;

    // إعدادات RemBG
    const outputBuffer = await removeBackground(inputBuffer, {
      model: "u2net_human_seg",
      alpha_matting: true,
      alpha_matting_foreground_threshold: 240,
      alpha_matting_background_threshold: 10,
      alpha_matting_erode_size: 10,
      post_process: true,
    });

    // تحويل الصورة Base64
    const base64 = outputBuffer.toString("base64");
    res.json({ image: base64 });

  } catch (err) {
    console.error("❌ Error removing background:", err);
    res.status(500).json({ error: "Failed to remove background" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Background Removal API running on port ${PORT}`);
});
