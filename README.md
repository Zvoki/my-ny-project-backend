# React Project

This is a full-stack application created as a student project and intended for portfolio presentation. The app implements a simple e-commerce platform where users can search for products, view details, and administer the product list.

## Live Demo

## Technologies

- **Frontend**: React 18 with Vite as the bundler, modern JavaScript, CSS
- **Backend**: Node.js with Express, SQLite database
- **Tooling**: ESLint, Vite, npm/yarn

## Features

1. Home page with search and product listing
2. Product page displaying item details
3. Admin section:
   - View all products
   - Add a new product with name, description, and price
4. Price formatting, slugs for URLs, and simple routing

## Project Structure

client/        # React frontend
   src/
      components/...
      pages/...
server/        # Express backend
   controllers/
   routes/
   db/


## Running Locally

1. Clone the repository and change into the project directory:

   git clone <repo-url>
   cd react-projekt

2. Start the backend server:

   cd server
   npm install
   npm start

3. Open a new terminal and start the frontend:
   cd client
   npm install
   npm run dev

4. Visit [http://localhost:5173](http://localhost:5173) for the frontend and [http://localhost:3000](http://localhost:3000) for the API.

## Development Notes

- The database is stored in the SQLite file (`server/db/freaky.sqlite3-query`).
- Routes under `server/routes` are organized by feature.

## Why This Project?

It serves as an example of a simple full-stack application showcasing skills in React, Node/Express, and working with a database. It can be extended with additional functionality as needed.

*(This README was created to explain the project as part of a portfolio for applying to an internship.)*
