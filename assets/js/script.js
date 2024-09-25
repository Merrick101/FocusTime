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

  

});