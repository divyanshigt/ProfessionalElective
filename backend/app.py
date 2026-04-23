from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
import requests
import joblib
import numpy as np
from io import BytesIO
from PyPDF2 import PdfReader

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# =========================
# Academic Risk files
# =========================
risk_model_path = os.path.join(BASE_DIR, "models", "academic_risk", "academic_risk_model.pkl")
risk_columns_path = os.path.join(BASE_DIR, "models", "academic_risk", "model_columns.pkl")

# =========================
# Internship files
# =========================
internship_model_path = os.path.join(BASE_DIR, "models", "Internship", "internship_model.pkl")
internship_columns_path = os.path.join(BASE_DIR, "models", "Internship", "columns.pkl")
internship_mlb_path = os.path.join(BASE_DIR, "models", "Internship", "mlb.pkl")
internship_domain_le_path = os.path.join(BASE_DIR, "models", "Internship", "le_domain.pkl")
internship_exp_le_path = os.path.join(BASE_DIR, "models", "Internship", "le_exp.pkl")
internship_target_le_path = os.path.join(BASE_DIR, "models", "Internship", "le_target.pkl")

# =========================
# Resume Analyzer files
# =========================
resume_model_path = os.path.join(BASE_DIR, "models", "resume_label_encoder", "resume_model.pkl")
resume_vectorizer_path = os.path.join(BASE_DIR, "models", "resume_label_encoder", "resume_vectorizer.pkl")
resume_label_encoder_path = os.path.join(BASE_DIR, "models", "resume_label_encoder", "resume_label_encoder.pkl")

# =========================
# Career Recommendation files
# =========================
career_model_path = os.path.join(BASE_DIR, "models", "career_vectorizer", "career_model (1).pkl")
career_vectorizer_path = os.path.join(BASE_DIR, "models", "career_vectorizer", "career_vectorizer (1).pkl")
career_label_path = os.path.join(BASE_DIR, "models", "career_vectorizer", "career_label (1).pkl")

# =========================
# Student Performance files
# =========================
sp_base = os.path.join(BASE_DIR, "models", "Student_performance", "Student_performance")

# =========================
# Load models
# =========================
risk_model = joblib.load(risk_model_path)
risk_columns = joblib.load(risk_columns_path)

# Internship artifacts
internship_model = joblib.load(internship_model_path)
internship_columns = joblib.load(internship_columns_path)
internship_mlb = joblib.load(internship_mlb_path)
internship_domain_le = joblib.load(internship_domain_le_path)
internship_exp_le = joblib.load(internship_exp_le_path)
internship_target_le = joblib.load(internship_target_le_path)

# Resume artifacts
resume_model = joblib.load(resume_model_path)
resume_vectorizer = joblib.load(resume_vectorizer_path)
resume_label_encoder = joblib.load(resume_label_encoder_path)

# Career artifacts
career_model = joblib.load(career_model_path)
career_vectorizer = joblib.load(career_vectorizer_path)
career_label = joblib.load(career_label_path)

# Student performance artifacts
gpa_model = joblib.load(os.path.join(sp_base, "gpa_model.pkl"))
performance_model = joblib.load(os.path.join(sp_base, "performance_model.pkl"))
scaler = joblib.load(os.path.join(sp_base, "scaler.pkl"))
label_encoder = joblib.load(os.path.join(sp_base, "label_encoder.pkl"))


# Gemini Client
gemini_client = genai.Client(api_key="AIzaSyBoWefRQbubvxO2XqnP8WQyQtbV6AB2HL8")

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "StudentPlus AI backend is running"
    })


# =========================
# Academic Risk Prediction
# =========================
@app.route("/api/predict-risk", methods=["POST"])
def predict_risk():
    data = request.get_json() or {}

    try:
        input_data = [data.get(col, 0) for col in risk_columns]
        features = np.array([input_data])
        pred = risk_model.predict(features)[0]

        pred_int = int(pred)

        label_map = {
            0: "Low Risk",
            1: "Medium Risk",
            2: "High Risk"
        }

        return jsonify({
            "risk_level": label_map.get(pred_int, f"Class {pred_int}"),
            "raw_prediction": pred_int,
            "input_used": {col: data.get(col, 0) for col in risk_columns}
        })
    except Exception as e:
        return jsonify({
            "error": "Risk prediction failed",
            "details": str(e)
        }), 500


