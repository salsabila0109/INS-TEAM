const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

  // ambil header authorization
  const authHeader = req.headers.authorization;

  // cek apakah token ada
  if (!authHeader) {
    return res.status(401).json({
      error: "Token tidak ada",
    });
  }

  // ambil token setelah kata "Bearer"
  const token = authHeader.split(" ")[1];

  try {

    // verifikasi token
    const verified = jwt.verify(
      token,
      "SECRET_KEY"
    );

    // simpan data user ke request
    req.user = verified;

    // lanjut ke route berikutnya
    next();

  } catch (err) {

    res.status(403).json({
      error: "Token tidak valid",
    });

  }
};

module.exports = verifyToken;