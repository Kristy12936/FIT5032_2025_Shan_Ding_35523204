# 🇦🇺 AgeAustralia — A Health Support Platform for Older Adults

AgeAustralia is a **Vue 3 + Vite** frontend-based health platform designed to support older adults through informative articles, community events, wellness resources, and feedback features.  
The system emphasizes **usability, accessibility, and responsive design**.  
It integrates **local JSON files, localStorage, and Firebase Firestore** for data management, and leverages **Cloudflare Pages + Resend API** for cloud deployment and email functionality.

---

## 💻 Tech Stack

- ✅ **Vue 3 + Composition API** (frontend framework)  
- ✅ **Bootstrap 5** (responsive UI components)  
- ✅ **PrimeVue** (interactive DataTables, dialogs, buttons)  
- ✅ **Font Awesome 6** (icon library)  
- ✅ **AOS.js** (scroll animations)  
- ✅ **JSON + LocalStorage** (local data storage)  
- ✅ **Firebase Firestore** (real-time event & article storage)  
- ✅ **Cloudflare Pages** (frontend deployment + serverless functions)  
- ✅ **Resend API** (cloud email service for sending messages with attachments)  

---

## 📚 Features

| Module             | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| ✅ User Auth        | Register/Login with email & password validation              |
| ✅ Role System      | Automatic role detection (admin/user) with protected routes  |
| ✅ Health Articles  | Browse, bookmark, and save informative articles              |
| ✅ Event System     | View, join, and rate local health events                     |
| ✅ Dashboard        | View saved articles, joined events, and ratings              |
| ✅ Rating System    | Users can rate events (1–5 stars)                            |
| ✅ Admin Panel      | Admins can create/delete events with live Firestore sync     |
| ✅ Feedback Module  | Users can submit suggestions (stored in Firestore/localStorage) |
| ✅ Health Resources | Nutrition tips, hotlines, support services — filterable      |
| ✅ Map & Navigation | Leaflet + OSM integration for searching locations and navigation |
| ✅ Email Sending    | Send emails (via Resend API) with recipient, subject, body, and attachments |
| ✅ Data Export      | Export articles/events to CSV for offline storage            |
| ✅ Accessibility    | Alt text for images, ARIA labels for inputs & buttons        |
| ✅ Responsive UI    | Mobile and desktop friendly                                  |
| ✅ Visual Effects   | Gradient backgrounds, hover cards, and scroll animations     |

---

## 📁 Project Structure

```
AgeAustralia/
├── src/
│   ├── assets/
│   │   └── data/              # JSON files (articles, events, resources)
│   ├── components/            # Reusable Vue components
│   ├── views/                 # Main pages (Home, Articles, Events, Dashboard, Admin, etc.)
│   ├── router/                # Vue Router setup
│   ├── store/                 # Pinia (auth & state management)
│   ├── App.vue                # Root app
│   └── main.js                # Entry point
├── functions/                 # Cloudflare Pages Functions (e.g., send-email.js)
├── public/                    # Static assets
├── index.html                 # HTML template
└── vite.config.js             # Vite config
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Kristy12936/FIT5032_2025_Shan_Ding_35523204.git
cd age-australia
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open https://fit5032-2025-shan-ding-35523204.pages.dev/ in your browser.

---

## 🛠️ Usage Notes

- 👤 Default admin account:  
  **Email:** `admin@age.com`  
  **Password:** `Ds20021206`

- 🧠 User data such as saved articles, feedback, event registration, and ratings are stored in **localStorage**.  

- 📂 All static content (articles, events, resources) is sourced from JSON files in `src/assets/data/`.  

- ☁️ Dynamic event & article data is synced with **Firebase Firestore** for real-time updates.  

- 📧 Email sending is powered by **Resend API**, configured via Cloudflare Pages Functions + environment variables (`RESEND_API_KEY`, `FROM_EMAIL`).  

- ✅ Bootstrap JS is optional (for dropdown support in navigation).  

---

## 🌟 Innovative Features

- **Real-time Admin Event Management** (Firestore live sync)  
- **Interactive Map & Navigation** (Leaflet + OSM + OSRM routing)  
- **Cloud Email Integration** (Resend API with attachment support)  
- **CSV Export** (downloadable article and event data)  
- **Accessibility-first Design** (ARIA support + alt text)  

---

## 🌍 Deployment

- **Frontend**: Deployed on **Cloudflare Pages**  
- **API Functions**: Implemented via **Cloudflare Pages Functions** (`/api/send-email`)  
- **Email Service**: Integrated with **Resend API** (free tier, attachment support)  

🔗 Live site: [https://fit5032-2025-shan-ding-35523204.pages.dev](https://fit5032-2025-shan-ding-35523204.pages.dev)

---

✅ *This project demonstrates full-stack integration using modern frontend frameworks, cloud deployment, and serverless architecture tailored to a health support platform for older adults.*  