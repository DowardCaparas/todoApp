const input = document.querySelector("#input");
const addTask = document.querySelector("#addTask");
const output = document.querySelector("#output");
const noTask = document.querySelector("#noTask");

const allButton = document.querySelector("#allButton");
const ongoingButton = document.querySelector("#ongoingButton");
const doneTaskButton = document.querySelector("#doneTaskButton");

let arr = [];

// Check localStorage on page load and render existing tasks
window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    arr = storedTasks; // Set the array to the stored tasks
    renderTask(arr); // Pass the array to the render function
  }
  allButton.style.backgroundColor = "#fff";
  noTask.textContent = "You have no task";
};

// Add task on button click
addTask.addEventListener("click", () => {
  const inputValue = input.value;

  if (inputValue) {
    // Store task with unchecked checkbox initially
    arr.push({ text: inputValue, isChecked: false, bgColor: "" });
    localStorage.setItem("tasks", JSON.stringify(arr)); // Store the updated array in localStorage
    renderTask(arr); // Pass the array to the render function
    input.value = "";
  }
});

// Function to render tasks from the array
function renderTask(tasks) {
  output.textContent = ""; // Clear the previous tasks

  tasks.forEach((item, index) => {
    // task container
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    // task title
    const taskText = document.createTextNode(item.text); // Create a span for task text

    // check box
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = item.isChecked; // Set checkbox state from stored value
    checkBox.classList.add("checkbox");

    // Apply the saved background color
    taskElement.style.backgroundColor = item.bgColor || ""; // Use the saved background color, default to "" if not set

    // Update checkbox state, background, and text color when clicked
    checkBox.addEventListener("change", () => {
      arr[index].isChecked = checkBox.checked; // Update the checked state in the array
      if (checkBox.checked) {
        arr[index].bgColor = "#86EDB0"; // Save light green color when checked
        taskElement.style.backgroundColor = "#86EDB0"; // Apply the background color
      } else {
        arr[index].bgColor = ""; // Reset the background color when unchecked
        taskElement.style.backgroundColor = ""; // Apply the default background color
      }

      // Save the updated task array to localStorage
      localStorage.setItem("tasks", JSON.stringify(arr));
    });

    // delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteTask");
    deleteButton.textContent = "X";

    // Delete task when the button is clicked
    deleteButton.addEventListener("click", () => {
      arr.splice(index, 1); // Remove the task from the array
      localStorage.setItem("tasks", JSON.stringify(arr)); // Update localStorage
      renderTask(arr); // Re-render the updated task list
    });

    taskElement.appendChild(checkBox);
    taskElement.appendChild(taskText); // Append the task text span
    taskElement.appendChild(deleteButton);

    output.appendChild(taskElement);
  });

  tasks.length > 0
    ? (noTask.textContent = "")
    : (noTask.textContent = "You have no task");
}

// Display all tasks
allButton.addEventListener("click", () => {
  allButton.style.backgroundColor = "#fff";
  ongoingButton.style.backgroundColor = "";
  doneTaskButton.style.backgroundColor = "";
  renderTask(arr);
});

// Display ongoing tasks
ongoingButton.addEventListener("click", () => {
  allButton.style.backgroundColor = "";
  ongoingButton.style.backgroundColor = "#fff";
  doneTaskButton.style.backgroundColor = "";
  const ongoingTasks = arr.filter((task) => !task.isChecked);
  renderTask(ongoingTasks);
});

// Display done tasks when the button is clicked
doneTaskButton.addEventListener("click", () => {
  allButton.style.backgroundColor = "";
  ongoingButton.style.backgroundColor = "";
  doneTaskButton.style.backgroundColor = "#fff";
  const doneTasks = arr.filter((task) => task.isChecked); // Filter tasks to show only done ones
  renderTask(doneTasks); // Render only the done tasks
});
