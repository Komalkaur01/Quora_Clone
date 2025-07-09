# 🔥 Askify – Q&A and Post Sharing Platform

A modern, full-featured web app where users can ask questions, post updates with images, like/comment/share, and explore content across different topics like **Technology**, **Science**, **Business**, and **Health**.

---

## 🚀 Features

- ✅ **User Authentication** (Firebase Auth)
- 📝 **Ask Questions** by Topic (Health, Business, etc.)
- 📸 **Create Posts** with Images
- ❤️ **Like**, 💬 **Comment**, and 📤 **Share** Posts
- 📚 **Topic-based Feed Filtering**
- 🔎 **Modern UI** with Light/Dark Mode
- 🕒 **Relative Timestamps** (e.g., “2 hours ago”)
- 🔐 **Real-time Firestore Integration**

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── QuestionCard.jsx
│   └── ...
├── pages/
│   ├── Health.jsx
│   ├── Business.jsx
│   └── ...
├── firebase/
│   └── firebase.js
├── App.jsx
└── index.js
```


## 🔧 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend/Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Icons**: Lucide Icons
- **Notifications**: react-hot-toast
- **Date Formatting**: date-fns


## 🛠 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/askify.git
cd askify
```

2. **Install dependencies**

```bash
npm install
```

3. **Firebase Setup**

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable **Authentication (Email/Password)**
- Create a **Firestore Database**
- Replace Firebase config inside `firebase/firebase.js`:

```js
// firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  ...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

4. **Start the application**

```bash
npm start
```

---

## 📸 Screenshots

| Home Page | Question Feed | Post Feed |
|-----------|----------------|------------|
| _Add screenshots in a `/screenshots` folder_ | _Add here_ | _Add here_ |

---

## 🧠 Future Enhancements

- 🔍 Full-text search across posts and questions
- 💬 Nested replies and threaded discussions
- 📱 Mobile-first design & responsiveness
- ⚙️ Admin Panel and Content Moderation

---

## 🙌 Contributing

Contributions are welcome! Fork the repo and open a PR.

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📄 License

Licensed under the [MIT License](LICENSE).

> Built with ❤️ using React & Firebase
