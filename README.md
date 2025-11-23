# Social Activity Feed Backend - Inkle Assignment

A production-ready Node.js/Express backend for a social activity feed with JWT authentication, role-based access control, and comprehensive activity tracking.

---

## 📋 Features

- **User Authentication**: Signup and login with JWT tokens
- **User Profiles**: Create and manage profiles with roles (User, Admin, Owner)
- **Posts**: Create, read, update, and delete posts
- **Likes**: Like and unlike posts with activity tracking
- **Follow System**: Follow and unfollow users with relationships
- **Block System**: Block users to hide their posts and activities
- **Activity Feed**: Real-time activity wall with all user actions
- **Role-Based Access Control**:
  - User: Create posts, like, follow, block
  - Admin: Delete posts, users, and likes
  - Owner: Everything admins can do + create/delete admins
- **Activity Logging**: Complete tracking of all actions
- **Permissions**: Fine-grained access control for all operations

---

## 🏗️ Project Structure

\`\`\`
.
├── server.js                    # Main server entry point
├── config/
│   └── database.js              # MongoDB connection configuration
├── models/
│   ├── User.js                  # User schema with auth methods
│   ├── Post.js                  # Post schema
│   ├── Like.js                  # Like schema
│   ├── Follow.js                # Follow relationship schema
│   ├── Block.js                 # Block relationship schema
│   └── Activity.js              # Activity log schema
├── controllers/
│   ├── authController.js        # Signup & login logic
│   ├── userController.js        # User profile management
│   ├── postController.js        # Post CRUD operations
│   ├── likeController.js        # Like operations
│   ├── followController.js      # Follow/unfollow logic
│   ├── blockController.js       # Block/unblock logic
│   └── activityController.js    # Activity feed logic
├── routes/
│   ├── auth.js                  # Authentication endpoints
│   ├── users.js                 # User endpoints
│   ├── posts.js                 # Post endpoints
│   ├── likes.js                 # Like endpoints
│   ├── follows.js               # Follow endpoints
│   ├── blocks.js                # Block endpoints
│   └── activities.js            # Activity endpoints
├── middleware/
│   ├── auth.js                  # JWT authentication
│   ├── authorization.js         # Role-based authorization
│   ├── errorHandler.js          # Global error handling
│   └── validation.js            # Validation result handler
├── utils/
│   ├── constants.js             # Constants and error messages
│   └── validation.js            # Validation schemas
└── .env.example                 # Environment variables template
\`\`\`

---

## 🚀 Installation & Setup

### Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 2: Create Environment File

\`\`\`bash
cp .env.example .env
\`\`\`

### Step 3: Configure Environment Variables

Edit \`.env\` and set:

\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-feed
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
\`\`\`

### Step 4: Start Server

**Development (with auto-reload):**

\`\`\`bash
npm run dev
\`\`\`

**Production:**

\`\`\`bash
npm start
\`\`\`

Expected output: \`🚀 Server is running on port 5000\`

---

## 📊 Database Setup

MongoDB must be running before starting the server.

**Local MongoDB:**

\`\`\`bash
mongod
\`\`\`

**Or use MongoDB Atlas:**

Set MONGODB_URI in .env to your Atlas connection string:

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
\`\`\`

---

## 👥 User Roles & Permissions

### Role Hierarchy

\`\`\`
OWNER (Highest)
├── Do everything Admin can do
├── Create new admins
└── Delete admins

ADMIN
├── Delete any post
├── Delete any user
├── Delete any like
└── View all activities

USER (Default - Lowest)
├── Create own posts
├── Like/unlike posts
├── Follow/unfollow users
├── Block/unblock users
└── Edit own profile
\`\`\`

### Permission Matrix

| Action | User | Admin | Owner |
|--------|------|-------|-------|
| Create Post | ✅ | ✅ | ✅ |
| Edit Own Post | ✅ | ✅ | ✅ |
| Delete Own Post | ✅ | ✅ | ✅ |
| Delete Any Post | ❌ | ✅ | ✅ |
| Delete Any User | ❌ | ✅ | ✅ |
| Delete Any Like | ❌ | ✅ | ✅ |
| Create Admin | ❌ | ❌ | ✅ |
| Remove Admin | ❌ | ❌ | ✅ |
| View All Activities | ✅ | ✅ | ✅ |

---

## 📝 API Testing with Postman

### Setup Postman Environment

Create a new environment with these variables:

\`\`\`json
{
  "base_url": "http://localhost:5000/api",
  "user_token": "",
  "admin_token": "",
  "owner_token": "",
  "userId": "",
  "postId": ""
}
\`\`\`

Then save tokens from responses to use in other requests.

---

## 🔐 Feature 1: Authentication

### 1.1 Signup - Create New Account

**Request:**

\`\`\`
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (201 Created):**

\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
\`\`\`

**Postman Steps:**

1. Create new POST request
2. URL: \`http://localhost:5000/api/auth/signup\`
3. Headers → Add \`Content-Type: application/json\`
4. Body → Raw → JSON
5. Paste request body above
6. Click Send
7. Copy token and save to Postman environment as \`user_token\`

**Verify:**

- [ ] Status code is 201
- [ ] Response has \`success: true\`
- [ ] JWT token returned
- [ ] User object contains username and email

---

### 1.2 Login - Authenticate User

**Request:**

\`\`\`
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] New JWT token received
- [ ] Can login with correct credentials
- [ ] Wrong password returns 401 Unauthorized

---

## 👤 Feature 2: User Management

### 2.1 Get Current User Profile

**Request:**

\`\`\`
GET http://localhost:5000/api/users/profile
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "bio": "I love coding",
    "role": "user",
    "followers": 5,
    "following": 3
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Returns current user data
- [ ] Without token returns 401 Unauthorized

---

### 2.2 Update User Profile

**Request:**

\`\`\`
PUT http://localhost:5000/api/users/profile
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "username": "john_doe_updated",
  "bio": "I love coding and designing"
}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe_updated",
    "bio": "I love coding and designing"
  }
}
\`\`\`

**Verify:**

- [ ] Status code is 200
- [ ] Username updated
- [ ] Bio updated

---

### 2.3 Get User by ID

**Request:**

\`\`\`
GET http://localhost:5000/api/users/507f1f77bcf86cd799439011
Authorization: Bearer {{user_token}}
\`\`\`

**Response (200 OK):**

\`\`\`json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "bio": "I love coding",
    "followers": 5,
    "following": 3
  }
}
\`\`\`

---

## 📮 Feature 3: Posts

### 3.1 Create Post

**Request:**

\`\`\`
POST http://localhost:5000/api/posts
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "content": "Just finished building an amazing social feed app!"
}
\`\`\`

**Response (201 Created):**

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
