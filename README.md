# Social Activity Feed Backend — Inkle Assignment

A concise, developer-friendly README with a clearer folder map and quick-start instructions to reduce the feeling of a congested project layout.

---

## Table of contents

- [Quick start](#quick-start)
- [What this project does](#what-this-project-does)
- [Minimal folder map](#minimal-folder-map)
- [Environment](#environment)
- [Run & test](#run--test)
- [API highlights](#api-highlights)
- [Troubleshooting](#troubleshooting)
- [Notes and next steps](#notes-and-next-steps)

---

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Copy environment template and edit `.env`

```powershell
copy .env.example .env
# then open .env and set values (PORT, MONGODB_URI, JWT_SECRET, etc.)
```

3. Start the server

Development (auto-reload with nodemon if available):

```powershell
npm run dev
```

Production:

```powershell
npm start
```

Visit: http://localhost:5000/health

---

## What this project does

This repository implements a backend for a social activity feed. Core features:

- User authentication (signup/login) with JWT
- Role-based access (User, Admin, Owner)
- Posts, Likes, Follows, Blocks
- Activity logging for user actions

The README below focuses on making the code layout and quick testing simple.

---

## STRUCTURE


```
.
├─ server.js                # start server, mount middleware + /api
├─ config/
│  └─ database.js
├─ routes/
│  ├─ index.js              # mounts: router.use('/auth', auth); router.use('/users', users);
│  ├─ auth.js
│  ├─ users.js
│  └─ posts.js
├─ controllers/
│  ├─ authController.js
│  ├─ userController.js
│  └─ postController.js
├─ models/
│  ├─ User.js
│  ├─ Post.js
│  └─ index.js              # export models { User, Post }
├─ middleware/
│  ├─ auth.js               # verifies JWT + sets req.user
│  ├─ authorization.js      # role checks
│  └─ errorHandler.js
├─ utils/
│  ├─ jwt.js
│  └─ constants.js
├─ tests/                   # future: integration/unit tests
├─ .env.example
└─ README.md

```

Tip: open `controllers/` to see the endpoint logic and `routes/` to see endpoint URLs.

---

## Environment

Copy `.env.example` to `.env` and configure these main values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-feed
JWT_SECRET=super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

If you use MongoDB Atlas, replace `MONGODB_URI` with the connection string.

---

## Run & test

1. Start MongoDB (local) or ensure your `MONGODB_URI` is reachable.

2. Start server (see Quick start).

3. Quick smoke test using curl (PowerShell - backticks for line continuation):

```powershell
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"secret123","username":"testuser"}'
```

Expected: HTTP 201 with a JSON payload containing `token` and `user`.

Postman: there is a `postman-collection.json` at repo root — import it into Postman and set the environment variable `base_url` to `http://localhost:5000/api`.

---

## API highlights

The most-used endpoints (see `routes/` for full list):

- POST /api/auth/signup — create account
- POST /api/auth/login — login (returns JWT)
- GET /api/users/profile — get current user (requires Authorization header)
- POST /api/posts — create a post (Authorization required)

Use header: `Authorization: Bearer <token>`

---

## Troubleshooting

- "next is not a function" during signup: restart server after updates. (Fix was applied in the Mongoose pre-save hook.)
- If you see DB connection errors: ensure `MONGODB_URI` is correct and MongoDB is running.
- To get verbose errors during development: set `NODE_ENV=development` in `.env`.

If an error persists, check the server logs — they include stack traces logged by the global error handler.

---

## Notes and next steps

- The folder map in this README intentionally avoids listing every file to keep it readable. Use `ls controllers` or `dir controllers` to inspect contents.
- Suggested improvements you might want to add:
  - Add an OpenAPI / Swagger spec for quick integration testing
  - Add a small integration test that spins up an in-memory MongoDB (mongodb-memory-server) and validates auth flow
  - Group large UI components (if front-end gets added) into `client/` to avoid mixing with backend code

---

If you'd like, I can:

- Expand the folder map back to a full file tree, but with foldable sections.
- Add a short quickendpoints.md that lists every route and payloads.
- Add a PowerShell script to run DB + server (for Windows dev experience).

Pick one and I'll implement it next.


\`\`\`json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "607f1f77bcf86cd799439020",
    "author": "507f1f77bcf86cd799439011",
    "content": "Just finished building an amazing social feed app!",
    "likes": 0,
    "createdAt": "2025-01-15T10:35:00Z"
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 201
- [ ] Post created with current user as author
- [ ] Activity log entry created
- [ ] Save postId for other tests

---

### 3.2 Get All Posts

**Request:**

\`\`\`
GET http://localhost:5000/api/posts?page=1&limit=10
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "posts": [
    {
      "_id": "607f1f77bcf86cd799439020",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe"
      },
      "content": "Just finished building an amazing social feed app!",
      "likes": 0,
      "likedByUser": false,
      "createdAt": "2025-01-15T10:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Returns array of posts
- [ ] Pagination included

---

### 3.3 Get Single Post

**Request:**

\`\`\`
GET http://localhost:5000/api/posts/{{postId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "post": {
    "_id": "607f1f77bcf86cd799439020",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe"
    },
    "content": "Just finished building an amazing social feed app!",
    "likes": 0,
    "createdAt": "2025-01-15T10:35:00Z"
  }
}
\`\`\`

---

### 3.4 Update Post (Owner Only)

**Request:**

\`\`\`
PUT http://localhost:5000/api/posts/{{postId}}
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "content": "Updated: Just finished building an amazing social feed app! Version 2.0"
}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "Post updated successfully",
  "post": {
    "_id": "607f1f77bcf86cd799439020",
    "content": "Updated: Just finished building an amazing social feed app! Version 2.0"
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Content updated
- [ ] Only owner can update
- [ ] Other user gets 403 Forbidden

---

### 3.5 Delete Post (Owner or Admin)

**Request:**

\`\`\`
DELETE http://localhost:5000/api/posts/{{postId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "Post deleted successfully"
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Post no longer in list
- [ ] Only owner or admin can delete

---

## ❤️ Feature 4: Likes

### 4.1 Like a Post

**Request:**

\`\`\`
POST http://localhost:5000/api/likes/{{postId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (201 Created):**

\`\`\`json
{
  "success": true,
  "message": "Post liked successfully",
  "like": {
    "_id": "607f1f77bcf86cd799439030",
    "post": "607f1f77bcf86cd799439020",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2025-01-15T10:40:00Z"
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 201
- [ ] Like record created
- [ ] Activity log created
- [ ] Cannot like twice (returns 400)

---

### 4.2 Unlike a Post

**Request:**

\`\`\`
DELETE http://localhost:5000/api/likes/{{postId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "Post unliked successfully"
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Like deleted
- [ ] Post likes count decremented

---

### 4.3 Admin Delete Like

**Request:**

\`\`\`
DELETE http://localhost:5000/api/likes/admin/{{likeId}}
Authorization: Bearer {{admin_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "Like deleted successfully"
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Only admin can delete

---

## 🔗 Feature 5: Follows

### 5.1 Follow a User

**Request:**

\`\`\`
POST http://localhost:5000/api/follows/{{userId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (201 Created):**

\`\`\`json
{
  "success": true,
  "message": "User followed successfully",
  "follow": {
    "_id": "607f1f77bcf86cd799439040",
    "follower": "507f1f77bcf86cd799439011",
    "following": "507f1f77bcf86cd799439012"
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 201
- [ ] Activity log shows "X followed Y"
- [ ] Cannot follow self (400)

---

### 5.2 Unfollow a User

**Request:**

\`\`\`
DELETE http://localhost:5000/api/follows/{{userId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "User unfollowed successfully"
}
\`\`\`

---

### 5.3 Get Follow Status

**Request:**

\`\`\`
GET http://localhost:5000/api/follows/status/{{userId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "status": {
    "isFollowing": true,
    "isFollowedBy": false,
    "mutualFollows": false
  }
}
\`\`\`

---

## 🚫 Feature 6: Blocks

### 6.1 Block a User

**Request:**

\`\`\`
POST http://localhost:5000/api/blocks/{{userId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (201 Created):**

\`\`\`json
{
  "success": true,
  "message": "User blocked successfully",
  "block": {
    "_id": "607f1f77bcf86cd799439050",
    "blocker": "507f1f77bcf86cd799439011",
    "blocked": "507f1f77bcf86cd799439012"
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 201
- [ ] Blocked user's posts no longer visible

---

### 6.2 Unblock a User

**Request:**

\`\`\`
DELETE http://localhost:5000/api/blocks/{{userId}}
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "User unblocked successfully"
}
\`\`\`

---

### 6.3 Get Blocked Users

**Request:**

\`\`\`
GET http://localhost:5000/api/blocks
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "blockedUsers": [
    {
      "_id": "607f1f77bcf86cd799439050",
      "blocked": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_smith"
      }
    }
  ]
}
\`\`\`

---

## 📊 Feature 7: Activity Feed

### 7.1 Get All Activities

**Request:**

\`\`\`
GET http://localhost:5000/api/activities?page=1&limit=20
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "activities": [
    {
      "_id": "607f1f77bcf86cd799439060",
      "actor": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe"
      },
      "actionType": "POST_CREATED",
      "description": "john_doe made a post",
      "createdAt": "2025-01-15T10:35:00Z"
    },
    {
      "_id": "607f1f77bcf86cd799439061",
      "actor": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_smith"
      },
      "actionType": "POST_LIKED",
      "description": "jane_smith liked john_doe's post",
      "createdAt": "2025-01-15T10:40:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Shows all activities (except from blocked users)
- [ ] Newest first

---

### 7.2 Get User Activities

**Request:**

\`\`\`
GET http://localhost:5000/api/activities/user/{{userId}}?page=1&limit=20
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "activities": [
    {
      "_id": "607f1f77bcf86cd799439060",
      "actor": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe"
      },
      "actionType": "POST_CREATED",
      "description": "john_doe made a post",
      "createdAt": "2025-01-15T10:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
\`\`\`

---

## 🛡️ Feature 8: Admin Features

### 8.1 Delete Any User (Admin Only)

**Request:**

\`\`\`
DELETE http://localhost:5000/api/users/{{userId}}
Authorization: Bearer {{admin_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "User deleted successfully"
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] User's posts deleted
- [ ] Regular user gets 403

---

### 8.2 Promote to Admin (Owner Only)

**Request:**

\`\`\`
PUT http://localhost:5000/api/users/{{userId}}/role
Authorization: Bearer {{owner_token}}
Content-Type: application/json

{
  "role": "admin"
}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "role": "admin"
  }
}
\`\`\`

---

## 🧪 Complete Testing Workflow

### Test End-to-End

**1. Create Two Users**

\`\`\`
POST /api/auth/signup
{ "username": "alice", "email": "alice@example.com", "password": "pass123" }
Save as alice_token

POST /api/auth/signup
{ "username": "bob", "email": "bob@example.com", "password": "pass123" }
Save as bob_token
\`\`\`

**2. Alice Creates Post**

\`\`\`
POST /api/posts
Authorization: Bearer alice_token
{ "content": "Hello world!" }
Save postId
\`\`\`

**3. Bob Follows Alice**

\`\`\`
POST /api/follows/alice_id
Authorization: Bearer bob_token
\`\`\`

**4. Bob Likes Alice's Post**

\`\`\`
POST /api/likes/postId
Authorization: Bearer bob_token
\`\`\`

**5. View Activity Feed**

\`\`\`
GET /api/activities
Authorization: Bearer bob_token
\`\`\`

Should show both activities.

**6. Alice Blocks Bob**

\`\`\`
POST /api/blocks/bob_id
Authorization: Bearer alice_token
\`\`\`

**7. View Activity Feed (Bob Hidden)**

\`\`\`
GET /api/activities
Authorization: Bearer alice_token
\`\`\`

Bob's activities no longer visible.

---

## 🔴 Common Errors

| Code | Error | Solution |
|------|-------|----------|
| 400 | Validation failed | Check request body format |
| 400 | Already liked | Unlike first, then like again |
| 401 | Unauthorized | Add JWT token to Authorization header |
| 403 | Forbidden | Insufficient permissions for action |
| 404 | Not found | Check resource ID is correct |
| 500 | Internal error | Check server logs, restart server |

---

## 📖 Notes

- All timestamps are in ISO 8601 format
- Pagination starts at page 1
- Default limit is 10-20 items per page
- Blocked user activities are filtered from feeds
- Posts are soft-deleted (can be restored)

---

**Created**: January 2025

**Version**: 1.0.0
