const bcrypt = require("bcrypt");
const validator = require("validator");

const prisma = require("../lib/prisma");
const apiResponse = require("../utils/apiResponse");
const { generateToken } = require("../utils/jwt");

const registerUser = async ({
  fullName,
  email,
  password,
}) => {
  if (!fullName || !email || !password) {
    throw new Error("All fields are required.");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }

  if (password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters."
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  return apiResponse(
    true,
    "Registration successful.",
    {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    }
  );
};

const loginUser = async ({
  email,
  password,
}) => {
  if (!email || !password) {
    throw new Error(
      "Email and password are required."
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials.");
  }

  const token = generateToken(user.id);

  return apiResponse(
    true,
    "Login successful.",
    {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
};