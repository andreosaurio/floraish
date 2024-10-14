import asyncHandler from "express-async-handler";

import UserData from "../schemas/user-data.js";
import token_generator from "../helpers/token-generator.js";

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserData.findOne({ email: email });

  if (user && (await user.comparePassword(password))) {
    token_generator(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Email o contraseña incorrectos.");
  }
});

const userSignUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const doesUserExist = await UserData.findOne({ email });

  if (doesUserExist) {
    res.status(400);
    throw new Error("Ese email ya está registrado");
  }

  const user = await UserData.create({
    name,
    email,
    password,
  });

  if (user) {
    token_generator(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Datos de usuario inválidos");
  }
});

const userLogout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Sesión cerrada" });
});

const usersProfile = asyncHandler(async (req, res) => {
  const user = await UserData.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

const updateUsersProfile = asyncHandler(async (req, res) => {
  const user = await UserData.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated_user = await user.save();

    res.status(200).json({
      _id: updated_user._id,
      name: updated_user.name,
      email: updated_user.email,
      isAdmin: updated_user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

const getAllProfiles = asyncHandler(async (req, res) => {
  const users = await UserData.find({});
  res.status(200).json(users);
});

const getUsersId = asyncHandler(async (req, res) => {
  const user = await UserData.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await UserData.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("El usuario admin no se puede eliminar");
    }
    await UserData.deleteOne({ _id: user._id });
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await UserData.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id, 
      name: updatedUser.name, 
      email: updatedUser.email, 
      isAdmin: updatedUser.isAdmin, 
    })
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado')
  }
});

export {
  userLogin,
  userSignUp,
  userLogout,
  usersProfile,
  updateUsersProfile,
  getAllProfiles,
  getUsersId,
  deleteUser,
  updateUser,
};
