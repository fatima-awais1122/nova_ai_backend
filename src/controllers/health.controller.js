const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nova AI Backend is Running 🚀",
    version: "1.0.0",
  });
};

module.exports = {
  healthCheck,
};