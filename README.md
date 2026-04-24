🎓 StudentPlus AI – Intelligent Student Analytics Platform

An advanced AI-powered platform designed to help students improve academic performance, career direction, and placement readiness using machine learning models and intelligent dashboards.

---

🚀 Project Overview

StudentPlus AI is a full-stack application that integrates multiple AI/ML models to provide:

- 📊 Academic Risk Prediction
- 📈 Student Performance Forecast
- 💼 Placement Readiness Dashboard
- 🧠 Resume Analysis (ML + NLP)
- 🎯 Career Recommendation System
- 🧑‍💻 Internship Recommendation Engine
- 🏫 Institutional Analytics Dashboard
- 🤖 AI Academic Assistant

The platform provides a modern UI + real-time ML predictions, making it industry-level and hackathon-ready.

---

🧠 Key Features

📌 1. Academic Risk Prediction

Predicts whether a student is at:

- Low Risk
- Medium Risk
- High Risk

---

📌 2. Student Performance Predictor

- Predicts GPA 📊
- Classifies performance level
- Uses ML model + scaler

---

📌 3. Placement Readiness Dashboard 💼

- Dynamic score (0–100)
- Readiness level (Low / Medium / High)
- Companies eligible
- Skill-wise analysis:
  - Technical Skills
  - Communication
  - Projects
  - Aptitude
  - Coding

---

📌 4. Resume Analyzer 📄

- ML-based role prediction
- ATS Score (0–100)
- Keyword extraction
- AI suggestions
- PDF upload support

---

📌 5. Career Recommendation System 🎯

- Predicts best career path based on skills
- Provides:
  - Recommended role
  - Missing skills
  - Learning roadmap

---

📌 6. Internship Recommendation 🤝

- Suggests internship role based on:
  - Domain
  - Skills
  - Experience

---

📌 7. Institutional Analytics 📊

- Placement stats
- Salary bands
- CTC distribution
- Top recruiters

---

📌 8. AI Academic Assistant 🤖

- Answers student queries
- Expandable to GPT-based system

---

🏗️ Tech Stack

💻 Frontend

- React.js (Vite)
- Tailwind CSS
- Axios

⚙️ Backend

- Flask (Python)
- REST APIs
- CORS enabled

🧠 Machine Learning

- Scikit-learn
- Joblib (model loading)
- NLP (TF-IDF / Vectorizer)

---

📁 Project Structure

studentplus-ai/
│
├── backend/
│   ├── app.py
│   ├── models/
│   │   ├── academic_risk/
│   │   ├── Internship/
│   │   ├── resume_label_encoder/
│   │   ├── career_vectorizer/
│   │   └── Student_performance/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│
└── README.md

---

⚙️ Installation & Setup

🔹 1. Clone the Repository

git clone https://github.com/your-username/studentplus-ai.git
cd studentplus-ai

---

🔹 2. Backend Setup

cd backend
pip install -r requirements.txt
python app.py

Server will run on:

http://127.0.0.1:5000

---

🔹 3. Frontend Setup

cd studentplus-ai
npm install
npm run dev

Frontend runs on:

http://localhost:3000 (or 3002/3003)

---

🔗 API Endpoints

Feature| Endpoint
Health Check| "/api/health"
Academic Risk| "/api/predict-risk"
Student Performance| "/api/student-performance"
Placement Score| "/api/placement-score"
Placement Dashboard| "/api/placement-dashboard"
Resume Analyzer| "/api/analyze-resume"
Career Prediction| "/api/career-predict"
Internship Recommendation| "/api/internships"
Institutional Analytics| "/api/institutional-analytics"
AI Assistant| "/api/assistant/query"

---

👨‍💻 Team Members

- Kavin Gupta
- Happy Saini
- Divyanshi Gupta
- Anchal Yadav

---

🌟 Future Enhancements

- AI Assistant 🤖
- Real-time PDF parsing improvements
- Live job/internship APIs integration
- Advanced analytics charts (Recharts / D3)
- Authentication system

---

📌 Conclusion

StudentPlus AI is a complete intelligent student ecosystem that combines:

- Machine Learning
- Data Analytics
- Full Stack Development
to deliver real-world impact and industry-level experience.

---

⭐ If you like this project, give it a star!
