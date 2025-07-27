# 👵 EmpowerAge — A Health Support Platform for Older Adults

EmpowerAge is a **Vue 3** frontend-only health platform designed to support older adults through informative articles, community events, wellness resources, and feedback features. The system supports user login/registration, role-based access control, event participation and rating, article bookmarking, and responsive UI.

> 🚀 This is a coursework project emphasizing functionality, usability, and design aesthetics. All data is stored in **localStorage** or static **JSON files**.

---

## 💻 Tech Stack

- ✅ Vue 3 + Composition API  
- ✅ Bootstrap 5 (Responsive layout & components)  
- ✅ PrimeVue (Dialog, buttons, alerts, etc.)  
- ✅ Font Awesome 6 (Icons)  
- ✅ AOS.js (Scroll animations)  
- ✅ JSON (as local data source)

---

## 📚 Features

| Module             | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| ✅ User Auth        | Register/Login with email & password validation              |
| ✅ Role System      | Automatic role detection (admin/user) with protected routes  |
| ✅ Health Articles  | Browse and bookmark informative articles                     |
| ✅ Event System     | View, join, and rate local health events                     |
| ✅ Article Saving   | Save articles and view them in dashboard                     |
| ✅ Rating System    | Users can rate events (1–5 stars)                            |
| ✅ Admin Panel      | Admins can create/delete events with rating stats            |
| ✅ Feedback Module  | Users can submit suggestions (locally stored)                |
| ✅ Form Validation  | Email format + password strength (min 8 chars, mixed case + digit) |
| ✅ Health Resources | Nutrition tips, hotlines, support services — filterable      |
| ✅ Responsive UI    | Mobile and desktop friendly                                  |
| ✅ Visual Effects   | Gradient backgrounds, hover cards, scroll animations         |

---

## 📁 Project Structure

```
src/
├── assets/
│   └── data/              # JSON files (articles, events, resources)
├── components/            # Reusable components
├── views/                 # All main views (Home, Login, AdminPanel, etc.)
├── router/                # Vue Router setup
├── App.vue                # Root app
├── main.js                # Entry point
public/
└── bg-pattern.png         # Background image
index.html                 # HTML template
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/empowerage.git
cd empowerage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Notes

- **Admin Role** is granted if registered with `admin@age.com`
- All data is stored in browser **localStorage**
- Ensure Bootstrap JS is properly loaded for dropdowns:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
```

---

## 📸 Preview

| Home Page                       | Dashboard                                 | Admin Panel                             |
| ------------------------------- | ----------------------------------------- | --------------------------------------- |
| ![Home](./screenshots/home.png) | ![Dashboard](./screenshots/dashboard.png) | ![Admin](./screenshots/admin-panel.png) |

---

## 📜 License

MIT License — for educational purposes only.