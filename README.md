# ✨ DigiLoom

---

## Overview
**DigiLoom** is a decentralized platform that connects companies and individuals with a distributed network of users to complete small tasks. By leveraging cryptocurrency for secure and instant micropayments, AI for intelligent analysis, cloud storage (AWS) for data management, and blockchain for trustless and transparent transactions, DigiLoom offers an innovative solution for task management.

### How It Works
1. **Deposit Payments**: Companies or individuals deposit payments in cryptocurrency.
2. **Complete Tasks**: Users are compensated with micropayments upon successful task completion.
3. **Ideal Use Cases**: Data labeling, early market reviews, and small-scale assignments.

---

### Contract Details
**Contract Address**: `0xB0B17f9ef03f13E77e8eE2117067989a4118489A`  
**Explorer Link**: [Explore on Neo X Testnet](https://xt4scan.ngd.network/address/0xB0B17f9ef03f13E77e8eE2117067989a4118489A)

---

## Key Features
- **Crypto Micropayments**: Users are paid in cryptocurrency for completing tasks, ensuring fast and secure payments without traditional fees.
- **AI Sentiment Polarity**: Feedback is analyzed using AI to measure quality and improve task outcomes.
- **AI-Powered Analysis**: Users can analyze their images, videos, or text via AI and receive instant feedback.
- **Cloud Storage (AWS)**: Secure storage of task-related data, such as images and documents, on AWS S3.
- **Blockchain Integration**: Built on blockchain technology for secure, transparent payments and task management.
- **Web3 Wallet Support**: Seamless integration with Web3 wallets for easy management and withdrawal of payments.
- **Decentralized Marketplace**: Eliminates high fees and delays typically associated with traditional freelancing platforms.

---

## Use Cases
- **Data Labeling**: Outsource data annotation tasks to a network of users.
- **Market Reviews**: Gather early feedback on new products and ideas.
- **Cloud-Based Storage**: Securely store task-related data like user submissions, options, images, and other documents on AWS.

---

## Technologies
- **Blockchain**: Secure, decentralized ledger for payments.
- **Cryptocurrency**: Micropayments in crypto for task completion.
- **Web3**: Wallet integration for easy payment management.
- **AWS (Amazon Web Services)**: Cloud storage via AWS S3 for secure and scalable file management.
- **AI Sentiment Polarity**: Ensures quality in task feedback and improves review accuracy.
- **AI Analysis**: Assigns tasks based on user skill profiles.

---

# File Structure
- **saas.sol**: Smart Contract of the Project
- **index.html**: Main HTML file of the contract
- **.env**(Not Shared): Azure API Keys and AWS Keys

---

YouTube Link: https://youtu.be/jxyhdD2zYq4
Presentation Link: https://docs.google.com/presentation/d/1yFOerysO-eAXtJYBF86tR7hCeLOI2Lb9/edit#slide=id.p1

---

Note:
To run the application and access the analysis features, you need to set up your Azure credentials. Follow the steps below:

### 1. Create a `.env` File
You need to create a `.env` file at the root of the project to securely store your Azure API credentials.

### 2. Add the Following Variables to Your `.env` File:
```bash
AZURE_API_ENDPOINT=https://your-azure-endpoint-url
AZURE_API_KEY=your-azure-api-key
