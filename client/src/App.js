import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  componentDidMount() {
    this.socket = io('http://localhost:8000/');
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  }

  state = {
    tasks: [],
    taskName: '',
  };

  addTask(task) {
    this.setState({
      task: this.state.tasks.push(task),
    });
  }

  removeTask(id, local) {
    this.setState({ tasks: this.state.tasks.filter((task) => task.id !== id) });
    if (local === true) {
      this.socket.emit('removeTask', id);
    }
  }

  submitForm(e) {
    e.preventDefault();
    const newTask = { id: uuidv4(), name: this.state.taskName };
    //console.log('newTask', newTask);
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
    this.setState({ taskName: '' });
  }

  updateTasks(tasks) {
    this.setState({
      tasks: tasks,
    });
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map((task) => (
              <li key={task.id} className='task'>
                {task.name}
                <button className='btn btn--red' onClick={() => this.removeTask(task.id, true)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id='add-task-form' onSubmit={(e) => this.submitForm(e)}>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              value={taskName}
              onChange={(e) => this.setState({ taskName: e.currentTarget.value })}
            />
            <button className='btn' type='submit'>
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
