const pollsData = [
  {
      id: 1,
      question: "Which blockchain logo do you prefer?",
      options: [
          { image: "img/bc3.jpg", votes: 0 },
          { image: "img/bc4.jpg", votes: 0 },
          { image: "img/bc2.jpg", votes: 0 },
          { image: "img/bc1.jpg", votes: 0 }
      ],
      duration: "2 days",
      prizePool: "$500"
  },
  {
      id: 2,
      question: "Which NFT artwork is your favorite?",
      options: [
          { image: "img/s2.png", votes: 0 },
          { image: "img/s7.png", votes: 0 },
          // { image: "img/s.jpg", votes: 0 },
          // { image: "img/s5.jpg", votes: 0 }
      ],
      duration: "1 week",
      prizePool: "$1000"
  },
  {
      id: 3,
      question: "What's the most promising blockchain use case?",
      options: [
          { text: "DeFi", votes: 0 },
          { text: "NFTs", votes: 0 },
          { text: "Supply Chain", votes: 0 },
          { text: "Voting Systems", votes: 0 }
      ],
      duration: "3 days",
      prizePool: "$750"
  },
  {
      id: 4,
      question: "Which is the most appealing image?",
      options: [
          { image: "img/s5.jpg", votes: 0 },
          { image: "img/s6.jpg", votes: 0 },
          // { image: "img/s7.png", votes: 0 },
          // { image: "img/s8.png", votes: 0 }
      ],
      duration: "4 days",
      prizePool: "$600"
  },
  {
      id: 5,
      question: "Which blockchain platform do you think has the most potential for enterprise adoption?",
      options: [
          { text: "Ethereum", votes: 0 },
          { text: "Hyperledger Fabric", votes: 0 },
          { text: "Corda", votes: 0 },
          { text: "Quorum", votes: 0 }
      ],
      duration: "5 days",
      prizePool: "$800"
  },
  {
      id: 6,
      question: "Which is the best Thumbnail ?",
      options: [
          { image: "s1.jpg", votes: 0 },
          // { image: "img/s2.png", votes: 0 },
          { image: "img/s3.jpg", votes: 0 },
          { image: "img/s4.jpg", votes: 0 }
      ],
      duration: "6 days",
      prizePool: "$1200"
  }
];

function createPollCards() {
  const pollsContainer = document.getElementById('polls-container');

  pollsData.forEach(poll => {
      const pollCard = document.createElement('div');
      pollCard.className = 'poll-card';

      const question = document.createElement('h2');
      question.textContent = poll.question;
      pollCard.appendChild(question);

      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'poll-options';

      poll.options.forEach((option, index) => {
          const optionElement = document.createElement('div');
          optionElement.className = 'poll-option';

          if (option.image) {
              const img = document.createElement('img');
              img.src = option.image;
              img.alt = `Option ${index + 1}`;
              optionElement.appendChild(img);
          } else {
              optionElement.textContent = option.text;
          }

          const progressBar = document.createElement('div');
          progressBar.className = 'progress-bar';
          optionElement.appendChild(progressBar);

          const percentage = document.createElement('span');
          percentage.className = 'percentage';
          percentage.textContent = '0%';
          optionElement.appendChild(percentage);

          optionElement.addEventListener('click', () => handleVote(poll.id, index));

          optionsContainer.appendChild(optionElement);
      });

      pollCard.appendChild(optionsContainer);

      const pollInfo = document.createElement('div');
      pollInfo.className = 'poll-info';
      pollInfo.innerHTML = `
          <span>Duration: ${poll.duration}</span>
          <span>Prize Pool: ${poll.prizePool}</span>
      `;
      pollCard.appendChild(pollInfo);

      pollsContainer.appendChild(pollCard);
  });
}

function handleVote(pollId, optionIndex) {
  const poll = pollsData.find(p => p.id === pollId);
  if (poll) {
      poll.options[optionIndex].votes++;
      updatePollDisplay(poll);
  }
}

function updatePollDisplay(poll) {
  const pollCard = document.querySelector(`.poll-card:nth-child(${poll.id})`);
  const options = pollCard.querySelectorAll('.poll-option');
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  options.forEach((optionElement, index) => {
      const votes = poll.options[index].votes;
      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

      const progressBar = optionElement.querySelector('.progress-bar');
      const percentageElement = optionElement.querySelector('.percentage');

      progressBar.style.width = `${percentage}%`;
      percentageElement.textContent = `${percentage.toFixed(1)}%`;
  });
}

createPollCards();