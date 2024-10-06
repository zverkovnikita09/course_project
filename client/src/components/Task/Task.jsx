import { ImCross } from "react-icons/im";
import { FcCancel } from "react-icons/fc";
import { MdDone } from "react-icons/md";
import { TbRestore } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import { IoMdTime } from "react-icons/io";
import { getTime } from "../../utils/getTime";
import "./Task.css";

export default function Task({
  text,
  title,
  isExpanded,
  onClick,
  time_planned,
  time_spent,
  status,
  onDelete,
  onDone,
  onCancel,
  onSpendTime,
  onRestore,
  start_date,
  end_date,
  onTakeInProgress,
}) {
  return (
    <div className={`task ${isExpanded ? "expanded" : ""} ${status === "done" || status === "canceled" ? "done" : ""}`} onClick={onClick}>
      <div className="task__titleBlock">
        <h3 className="task__title">{title}</h3>
        <div className="task__buttonBox">
          {status !== "done" && status !== "canceled" && (
            <button onClick={onCancel} title="Отменить"><FcCancel size={20} /></button>
          )}
          {status === "in_progress" && (
            <>
              <button onClick={onSpendTime} title="Вести учет затраченного времени"><IoMdTime size={18} color="fff" /></button>
              <button onClick={onDone} title="Выполнено"><MdDone size={20} color="6d0" /></button>
            </>
          )}
          {status === "planned" && <button onClick={onTakeInProgress} title="Взять в работу"><GrUserWorker color="#fff" size={16} /></button>}
          {status === "canceled" && <button onClick={onRestore} title="Восстановить"><TbRestore color="#fff" size={18} /></button>}
          <button onClick={onDelete} title="Удалить"><ImCross color="#f00" size={15} /></button>
        </div>
      </div>
      <div className="task__info">
        <p className={start_date < new Date().getTime() && status === "planned" ? "error" : ""}>
          Плановая дата начала: <br />
          {new Date(start_date).toLocaleString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' })}
        </p>
        <p className={end_date < new Date().getTime() && (status !== "canceled" && status !== "done") ? "error" : ""}>
          Плановая дата завершения: <br />
          {new Date(end_date).toLocaleString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' })}
        </p>
        <p>Запланировано времени: {getTime(time_planned)}</p>
        <p className={time_planned < time_spent ? "error" : ""}>Затрачено: {getTime(time_spent)}</p>
        <p className={time_planned - time_spent <= 0 && (status !== "canceled" && status !== "done") ? "error" : ""}>Осталось: {getTime(time_planned - time_spent)}</p>
        <p className="task__text">{text}</p>
      </div>
    </div >
  )
}