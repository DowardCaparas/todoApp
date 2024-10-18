const input = document.querySelector("#input");
const addTask = document.querySelector("#addTask");
const output = document.querySelector("#output");
const noTask = document.querySelector("#noTask");

const allButton = document.querySelector("#allButton");
const pendingButton = document.querySelector("#pendingButton");
const doneTaskButton = document.querySelector("#doneTaskButton");

let arr = [];

// Check localStorage on page load and render existing tasks
window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    arr = storedTasks; // Set the array to the stored tasks
    renderTask(arr, true); // Pass the array to the render function and show controls
  }
  allButton.style.backgroundColor = "#fff";
};

// Add task on button click
addTask.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  const inputValue = input.value;

  if (inputValue) {
    // Store task with unchecked checkbox initially
    arr.push({ text: inputValue, isChecked: false, bgColor: "" });
    localStorage.setItem("tasks", JSON.stringify(arr)); // Store the updated array in localStorage
    renderTask(arr); // Pass the array to the render function and show controls
    input.value = "";
  }
});

// State mangement for task filter
let state = "all";

// Function to render tasks from the array
function renderTask(tasks) {
  output.textContent = ""; // Clear the previous tasks

  tasks.forEach((item, index) => {
    // Task container
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    // Task title
    const taskText = document.createElement("span");
    taskText.textContent = item.text;

    if (state === "all") {
      // Checkbox
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

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("deleteTask");
      deleteButton.textContent = "X";

      // Delete task when the button is clicked
      deleteButton.addEventListener("click", () => {
        arr.splice(index, 1); // Remove the task from the array
        localStorage.setItem("tasks", JSON.stringify(arr)); // Update localStorage

        taskElement.remove();
      });

      taskElement.appendChild(checkBox); // Append checkbox to the left
      taskElement.appendChild(taskText); // Append centered task text
      taskElement.appendChild(deleteButton); // Append delete button to the right
    } else {
      taskElement.appendChild(taskText); // Only append centered task text without controls
    }

    output.appendChild(taskElement);
  });

  tasks.length > 0
    ? (noTask.textContent = "")
    : (noTask.textContent = "You have no task");
}

// Display all tasks
allButton.addEventListener("click", () => {
  panelButtonFunction("all", allButton, pendingButton, doneTaskButton, "#fff");
  renderTask(arr); // Show tasks with controls
});

// Display pending tasks
pendingButton.addEventListener("click", () => {
  panelButtonFunction("pending", pendingButton, allButton, doneTaskButton, "#fff");
  const pendingTasks = arr.filter((task) => !task.isChecked);
  renderTask(pendingTasks); // Show tasks without controls
});

// Display done tasks when the button is clicked
doneTaskButton.addEventListener("click", () => {
  panelButtonFunction("done", doneTaskButton, allButton, pendingButton, "#fff");
  const doneTasks = arr.filter((task) => task.isChecked);
  renderTask(doneTasks); // Show tasks without controls
});

// Function to handle button panel style changes
const panelButtonFunction = (stateHandler, activeButton, inactiveButton1, inactiveButton2, bgColor) => {
  // update the state
  state = stateHandler;
  activeButton.style.backgroundColor = bgColor;
  inactiveButton1.style.backgroundColor = "";
  inactiveButton2.style.backgroundColor = "";
};
