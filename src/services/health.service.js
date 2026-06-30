const getHealthStatus = () => {
  return {
    success: true,
    message: "Nova AI Backend is Running 🚀",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  };
};

module.exports = {
  getHealthStatus,
};