# Website Monitoring App
Website Monitoring App is a tool that periodically checks the status of websites and notifies users via email if their websites go down.

## Features
- **User Authentication:** Signup and login functionality with JWT-based authentication.
- **Add and Delete Websites:** Users can add websites they wish to monitor and remove them as needed.
- **Real-Time Monitoring:** The app uses a cron job to check the status of the websites every hour.
- **Email Notifications:** Users receive email notifications if their website goes down.
- **User-Friendly Interface:** A simple and intuitive frontend for managing websites.

## Technologies Used
- **Frontend:** React, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt
- **Email Service:** Nodemailer
- **Scheduling:** Node-cron

## Installation

### Prerequisites

- Node.js
- MongoDB
- npm

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/AvikNayak22/website-monitoring-app.git
   cd website-monitoring-app
   ```
2. Install dependencies for both frontend and backend:

   ```
   cd backend
   npm install
   ```
   ```
   cd ../frontend
   npm install
   ```
3. Environment Variables:
   - Create a `.env` file in the root of the backend directory and add the following environment variables:
     ```
     MONGO_URI=your_mongodb_uri
     SECRET_KEY=your_jwt_secret_key
     EMAIL=your_email@gmail.com
     PASSWORD=your_email_password
     ```
### Running the App
1. Start the backend server:
   
   ```
   cd backend
   npm start
   ```
2. Start the frontend development server:

   ```
   cd ../frontend
   npm run dev
   ```

## Contributor
- Avik Nayak (@AvikNayak22)

   
