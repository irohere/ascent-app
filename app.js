document.addEventListener('DOMContentLoaded', () => {
    // DOM ELEMENTS
    const pointsDisplay = document.getElementById('points-display');
    const streakDisplay = document.getElementById('streak-display');
    const taskList = document.getElementById('task-list');
    const currentDateDisplay = document.getElementById('current-date');
    const resetBtn = document.getElementById('reset-progress-btn');

    // --- STATE MANAGEMENT ---
    let state = {
        streak: 0,
        lastLogin: new Date().toDateString(),
        tasks: [
            { id: 1, title: '15 Min Meditation', points: 1, completed: false },
            { id: 2, title: '10 Min Visualization', points: 1, completed: false },
            { id: 3, title: '25 Min Daily Exercise', points: 1, completed: false },
            { id: 4, title: 'Deep Work Block 1 (Focus)', points: 1, completed: false },
            { id: 5, title: 'Deep Work Block 2 (Revise)', points: 1, completed: false },
            { id: 6, title: 'Log Daily Wins & Journal', points: 1, completed: false },
            { id: 7, 'title': 'Plan Tomorrow', points: 1, completed: false }
        ]
    };

    // --- FUNCTIONS ---

    // Load data from localStorage or use default state
    function loadState() {
        const savedState = JSON.parse(localStorage.getItem('ascentAppState'));
        const today = new Date().toDateString();

        if (savedState) {
            // If the saved data is not from today, reset the 'completed' status of tasks
            if (savedState.lastLogin !== today) {
                savedState.tasks.forEach(task => task.completed = false);
                savedState.lastLogin = today;
                // Simple streak mechanism (in a real app, this would be more robust)
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (new Date(savedState.lastLogin).getTime() === yesterday.getTime()) {
                    savedState.streak++;
                } else {
                    savedState.streak = 1; // Reset streak if not consecutive days
                }
            }
            state = savedState;
        }
    }

    // Save the current state to localStorage
    function saveState() {
        localStorage.setItem('ascentAppState', JSON.stringify(state));
    }

    // Render all tasks in the list
    function renderTasks() {
        taskList.innerHTML = '';
        let currentPoints = 0;

        state.tasks.forEach(task => {
            if (task.completed) {
                currentPoints += task.points;
            }

            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.innerHTML = `
                <div class="checkbox">${task.completed ? '✔' : ''}</div>
                <span class="title">${task.title}</span>
                <span class="points">+${task.points} pt</span>
            `;
            taskItem.addEventListener('click', () => toggleTask(task.id));
            taskList.appendChild(taskItem);
        });
        updateHeader(currentPoints);
    }

    // Toggle a task's completion status
    function toggleTask(id) {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
            saveState();
        }
    }

    // Update the header with points and streak
    function updateHeader(points) {
        pointsDisplay.textContent = `🔥 ${points} Points`;
        streakDisplay.textContent = `⚡ ${state.streak} Day Streak`;
    }
    
    // Reset all progress
    function resetProgress() {
        if (confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            localStorage.removeItem('ascentAppState');
            // Re-initialize the state to default
             state = {
                streak: 0,
                lastLogin: new Date().toDateString(),
                tasks: state.tasks.map(t => ({...t, completed: false}))
            };
            renderTasks();
            saveState();
        }
    }

    // --- INITIALIZATION ---
    function init() {
        currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        loadState();
        renderTasks();
        saveState(); // Save the initial or updated state
        resetBtn.addEventListener('click', resetProgress);
    }

    init();
});
