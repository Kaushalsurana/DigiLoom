import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

let counter = 0;

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
    // Initialize AWS SDK
    //use .env file to get the credential
    AWS.config.update({
        accessKeyId: '',
        secretAccessKey: '',
        region: 'us-east-1'
    });

    const s3 = new AWS.S3();
    const form = document.getElementById('poll-form');
    const addOptionButton = document.getElementById('add-option');
    const analyseAIButton = document.getElementById('analyse-ai');
    const optionsContainer = document.getElementById('options-container');
    const aiCommentSection = document.getElementById('ai-comment-section');
    const apiFetchedText = document.getElementById('api-fetched-text');

    let optionCount = 2;

    // Function to create a new option
    function createOption(number) {
        const optionGroup = document.createElement('div');
        optionGroup.className = 'option-group';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Option ${number}`;
        input.className = 'poll-option';
        input.required = true;

        const fileUploadContainer = document.createElement('div');
        fileUploadContainer.className = 'file-upload-container';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = `file-upload-${number}`;
        fileInput.className = 'file-upload';
        fileInput.accept = '.jpg,.jpeg,.png,.pdf,.docx';

        const fileLabel = document.createElement('label');
        fileLabel.htmlFor = `file-upload-${number}`;
        fileLabel.className = 'file-upload-label';
        fileLabel.textContent = 'Upload File';

        const previewContainer = document.createElement('div');
        previewContainer.id = `preview-container-${number}`;
        previewContainer.className = 'preview-container';

        fileUploadContainer.appendChild(fileInput);
        fileUploadContainer.appendChild(fileLabel);

        optionGroup.appendChild(input);
        optionGroup.appendChild(fileUploadContainer);
        optionGroup.appendChild(previewContainer);

        // Add event listener for file upload
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(img);
                }
                reader.readAsDataURL(file);
            }
        });

        return optionGroup;
    }

    // Add new option
    addOptionButton.addEventListener('click', function() {
        optionCount++;
        const newOption = createOption(optionCount);
        optionsContainer.appendChild(newOption);
    });

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Analyse with AI - send the files directly to Azure OpenAI API
    analyseAIButton.addEventListener('click', async function() {
        try {
            if (!aiCommentSection) {
                console.error("aiCommentSection not found in the DOM");
                return;
            }

            const fileInputs = document.querySelectorAll('.file-upload');
            const base64Images = [];

            for (let fileInput of fileInputs) {
                const file = fileInput.files[0];
                if (file) {
                    const base64 = await getBase64(file);
                    base64Images.push(`data:image/jpeg;base64,${base64}`);
                }
            }

            console.log(`Number of images processed: ${base64Images.length}`);

            if (base64Images.length === 0) {
                throw new Error("No images uploaded");
            }

            // Add your own key in .env file
            const endpoint = "";
            const apiKey = "";
            const apiVersion = "";

            const messageContent = base64Images.map((image, index) => ({
                role: "user",
                content: [
                    { type: "text", text: `Image ${index + 1}: Please evaluate the visual impact of this image on a scale of 1 to 10 and provide a justification for your rating along with suggestions for improvement. `},
                    { type: "image_url", image_url: { url: image } }
                ]
            }));

            console.log("Sending request to Azure OpenAI API...");

            const response = await fetch(`${endpoint}/openai/deployments/gpt-4o-standard/chat/completions?api-version=${apiVersion}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify({
                    messages: [{
                        role: "system",
                        content: `You are an experienced creative director tasked with evaluating portfolio images. Your goal is to assess the *visual impact* of the provided images on a scale from 1 to 10, where 1 is very weak and 10 is exceptionally impactful. Your analysis for each image should cover:

    1. *Visual Impact Rating*: Rate the image on a scale of 1 to 10 based on its overall aesthetic appeal, clarity, originality, and how effectively it communicates the intended message.
    2. *Justification*: Provide a detailed justification for the score, explaining specific elements that influenced the rating.
    3. *Improvement Suggestions*: Suggest areas for improvement.

    *Visual Impact Scale*:
    1-3: Low impact, lacks appeal or clarity.
    4-6: Moderate impact, communicates some ideas but could be more engaging.
    7-8: High impact, visually engaging with good clarity and originality.
    9-10: Exceptional impact, highly effective in conveying its purpose.

    Consider factors such as:
    - *Aesthetic Appeal*: How pleasing is the image to look at?
    - *Clarity of Message*: Does the image effectively convey its intended message?
    - *Originality and Creativity*: Is there a unique or innovative element to the design?
    - *Design Functionality*: How well does the design serve its purpose?

    Evaluate all images based on these criteria.`
                    }, ...messageContent],
                    max_tokens: 3000
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response received from Azure OpenAI API:", data);

            // Clear previous analysis text
            aiCommentSection.innerHTML = '';

            // Display formatted analysis result
            const analysis = data.choices[0].message.content;
            const formattedResult = analysis.split("**Image")
                .filter(part => part.trim())
                .map(part => part.trim().replace(/\n/g, "<br>"));

            formattedResult.forEach((result) => {
                const paragraph = document.createElement('p');
                paragraph.innerHTML = result;
                aiCommentSection.appendChild(paragraph);
            });

            console.log("Analysis displayed successfully");
        } catch (error) {
            console.error("An error occurred:", error);
            aiCommentSection.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Capture the username, duration value, and points
        const username = 'user123'; // Replace with dynamic username from your authentication system
        const duration = document.getElementById('duration').value;
        const questionText = document.getElementById('question').value;
        const points = document.getElementById('points').value; // Capture the points

        const contract = await loadABI();
        // Assuming 'register' is a function in your contract
        console.log("Calling register function...");
        const transaction = await contract.upload(counter,{value: points.toString()});
        console.log("Transaction sent:", transaction.hash);
        
        const receipt = await transaction.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        counter++;

        // Create a folder structure based on username
        const userFolderKey = `${username}/`;
        const questionFolderKey = `${userFolderKey}questions/${Date.now()}/`;

        // Create a folder for the question
        const params = {
            Bucket: 'microsaastest',
            Key: questionFolderKey, 
            Body: '', // Create a folder with an empty body
            ContentType: 'application/x-directory'
        };

        s3.putObject(params, function(err, data) {
            if (err) {
                console.error('Error creating folder:', err);
                return;
            }
            console.log('Folder created:', data);
            // Now upload the question, options, duration, points, and date
            uploadQuestion(questionFolderKey, questionText, duration, points);
            uploadDate(questionFolderKey); // Call the function to upload the date
        });
    });

    async function uploadQuestion(folderKey, questionText, duration, points) {
        const options = [...optionsContainer.querySelectorAll('.poll-option')];
        const files = [...document.querySelectorAll('.file-upload')];

        // Upload the question text file
        const questionParams = {
            Bucket: 'microsaastest',
            Key: `${folderKey}question.txt`,
            Body: questionText,
            ContentType: 'text/plain'
        };


        s3.putObject(questionParams, function(err, data) {
            if (err) {
                console.error('Error uploading question text:', err);
                return;
            }
            console.log('Question text uploaded:', data);
            // Now upload options and files
            options.forEach((option, index) => {
                const optionText = option.value;
                const fileInput = files[index];

                // Upload the option text file
                const optionParams = {
                    Bucket: 'microsaastest',
                    Key: `${folderKey}option_${index + 1}.txt`,
                    Body: optionText,
                    ContentType: 'text/plain'
                };

                s3.putObject(optionParams, function(err, data) {
                    if (err) {
                        console.error('Error uploading option text:', err);
                        return;
                    }
                    console.log(`Option ${index + 1} text uploaded:`, data);
                });

                // Upload the file if exists
                if (fileInput.files[0]) {
                    const file = fileInput.files[0];
                    const fileParams = {
                        Bucket: 'microsaastest',
                        Key: `${folderKey}${file.name}`,
                        Body: file,
                        ContentType: file.type
                    };

                    s3.upload(fileParams, function(err, data) {
                        if (err) {
                            console.error('Error uploading file:', err);
                            return;
                        }
                        console.log('File uploaded:', data);
                    });
                }
            });

            // Upload the duration as a separate text file
            const durationParams = {
                Bucket: 'microsaastest',
                Key: `${folderKey}duration.txt`,
                Body: duration,
                ContentType: 'text/plain'
            };

            s3.putObject(durationParams, function(err, data) {
                if (err) {
                    console.error('Error uploading duration:', err);
                    return;
                }
                console.log('Duration uploaded:', data);
            });

            // Upload the points as a separate text file
            const pointsParams = {
                Bucket: 'microsaastest',
                Key: `${folderKey}points.txt`,
                Body: points,
                ContentType: 'text/plain'
            };

            s3.putObject(pointsParams, function(err, data) {
                if (err) {
                    console.error('Error uploading points:', err);
                    return;
                }
                console.log('Points uploaded:', data);
                apiFetchedText.innerHTML = '<p>Poll created successfully!</p>';
            });
        });
    }
    console.log(counter);

    // Function to upload the current date
    function uploadDate(folderKey) {
        const currentDate = new Date().toISOString(); // Format the date as needed
        const dateParams = {
            Bucket: 'microsaastest',
            Key: `${folderKey}date.txt`,
            Body: currentDate,
            ContentType: 'text/plain'
        };

        s3.putObject(dateParams, function(err, data) {
            if (err) {
                console.error('Error uploading date:', err);
                return;
            }
            console.log('Date uploaded:', data);
        });
    }

    // Initialize file upload for existing options
    document.querySelectorAll('.file-upload').forEach((fileInput, index) => {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    const previewContainer = document.getElementById(`preview-container-${index + 1}`);
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(img);
                }
                reader.readAsDataURL(file);
            }
        });
    });
});
