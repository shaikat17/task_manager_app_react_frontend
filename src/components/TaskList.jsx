import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Task from "./Task";
import TaskForm from "./TaskForm";
import axios from "axios";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });

  const [tasks, setTasks] = useState([]);
  const [completeTasks, setCompleteTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskUpdate, setTaskUpdate] = useState(false);
  const [editId, setEditId] = useState("");

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, name: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Task can not be empty");
    }
    axios
      .post(
        "https://task-manager-app-backend-murex.vercel.app/api/tasks",
        formData
      )
      .then((res) => {
        toast.success("Task Added Successfully");
        setFormData({ ...formData, name: "" });
        getTasks();
      })
      .catch((err) => toast.error(err.message));
  };

  const getTasks = async () => {
    setLoading(true);
    const res = await axios(
      "https://task-manager-app-backend-murex.vercel.app/api/tasks"
    );

    setLoading(false);
    setTasks(res.data);
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setEditId(task._id);
    setTaskUpdate(true);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleDelete = async (id) => {
    const res = await axios.delete(
      `https://task-manager-app-backend-murex.vercel.app/api/task/${id}`
    );
    if (res.status === 200) {
      toast.success("Task Deleted Successfully");
      const remaining = tasks.filter((task) => task._id !== id);
      setTasks(remaining);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    const res = await axios.put(
      `https://task-manager-app-backend-murex.vercel.app/api/task/${editId}`,
      formData
    );
    setTaskUpdate(false);
    if (res.status === 200) toast.success("Task Updated Successfully");
    setFormData({ ...formData, name: "" });
    getTasks();
  };

  const setTaskComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };

    const res = await axios.put(
      `https://task-manager-app-backend-murex.vercel.app/api/task/${task._id}`,
      newFormData
    );
    if (res.status === 200)
      toast.success(
        "Congratulations... You have Completed the Task Successfully"
      );
    getTasks();
  };

  useEffect(() => {
    const completeTasks = tasks.filter((task) => task.completed === true);
    setCompleteTasks(completeTasks);
  }, [tasks]);

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        createTask={createTask}
        handleInputChange={handleInputChange}
        taskUpdate={taskUpdate}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Task:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Task:</b> {completeTasks.length}
          </p>
        </div>
      )}
      <hr />
      {!loading && tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task.</p>
      ) : (
        <>
          {tasks.map((task, index) => (
            <Task
              key={task._id}
              task={task}
              index={index}
              handleDelete={handleDelete}
              getSingleTask={getSingleTask}
              setTaskComplete={setTaskComplete}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TaskList;
