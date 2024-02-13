# SocialRefugees

SocialRefugees is a web application that aims to connect refugees with volunteers and organizations that can provide them with support and assistance.

Technologies Used
The SocialRefugees project uses a variety of technologies to create a robust and user-friendly web application. These technologies include:

DEVELOPMENT ENVIRONMENT : VITE

FRONTEND:
- PREACT
- TAILWINDCSS

BACKEND:
- MONGODB - MONGOOSE
- NODEJS - EXPRESSJS

Repository tree

```bash
├── backend
│   ├── assets
│   ├── controllers
│   │   ├── auth.js
│   │   ├── groups.js
│   │   ├── uploads.js
│   │   └── users.js
│   ├── index.js
│   ├── middlewares
│   │   ├── admin.js
│   │   └── auth.js
│   ├── mockData.js
│   ├── models
│   │   ├── Group.js
│   │   └── User.js
│   ├── package.json
│   ├── package-lock.json
│   └── routes
│       ├── auth.js
│       ├── groups.js
│       └── users.js
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── app.css
│   │   ├── app.jsx
│   │   ├── assets
│   │   │   ├── abstractred.jpg
│   │   │   ├── abstractyellow.jpg
│   │   │   ├── default.png
│   │   │   ├── preact.svg
│   │   │   ├── redback.webp
│   │   │   └── yellowback.jpg
│   │   ├── components
│   │   │   ├── Input.jsx
│   │   │   └── Navbar.jsx
│   │   ├── data
│   │   ├── index.css
│   │   ├── layouts
│   │   │   └── SplitScreen.jsx
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Account.jsx
│   │   │   ├── Groups.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── userContext.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md

```

# Features
The SocialRefugees web application includes a number of features that make it easy for refugees to connect with volunteers and organizations. These features include:

- User registration and login
- Volunteer and organization registration
- Password encrypting with bcrypt
- Server security using JWT tokens
- Ease of scalability thanks to MongoDB

Roadmap: 

- Changing the profile picture 
- Refugee management using a "bucket", a collection where Non-profit Organizations (admins) can take under management individual groups and then publish them to the public collection where helpers can offer to help. ( due to legal reasons, we cannot welcome strangers into our homes just like that :) )
- Search functionality to find volunteers and organizations
- Creating groups (from refugees' POV)
- Messaging system to communicate with volunteers and organizations
- Donation system to support refugees

# Installation
To install and run the SocialRefugees web application, follow these steps:

Clone the repository to your local machine using git clone https://github.com/LucasS-05/SocialRefugees.git

Install the necessary dependencies using npm install

Start the frontend server using npm run dev

Start the backend server using node index.js ( Make sure to have mongodb installed and running - MONGO_URL="mongodb://127.0.0.1:27017/"

Open your web browser and navigate to http://localhost:5173


# Contributing
If you would like to contribute to the SocialRefugees project, please follow these guidelines:

Fork the repository

Create a new branch for your changes

Make your changes and commit them to your branch

Push your changes to your forked repository

Create a pull request to merge your changes into the main repository


# Conclusion
Overall, the project's use of modern technologies and user-friendly features make it easy for refugees to connect with volunteers and organizations, and the project's open-source nature means that it can continue to grow and improve over time.
