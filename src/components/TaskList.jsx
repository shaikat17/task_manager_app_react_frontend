import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import Task from "./Task";
import TaskForm from "./TaskForm";
import axios from "axios";
import loadingImg from '../assets/loader.gif'


const TaskList = () => {
    const [formData, setFormData] = useState({
        name: "",
        completed: false
    })

    const [tasks, setTasks] = useState([])
    const [completeTasks, setCompleteTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [taskUpdate, setTaskUpdate] = useState(false)
    const [editId, setEditId] = useState('')

    const {name} = formData

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, name: value})
    }

    const createTask = async (e) => {
        e.preventDefault()
        if(name === "") {
            return toast.error("Task can not be empty")
        }
        axios.post('http://localhost:3000/api/tasks', formData)
        .then(res => {
            toast.success("Task Added Successfully")
            setFormData({...formData, name: ""})
            getTasks()
        })
        .catch(err => toast.error(err.message))
    }

    const getTasks = async () => {
        setLoading(true)
        const res = await axios('http://localhost:3000/api/tasks')
        
        setLoading(false)
        setTasks(res.data)
    }

    const getSingleTask = async (task) => {
        setFormData({ name: task.name, completed: false})
         setEditId(task._id)
         setTaskUpdate(true)
    }

    useEffect(() => {
        getTasks()
    },[])

    const handleDelete = async (id) => {
        const res = await axios.delete(`http://localhost:3000/api/task/${id}`)
        if(res.status === 200) {
            toast.success("Task Deleted Successfully")
            const remaining = tasks.filter(task => task._id !== id)
            setTasks(remaining)
        }
    }

    const updateTask = async (e) => {
        e.preventDefault()
        const res = await axios.put(`http://localhost:3000/api/task/${editId}`, formData)
        setTaskUpdate(false)
        if(res.status === 200) toast.success("Task Updated Successfully")
        setFormData({...formData, name: ""})
        getTasks()
    }

    return (
        <div>
            <h2>Task Manager</h2>
            <TaskForm name={name} createTask={createTask} handleInputChange={handleInputChange} taskUpdate={taskUpdate} updateTask={updateTask} />
            <div className="--flex-between --pb">
                <p>
                    <b>Total Task:</b> 0
                </p>
                <p>
                    <b>Completed Task:</b> 0
                </p>
            </div>
            <hr />
           {!loading && tasks.length === 0 ? (
            <p className="--py">No task added.
            Please add a task.</p>
           ) : (<>
           {tasks.map((task,index) => <Task key={task._id} task={task} index={index} handleDelete={handleDelete} getSingleTask={getSingleTask} />)}
           </>)}
        </div>
    );
};

export default TaskList;