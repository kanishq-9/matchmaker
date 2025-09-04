# MatchMaking
A full-stack matchmaking platform connecting users based on preferences and profiles. Built with React, Node.js, Express, and FireBase.

## Features
-User Authentication: Signup, login, and sessions.
-User Profiles: Create, update, and view profiles with tabbed sections.
-Matching Algorithm: Matches users based on preferences and compatibility, also used genAI from gemini.
-Admin Dashboard: View and manage users, assign matches.
-Responsive UI: Built with React and Bootstrap, optimized for desktop and mobile.
-Security: Uses Helmet for CSP, cors and secure headers.

## Technologies
-Frontend: React, Bootstrap, JavaScript, HTML, CSS
-Backend: Node.js, Express.js
-Database: FIreBase (NoSQL)
-Other Tools: REST APIs, Helmet for security, Nodemon for development
-Deployment + CI/CD: Render (backend), static frontend via React build

```
matchmaker/
│
├─ client/                  
│   ├─ public/              
│   ├─ src/
│   │   ├─ components/     
│   │   ├─ pages/           
│   │   └─ App.js
│   └─ package.json
│
├─ server/                 
│   ├─ app.js            
│   ├─ server.js           
│   ├─ routes/              
│   └─ models/             
│
├─ README.md
└─ package.json
```

## Installation and Setup
### 1.Clone the repository:
```
git clone <your-repo-url>
cd matchmaker
```
