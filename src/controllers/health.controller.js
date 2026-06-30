const {
  getHealthStatus,
} = require("../services/health.service");

const apiResponse = require("../utils/apiResponse");

const healthCheck = (req, res) => {
  const health = getHealthStatus();

  return res.status(200).json(
    apiResponse(
      true,
      "Health Check Successful",
      health
    )
  );
};

module.exports = {
  healthCheck,
};