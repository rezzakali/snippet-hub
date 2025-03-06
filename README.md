# Code Snippet Manager - Documentation

## 📌 Introduction

The **Code Snippet Manager** is a full-stack web application that allows developers to **store, organize, search, and share** code snippets efficiently. It features a **modern UI**, authentication, search functionality, tagging system, and Firebase Cloud Messaging (FCM) for notifications.

---

## 🚀 Features

- 📝 **Save & Organize** - Store your favorite code snippets with metadata.
- 🔍 **Search & Filter** - Find snippets easily by title, language, or tags.
- 🏷️ **Tagging & Categories** - Organize snippets with relevant tags.
- 🖥️ **Code Editor** - View, edit, and copy code directly from the UI.
- 📤 **Share Snippets** - Generate links for easy sharing.
- 🔥 **Trending Snippets** - View popular snippets.
- 🔔 **Push Notifications (FCM)** - Get updates when new snippets are added.
- 👤 **User Authentication** - Secure login with Firebase/Google Auth.
- 🎨 **Modern UI** - Built with Next.js, Tailwind CSS, and ShadCN.

---

## 🏗️ Tech Stack

| **Technology**   | **Usage**          |
| ---------------- | ------------------ |
| Next.js 14       | Frontend & API     |
| MongoDB          | Database           |
| Firebase Auth    | Authentication     |
| Firebase FCM     | Push Notifications |
| Tailwind CSS     | Styling            |
| ShadCN           | UI Components      |
| Mongoose         | ORM for MongoDB    |
| React CodeMirror | Code Editor        |

---

## 🗄️ Database Schema (MongoDB)

### **User Model**

```ts
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
});
```

### **Snippet Model**

```ts
const SnippetSchema = new mongoose.Schema({
  title: String,
  code: String,
  language: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});
```

### **Tag Model** (For structured categorization)

```ts
const TagSchema = new mongoose.Schema({
  name: String,
});
```

---

## 🔐 Authentication (Firebase Auth)

- **Users can sign in with:** Google Authentication (OAuth).
- **Session Handling:** Firebase manages user sessions securely.
- **Protected Routes:** Next.js middleware to restrict access to authenticated users.

```ts
import { getAuth } from 'firebase/auth';
const auth = getAuth();
```

---

## 📤 API Endpoints

### **User Endpoints**

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/users`     | Get all users     |
| GET    | `/api/users/:id` | Get user by ID    |
| POST   | `/api/users`     | Create a new user |
| DELETE | `/api/users/:id` | Delete user       |

### **Snippet Endpoints**

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/snippets`     | Get all snippets     |
| GET    | `/api/snippets/:id` | Get snippet by ID    |
| POST   | `/api/snippets`     | Create a new snippet |
| PUT    | `/api/snippets/:id` | Update snippet       |
| DELETE | `/api/snippets/:id` | Delete snippet       |

---

## 🎨 UI Design

### **Home Page Layout**

1️⃣ **Hero Section** 🚀

- Title: "Save, Share & Manage Code Snippets Easily"
- CTA Button: "Get Started"
  2️⃣ **Features Section** 🌟
- Show features like tagging, search, and sharing.
  3️⃣ **Explore Snippets** 🏗️
- Display snippets in a grid format with search & filters.
  4️⃣ **Footer Section** 📌
- Links to About, Contact, Privacy Policy.

---

## 🔔 Firebase Cloud Messaging (FCM)

- Send push notifications when new snippets are added.
- Implement FCM with Firebase Admin SDK.

```ts
import admin from 'firebase-admin';
const message = {
  notification: {
    title: 'New Snippet Added!',
    body: 'Check out the latest code snippet now!',
  },
  topic: 'snippets',
};
admin.messaging().send(message);
```

---

## ✨ Future Enhancements

✅ **AI-Powered Snippet Explanations** (if free AI APIs are available).  
✅ **Snippet Versioning** (track edits & history).  
✅ **Snippet Export (JSON/Markdown)** (download snippets).

---

## 🏁 Conclusion

This **Code Snippet Manager** provides a seamless experience for developers to store, search, and share snippets efficiently. With Firebase authentication, MongoDB, and Next.js, it offers both **scalability** and **performance**.

---

📌 **Ready to start coding? Let’s build this now!** 🚀
