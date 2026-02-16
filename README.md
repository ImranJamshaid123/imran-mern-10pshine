# imran-mern-10pshine
MERN Notes Application - 10Pearls Shine Internship
A full-stack Notes Management System built using React (CRA), Node.js, Express, and MySQL, featuring secure authentication, user profile management, notes CRUD functionality, and comprehensive unit testing for both frontend and backend.

🚀 Tech Stack
🔹 Frontend
    - React (Create React App)
    - React Router DOM
    - Axios
    - Bootstrap
    - Jest
    - React Testing Library
    
🔹 Backend
    - Node.js
    - Express.js
    - MySQL
    - JWT Authentication
    - Mocha

📂 Project Structure
    imran-mern-10pshine/
    │
    ├── frontend/                 # React frontend
    │   ├── src/
    │   │   ├── auth/
    │   │   ├── notes/
    │   │   ├── routes/
    │   │   ├── utils/
    │   │   └── tests/
    │   └── package.json  
    │
    ├── backend/                  # Express backend
    │   ├── src/
    │   │   ├── routes/
    │   │   ├── controllers/
    │   │   ├── middleware/
    │   │   └── config/
    │   └── package.json  
    │  
    └── README.md

✨ Features
🔐 Authentication
    - User Registration
    - User Login
    - JWT-based authentication
    - Forgot Password
    - Reset Password (token-based)
    - Protected routes (frontend & backend)
📝 Notes Management
    - Create notes
    - View all notes
    - Update notes
    - Delete notes
    - Pin / Favorite / Archive notes
    - Authenticated user-specific notes
👤 User Profile
    - View profile
    - Update profile
    - Change password

🔌 API Endpoints
🔐 Authentication
    Method   Endpoint                        
    POST     /api/auth/register              
    POST     /api/auth/login                 
    POST     /api/auth/forgot-password       
    POST     /api/auth/reset-password/:token 

📝 Notes
    Method   Endpoint       
    POST     /api/notes     
    GET      /api/notes     
    PUT      /api/notes/:id 
    DELETE   /api/notes/:id 

👤 Users
    Method   Endpoint                   
    GET      /api/users/me              
    PUT      /api/users/me              
    PUT      /api/users/change-password 

⚙️ Installation & Setup
1️⃣ Clone the Repository
    git clone <repository-url>
    cd imran-mern-10pshine
🔹 Backend Setup
    cd backend
    npm install
🔹 Frontend Setup
    cd frontend
    npm install
    npm start

🚀 Future Improvements
    - Role-based access control (Admin/User)
    - Pagination & filtering for notes
    - Docker containerization
    - Deployment on cloud platform (Render/AWS/Vercel)
    - CI/CD pipeline enhancements

📄 License
This project is developed for educational and skill evaluation purposes.
