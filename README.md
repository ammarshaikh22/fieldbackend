FieldOps Backend

Overview

This project is a simplified Field Service Management system. The goal was to build a basic backend where admins can manage jobs, assign technicians, and clients can track progress.

The requirements were intentionally open-ended, so some decisions were made based on what felt practical for a small internal tool.

---

Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JWT for authentication

I chose this stack mainly because it allows quick development and is easy to structure for APIs.

---

How to run locally

1. Clone the repo

```bash
git clone <repo-link>
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in root

```env
PORT=7000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret
```

4. Run the server

```bash
npm run dev
```

---

Main Idea / Flow

The system works like this:

- A client submits a service request
- Admin reviews it and creates a job
- Admin assigns a technician
- Technician updates job status
- Client can see progress

I tried to keep the flow simple and realistic.

---

Assumptions

Since a lot of things were not defined, I made a few assumptions:

- Only admins can create and assign jobs
- Technicians can only update job status
- Clients cannot modify jobs, only view them
- A request must be approved before becoming a job

---

Job Status

I kept status simple:

- pending
- assigned
- in-progress
- completed
- cancelled

There could be more states in a real system, but this felt enough for now.

---

Notifications

Instead of building a real-time system, I just planned simple database-based notifications.

Reason: keeping the scope small and focused on core functionality.

---

Trade-offs

- Used MongoDB instead of relational DB for speed and flexibility
- Did not implement real-time updates
- Kept RBAC very basic (role-based only)

---

What's missing / could be improved

- Pagination on job lists
- Better validation
- More secure auth handling (refresh tokens etc.)
- Proper error handling structure
- UI (not implemented yet)

---

Folder structure

```bash
src/
  controllers/
  models/
  routes/
  services/
  utils/
```

---

Notes

I tried to keep the implementation within the suggested 6–10 hour range, so I focused more on structure and clarity instead of adding too many features.

If I had more time, I would improve validation, add better role control, and implement a basic frontend.