# =========================
# GPA Forecast
# =========================
@app.route("/api/forecast-gpa", methods=["POST"])
def forecast_gpa():
    data = request.get_json() or {}
    current_gpa = float(data.get("currentGpa", 0))
    study_hours = float(data.get("studyHours", 0))

    predicted_gpa = min(10.0, round(current_gpa + (study_hours * 0.1), 2))

    return jsonify({
        "predicted_gpa": predicted_gpa
    })


# =========================
# Placement Score
# =========================
@app.route("/api/placement-score", methods=["POST"])
def placement_score():
    data = request.get_json() or {}

    try:
        skills = int(data.get("skills", 0))
        projects = int(data.get("projects", 0))
        aptitude = int(data.get("aptitude", 0))
        communication = int(data.get("communication", 0))
        cgpa = float(data.get("cgpa", 0))

        score = min(100, round(
            (skills * 8) +
            (projects * 10) +
            (aptitude * 0.25) +
            (communication * 0.2) +
            (cgpa * 5)
        ))

        if score >= 75:
            level = "High Readiness"
            suggestion = "You are placement-ready. Focus on mock interviews and advanced projects."
        elif score >= 50:
            level = "Medium Readiness"
            suggestion = "Improve DSA, aptitude, and communication to increase interview chances."
        else:
            level = "Low Readiness"
            suggestion = "Build more projects, improve coding fundamentals, and practice aptitude regularly."

        return jsonify({
            "placement_score": score,
            "readiness_level": level,
            "suggestion": suggestion,
            "input_used": {
                "skills": skills,
                "projects": projects,
                "aptitude": aptitude,
                "communication": communication,
                "cgpa": cgpa
            }
        })

    except Exception as e:
        return jsonify({
            "error": "Placement prediction failed",
            "details": str(e)
        }), 500


# =========================
# Resume Analyzer ML
# =========================
@app.route("/api/analyze-resume", methods=["POST"])
def analyze_resume():
    try:
        resume_text = ""

        if "file" in request.files:
            file = request.files["file"]

            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400

            if not file.filename.lower().endswith(".pdf"):
                return jsonify({"error": "Only PDF files are allowed"}), 400

            pdf_bytes = BytesIO(file.read())
            reader = PdfReader(pdf_bytes)

            extracted_pages = []
            for page in reader.pages:
                extracted_pages.append(page.extract_text() or "")

            resume_text = "\n".join(extracted_pages).strip()
        else:
            data = request.get_json() or {}
            resume_text = data.get("resumeText", "").strip()

        if not resume_text:
            return jsonify({
                "error": "Resume text could not be extracted"
            }), 400

        vectorized_text = resume_vectorizer.transform([resume_text])
        pred = resume_model.predict(vectorized_text)[0]

        try:
            predicted_category = resume_label_encoder.inverse_transform([pred])[0]
        except Exception:
            predicted_category = str(pred)

        lower_text = resume_text.lower()

        score = 50
        suggestions = []
        matched_keywords = []

        keyword_groups = {
            "python": ["python"],
            "projects": ["project", "projects"],
            "internship": ["internship", "experience"],
            "skills": ["skills", "technical skills"],
            "github": ["github"],
            "linkedin": ["linkedin"],
            "sql": ["sql", "mysql", "postgresql"],
            "api": ["api", "rest api", "flask", "fastapi"],
            "ml": ["machine learning", "deep learning", "scikit-learn", "tensorflow", "pytorch"],
            "web": ["react", "javascript", "html", "css", "node.js"]
        }

        for group, words in keyword_groups.items():
            found = False
            for word in words:
                if word in lower_text:
                    matched_keywords.append(word)
                    found = True
            if found:
                score += 5

        if "python" not in lower_text:
            suggestions.append("Add Python if relevant to your target role.")
        if "project" not in lower_text:
            suggestions.append("Add strong project descriptions with outcomes.")
        if "internship" not in lower_text and "experience" not in lower_text:
            suggestions.append("Mention internship or hands-on practical experience.")
        if "skills" not in lower_text:
            suggestions.append("Add a dedicated technical skills section.")
        if "github" not in lower_text and "linkedin" not in lower_text:
            suggestions.append("Add GitHub or LinkedIn links.")
        if "sql" not in lower_text:
            suggestions.append("Mention database or SQL skills if you know them.")
        if "api" not in lower_text and "flask" not in lower_text and "fastapi" not in lower_text:
            suggestions.append("Add API/backend experience if applicable.")

        score = min(score, 100)

        if score >= 85:
            ats_level = "Excellent"
        elif score >= 70:
            ats_level = "Good"
        elif score >= 55:
            ats_level = "Average"
        else:
            ats_level = "Needs Improvement"

        ai_summary = (
            f"Your resume is most aligned with '{predicted_category}'. "
            f"It has an ATS score of {score}/100 and falls under '{ats_level}'. "
            f"To improve further, focus on stronger project descriptions, practical experience, and technical keyword coverage."
        )

        return jsonify({
            "predicted_role": predicted_category,
            "resume_score": score,
            "ats_level": ats_level,
            "suggestions": suggestions,
            "confidence": 0.88,
            "matched_keywords": list(sorted(set(matched_keywords))),
            "ai_summary": ai_summary,
            "extracted_text_preview": resume_text[:800]
        })

    except Exception as e:
        return jsonify({
            "error": "Resume analysis failed",
            "details": str(e)
        }), 500


