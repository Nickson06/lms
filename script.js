// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutForm = document.getElementById('logout-form');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const full_name = formData.get('full_name');
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, full_name })
            });
            if (response.ok) {
                alert('Registration successful');
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                alert('Login successful');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    logoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });
            if (response.ok) {
                alert('Logout successful');
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Check if the current page is the course content page
    if (window.location.pathname === '/course-content') {
        // Call the fetchCourseContent function
        fetchCourseContent();
    }

     // Check if the current page is the course content page
    if (window.location.pathname === '/leader-board') {
        // Fetch course content from server
        fetchLeaderboardData();
    }

    // Check if the current page is the course content page
    if (window.location.pathname === '/dashboard') {
        //fetch Logged in user's full name
        fetchFullName();
    }
});

function fetchCourseContent() {
    // Get course ID from URL parameter (assuming course ID is passed in the URL)
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    // Make AJAX request to fetch course content from server
    fetch(`/course/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display course content on the page
            displayCourseContent(data);
        })
        .catch(error => {
            console.error('Error fetching course content:', error);
        });
}

function displayCourseContent(courseContent) {
    // Get the course name element
    const courseNameElement = document.getElementById('course-name');
    // Set the course name
    courseNameElement.textContent = courseContent.name;

    // Get the course content element
    const courseContentElement = document.getElementById('course-content');
    // Clear previous content
    courseContentElement.innerHTML = '';

    // Loop through the modules and display them
    courseContent.modules.forEach(module => {
        const moduleSection = document.createElement('section');
        moduleSection.innerHTML = `
            <h2>${module.title}</h2>
            <p>${module.description}</p>
            <!-- Add more elements as needed (e.g., videos, quizzes) -->
        `;
        courseContentElement.appendChild(moduleSection);
    });
}

function fetchLeaderboardData() {
    // Make AJAX request to fetch leaderboard data from server
    fetch('/leaderboard')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display leaderboard data on the page
            displayLeaderboardData(data);
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
        });
}
// Function to save selected courses to local storage
function saveSelectedCourses(event) {
    event.preventDefault();
    const selectedCourses = [];
    const checkboxes = document.querySelectorAll('input[name="course"]:checked');
    checkboxes.forEach((checkbox) => {
        selectedCourses.push(checkbox.value);
    });
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    alert('Courses saved successfully!');
}

// Function to display selected courses from local storage
function displaySelectedCourses() {
    const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    const selectedCoursesList = document.getElementById('selected-courses-list');
    selectedCoursesList.innerHTML = '';
    selectedCourses.forEach((course) => {
        const li = document.createElement('li');
        li.textContent = course;
        selectedCoursesList.appendChild(li);
    });
}

// Add event listener to the form on the course selection page
if (document.getElementById('course-form')) {
    document.getElementById('course-form').addEventListener('submit', saveSelectedCourses);
}

// Call display function if on the selected courses page
if (document.getElementById('selected-courses-list')) {
    document.addEventListener('DOMContentLoaded', displaySelectedCourses);
}

function displayLeaderboardData(leaderboardData) {
    // Get the leaderboard element
    const leaderboardElement = document.getElementById('leaderboard');
    // Clear previous content
    leaderboardElement.innerHTML = '';

    // Create a table to display leaderboard data
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
        </tr>
    `;

    // Loop through the leaderboard data and add rows to the table
    leaderboardData.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        table.appendChild(row);
    });

    // Append the table to the leaderboard element
    leaderboardElement.appendChild(table);
}

function fetchFullName() {
    // Make AJAX request to fetch the user's full name from the server
    fetch('/get-fullname')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the user's full name on the dashboard
            displayFullName(data.fullName);
        })
        .catch(error => {
            console.error('Error fetching user full name:', error);
        });
}

function displayFullName(fullName) {
    // Get the element where the full name will be displayed
    const fullNameElement = document.getElementById('user-fullname');
    // Set the inner HTML of the element to the user's full name
    fullNameElement.textContent = fullName;
}