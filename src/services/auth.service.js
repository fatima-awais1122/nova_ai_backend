const registerUser = async (userData) => {
  return {
    success: true,
    message: "Register service created successfully.",
    data: userData,
  };
};

const loginUser = async (userData) => {
  return {
    success: true,
    message: "Login service created successfully.",
    data: userData,
  };
};

module.exports = {
  registerUser,
  loginUser,
};