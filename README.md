# MERN Internship Project (Tasks 1-8)

This project implements the Cognifyz Full Stack internship task set with a MERN-first architecture.

## Stack
- MongoDB + Mongoose
- Express + Node.js
- React + Vite
- JWT Authentication
- EJS (server-side rendering tasks)

## Run

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Task Coverage

1. HTML structure + basic server interaction
- SSR page + form: `backend/src/views/index.ejs`
- Express form endpoints: `backend/src/routes/webRoutes.js`

2. Inline styles/JS + server validation + temporary storage
- Inline JS validation + DOM preview: `backend/src/views/index.ejs`
- Server validation: `backend/src/controllers/webController.js`
- Temporary in-memory storage: `backend/src/services/tempStorage.js`

3. Advanced CSS + responsive design
- Bootstrap responsive SSR page: `backend/src/views/index.ejs`
- Transitions/animations included in inline CSS

4. Complex validation + dynamic DOM + client-side routing
- Password strength rule: `backend/src/controllers/webController.js`
- Live DOM preview: `backend/src/views/index.ejs`
- Client-side routing: `frontend/src/App.jsx` (React Router)

5. API integration + frontend interaction
- CRUD APIs: `backend/src/routes/taskRoutes.js`
- Frontend API usage: `frontend/src/api.js`, `frontend/src/App.jsx`

6. Database + authentication + authorization
- MongoDB models: `backend/src/models/User.js`, `backend/src/models/Task.js`
- JWT auth middleware: `backend/src/middleware/auth.js`
- Protected task routes: `backend/src/routes/taskRoutes.js`

7. Advanced API usage + external API + rate limiting
- External API integration: `backend/src/routes/externalRoutes.js`
- Rate limiting: `backend/src/middleware/rateLimiters.js`
- Error handling around external calls: `backend/src/controllers/externalController.js`

8. Advanced server-side functionality
- Middleware: body parsing, CORS, logging (`morgan`) in `backend/src/server.js`
- Background job processing (lightweight queue): `backend/src/services/jobQueue.js`
- Caching mechanism: `backend/src/services/cache.js` used in task/external controllers

## Notes
- OAuth is listed as an exploration concept in task 7. This build includes secure JWT auth and rate limiting, and is structured so OAuth providers can be added next.
- Temporary storage for task 2 is intentionally in-memory per internship requirement.
