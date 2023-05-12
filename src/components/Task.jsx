import { FaCheckDouble, FaEdit, FaRegTrashAlt } from "react-icons/fa"

const Task = ({task, index, handleDelete, getSingleTask, setTaskComplete }) => {
    return (
        <div className={task.completed ? "task completed" : "task"}>
            <p>
                <b>{index+1}.</b>
                {task.name}
            </p>
            <div className="task-icons">
                <FaCheckDouble color="green" onClick={() => setTaskComplete(task)} />
                <FaEdit color="purple" onClick={() => getSingleTask(task)} />
                <FaRegTrashAlt color="red" onClick={() => handleDelete(task._id)} />
            </div>
        </div>
    );
};

export default Task;