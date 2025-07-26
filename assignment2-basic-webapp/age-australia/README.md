// README.md (Project Root)

# AgeAustralia Web Application

A responsive Vue.js 3 web application designed to support older Australians with accessible health services, events, and community interaction. This system fulfills all Business Requirements (A–C) from the FIT5032 Assignment 2 specification.

---

##  Features Implemented

### A. Functional Requirements
- **Vue 3 + Vite + Bootstrap** development stack 
- **Responsive Design** using Bootstrap Grid 

### B. Application Functionality
- 🔐 User Login & Registration (with validation)
- 📅 Dynamic Event Listing & Registration (localStorage)
- ⭐ Rating System with average feedback

### C. Security & Role
- 🔐 Auth protected routes with role-based routing (user/admin)
- 🛡️ Basic input validation and access checks

---

## 📁 Project Structure
```
age-australia/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   ├── store/
│   │   └── auth.js
│   ├── views/
│   │   ├── Dashboard.vue
│   │   ├── EventList.vue
│   │   ├── EventDetail.vue
│   │   └── AdminPanel.vue
│   ├── components/
│   │   ├── Login.vue
│   │   └── Register.vue
```

---

## 🚀 Getting Started

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Test Users

### Admin
```
Email: admin@age.com
Password: 123456
```

### Regular User
```
Email: user@example.com
Password: 123456
```

---

## 📌 Notes
- Data is stored in localStorage
- User role assigned during registration
- Route guards enforce login & admin access

---

## 📸 Demo Video (Optional)
Please upload your video to Google Drive and link it here.

---

## ©️ Author
This application was created as part of FIT5032 Assignment 2.
