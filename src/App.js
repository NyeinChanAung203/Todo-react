import './App.css';
import Todo from './components/Todo'
import Form from './components/Form'
import FilterButton from './components/FilterButton';
import { useState,useEffect,useRef } from 'react';
import {nanoid} from 'nanoid'

function App(props) {
  // console.log(props.tasks)
  const [tasks,setTasks] = useState(props.tasks)
  const [filter, setFilter] = useState('All')
  const   listHeadingRef = useRef(null)

  const usePrevious=(value)=>{
    const ref = useRef()
    useEffect( ()=>{
      ref.current = value;
    });
    return ref.current
  }
  const prevTaskLength = usePrevious(tasks.length);

  const FILTER_MAP = {
    All: () => true,
    Active: task => !task.complete,
    Completed: task => task.complete
  }
  const FILTER_NAMES = Object.keys(FILTER_MAP)
  // console.log(FILTER_NAMES)
  const filterList = FILTER_NAMES.map(name=>(
    <FilterButton key={name} name={name} isPressed={name === filter} setFilter={setFilter}/>
  ))


  const toggleTaskCompleted = (id)=>{
    const updateTasks = tasks.map( task =>{
      if(id === task.id){
        return {...task,complete:!task.complete}
      }
      return task;
    });
    setTasks(updateTasks)
  }

  const editTask = (id,newName) =>{
    const editTaskList = tasks.map(task=>{
      if(id=== task.id){
        return {...task,name:newName}
      }
      return task
    })
    setTasks(editTaskList)
  }

  const deleteTask = (id) =>{
    const remainingTask = tasks.filter(task=> id !== task.id);
    setTasks(remainingTask)
  }

  const taskList = tasks.filter(FILTER_MAP[filter]).map(task=> (
    <Todo 
      name={task.name} 
      complete={task.complete} 
      id={task.id} 
      key={task.id} 
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ))

  const addTask = (name) =>{
    if(name !== ''){
      const newTask = {id:"todo-"+nanoid(),name:name,complete:false};
      setTasks([...tasks,newTask])
    }
    
  }
  
  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  useEffect( () =>{
    if(tasks.length - prevTaskLength === -1){
      listHeadingRef.current.focus()
    }
  },[tasks.length,prevTaskLength])

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText} 
      </h2>
      <ul className="todo-list stack-large stack-exception" aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