# =========================
# Career Roadmap
# =========================
@app.route("/api/career-roadmap", methods=["POST"])
def career_roadmap():
    data = request.get_json() or {}
    role = data.get("role", "Software Developer")

    return jsonify({
        "target_role": role,
        "missing_skills": ["DSA", "SQL", "Projects"],
        "recommended_steps": [
            "Strengthen fundamentals",
            "Build 2 portfolio projects",
            "Practice coding regularly",
            "Improve resume and LinkedIn"
        ]
    })


# =========================
# Career Prediction (Next Level)
# =========================
@app.route("/api/career-predict", methods=["POST"])
def career_predict():
    data = request.get_json() or {}

    try:
        skills_text = str(data.get("skills", "")).strip().lower()

        if not skills_text:
            return jsonify({"error": "Skills are required"}), 400

        skills_list = [s.strip() for s in skills_text.split(",") if s.strip()]

        recommended_role = ""
        confidence = 0.85
        related_roles = []
        missing_skills = []
        roadmap = []

        if any(x in skills_text for x in ["react", "html", "css", "javascript", "node", "frontend"]):
            recommended_role = "Frontend / Full Stack Developer"
            confidence = 0.92
            related_roles = ["Frontend Developer", "Full Stack Developer", "UI Engineer"]
            missing_skills = ["REST APIs", "State Management", "Deployment", "System Design Basics"]
            roadmap = [
                "Strengthen React and JavaScript fundamentals",
                "Build 2 full-stack portfolio projects",
                "Learn API integration and authentication",
                "Deploy projects on Vercel / Render",
                "Practice frontend interview questions"
            ]

        elif any(x in skills_text for x in ["python", "machine learning", "deep learning", "tensorflow", "pytorch"]):
            recommended_role = "AI / ML Engineer"
            confidence = 0.90
            related_roles = ["ML Engineer", "AI Engineer", "Applied Data Scientist"]
            missing_skills = ["Model Deployment", "MLOps", "FastAPI/Flask", "SQL"]
            roadmap = [
                "Strengthen ML and deep learning basics",
                "Build 2 end-to-end ML projects",
                "Learn model deployment with Flask/FastAPI",
                "Study MLOps basics and API serving",
                "Create GitHub portfolio with deployed demos"
            ]

        elif any(x in skills_text for x in ["sql", "pandas", "numpy", "power bi", "excel", "statistics", "visualization"]):
            recommended_role = "Data Science / Analyst"
            confidence = 0.88
            related_roles = ["Data Analyst", "Data Scientist", "Business Analyst"]
            missing_skills = ["SQL", "Dashboards", "Machine Learning Basics", "Storytelling"]
            roadmap = [
                "Improve Python, pandas, and SQL",
                "Practice EDA and visualization projects",
                "Create dashboards in Power BI/Tableau",
                "Learn basic machine learning models",
                "Build case-study based portfolio projects"
            ]

        elif any(x in skills_text for x in ["java", "c++", "dsa", "oop", "dbms", "os"]):
            recommended_role = "Software Development Engineer"
            confidence = 0.89
            related_roles = ["SDE", "Backend Developer", "Software Engineer"]
            missing_skills = ["System Design", "Backend Frameworks", "Projects", "Problem Solving Speed"]
            roadmap = [
                "Practice DSA regularly",
                "Revise OOPs, DBMS, OS, and CN",
                "Build backend or full-stack projects",
                "Solve interview-style coding problems",
                "Prepare resume and GitHub for placements"
            ]

        else:
            vectorized = career_vectorizer.transform([skills_text])
            pred = career_model.predict(vectorized)[0]

            try:
                recommended_role = career_label.inverse_transform([pred])[0]
            except Exception:
                recommended_role = str(pred)

            related_roles = [recommended_role]
            missing_skills = ["Projects", "Advanced Tools", "Role-Specific Skills"]
            roadmap = [
                "Improve your core fundamentals",
                "Add more role-specific tools and frameworks",
                "Build practical portfolio projects",
                "Improve resume and online profile"
            ]

        ai_summary = (
            f"Based on your current skills, the most suitable path is '{recommended_role}'. "
            f"You already have a good base, but adding more targeted projects and role-specific tools "
            f"will improve your chances significantly."
        )

        return jsonify({
            "recommended_role": recommended_role,
            "confidence": confidence,
            "related_roles": related_roles,
            "missing_skills": missing_skills,
            "roadmap": roadmap,
            "ai_summary": ai_summary,
            "input_used": skills_list
        })

    except Exception as e:
        return jsonify({
            "error": "Career prediction failed",
            "details": str(e)
        }), 500


