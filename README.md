# Property Management App

A full-stack property management application with a React frontend and Node.js/Express/MongoDB backend.

## Features
- Add, edit, delete, and view property listings
- Filter by city, state, type, and price
- Modern UI with persistent filter state
- Bulk delete support

## Folder Structure
```
logicFirstAssignment/
│
├── backend/                # Node.js/Express API
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── propertyController.js
│   ├── models/
│   │   └── Property.js
│   ├── routes/
│   │   └── propertyRoutes.js
│   └── server.js
│
├── frontend/               # React app
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── propertyApi.js
│   │   ├── components/
│   │   │   └── Header.jsx
│   │   ├── pages/
│   │   │   ├── PropertyDetail.jsx
│   │   │   ├── PropertyForm.jsx
│   │   │   ├── PropertyList.jsx
│   │   │   └── PropertyList.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── .env                    # Environment variables (backend)
├── .gitignore              # Git ignore rules
├── package.json            # (Optional) Root for shared scripts/tools
├── package-lock.json
└── README.md
```

## .gitignore
- Ignores node_modules, .env, build output, logs, and editor/OS files.
- See `.gitignore` in the root for details.

## Environment Setup

### Backend (.env)
Create a `.env` file inside the root or backend folder with the following content:
```
MONGO_URI=mongodb://localhost:27017/propertydb
PORT=5000
```

## Getting Started

### 1. Clone the repository
```
git clone <repo-url>
cd logicFirstAssignment
```

### 2. Install dependencies
#### Backend
```
cd backend
npm install
```
#### Frontend
```
cd ../frontend
npm install
```

### 3. Configure MongoDB
- By default, the backend connects to `mongodb://localhost:27017/propertydb`.
- To use a different URI, edit `.env` or `backend/config/db.js`.

### 4. Start the backend server
```
cd backend
npm run dev
```
- The backend runs on [http://localhost:5000](http://localhost:5000)

### 5. Start the frontend
```
cd frontend
npm run dev
```
- The frontend runs on [http://localhost:5173](http://localhost:5173)

## Usage
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Use the UI to add, edit, delete, and filter properties.

## Troubleshooting
- Make sure MongoDB is running before starting the backend.
- If ports are in use, change them in `.env`, `backend/server.js`, or `frontend/vite.config.js`.

## License
MIT
