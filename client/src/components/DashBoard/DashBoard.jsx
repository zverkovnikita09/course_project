import "./DashBoard.css"
import { useGetData } from "../../hooks/useGetData"
import { useSendData } from "../../hooks/useSendData"
import { Spinner } from "../Spinner/Spinner";
import { Popup } from "../Popup/Popup";
import Task from "../Task/Task";
import { useState } from "react";
import { getTimePlanned } from "../../utils/getTime";

export default function DashBoard() {
  const userData = localStorage.getItem("userLSData");
  const userId = JSON.parse(userData ?? "")?.id ?? "";

  const { data, isError, isLoading, refecth } = useGetData({
    url: "/get-tasks", params: {
      userId,
    }, isEnabled: !!userData
  })

  const [isPopupActive, setPopupActive] = useState(false);

  const [expandedBlock, setExpandedBlock] = useState(null);

  const { handleSendData, isSending, error } = useSendData({
    url: "/update-tasks", onSuccess: () => {
      refecth()
    }
  })

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [timePlanned, setTimePlanned] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [spendTime, setSpendTime] = useState("");
  const [timePopup, setTimePopup] = useState(false);
  const [taskId, setTaskId] = useState(null);

  console.log(isError);

  if (!userData || isError) return null;

  const resolvedTasks = (data?.tasks ?? []).filter((task) => task.status === "done")
  const inProgressTasks = (data?.tasks ?? []).filter((task) => task.status === "in_progress")
  const plannedTasks = (data?.tasks ?? []).filter((task) => task.status === "planned")
  const canceledTasks = (data?.tasks ?? []).filter((task) => task.status === "canceled")

  const onDelete = (taskId) => {
    const newTaskList = data.tasks.filter((item) => item.id !== taskId);
    handleSendData({ tasks: newTaskList, userId })
  }

  const onCancel = (taskId) => {
    const filteredTasks = data.tasks.filter((item) => item.id !== taskId);
    const targetTask = data.tasks.find((item) => item.id === taskId);

    const newTaskList = [...filteredTasks, { ...targetTask, status: "canceled" }]
    handleSendData({ tasks: newTaskList, userId })
  }

  const onRestore = (taskId) => {
    const filteredTasks = data.tasks.filter((item) => item.id !== taskId);
    const targetTask = data.tasks.find((item) => item.id === taskId);

    const newTaskList = [...filteredTasks, { ...targetTask, status: "planned" }]
    handleSendData({ tasks: newTaskList, userId })
  }

  const onTakeInProgress = (taskId) => {
    const filteredTasks = data.tasks.filter((item) => item.id !== taskId);
    const targetTask = data.tasks.find((item) => item.id === taskId);

    const newTaskList = [...filteredTasks, { ...targetTask, status: "in_progress" }]
    handleSendData({ tasks: newTaskList, userId })
  }

  const onDone = (taskId) => {
    const filteredTasks = data.tasks.filter((item) => item.id !== taskId);
    const targetTask = data.tasks.find((item) => item.id === taskId);

    const newTaskList = [...filteredTasks, { ...targetTask, status: "done" }]
    handleSendData({ tasks: newTaskList, userId })
  }

  const onSpendTime = () => {
    const filteredTasks = data.tasks.filter((item) => item.id !== taskId);
    const targetTask = data.tasks.find((item) => item.id === taskId);

    const newTaskList = [...filteredTasks, { ...targetTask, time_spent: targetTask.time_spent + getTimePlanned(spendTime) }]
    handleSendData({ tasks: newTaskList, userId })
  }

  const openSpendTimePopup = (taskId) => {
    setTimePopup(true);
    setTaskId(taskId);
  }

  const closeSpendTimePopup = () => {
    setTimePopup(false)
    setTaskId(null);
  }

  const onAddTask = async (e) => {
    e.preventDefault();

    const id = Math.max(...data.tasks.map((item) => item.id)) + 1;

    const newTaskList = [...data.tasks, {
      id,
      title,
      text,
      time_planned: getTimePlanned(timePlanned),
      time_spent: 0,
      start_date: new Date(startDate).getTime(),
      end_date: new Date(endDate).getTime(),
      status: "planned"
    }]
    await handleSendData({ tasks: newTaskList, userId })
    setTitle("")
    setText("")
    setTimePlanned("")
    setStartDate("")
    setEndDate("")
    setPopupActive(false)
  }

  return (
    <>
      <Popup closePopup={() => setPopupActive(false)} isActive={isPopupActive}>
        <form onSubmit={onAddTask} className="popupForm">
          <label className="popupForm__label">
            Заголовок
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="popupForm__input" />
          </label>
          <label className="popupForm__label">
            Описание
            <textarea value={text} onChange={e => setText(e.target.value)} className="popupForm__input" />
          </label>
          <label className="popupForm__label">
            Плановая дата начала:
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="popupForm__input" />
          </label>
          <label className="popupForm__label">
            Плановая дата завершения:
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="popupForm__input" />
          </label>
          <label className="popupForm__label">
            Запланировано времени:
            <input type="text" value={timePlanned} onChange={e => setTimePlanned(e.target.value)} className="popupForm__input" />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="popupForm__submit" disabled={isSending}>
            {isSending ? <Spinner /> : "Создать"}
          </button>
        </form>
      </Popup>
      <Popup isActive={timePopup} closePopup={closeSpendTimePopup}>
        <form onSubmit={onSpendTime} className="popupForm">
          <label className="popupForm__label">
            Времени затрачено:
            <input value={spendTime} onChange={e => setSpendTime(e.target.value)} type="text" className="popupForm__input" />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="popupForm__submit" disabled={isSending}>
            {isSending ? <Spinner /> : "Подтвердить"}
          </button>
        </form>
      </Popup>
      <button className="addTask" onClick={() => setPopupActive(true)}>Добавить задачу</button>
      <div className="dashboard">
        <div className="dashboard__dash">
          <h2 className="dashboard__title">Запланированно</h2>
          <div className="dashboard__item">
            {isLoading ?
              <div className="loading"><Spinner isBlue /></div>
              :
              !!plannedTasks?.length && plannedTasks.map(({ id, ...props }) => (
                <Task
                  key={id}
                  isExpanded={expandedBlock === id}
                  onClick={() => setExpandedBlock(expandedBlock !== id ? id : null)}
                  onDelete={() => onDelete(id)}
                  onCancel={() => onCancel(id)}
                  onRestore={() => onRestore(id)}
                  onDone={() => onDone(id)}
                  onTakeInProgress={() => onTakeInProgress(id)}
                  onSpendTime={() => openSpendTimePopup(id)}
                  {...props}
                />
              ))}
          </div>
        </div>
        <div className="dashboard__dash">
          <h2 className="dashboard__title">В работе</h2>
          <div className="dashboard__item">
            {isLoading ?
              <div className="loading"><Spinner isBlue /></div>
              :
              !!inProgressTasks?.length && inProgressTasks.map(({ id, ...props }) => (
                <Task
                  key={id}
                  isExpanded={expandedBlock === id}
                  onClick={() => setExpandedBlock(expandedBlock !== id ? id : null)}
                  onDelete={() => onDelete(id)}
                  onCancel={() => onCancel(id)}
                  onRestore={() => onRestore(id)}
                  onDone={() => onDone(id)}
                  onTakeInProgress={() => onTakeInProgress(id)}
                  onSpendTime={() => openSpendTimePopup(id)}
                  {...props}
                />
              ))}
          </div>
        </div>
        <div className="dashboard__dash">
          <h2 className="dashboard__title">Завершено</h2>
          <div className="dashboard__item">
            {isLoading ?
              <div className="loading"><Spinner isBlue /></div>
              :
              !!resolvedTasks?.length && resolvedTasks.map(({ id, ...props }) => (
                <Task
                  key={id}
                  isExpanded={expandedBlock === id}
                  onClick={() => setExpandedBlock(expandedBlock !== id ? id : null)}
                  onDelete={() => onDelete(id)}
                  onCancel={() => onCancel(id)}
                  onRestore={() => onRestore(id)}
                  onDone={() => onDone(id)}
                  onTakeInProgress={() => onTakeInProgress(id)}
                  onSpendTime={() => openSpendTimePopup(id)}
                  {...props}
                />
              ))}
          </div>
        </div>
        <div className="dashboard__dash">
          <h2 className="dashboard__title">Отменено</h2>
          <div className="dashboard__item">
            {isLoading ?
              <div className="loading"><Spinner isBlue /></div>
              :
              !!canceledTasks?.length && canceledTasks.map(({ id, ...props }) => (
                <Task
                  key={id}
                  isExpanded={expandedBlock === id}
                  onClick={() => setExpandedBlock(expandedBlock !== id ? id : null)}
                  onDelete={() => onDelete(id)}
                  onCancel={() => onCancel(id)}
                  onRestore={() => onRestore(id)}
                  onDone={() => onDone(id)}
                  onTakeInProgress={() => onTakeInProgress(id)}
                  onSpendTime={() => openSpendTimePopup(id)}
                  {...props}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}