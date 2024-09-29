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
            console.log(`Connected: ${userAddress}`);
            
            const contract = new ethers.Contract(contractAddress, Contractabi, signer);
            
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

document.addEventListener('DOMContentLoaded', function() {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        age: "30",
        location: "New York, NY",
        occupation: "Software Developer",
        bio: "Passionate about technology and innovation.",
        profilePicture: "https://github.com/shadcn.png"
    };

    // Initialize user data
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('avatar').src = user.profilePicture;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('age').value = user.age;
    document.getElementById('location').value = user.location;
    document.getElementById('occupation').value = user.occupation;
    document.getElementById('bio').value = user.bio;

    // Tab functionality
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            trigger.classList.add('active');
            document.getElementById(`${trigger.dataset.tab}Tab`).classList.add('active');
        });
    });

    // Profile picture upload
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatar = document.getElementById('avatar');

    changeAvatarBtn.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatar.src = e.target.result;
                user.profilePicture = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Wallet functionality
    const balanceElement = document.getElementById('balance');
    const addAmountInput = document.getElementById('addAmount');
    const addMoneyBtn = document.getElementById('addMoneyBtn');

    async function updateBalance() {
        const contract = await loadABI();
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts");
        const signer = await provider.getSigner(); 
        // Get the user's address
        const userAddress = await signer.getAddress();
        const transaction = await contract.balance(userAddress.toString());
        balanceElement.textContent = `GAS ${transaction}`;
    }

    addMoneyBtn.addEventListener('click', async () => {
        const contract = await loadABI();
        const transaction = await contract.withdraw(addAmountInput.value);
    });

    // Disperse functionality
    const disperseAmountInput = document.getElementById('disperseAmount');
    const recipientAddressesInput = document.getElementById('recipientAddresses');
    const disperseBtn = document.getElementById('disperseBtn');

    disperseBtn.addEventListener('click', async () => {
        const contract = await loadABI();
        
        // Get the amount to disperse
        const disperseAmount = disperseAmountInput.value;
        
        // Get the recipient addresses from the textarea, splitting by commas
        const recipientAddresses = recipientAddressesInput.value.split(',').map(addr => addr.trim());
        
        if (disperseAmount > 0 && recipientAddresses.length > 0) {
            try {
                // Call the smart contract's disperse function (ensure the contract has this function)
                const transaction = await contract.disperseFunds(recipientAddresses, {
                    value: ethers.utils.parseEther(disperseAmount)
                });

                console.log("Transaction hash:", transaction.hash);
                alert("Funds dispersed successfully!");
            } catch (error) {
                console.error("Error dispersing funds:", error);
                alert("An error occurred while dispersing funds.");
            }
        } else {
            alert("Please enter a valid amount and at least one recipient address.");
        }
    });

    updateBalance();

    // Questions functionality
    const questions = [
        { id: 1, title: "Which is the most attractive Thumbnail ?", date: "2024-09-29" },
        { id: 2, title: "Which is the most trending photo in 2024?", date: "2024-09-28" },
    ];

    const questionsContainer = document.getElementById('questionsContainer');

    function displayQuestions() {
        questionsContainer.innerHTML = ''; // Clear the container first
        questions.forEach(question => {
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';
            
            const questionTitle = document.createElement('div');
            questionTitle.className = 'question-title';
            questionTitle.textContent = question.title;
            
            const questionDate = document.createElement('div');
            questionDate.className = 'question-date';
            questionDate.textContent = question.date;
    
            // Create the button
            const detailButton = document.createElement('button');
            detailButton.className = 'btn btn-primary'; // Add any desired button classes
            detailButton.textContent = 'View Details';
    
            // Add click event to the button
            detailButton.addEventListener('click', () => {
                window.location.href = `questiondetail.html?id=${question.id}`; // Redirect on click
            });
    
            // Append title, date, and button to the card
            questionCard.appendChild(questionTitle);
            questionCard.appendChild(questionDate);
            questionCard.appendChild(detailButton);
            
            questionsContainer.appendChild(questionCard); // Add card to container
        });
    }
    

    displayQuestions();

    // Save changes functionality (placeholder)
    const saveBtn = document.querySelector('.card-footer .btn:last-child');
    saveBtn.addEventListener('click', () => {
        user.name = document.getElementById('name').value;
        user.email = document.getElementById('email').value;
        user.age = document.getElementById('age').value;
        user.location = document.getElementById('location').value;
        user.occupation = document.getElementById('occupation').value;
        user.bio = document.getElementById('bio').value;

        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;

        alert('Changes saved successfully!');
    });
});
