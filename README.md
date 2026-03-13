# 🌆 CivicPulse

### Smart Civic Issue Reporting Platform

🚀 **CivicPulse** is a modern web application that empowers citizens to report civic issues like potholes, garbage dumping, broken streetlights, or water leaks directly to authorities.

With **image uploads, location detection, and a clean user interface**, CivicPulse makes reporting problems faster, transparent, and more efficient.

---

## ✨ Features

📸 **Image-based Issue Reporting**
Upload photos of civic problems to provide clear evidence.

📍 **Automatic Location Detection**
Uses browser geolocation to detect where the issue occurred.

🗂 **Issue Categorization**
Helps classify problems such as sanitation, road damage, or infrastructure issues.

⚡ **Fast & Responsive UI**
Built with modern frontend tools for smooth performance.

🗄 **Database Storage**
All reports are stored securely using SQLite.

🧠 **Scalable Architecture**
Structured backend and frontend to support future AI features.

---

## 🖥 Tech Stack

### 🎨 Frontend

* HTML5
* CSS3
* JavaScript
* Tailwind CSS
* Vite

### ⚙ Backend

* Python
* Flask

### 🗄 Database

* SQLite

### 🛠 Tools & Environment

* Node.js
* npm
* Git & GitHub

---

## 📂 Project Structure

```
civicpulse
│
├── backend
│   ├── uploads              # Uploaded issue images
│   ├── app.py               # Flask backend server
│   ├── civicpulse.db        # SQLite database
│   └── requirements.txt     # Python dependencies
│
├── frontend
│   ├── node_modules         # Node packages
│   ├── src                  # Frontend source files
│   ├── index.html           # Main HTML entry
│   ├── package.json         # Node dependencies
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── START_MAC_LINUX.sh       # Start script for Mac/Linux
└── START_WINDOWS.bat        # Start script for Windows
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/civicpulse.git
cd civicpulse
```

---

### 2️⃣ Backend Setup

Navigate to backend folder

```
cd backend
```

Install Python dependencies

```
pip install -r requirements.txt
```

Run Flask server

```
python app.py
```

Backend will start running locally.

---

### 3️⃣ Frontend Setup

Navigate to frontend folder

```
cd frontend
```

Install dependencies

```
npm install
```

Start development server

```
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🧠 How CivicPulse Works

1️⃣ User opens the web app
2️⃣ Uploads an image of the civic issue
3️⃣ Location is detected automatically
4️⃣ Complaint is sent to backend API
5️⃣ Data is stored in the database
6️⃣ Issue becomes available for tracking and review

---

## 🌍 Real-World Impact

CivicPulse aims to improve **communication between citizens and local authorities** by:

✔ Making issue reporting easier
✔ Increasing transparency
✔ Helping cities respond faster to public problems

---

## 🔮 Future Improvements

🧠 AI image classification for automatic issue detection
📊 Admin dashboard for authorities
📍 Map-based issue visualization
📱 Mobile application version
🔔 Real-time status updates for complaints

---

## 👩‍💻 Author

**Chandana**

🎓 B.Tech Computer Science Student
💡 Interested in **UI/UX Design, Web Development, and AI Applications**

---

## ⭐ Support

If you like this project:

⭐ Star the repository
🍴 Fork the project
💡 Contribute ideas or improvements

---

## 📜 License

This project is open-source and available under the MIT License.
