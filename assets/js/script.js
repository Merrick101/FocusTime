/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners for buttons instead of using "onclick" in HTML
    document.querySelector('.open-btn').addEventListener('click', toggleSidebar);
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Sidebar toggle function
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('content');
        sidebar.classList.toggle('open');
        content.classList.toggle('shift');
    }

    // Function to open modals
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
    }

    // Function to close modals
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }

    // Close button for the sidebar
    const sidebarCloseBtn = document.querySelector('.sidebar .close-btn');
    sidebarCloseBtn.addEventListener('click', function () {
        toggleSidebar(); // Toggle the sidebar closed
    });

    // Close modal on outside click
    window.addEventListener('click', function (event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal with ESC key
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach((modal) => {
                if (modal.classList.contains('show')) {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Close sidebar with ESC key
    window.addEventListener('keydown', function (event) {
        const sidebar = document.getElementById('sidebar');
        if (event.key === 'Escape' && sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    });

    // Add event listeners for modal close buttons
    document.querySelectorAll('.modal .close-btn').forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal'); // Find the closest parent modal
            closeModal(modal.id); // Pass the modal's id to the closeModal function
        });
    });

    // Function to switch to Sign Up form
    function switchToSignUp() {
        document.getElementById('sign-in-form').classList.add('hidden');
        document.getElementById('sign-up-form').classList.remove('hidden');
    }

    // Function to switch to Sign In form
    function switchToSignIn() {
        document.getElementById('sign-up-form').classList.add('hidden');
        document.getElementById('sign-in-form').classList.remove('hidden');
    }

    // Add event listener to the Sign Up link in the Sign In form
    document.querySelector('#sign-in-form a').addEventListener('click', function (e) {
        e.preventDefault();
        switchToSignUp();
    });

    // Add event listener to the Sign In link in the Sign Up form
    document.querySelector('#sign-up-form a').addEventListener('click', function (e) {
        e.preventDefault();
        switchToSignIn();
    });

    // Timer-related variables
    const timeSettings = {
        workTime: 1500, // 25 minutes
        shortBreakTime: 300, // 5 minutes
        longBreakTime: 900, // 15 minutes
        timeLeft: 1500, // This will track the remaining time
        currentMode: 'work' // Initial mode is 'work'
    };

    // Timer control variables
    let isRunning = false;  // Tracks whether the timer is running
    let interval;           // Stores the reference to the interval

    // Get references to HTML elements
    const timeDisplay = document.getElementById('time');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const startPauseButton = document.getElementById('start-pause');
    const resetButton = document.getElementById('reset');
    const workModeButton = document.getElementById('work-mode');
    const shortBreakModeButton = document.getElementById('shortBreak-mode');
    const longBreakModeButton = document.getElementById('longBreak-mode');

    // Function to handle notifications
    function notifyUser(message) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(message); // Store the notification, even if not used
        } else if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    const notification = new Notification(message);
                }
            });
        } else {
            alert(message); // Fallback if notifications aren't available
        }
    }

    // Update Timer Display
    function updateTimerDisplay(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        timeDisplay.style.color = time > 900 ? '#4682B4' : time > 300 ? '#32CD32' : '#FF6347';
    }

    // Update Progress Bar
    function updateProgress(time) {
        let totalTime;
        let progressBarColor;

        // Determine the total time based on the current mode
        if (timeSettings.currentMode === 'work') {
            totalTime = timeSettings.workTime;
            progressBarColor = '#4682B4'; // Blue for Work mode
        } else if (timeSettings.currentMode === 'shortBreak') {
            totalTime = timeSettings.shortBreakTime;
            progressBarColor = '#FF6347'; // Red for Short Break mode
        } else {
            totalTime = timeSettings.longBreakTime;
            progressBarColor = '#32CD32'; // Green for Long Break mode
        }

        // Calculate progress percentage
        const progressPercent = (time / totalTime) * 100;

        // Update progress bar
        progressBarFill.style.width = `${progressPercent}%`;
        progressBarFill.style.backgroundColor = progressBarColor;
    }

    // Start or Pause the timer
    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function updateTimerUI() {
        updateTimerDisplay(timeSettings.timeLeft);
        updateProgress(timeSettings.timeLeft);
    }

    function startTimer() {
        isRunning = true;
        startPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        interval = setInterval(() => {
            if (timeSettings.timeLeft <= 0) {
                clearInterval(interval);
                switchMode(); // Automatically switch modes when time ends
            } else {
                timeSettings.timeLeft--;
                updateTimerUI();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(interval);
        isRunning = false;
        startPauseButton.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    }

    function resetTimer() {
        clearInterval(interval);
        isRunning = false;

        // Determine the correct time left based on the current mode
        if (timeSettings.currentMode === 'work') {
            timeSettings.timeLeft = timeSettings.workTime;
        } else if (timeSettings.currentMode === 'shortBreak') {
            timeSettings.timeLeft = timeSettings.shortBreakTime;
        } else {
            timeSettings.timeLeft = timeSettings.longBreakTime;
        }

        // Update display and progress
        updateTimerDisplay(timeSettings.timeLeft);
        updateProgress(timeSettings.timeLeft);

        // Reset the start/pause button
        startPauseButton.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    }

    // **Manual Mode Switching** without triggering notifications
    function manualSwitchMode(mode) {
        // Switch the mode
        timeSettings.currentMode = mode;

        // Determine the correct time left based on the mode
        if (mode === 'work') {
            timeSettings.timeLeft = timeSettings.workTime;
        } else if (mode === 'shortBreak') {
            timeSettings.timeLeft = timeSettings.shortBreakTime;
        } else {
            timeSettings.timeLeft = timeSettings.longBreakTime;
        }

        // Reset the timer for the new mode
        resetTimer();

        // Update active button styling
        document.querySelectorAll('.mode-btn').forEach(button => button.classList.remove('active'));
        document.getElementById(`${timeSettings.currentMode}-mode`).classList.add('active');
    }

    // **Automatic Mode Switching** when timer expires
    function switchMode() {
        if (timeSettings.currentMode === 'work') {
            // If in work mode, switch to short break
            timeSettings.currentMode = 'shortBreak';
            timeSettings.timeLeft = timeSettings.shortBreakTime;
            notifyUser("Time for a short break!");
        } else if (timeSettings.currentMode === 'shortBreak' || timeSettings.currentMode === 'longBreak') {
            // After short or long break ends, switch back to work
            timeSettings.currentMode = 'work';
            timeSettings.timeLeft = timeSettings.workTime;
            notifyUser("Back to work!");
        }

        resetTimer();
        document.querySelectorAll('.mode-btn').forEach(button => button.classList.remove('active'));
        document.getElementById(`${timeSettings.currentMode}-mode`).classList.add('active');
    }

    // Initial setup
    updateTimerDisplay(timeSettings.timeLeft);
    updateProgress(timeSettings.timeLeft);

    // Event listeners for buttons
    startPauseButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);

    // Manual mode switching when mode buttons are clicked
    workModeButton.addEventListener('click', () => manualSwitchMode('work'));
    shortBreakModeButton.addEventListener('click', () => manualSwitchMode('shortBreak'));
    longBreakModeButton.addEventListener('click', () => manualSwitchMode('longBreak'));

    // Request Notification Permission on page load
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Save customized timer and settings
    const saveBtn = document.getElementById('save-btn');
    const workDurationInput = document.getElementById('work-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const notificationsToggle = document.getElementById('notifications-toggle');

    // Save button functionality in the customization modal
    saveBtn.addEventListener('click', () => {
        // Save durations
        timeSettings.workTime = workDurationInput.value * 60;
        timeSettings.shortBreakTime = shortBreakDurationInput.value * 60;
        timeSettings.longBreakTime = longBreakDurationInput.value * 60;

        // Store Dark Mode and Notifications preferences based on whether the toggle has the 'active' class
        const darkModeEnabled = darkModeToggle.classList.contains('active');
        const notificationsEnabled = notificationsToggle.classList.contains('active');

        // Apply dark mode
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }

        // Save notifications preference
        localStorage.setItem('notificationsEnabled', notificationsEnabled ? 'enabled' : 'disabled');

        // Notify the user
        notifyUser('Settings saved successfully!');

        // Optionally close the modal after saving settings
        closeModal('customization-modal');
    });

    // Toggle Dark Mode
    darkModeToggle.addEventListener('click', () => {
        darkModeToggle.classList.toggle('active');
        const isDarkMode = darkModeToggle.classList.contains('active');
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });

    // Toggle Notifications
    notificationsToggle.addEventListener('click', () => {
        notificationsToggle.classList.toggle('active');
        const notificationsEnabled = notificationsToggle.classList.contains('active');
        localStorage.setItem('notificationsEnabled', notificationsEnabled ? 'enabled' : 'disabled');
    });

    // Initialize Toggles on Page Load (Restore from LocalStorage)
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'enabled';

    darkModeToggle.classList.toggle('active', darkModeEnabled);
    document.body.classList.toggle('dark-mode', darkModeEnabled);
    notificationsToggle.classList.toggle('active', notificationsEnabled);

    // Add event listener for feedback form submission
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Thank you for your feedback!');
            closeModal('contact-modal');
        });
    }
});