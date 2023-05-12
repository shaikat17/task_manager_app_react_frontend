const TaskForm = ({ createTask, name, handleInputChange, taskUpdate, updateTask }) => {
  return (
    <form className="task-form" onSubmit={taskUpdate ? updateTask : createTask}>
      <input type="text" placeholder="Add a Task" name="name" onChange={handleInputChange} value={name} />
      <button type="submit">{taskUpdate ? "Edit" : "Add"}</button>
    </form>
  );
};

export default TaskForm;
