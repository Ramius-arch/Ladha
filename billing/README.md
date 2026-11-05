# Qx_Billing

A web application for telecommunication billing management.

## Features

*   **Customer Management:** Add, edit, and view customer information.
*   **Usage Tracking:** Track customer usage of services.
*   **Billing Engine:** Generate bills for customers based on their usage.
*   **Reporting:** View various reports related to billing and revenue.
*   **Dashboard:** A summary of the system's key metrics.

## Technologies Used

### Backend

*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [SQLite](https://www.sqlite.org/index.html) (default for development with Sequelize) or [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Sequelize](https://sequelize.org/)
*   **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt)
*   **Email:** [Nodemailer](https://nodemailer.com/)
*   **SMS:** [Africa's Talking](https://africastalking.com/)
*   **PDF Generation:** [PDFMake](http://pdfmake.org/)
*   **Logging:** [Winston](https://www.npmjs.com/package/winston)

### Frontend

*   **Framework:** [Vue.js 3](https://v3.vuejs.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **HTTP Client:** [Axios](https://axios-http.com/)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/download/) (v14 or newer)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add the necessary environment variables (e.g., database connection string, JWT secret).
4.  Start the server (this will also seed the database with mock data if `sequelize.sync({ force: true })` is enabled in `backend/server.js`):
    ```bash
    npm start
    ```
    **Note:** Running `npm start` (which executes `node server.js`) with `force: true` in `sequelize.sync` will drop existing tables and re-create them, losing any previous data.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Project Structure

```
Qx_Billing/
├── backend/        # Node.js/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/       # Vue.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router.js
│   │   └── main.js
│   └── vite.config.js
└── README.md
```

