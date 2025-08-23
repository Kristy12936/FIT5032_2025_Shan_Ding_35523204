🇦🇺 AgeAustralia — A Health Support Platform for Older Adults

AgeAustralia is a Vue 3 frontend-only health platform designed to support older adults with informative articles, community events, wellness resources, and feedback tools. The project emphasizes usability, visual aesthetics, and local-first architecture — all data is managed using localStorage and static JSON files, with no backend or cloud database required.

💻 Tech Stack

✅ Vue 3 + Composition API

✅ Bootstrap 5 (Responsive UI)

✅ PrimeVue (Interactive tables, modals, buttons)

✅ Font Awesome 6 (Icon set)

✅ AOS.js (Scroll animations)

✅ JSON + LocalStorage (Data layer)

📚 Features
Module	Description
✅ User Auth	Register/Login with email & password validation
✅ Role System	Automatic role detection (admin/user) with protected routes
✅ Health Articles	Browse and bookmark informative articles
✅ Event System	View, join, and rate local health events
✅ Article Saving	Save articles and view them in dashboard
✅ Rating System	Users can rate events (1–5 stars)
✅ Admin Panel	Admins can create/delete events with rating stats
✅ Feedback Module	Users can submit suggestions (locally stored)
✅ Form Validation	Email format + password strength (min 8 chars, mixed case + digit)
✅ Health Resources	Nutrition tips, hotlines, support services — filterable
✅ Responsive UI	Mobile and desktop friendly
✅ Visual Effects	Gradient backgrounds, hover cards, scroll animations
📁 Project Structure
AgeAustralia/
├── src/
│   ├── assets/
│   │   └── data/              # JSON files (articles, events, resources)
│   ├── components/            # Reusable components
│   ├── views/                 # All main views (Home, Login, AdminPanel, etc.)
│   ├── router/                # Vue Router setup
│   ├── App.vue                # Root app
│   └── main.js                # Entry point
├── public/
│   └── bg-pattern.png         # Background image
├── index.html                 # HTML template
└── vite.config.js             # Vite config

🚀 Getting Started
1. Clone the Repository
git clone https://github.com/Kristy12936/FIT5032_2025_Shan_Ding_35523204.git
cd age-australia

2. Install Dependencies
npm install

3. Run Development Server
npm run dev


Open http://localhost:5173
 in your browser.

🛠️ Usage Notes

👤 The email admin@age.com is automatically granted admin privileges.

🧠 Data such as saved articles, feedback, event registration, and ratings are stored in browser localStorage.

📂 All content (articles, events, resources) is sourced from JSON files in src/assets/data/.

✅ Bootstrap JS (optional) for dropdown support: