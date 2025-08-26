# Elvia Multiplayer Quiz Platform

A real-time, interactive multiplayer quiz application where hosts can create custom quizzes with various question types, and players can join using a unique room PIN to compete. Scores are calculated and displayed in real-time once the quiz ends.

## [Host Link🔗](https://elvia-ai.vercel.app)


## ✨ Features

### Quiz Creation
- Create quizzes with Multiple Choice (MCQ), True/False, and Fill-in-the-Blank question types.
- Add an unlimited number of questions.
- Set a time limit per question.
- Dynamic form management using **React Hook Form**.

### Unique Room PIN
- Each created quiz generates a unique, short room PIN for easy sharing.

### Player Joining
- Players can enter a room PIN to join an active quiz.
- Create a player profile with a custom name and a randomly selected avatar.
- Player data is saved to **Firestore**.

### Real-time Host Dashboard
- Host sees a live list of all joined players with their avatars and names.
- Host has control to start the quiz.
- Host can monitor how many players have finished answering all questions.
- Host can show results when ready.
- Host can end and delete the quiz.

### Real-time Player Experience
- Players see a waiting screen until the host starts the quiz.
- Quiz start sequence: 3-second warning → 3-second countdown → questions begin.
- Questions are displayed one by one, with a per-question timer.
- Answers are automatically submitted if the timer runs out (submitting the last selected/typed answer, or `null` if none).
- Players are shown a "You've finished!" screen while waiting for the host to show results.

### Score Calculation
- Scores are calculated based on correct answers for all question types (MCQ, True/False, Fill-in-the-Blank).
- Scores are stored with player profiles in Firestore.

### Dynamic Results Display
- Both host and players see a real-time leaderboard with scores and dynamic score bars when the quiz ends.

### Firebase Integration
- Uses Firestore for real-time database capabilities and data persistence.
- Answers are stored in a dedicated subcollection for scalability.

### Responsive Design
- Built with **Tailwind CSS** for a mobile-first approach.

## 🛠️ Technologies Used
- **React.js** – Frontend library for building user interfaces.
- **Next.js (App Router)** – React framework for server-side rendering and routing.
- **Tailwind CSS** – Utility-first CSS framework for rapid styling.
- **React Hook Form** – For efficient and flexible form management and validation.
- **Firebase Firestore** – Real-time NoSQL database for storing quiz data, player information, and answers.
- **Firebase Authentication (Anonymous/Custom Token)** – Used for basic user identification (can be extended for full authentication).
- **next/navigation** – For client-side routing in Next.js App Router.
- **react-icons** – For various icons.
- **lottie.host** – For animated illustrations.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <https://github.com/iamtushar28/Elvia>
cd Elvia
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Firebase Project Setup

## Create a Firebase Project

- Go to the Firebase Console.
- Click "Add project" and follow the steps to create a new project.

## Register a Web App

- In your Firebase project, click the </> (web) icon to add a new web app.
- Follow the instructions and copy your firebaseConfig object.

## Configure `.env.local`

In the root directory of your project, create a file named `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY_HERE"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_HERE"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID_HERE"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_HERE"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_HERE"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID_HERE"
GOOGLE_GENAI_API_KEY=YOUR_GENAI_API_KEY_HERE

 Important: Add `.env.local` to `.gitignore` to prevent it from being committed.

 ## Firebase Initialization File

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };

```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
___ 
# 🤝 Contributing

### Contributions are welcome! Please feel free to open issues or submit pull requests.