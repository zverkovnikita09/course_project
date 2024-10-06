import { getFileData, setFileData } from "./helpers.js";
import path from "path";

export const getAuth = (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      throw new Error("Отсутствует логин или пароль");
    }
    const fileData = getFileData(path.resolve("db", "users.json"));
    if (!fileData) throw new Error("Не удалось прочитать файл");

    const user = fileData.users.find(
      (user) => user.login === login && user.password === password
    );

    if (!user) throw new Error("Неверный логин или пароль");

    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

export const registerUser = (req, res) => {
  try {
    const { login, password, name } = req.body;
    if (!login || !password || !name) {
      throw new Error("Отсутствует логин или пароль");
    }
    const fileData = getFileData(path.resolve("db", "users.json"));
    if (!fileData) throw new Error("Не удалось прочитать файл");

    const userInDB = fileData.users.find((user) => user.login === login);

    if (userInDB)
      throw new Error("Пользователь с таким логином уже существует");

    const id = Math.max(...fileData.users.map((user) => user.id)) + 1;

    const user = {
      id,
      name,
      login,
      password,
    };

    const newUsersList = [...fileData.users, user];

    setFileData(path.resolve("db", "users.json"), { users: newUsersList });
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

