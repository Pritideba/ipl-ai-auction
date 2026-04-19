# 🏏 IPL Auction Simulator (AI-Based)

An AI-powered IPL Auction Simulator that replicates real IPL auction logic with smart team bidding, player categorization, and budget management.

---

## 🚀 Features

* 🔥 Real IPL-style Auction System
* 🤖 AI-based Team Bidding Logic
* 💰 Dynamic Budget Management (₹150 Cr per team)
* 🧠 Smart Player Selection (based on role & team needs)
* 🌍 Indian + Overseas Player Pool (70/30 ratio)
* 🏏 Role-based Players:

  * Batter
  * Bowler
  * Allrounder
  * Wicketkeeper
* ⚡ Live Auction Flow
* 📊 Team Squad & Leaderboard

---

## 📁 Project Structure

```
project/
│
├── backend/
│   ├── app.py
│   ├── ai_logic.py
│
├── frontend/
│   ├── index.html
│   ├── auction.html
│   ├── script.js
│   ├── style.css
│
├── data/
│   └── players.csv
│
└── README.md
```

---

## ⚙️ Tech Stack

* Python (Flask)
* JavaScript (Frontend Logic)
* HTML & CSS (UI)
* Pandas (Data Handling)
* CSV Dataset (Player Data)

---

## ▶️ How to Run

### 1️⃣ Backend Setup

```bash
pip install flask flask-cors pandas
python app.py
```

Server runs at:

```
http://127.0.0.1:5000
```

---

### 2️⃣ Frontend

Open:

```
index.html
```

---

## 🔗 API Endpoints

### Get all players

```
GET /players
```

Returns JSON data of all players.

---

## 🧠 AI Logic (Core Idea)

* Teams bid based on:

  * Player role requirement
  * Remaining budget
  * Player rating
* Only 3–5 teams participate per player
* Stops bidding when:

  * Budget low
  * Better players available

---

## 📊 Dataset Info

* 300+ players
* No duplicate entries
* No Bangladesh/Pakistan players
* 70% Indian / 30% Overseas

---

## 🔮 Future Improvements

* 🔥 Live auction UI animation
* 🧠 Advanced ML-based bidding strategy
* 📊 Player performance stats integration
* 🌍 Real-time player database

---

## 👨‍💻 Author

* Pritideba Patra

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
