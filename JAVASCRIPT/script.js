import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

async function loadABI() {
    try {
        const response = await fetch('./contract.json');
        const abi = await response.json();
        const Contractabi = abi.abi;
        const contractAddress = "0xB0B17f9ef03f13E77e8eE2117067989a4118489A";
        console.log(abi);

        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts");
            const signer = await provider.getSigner();
            
            // Get the user's address
            const userAddress = await signer.getAddress();
            //console.log(Connected: ${userAddress});
            
            const contract = new ethers.Contract(contractAddress, Contractabi, signer);
            
            // Assuming 'register' is a function in your contract
            console.log("Calling register function...");
            const transaction = await contract.register();
            console.log("Transaction sent:", transaction.hash);
            
            const receipt = await transaction.wait();
            console.log("Transaction confirmed in block:", receipt.blockNumber);
            
            return contract;
        } else {
            alert("Please install MetaMask!");
            throw new Error("MetaMask not found");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Ensures it scrolls to the top of the section
            });
        });
    });

    // Add click event listeners to the boxes
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', function () {
            const action = this.querySelector('a').getAttribute('href');
            window.location.href = action; // Redirect to the href of the button inside the box
        });
    });

    // Add hover effect to pricing plans
    document.querySelectorAll('.plan').forEach(plan => {
        plan.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        plan.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Form submission for newsletter (if present)
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with email: ${email}`);
            this.reset();
        });
    }

    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    }

    // Check login status on page load
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check login status from localStorage
    const signupButton = document.querySelector('.signup-btn'); // Select the Sign Up button
    const logoutButton = document.createElement('button'); // Create Log Out button

    signupButton.onclick = async function() {
        const contract = await loadABI();
        if(contract) {
            window.location.href = 'login.html';
        }
       // 
    };

    // Set up Log Out button
    logoutButton.innerText = 'Log Out';
    logoutButton.classList.add('logout-btn');
    logoutButton.style.display = isLoggedIn ? 'inline-block' : 'none'; // Show or hide based on login status
    logoutButton.onclick = function() {
        localStorage.setItem("isLoggedIn", "false"); // Update login status
        window.location.reload(); // Reload the page to update buttons
    };

    // Insert the Log Out button into the navigation
    document.querySelector('nav').insertBefore(logoutButton, signupButton.nextSibling); // Insert after the Sign Up button

    // Show/hide buttons based on login status
    if (isLoggedIn) {
        signupButton.style.display = 'none'; // Hide Sign Up button if logged in
    } else {
        signupButton.style.display = 'inline-block'; // Show Sign Up button if not logged in
    }
});