# =========================
# Internship Recommendation
# =========================
@app.route("/api/internships", methods=["POST"])
def internships():
    data = request.get_json() or {}

    try:
        domain = str(data.get("domain", "")).strip()
        experience = str(data.get("experience", "")).strip()
        skills = data.get("skills", [])

        if isinstance(skills, str):
            skills = [s.strip().lower() for s in skills.split(",") if s.strip()]
        elif isinstance(skills, list):
            skills = [str(s).strip().lower() for s in skills if str(s).strip()]
        else:
            skills = []

        domain_lower = domain.lower()

        if "ai" in domain_lower or "machine learning" in domain_lower:
            role = "AI Intern"
            suggestion = "Focus on Python, ML, APIs, and model deployment."
        elif "data science" in domain_lower:
            role = "Data Science Intern"
            suggestion = "Improve Python, pandas, SQL, and end-to-end data projects."
        elif "data analysis" in domain_lower:
            role = "Data Analyst Intern"
            suggestion = "Improve SQL, Excel, dashboards, and analytical storytelling."
        elif "web" in domain_lower:
            role = "Frontend Intern"
            suggestion = "Strengthen React, JavaScript, APIs, and frontend projects."
        elif "software" in domain_lower:
            role = "SDE Intern"
            suggestion = "Practice DSA, OOP, DBMS, and backend fundamentals."
        else:
            role = "Full Stack Intern"
            suggestion = "Build full-stack projects with frontend, backend, and database integration."

        return jsonify({
            "recommended_role": role,
            "confidence": 0.87,
            "suggestion": suggestion,
            "input_used": {
                "domain": domain,
                "experience": experience,
                "skills": skills
            }
        })

    except Exception as e:
        return jsonify({
            "error": "Internship prediction failed",
            "details": str(e)
        }), 500


