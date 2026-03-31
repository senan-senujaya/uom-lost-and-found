# 🔍 UoM Lost & Found Network

A modern, full-stack web application designed for university campuses to help students report, search for, and recover lost items. Built with the MERN stack and styled with a premium Dark Glassmorphism UI.

## ✨ Key Features

*   **Modern Glassmorphism UI:** Built completely from scratch using the brand new Tailwind CSS v4, featuring frosted glass cards, backdrop blurs, and neon glowing gradients.
*   **Real-Time Search & Sieve:** Instantly filter lost or found items by keyword, type, or specific categories without refreshing the page.
*   **Secure Resolution System:** When a user reports an item, the server generates a unique **6-character Secret Token**. Users must input this exact token (or an Admin master password) to delete the post, preventing malicious deletions.
*   **Viral Social Sharing:** Integrated Web Share API allowing students to instantly format and blast "Lost Item Alerts" to university WhatsApp groups or native social apps in one click.
*   **Zero-Database Timestamps:** Dynamically calculates "Time Ago" (e.g., *10m ago*, *2h ago*) purely by extracting and decoding the creation timestamp hidden inside the MongoDB `_id` string.

## 💻 Tech Stack

*   **Frontend:** React.js, Vite, Tailwind CSS v4
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas, Mongoose
*   **API Communication:** Axios

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed and a [MongoDB Atlas](https://www.mongodb.com/atlas/database) account set up.

### 2. Clone the Repository
\`\`\`bash
git clone https://github.com/senan-senujaya/uom-lost-and-found.git
cd uom-lost-and-found
\`\`\`

### 3. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file inside the `backend` folder and add your MongoDB connection string:
\`\`\`env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lostandfound?retryWrites=true&w=majority
PORT=5001
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 4. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
\`\`\`
Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`

## 🔒 Security Note
The `.env` file and `node_modules` are safely ignored via `.gitignore` to protect database credentials.

---
*Built for the University of Moratuwa (UoM) Web Technologies Module.*