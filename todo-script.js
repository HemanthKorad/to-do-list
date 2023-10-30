let tasks = [];
let totalTasks = 0;
let completedTasks = 0;
let completedTasksList = [];


function addTask(){
    let taskInput = document.getElementById('taskInput');
    let taskList = document.getElementById('taskList')
    let newTask = taskInput.value;

    if (newTask === ''){
        alert('Please enter a task!');
        return;
    }

    tasks.push({name: newTask, completed: false})
    totalTasks++;
    updateTaskCount();

    let li = document.createElement('li');
    li.innerHTML = `<div class="task-row">
                        <div class = "checkbox">
                            <input type = "checkbox" onchange = "toggleTaskCompletion(${totalTasks - 1})">
                        </div>
                        <div class="task-name">
                            <span>${newTask}</span>
                        </div>
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editTask(${totalTasks - 1})"><i class="fa fa-pencil"></i></button>
                            <button class="delete-btn" onclick="deleteTask(${totalTasks - 1})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                        </div>    
                    </div>`;
                    
    taskList.appendChild(li);
    taskInput.value = '';
    saveTasksToLocalStorage();
    alert('Task successfully added.')
}

function toggleTaskCompletion(index){
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) {
        completedTasks++;
        completedTasksList.push(tasks[index]);
    } else {
        completedTasks--;
        completedTasksList = completedTasksList.filter(task => task !== tasks[index]);
    }
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks = tasks.filter(task => !task.completed); 
    tasks.forEach((task, i) => {
        let li = document.createElement('li');
        li.innerHTML = `<div class = "task-row">
                            <div class = "checkbox">
                                <input type="checkbox" onchange="toggleTaskCompletion(${i})" ${task.completed ? 'checked' : ''}>
                            </div>
                            <div class = "task-name">
                                <span ${task.completed ? 'class="completed"' : ''}>${task.name}</span>
                            </div>
                            <div class = "action-btns">
                                <button class="edit-btn" onclick="editTask(${i})"><i class="fa fa-edit"></i></button>
                                <button class="delete-btn" onclick="deleteTask(${i})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                            </div>
                        </div>`;
        taskList.appendChild(li);
    });
    updateTaskCount();
    updateCompletedTasksList();
    saveTasksToLocalStorage();
}

function updateCompletedTasksList() {
    let completedTaskListContainer = document.getElementById('completedTaskList');
    completedTaskListContainer.innerHTML = '';

    completedTasksList.forEach(task => {
        let li = document.createElement('li');
        li.innerHTML = `<div class="task-row">
                            <div class = "checkbox">
                                <input type="checkbox" checked disabled>
                            </div>
                            <div class="task-name">
                                <span class="completed">${task.name}</span>
                            </div>
                            <div class="action-btns">
                                <button class="edit-btn" disabled><i class="fa fa-pencil" ></i></button>
                                <button class="delete-btn" disabled><i class="fa fa-trash"  aria-hidden="true"></i></button>
                            </div>
                        </div>`;
        
        completedTaskListContainer.appendChild(li);
    });
}

function deleteCompletedTask(index) {
    completedTasksList.splice(index, 1);
    updateCompletedTasksList();
    saveTasksToLocalStorage();
}


function deleteTask(index){
   
    let taskList = document.getElementById('taskList');
    let li = taskList.getElementsByTagName('li')[index];

    if (tasks[index].completed) {
        completedTasks--;
        updateTaskCount();
    }

    taskList.removeChild(li);
    tasks.splice(index, 1);
    totalTasks--;

    if (totalTasks === 0) {
        completedTasks = 0;
    }else {
        updateTaskCount();
    }
    saveTasksToLocalStorage();
    alert('Task successfully deleted.')
}


function updateTaskCount(){
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Retrieve tasks from local storage
function getTasksFromLocalStorage() {
    const tasksString = localStorage.getItem('tasks');
    if (tasksString) {
        tasks = JSON.parse(tasksString);
        totalTasks = tasks.length;
        completedTasks = tasks.filter(task => task.completed).length;
    }
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage when the webpage loads
window.onload = function () {
    getTasksFromLocalStorage();
    tasks.forEach((task, index) => {
        let taskList = document.getElementById('taskList');
        let li = document.createElement('li');
        li.innerHTML = `<div class = "task-row">
                            <div class = "checkbox">
                                <input type="checkbox" onchange="toggleTaskCompletion(${index})" ${task.completed ? 'checked' : ''}>
                            </div>
                            <div class = "task-name">
                                <span ${task.completed ? 'class="completed"' : ''}>${task.name}</span>
                            </div>
                            <div class = "action-btns">
                                <button class="edit-btn" onclick="editTask(${index})"><i class="fa fa-pencil"></i></button>
                                <button class="delete-btn" onclick="deleteTask(${index})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                            </div>
                        </div>`;
        taskList.appendChild(li);
    });
    updateTaskCount();
};

function editTask(index) {
    let newName = prompt('Enter the new task name:', tasks[index].name);
    if (newName && newName.trim() !== '') {
        tasks[index].name = newName;
        let taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach((task, i) => {
            let li = document.createElement('li');
            li.innerHTML = `<div class = "task-row">
                                <div class = "checkbox">
                                    <input type="checkbox" onchange="toggleTaskCompletion(${i})" ${task.completed ? 'checked' : ''}>
                                </div>
                                <div class = "task-name">
                                    <span ${task.completed ? 'class="completed"' : ''}>${task.name}</span>
                                </div>
                                <div class = "action-btns">
                                    <button class="edit-btn" onclick="editTask(${i})"><i class="fa fa-pencil"></i></button>
                                    <button class="delete-btn" onclick="deleteTask(${i})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                                </div>
                            </div>`;
            taskList.appendChild(li);
        });
        saveTasksToLocalStorage();
    }
}