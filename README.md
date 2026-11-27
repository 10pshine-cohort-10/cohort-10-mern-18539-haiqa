# Leafnote

A notes app where users can sign up, write notes and organize them.

Built with MongoDB, Express, React and Node.js.

## Run the backend

```
cd backend
npm install
npm run dev
```

Before running, copy `.env.example` to `.env` and add your MongoDB connection string (`MONGODB_URI`) and a long random `JWT_SECRET`. For tests, also set `MONGODB_TEST_URI` to a separate database such as `leafnote-test`.

Open http://localhost:5000/api/health to check it's running.