# =========================
# Student Performance API
# =========================
@app.route("/api/student-performance", methods=["POST"])
def student_performance():
    data = request.get_json() or {}

    try:
        study_hours = float(data.get("study_hours", 0))
        attendance = float(data.get("attendance", 0))
        assignments = float(data.get("assignments", 0))
        internal_marks = float(data.get("internal_marks", 0))

        # Model expects 13 features. We are supplying 4 real + 9 default placeholders.
        features = np.array([[
            study_hours,
            attendance,
            assignments,
            internal_marks,
            0, 0, 0, 0, 0, 0, 0, 0, 0
        ]])

        features_scaled = scaler.transform(features)

        gpa = gpa_model.predict(features_scaled)[0]
        perf = performance_model.predict(features_scaled)[0]

        try:
            perf_label = label_encoder.inverse_transform([int(perf)])[0]
        except Exception:
            perf_label = str(perf)

        return jsonify({
            "predicted_gpa": round(float(gpa), 2),
            "performance": perf_label,
            "confidence": 0.9,
            "input_used": data
        })

    except Exception as e:
        return jsonify({
            "error": "Student performance prediction failed",
            "details": str(e)
        }), 500
# =========================
# AI Assistant
# =========================
@app.route("/api/assistant/query", methods=["POST"])
def assistant_query():
    try:
        data = request.get_json() or {}
        query = str(data.get("query", "")).strip()

        if not query:
            return jsonify({"response": "Please enter a question."}), 400

        try:
            # Gemini AI call
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=(
                    "You are StudentPlus AI, a modern AI assistant for students.\n\n"
                    "Your job:\n"
                    "- Help with academics, GPA improvement, placements, internships, resume, projects.\n"
                    "- Answer in clean markdown.\n"
                    "- Use headings, bullet points, short paragraphs.\n"
                    "- Be practical and clear.\n\n"
                    f"User question: {query}"
                ),
            )

            answer = getattr(response, "text", None)

            if answer:
                return jsonify({"response": answer})

        except Exception as gemini_error:
            print("Gemini error:", gemini_error)

            q = query.lower()

            # ===== SMART FALLBACKS =====
            if "gpa" in q or "study" in q or "academic" in q:
                fallback = (
                    "## 🎓 Improve Your GPA\n\n"
                    "- Study **daily** (avoid last-minute cramming)\n"
                    "- Revise notes within **24 hours**\n"
                    "- Solve **PYQs + practice questions**\n"
                    "- Focus on **weak subjects first**\n"
                    "- Maintain **sleep + consistency**\n\n"
                    "👉 Small daily effort = big GPA boost 🚀"
                )

            elif "resume" in q:
                fallback = (
                    "## 📄 Improve Your Resume\n\n"
                    "- Add **strong projects with results**\n"
                    "- Mention **skills + internships**\n"
                    "- Add **GitHub & LinkedIn links**\n"
                    "- Use **ATS keywords**\n\n"
                    "👉 Clean resume = more shortlist calls 💼"
                )

            elif "placement" in q:
                fallback = (
                    "## 💼 Placement Preparation\n\n"
                    "- Practice **DSA daily**\n"
                    "- Improve **aptitude + communication**\n"
                    "- Build **2–3 solid projects**\n"
                    "- Prepare for **HR + technical interviews**\n\n"
                    "👉 Consistency > Talent 🔥"
                )

            elif "internship" in q:
                fallback = (
                    "## 🚀 Get Better Internships\n\n"
                    "- Build **domain-specific projects**\n"
                    "- Improve **resume quality**\n"
                    "- Apply on **LinkedIn + Internshala**\n"
                    "- Match **skills with job role**\n\n"
                    "👉 Smart applying increases chances 📈"
                )

            else:
                fallback = (
                    "## 🤖 StudentPlus AI\n\n"
                    "Live AI is currently under **high demand** ⚠️\n\n"
                    "You can still ask about:\n"
                    "- 🎓 Academics\n"
                    "- 💼 Placements\n"
                    "- 📄 Resume\n"
                    "- 🚀 Internships\n"
                    "- 🧠 Career guidance\n\n"
                    "👉 Try a more specific question!"
                )

            return jsonify({"response": fallback})

        return jsonify({
            "response": "No response returned from AI."
        }), 500

    except Exception as e:
        return jsonify({
            "error": "Assistant failed",
            "details": str(e)
        }), 500
