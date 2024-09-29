document.addEventListener('DOMContentLoaded', function() {
    // Simulated data (replace with actual data fetching logic)
    const questionData = {
        id: 1,
        title: "Which is the most attractive Thumbnail ?",
        voteData: {
            labels: ['Image 1', 'Image 2', 'Image 3'],
            votes: [75, 10, 8, 7]
        }
    };

    // Predefined comments
    const comments = [
        "This question is really interesting!",
        "I love how simple yet challenging it is.",
        "Paris is definitely the capital; I hope everyone gets it right!"
    ];

    // Set the question title
    document.getElementById('questionTitle').textContent = questionData.title;

    // Calculate percentages
    const totalVotes = questionData.voteData.votes.reduce((a, b) => a + b, 0);
    const votePercentages = questionData.voteData.votes.map(votes => ((votes / totalVotes) * 100).toFixed(1));

    // Create the pie chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: questionData.voteData.labels,
            datasets: [{
                data: questionData.voteData.votes,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Vote Distribution (Count)'
                }
            }
        }
    });

    // Create the bar chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: questionData.voteData.labels,
            datasets: [{
                label: 'Vote Percentage',
                data: votePercentages,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Vote Distribution (%)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Function to display comments
    function displayComments() {
        const commentsContainer = document.getElementById('commentsContainer');
        commentsContainer.innerHTML = ''; // Clear the container first
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.textContent = comment;
            commentsContainer.appendChild(commentDiv);
        });
    }

    // Display comments on page load
    displayComments();

    // Function to analyze comments
    //Use .env file to get the credentials
    async function analyzeComments(comments) {
        const apiEndpoint = ""; // Adjust this endpoint
        const apiKey = ""; // Your Azure API key

        const messageContent = [
            {
                "role": "system",
                "content": `You are an expert in sentiment analysis and feedback summarization. 
                You will be given a list of survey comments. Please perform the following:
                1. Overall Sentiment Analysis: Provide the overall sentiment (positive, negative, or neutral) based on the feedback.
                2. Key Points: Summarize the key themes or topics from the comments.
                3. Suggestions for Improvement: If applicable, provide suggestions based on the feedback.`
            },
            {
                "role": "user",
                "content": `Here are the survey comments: ${comments.join('. ')}`
            }
        ];

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey // Use 'api-key' instead of 'Authorization'
                },
                body: JSON.stringify({
                    messages: messageContent,
                    max_tokens: 1500 // Adjust as necessary
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content; // Adjust based on your response structure
        } catch (error) {
            console.error('Error analyzing comments:', error);
            return 'Error analyzing comments. Please try again.';
        }
    }

    // Add event listener to the Analyze Comment button
    document.getElementById('analyzeCommentBtn').addEventListener('click', async function() {
        const analysisResult = await analyzeComments(comments);
        
        // Display the analysis result below the button
        const analysisResultDiv = document.getElementById('analysisResult'); // Ensure you have this div in your HTML
        analysisResultDiv.textContent = analysisResult;
    });
});
