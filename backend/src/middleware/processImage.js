import sharp from "sharp";
import path from "path";

const processImage = async (req, res, next) => {

  if (!req.file) {
    return next();
  }

  try {

    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const filename = `${uniqueSuffix}.webp`;

    const filepath = path.join("uploads", filename);

    await sharp(req.file.buffer)

      .rotate()

      .resize(800, 600, {
        fit: "cover",
        position: "center"
      })

      .webp({
        quality: 80
      })

      .toFile(filepath);

    req.file.filename = filename;
    req.file.filepath = filepath;

    next();

  } catch (error) {

    console.error("Image processing error:", error);

    res.status(400).json({
      message: "Error processing image",
      error: error.message
    });

  }

};

export default processImage;