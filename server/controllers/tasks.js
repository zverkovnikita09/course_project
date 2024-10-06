import path from "path";
import { getFileData, setFileData } from "./helpers.js";

export const getUserTasks = (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) res.status(400).json({ message: "Неверный userId" });

    const fileData = getFileData(path.resolve("db", "tasks.json"));
    if (!fileData) throw new Error("Не удалось прочитать файл");

    const userTasks = fileData.data.find(
      (task) => task.userId === Number(userId)
    );

    return res.status(200).json(userTasks ?? { userId, tasks: [] });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

export const updateTasks = (req, res) => {
  try {
    const { tasks, userId } = req.body;
    if (!tasks || !userId)
      res.status(400).json({ message: "Неверный body запроса" });

    const fileData = getFileData(path.resolve("db", "tasks.json"));
    if (!fileData) throw new Error("Не удалось прочитать файл");

    const taskListWithoutUserTasks = fileData.data.filter(
      (task) => task.userId !== userId
    );

    const newTasksList = [...taskListWithoutUserTasks, { userId, tasks }];

    setFileData(path.resolve("db", "tasks.json"), { data: newTasksList });
    return res.status(200).json({});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

