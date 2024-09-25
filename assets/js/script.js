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
            new Notification(message);
        } else if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(message);
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
        const totalTime = timeSettings.currentMode === 'work'
            ? timeSettings.workTime
            : timeSettings.currentMode === 'shortBreak'
                ? timeSettings.shortBreakTime
                : timeSettings.longBreakTime;

        const progressPercent = (time / totalTime) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
        progressBarFill.style.backgroundColor = timeSettings.currentMode === 'work'
            ? '#4682B4'
            : timeSettings.currentMode === 'shortBreak'
                ? '#FF6347'
                : '#32CD32';
    }



});