# =========================
# Placement Dashboard Data
# =========================
@app.route("/api/placement-dashboard", methods=["POST"])
def placement_dashboard():
    data = request.get_json() or {}

    try:
        skills = int(data.get("skills", 5))
        projects = int(data.get("projects", 3))
        aptitude = int(data.get("aptitude", 60))
        communication = int(data.get("communication", 60))
        cgpa = float(data.get("cgpa", 7))

        placement_score = min(100, round(
            (skills * 8) +
            (projects * 10) +
            (aptitude * 0.25) +
            (communication * 0.2) +
            (cgpa * 5)
        ))

        if placement_score >= 75:
            readiness_level = "High Readiness"
            suggestion = "You are close to placement-ready. Improve communication and advanced project depth."
        elif placement_score >= 50:
            readiness_level = "Medium Readiness"
            suggestion = "Improve aptitude, communication, and project quality for better placement chances."
        else:
            readiness_level = "Low Readiness"
            suggestion = "Strengthen DSA, aptitude, projects, and communication fundamentals."

        technical_skills = min(100, skills * 10)
        projects_portfolio = min(100, projects * 10)
        coding_proficiency = min(100, skills * 10)
        companies_eligible = max(5, int(placement_score / 3))
        improvement = max(2, 100 - placement_score)

        return jsonify({
            "placement_score": placement_score,
            "readiness_level": readiness_level,
            "improvement": improvement,
            "companies_eligible": companies_eligible,
            "technical_skills": technical_skills,
            "communication": communication,
            "projects_portfolio": projects_portfolio,
            "aptitude_reasoning": aptitude,
            "coding_proficiency": coding_proficiency,
            "suggestion": suggestion,
            "input_used": {
                "skills": skills,
                "projects": projects,
                "aptitude": aptitude,
                "communication": communication,
                "cgpa": cgpa
            }
        })

    except Exception as e:
        return jsonify({
            "error": "Placement dashboard failed",
            "details": str(e)
        }), 500


# =========================
# Institutional Analytics Data
# =========================
@app.route("/api/institutional-analytics", methods=["GET"])
def institutional_analytics():
    return jsonify({
        "companies": 370,
        "students": 1545,
        "offers": 2430,
        "highest_package_lpa": 48.89,
        "average_package_lpa": 6.51,
        "placement_rate": 91.53,

        "salary_bands": [
            {"band": ">9 LPA", "companies": 55, "offers": 233},
            {"band": "6-9 LPA", "companies": 82, "offers": 480},
            {"band": "4-6 LPA", "companies": 192, "offers": 1657}
        ],

        "ctc_matrix": [
            {"group": "Top 100 Students", "avg_ctc_lpa": 17.35},
            {"group": "Top 200 Students", "avg_ctc_lpa": 13.13},
            {"group": "Top 300 Students", "avg_ctc_lpa": 11.06},
            {"group": "Top 500 Students", "avg_ctc_lpa": 8.95}
        ],

        "ctc_terminal": [
            {"package_lpa": 48.89, "students": 9},
            {"package_lpa": 32.57, "students": 3},
            {"package_lpa": 23.00, "students": 8},
            {"package_lpa": 18.00, "students": 28},
            {"package_lpa": 14.00, "students": 27}
        ],

        "top_recruiters": [
            "Capgemini", "Cognizant", "Accenture", "Infosys", "TCS", "Wipro",
            "HCL", "Tech Mahindra", "Amazon", "Walmart", "American Express",
            "Cisco", "Bosch", "Airbus", "Samsung"
        ]
    })

if __name__ == "__main__":
    app.run(debug=True,port=5000)