

// AWS S3 Configuration
AWS.config.update({
    region: 'us-east-1', // Change to your desired region
    credentials: new AWS.Credentials('', '') // Use proper IAM role and policies for production
});

const s3 = new AWS.S3();
const bucketName = 'microsaastest'; // Replace with your bucket name

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Function to check if all fields are filled
function areFieldsFilled(form) {
    const inputs = form.querySelectorAll('input');
    for (let input of inputs) {
        if (input.value.trim() === '') {
            return false;
        }
    }
    return true;
}

// Handle sign-up form submission
document.getElementById('signUpForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission
    if (areFieldsFilled(this)) {
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;

        try {
            // Store each credential in a separate file
            const nameParams = {
                Bucket: bucketName,
                Key: `users/${email}/name.json`, // Store name
                Body: JSON.stringify({ name }),
                ContentType: 'application/json'
            };
            await s3.putObject(nameParams).promise();

            const emailParams = {
                Bucket: bucketName,
                Key: `users/${email}/email.json`, // Store email
                Body: JSON.stringify({ email }),
                ContentType: 'application/json'
            };
            await s3.putObject(emailParams).promise();

            const passwordParams = {
                Bucket: bucketName,
                Key: `users/${email}/password.json`, // Store password
                Body: JSON.stringify({ password }),
                ContentType: 'application/json'
            };
            await s3.putObject(passwordParams).promise();

            alert('User registered successfully!');
            window.location.href = 'login.html'; // Redirect after successful sign-up
        } catch (err) {
            console.error("Error uploading credentials: ", err);
            alert('There was an error registering the user. Please try again.');
        }
    } else {
        alert('Please fill out all fields before submitting.');
    }
});

// Handle sign-in form submission
document.getElementById('signInForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission
    if (areFieldsFilled(this)) {
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;

        const passwordParams = {
            Bucket: bucketName,
            Key: `users/${email}/password.json` // Get password
        };

        try {
            const data = await s3.getObject(passwordParams).promise();
            const userPassword = JSON.parse(data.Body.toString()).password;
            if (userPassword === password) {
                alert('Login successful!');
                localStorage.setItem("isLoggedIn", "true"); // Set login state
                window.location.href = 'index.html'; // Redirect after successful login
            } else {
                alert('Invalid email or password.');
            }
        } catch (err) {
            console.error("Error retrieving user data: ", err);
            alert('Invalid email or password.');
        }
    } else {
        alert('Please fill out all fields before submitting.');
    }
});

// Simulate social media login
function simulateSocialLogin(platform) {
    alert(`Login in with ${platform}`);
    document.getElementById('signInEmail').value = `user@${platform.toLowerCase()}.com`;
    document.getElementById('signInPassword').value = 'password123';
    document.getElementById('signInForm').dispatchEvent(new Event('submit'));
}

// Toggle between forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("isLoggedIn");
    alert('Logged out successfully!');
    window.location.reload(); // Reload the page to update button visibility
});
