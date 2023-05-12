import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import Task from "./Task";
import TaskForm from "./TaskForm";
import axios from "axios";


const TaskList = () => {
    const [formData, setFormData] = useState({
        name: "",
        completed: false
    })

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
        })
        .catch(err => toast.error(err.message))
    }
    return (
        <div>
            <h2>Task Manager</h2>
            <TaskForm name={name} createTask={createTask} handleInputChange={handleInputChange} />
            <div className="--flex-between --pb">
                <p>
                    <b>Total Task:</b> 0
                </p>
                <p>
                    <b>Completed Task:</b> 0
                </p>
            </div>
            <hr />
            <Task />
        </div>
    );
};

export default TaskList;