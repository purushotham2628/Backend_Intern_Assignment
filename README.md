# Social Activity Feed Backend

A comprehensive backend system for a social activity feed with proper permissions, roles, and activity tracking using Node.js, Express.js, MongoDB, and JWT authentication.

## 📋 Features

- **User Authentication**: Signup, Login with JWT tokens
- **User Profiles**: Create and manage user profiles with roles (User, Admin, Owner)
- **Posts**: Create, read, update, delete posts
- **Likes**: Like/unlike posts with activity tracking
- **Follow System**: Follow/unfollow users with activity tracking
- **Block System**: Block users to hide their posts and activities
- **Activity Feed**: Real-time activity wall showing all user actions
- **Role-Based Access Control (RBAC)**:
  - **User**: Can create posts, like, follow, block
  - **Admin**: Can delete posts, users, and likes
  - **Owner**: Can do everything admins can + create/delete admins
- **Activity Logging**: Comprehensive tracking of all user actions
- **Permissions**: Fine-grained permission system for all operations

## 🏗️ Project Structure

\`\`\`
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic (signup, login)
│   ├── userController.js    # User management
│   ├── postController.js    # Post management
│   ├── likeController.js    # Like functionality
│   ├── followController.js  # Follow functionality
│   ├── blockController.js   # Block functionality
│   └── activityController.js # Activity feed
├── models/
│   ├── User.js              # User schema
│   ├── Post.js              # Post schema
│   ├── Like.js              # Like schema
│   ├── Follow.js            # Follow schema
│   ├── Block.js             # Block schema
│   └── Activity.js          # Activity log schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User routes
│   ├── posts.js             # Post routes
│   ├── likes.js             # Like routes
│   ├── follows.js           # Follow routes
│   ├── blocks.js            # Block routes
│   └── activities.js        # Activity feed routes
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── authorization.js     # Role-based authorization
│   └── errorHandler.js      # Global error handler
├── utils/
│   ├── validation.js        # Input validation utilities
│   └── constants.js         # Application constants
├── server.js                # Main server file
└── .env.example             # Environment variables template
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd social-activity-feed-backend
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Configure environment variables**
\`\`\`bash
cp .env.example .env
# Edit .env and update the values
\`\`\`

4. **Start the server**
\`\`\`bash
# Development
npm run dev

# Production
npm start
\`\`\`

The server will run on `http://localhost:5000`

## 📚 API Endpoints Overview

### Authentication Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### User Routes
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin/Owner)
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following list
- `POST /api/users/admin/make` - Make user admin (Owner only)
- `POST /api/users/admin/remove` - Remove admin privileges (Owner only)

### Post Routes
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (Owner only)
- `DELETE /api/posts/:id` - Delete post (Owner/Admin)

### Like Routes
- `POST /api/likes` - Like a post
- `DELETE /api/likes/:postId` - Unlike a post
- `GET /api/likes/:postId` - Get likes on a post
- `DELETE /api/likes/admin/:likeId` - Delete like (Admin only)

### Follow Routes
- `POST /api/follows` - Follow a user
- `DELETE /api/follows/:followingId` - Unfollow a user
- `GET /api/follows/status/:userId` - Check follow status

### Block Routes
- `POST /api/blocks` - Block a user
- `DELETE /api/blocks/:blockedId` - Unblock a user
- `GET /api/blocks` - Get blocked users list

### Activity Routes
- `GET /api/activities` - Get activity feed (paginated)
- `GET /api/activities/user/:userId` - Get user-specific activities

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## 🛡️ Roles & Permissions

### User Roles
1. **User** (default)
   - Create own posts
   - Like/unlike posts
   - Follow/unfollow users
   - Block users
   - Update own profile

2. **Admin**
   - All User permissions
   - Delete any post
   - Delete any like
   - Delete any user
   - Cannot manage admins

3. **Owner**
   - All Admin permissions
   - Create/delete other admins
   - Full system control

## 📊 Data Models

### User
\`\`\`javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (User/Admin/Owner),
  profile: {
    bio: String,
    avatar: String
  },
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Post
\`\`\`javascript
{
  _id: ObjectId,
  content: String,
  author: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Activity
\`\`\`javascript
{
  _id: ObjectId,
  actor: ObjectId (ref: User),
  action: String (created_post, liked_post, followed_user, etc.),
  target: ObjectId (ref: Post/User),
  targetModel: String (Post/User),
  description: String,
  createdAt: Date
}
\`\`\`

---

## 🧪 Complete Postman Testing Guide

### Setup Instructions

1. **Import Collection**: Open Postman → Click Import → Select `postman-collection.json`
2. **Set Environment Variables**:
   - After login, copy the JWT token from response
   - Create environment variable `token` with the JWT token value
   - Use `{{token}}` in Authorization headers for authenticated requests

---

### 1. Authentication Endpoints

#### 1.1 Signup
**Endpoint**: `POST http://localhost:5000/api/auth/signup`

**Request Body**:
\`\`\`json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
\`\`\`

**Expected Response** (Status: 201):
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "User",
    "profile": {
      "bio": "",
      "avatar": null
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Create user with valid credentials → 201 status
- [ ] Try duplicate email → 400 "Email already registered"
- [ ] Try duplicate username → 400 "Username already taken"
- [ ] Try weak password → 400 validation error
- [ ] Copy token for next requests

---

#### 1.2 Login
**Endpoint**: `POST http://localhost:5000/api/auth/login`

**Request Body**:
\`\`\`json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "User",
    "profile": {
      "bio": "",
      "avatar": null
    }
  }
}
\`\`\`

**Verification Steps**:
- [ ] Login with correct credentials → 200 status
- [ ] Try wrong password → 401 "Invalid email or password"
- [ ] Try non-existent email → 401 "Invalid email or password"
- [ ] Try without credentials → 400 validation error
- [ ] Save token to Postman environment variable

---

### 2. User Management Endpoints

#### 2.1 Get All Users
**Endpoint**: `GET http://localhost:5000/api/users`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef12345",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "User",
      "profile": {
        "bio": "Software developer",
        "avatar": null
      },
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "_id": "65a1234567890abcdef67890",
      "username": "jane_smith",
      "email": "jane@example.com",
      "role": "User",
      "profile": {
        "bio": "",
        "avatar": null
      },
      "createdAt": "2024-01-15T10:05:00Z"
    }
  ]
}
\`\`\`

**Verification Steps**:
- [ ] Get all users → 200 status, array of users
- [ ] Verify no password fields in response
- [ ] Without token → 401 Unauthorized
- [ ] Verify blocked users are not shown

---

#### 2.2 Get User by ID
**Endpoint**: `GET http://localhost:5000/api/users/:id`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "65a1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "User",
    "profile": {
      "bio": "Software developer",
      "avatar": null
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Get any existing user → 200 status
- [ ] Try invalid user ID → 404 "User not found"
- [ ] Without token → 401 Unauthorized

---

#### 2.3 Update User Profile
**Endpoint**: `PUT http://localhost:5000/api/users/:id`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Request Body**:
\`\`\`json
{
  "username": "john_updated",
  "bio": "Updated bio - I love coding"
}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "65a1234567890abcdef12345",
    "username": "john_updated",
    "email": "john@example.com",
    "role": "User",
    "profile": {
      "bio": "Updated bio - I love coding",
      "avatar": null
    },
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Update own profile → 200 status
- [ ] Update another user's profile → 403 Forbidden
- [ ] Verify changes appear in GET /api/users/:id
- [ ] Without token → 401 Unauthorized

---

#### 2.4 Delete User (Admin/Owner)
**Endpoint**: `DELETE http://localhost:5000/api/users/:id`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}  (Admin or Owner token)
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "User deleted successfully"
}
\`\`\`

**Verification Steps**:
- [ ] As Admin: delete any user → 200 status
- [ ] As regular User: delete another user → 403 Forbidden
- [ ] Try deleting non-existent user → 404 "User not found"
- [ ] Verify deleted user's posts are also deleted
- [ ] Verify activity log shows "User deleted by Admin"

---

### 3. Post Management Endpoints

#### 3.1 Create Post
**Endpoint**: `POST http://localhost:5000/api/posts`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
Content-Type: application/json
\`\`\`

**Request Body**:
\`\`\`json
{
  "content": "This is my first post! Excited to share my thoughts on web development. #coding #nodejs"
}
\`\`\`

**Expected Response** (Status: 201):
\`\`\`json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65a1234567890abcdef99999",
    "content": "This is my first post! Excited to share my thoughts on web development. #coding #nodejs",
    "author": {
      "_id": "65a1234567890abcdef12345",
      "username": "john_doe",
      "email": "john@example.com",
      "profile": {
        "bio": "Software developer"
      }
    },
    "createdAt": "2024-01-15T10:45:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Create post with content → 201 status
- [ ] Verify activity "ABC made a post" appears in feed
- [ ] Try with empty content → 400 "Content is required"
- [ ] Try with content > 5000 chars → 400 validation error
- [ ] Without token → 401 Unauthorized

---

#### 3.2 Get All Posts
**Endpoint**: `GET http://localhost:5000/api/posts`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Query Parameters** (Optional):
\`\`\`
?page=1&limit=10
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef99999",
      "content": "This is my first post!",
      "author": {
        "_id": "65a1234567890abcdef12345",
        "username": "john_doe",
        "email": "john@example.com",
        "profile": { "bio": "Software developer" }
      },
      "createdAt": "2024-01-15T10:45:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 2
  }
}
\`\`\`

**Verification Steps**:
- [ ] Get all posts → 200 status
- [ ] Verify pagination works: `?page=1&limit=5`
- [ ] Verify posts from blocked users not shown
- [ ] Posts ordered by newest first
- [ ] Without token → 401 Unauthorized

---

#### 3.3 Get Post by ID
**Endpoint**: `GET http://localhost:5000/api/posts/:id`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "65a1234567890abcdef99999",
    "content": "This is my first post!",
    "author": {
      "_id": "65a1234567890abcdef12345",
      "username": "john_doe",
      "email": "john@example.com",
      "profile": { "bio": "Software developer" }
    },
    "createdAt": "2024-01-15T10:45:00Z",
    "updatedAt": "2024-01-15T10:45:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Get valid post → 200 status
- [ ] Try invalid post ID → 404 "Post not found"
- [ ] Try post from blocked user → 403 Forbidden
- [ ] Without token → 401 Unauthorized

---

#### 3.4 Update Post
**Endpoint**: `PUT http://localhost:5000/api/posts/:id`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Request Body**:
\`\`\`json
{
  "content": "Updated post content - now with better insights!"
}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "65a1234567890abcdef99999",
    "content": "Updated post content - now with better insights!",
    "author": { "_id": "65a1234567890abcdef12345", "username": "john_doe" },
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Update own post → 200 status
- [ ] Update another user's post → 403 Forbidden
- [ ] Verify updatedAt timestamp changes
- [ ] Try non-existent post → 404 "Post not found"

---

#### 3.5 Delete Post (Owner/Admin)
**Endpoint**: `DELETE http://localhost:5000/api/posts/:id`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "Post deleted successfully"
}
\`\`\`

**Verification Steps**:
- [ ] Delete own post → 200 status
- [ ] As Admin: delete any post → 200 status
- [ ] As regular User: delete others' post → 403 Forbidden
- [ ] Verify activity "Post deleted by Admin" appears
- [ ] Verify post no longer in GET /api/posts
- [ ] Verify associated likes are deleted

---

### 4. Like System Endpoints

#### 4.1 Like a Post
**Endpoint**: `POST http://localhost:5000/api/likes`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Request Body**:
\`\`\`json
{
  "postId": "65a1234567890abcdef99999"
}
\`\`\`

**Expected Response** (Status: 201):
\`\`\`json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "_id": "65a1234567890abcdef88888",
    "user": {
      "_id": "65a1234567890abcdef12345",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "post": "65a1234567890abcdef99999",
    "createdAt": "2024-01-15T11:15:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Like valid post → 201 status
- [ ] Like same post twice → 400 "Post already liked"
- [ ] Verify activity "ABC liked XYZ's post" appears
- [ ] Try liking non-existent post → 404 "Post not found"
- [ ] Try liking post from blocked user → 403 Forbidden

---

#### 4.2 Unlike a Post
**Endpoint**: `DELETE http://localhost:5000/api/likes/:postId`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "Post unliked successfully"
}
\`\`\`

**Verification Steps**:
- [ ] Unlike a post you liked → 200 status
- [ ] Try unliking post never liked → 404 "Like not found"
- [ ] Verify activity is removed
- [ ] Like count decrements

---

#### 4.3 Get Likes on a Post
**Endpoint**: `GET http://localhost:5000/api/likes/:postId`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef88888",
      "user": {
        "_id": "65a1234567890abcdef12345",
        "username": "john_doe",
        "email": "john@example.com",
        "profile": { "bio": "Software developer" }
      },
      "post": "65a1234567890abcdef99999",
      "createdAt": "2024-01-15T11:15:00Z"
    }
  ]
}
\`\`\`

**Verification Steps**:
- [ ] Get likes for post with likes → 200, array of users
- [ ] Get likes for post with no likes → 200, empty array
- [ ] Try post with no likes → 200 "[]"
- [ ] Try non-existent post → 404

---

#### 4.4 Delete Like (Admin Only)
**Endpoint**: `DELETE http://localhost:5000/api/likes/admin/:likeId`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}  (Admin token)
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "Like deleted successfully"
}
\`\`\`

**Verification Steps**:
- [ ] As Admin: delete any like → 200 status
- [ ] As regular User: delete like → 403 Forbidden
- [ ] Try non-existent like ID → 404 "Like not found"
- [ ] Verify like disappears from post's likes

---

### 5. Follow System Endpoints

#### 5.1 Follow User
**Endpoint**: `POST http://localhost:5000/api/follows`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Request Body**:
\`\`\`json
{
  "followingId": "65a1234567890abcdef67890"
}
\`\`\`

**Expected Response** (Status: 201):
\`\`\`json
{
  "success": true,
  "message": "User followed successfully",
  "data": {
    "_id": "65a1234567890abcdef77777",
    "follower": {
      "_id": "65a1234567890abcdef12345",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "following": {
      "_id": "65a1234567890abcdef67890",
      "username": "jane_smith",
      "email": "jane@example.com"
    },
    "createdAt": "2024-01-15T11:30:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Follow different user → 201 status
- [ ] Try following yourself → 400 "You cannot follow yourself"
- [ ] Try following same user twice → 400 "Already following this user"
- [ ] Verify activity "ABC followed XYZ" appears
- [ ] Try following non-existent user → 404

---

#### 5.2 Unfollow User
**Endpoint**: `DELETE http://localhost:5000/api/follows/:followingId`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "User unfollowed successfully"
}
\`\`\`

**Verification Steps**:
- [ ] Unfollow user you follow → 200 status
- [ ] Try unfollowing user you don't follow → 404
- [ ] Verify activity is removed
- [ ] Following count decrements

---

#### 5.3 Check Follow Status
**Endpoint**: `GET http://localhost:5000/api/follows/status/:userId`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "isFollowing": true
}
\`\`\`

**Verification Steps**:
- [ ] Check status for user you follow → `isFollowing: true`
- [ ] Check status for user you don't follow → `isFollowing: false`
- [ ] Try non-existent user → 404

---

#### 5.4 Get User Followers
**Endpoint**: `GET http://localhost:5000/api/users/:id/followers`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef77777",
      "follower": {
        "_id": "65a1234567890abcdef12345",
        "username": "john_doe",
        "email": "john@example.com",
        "profile": { "bio": "Software developer" }
      },
      "following": "65a1234567890abcdef67890",
      "createdAt": "2024-01-15T11:30:00Z"
    }
  ]
}
\`\`\`

**Verification Steps**:
- [ ] Get followers of any user → 200, array
- [ ] User with no followers → 200, empty array
- [ ] Verify user details included

---

#### 5.5 Get User Following List
**Endpoint**: `GET http://localhost:5000/api/users/:id/following`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef77777",
      "follower": "65a1234567890abcdef67890",
      "following": {
        "_id": "65a1234567890abcdef12345",
        "username": "john_doe",
        "email": "john@example.com"
      }
    }
  ]
}
\`\`\`

**Verification Steps**:
- [ ] Get following list → 200, array
- [ ] User following nobody → 200, empty array

---

### 6. Block System Endpoints

#### 6.1 Block User
**Endpoint**: `POST http://localhost:5000/api/blocks`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Request Body**:
\`\`\`json
{
  "blockedId": "65a1234567890abcdef11111"
}
\`\`\`

**Expected Response** (Status: 201):
\`\`\`json
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "_id": "65a1234567890abcdef44444",
    "blocker": {
      "_id": "65a1234567890abcdef12345",
      "username": "john_doe"
    },
    "blocked": {
      "_id": "65a1234567890abcdef11111",
      "username": "spam_user"
    },
    "createdAt": "2024-01-15T11:45:00Z"
  }
}
\`\`\`

**Verification Steps**:
- [ ] Block different user → 201 status
- [ ] Try blocking yourself → 400 "Cannot block yourself"
- [ ] Try blocking same user twice → 400 "Already blocked"
- [ ] Verify blocked user's posts don't appear in your feed
- [ ] Try blocking non-existent user → 404

---

#### 6.2 Unblock User
**Endpoint**: `DELETE http://localhost:5000/api/blocks/:blockedId`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "User unblocked successfully"
}
\`\`\`

**Verification Steps**:
- [ ] Unblock blocked user → 200 status
- [ ] Try unblocking user not blocked → 404
- [ ] Blocked user's posts now visible again

---

#### 6.3 Get Blocked Users
**Endpoint**: `GET http://localhost:5000/api/blocks`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef44444",
      "blocker": "65a1234567890abcdef12345",
      "blocked": {
        "_id": "65a1234567890abcdef11111",
        "username": "spam_user",
        "email": "spam@example.com",
        "profile": { "bio": "" }
      }
    }
  ]
}
\`\`\`

**Verification Steps**:
- [ ] Get blocked users list → 200, array
- [ ] No blocks → 200, empty array

---

### 7. Activity Feed Endpoints

#### 7.1 Get Activity Feed
**Endpoint**: `GET http://localhost:5000/api/activities`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Query Parameters** (Optional):
\`\`\`
?page=1&limit=20
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef33333",
      "actor": {
        "_id": "65a1234567890abcdef12345",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "action": "created_post",
      "target": "65a1234567890abcdef99999",
      "targetModel": "Post",
      "description": "john_doe made a post",
      "createdAt": "2024-01-15T10:45:00Z"
    },
    {
      "_id": "65a1234567890abcdef22222",
      "actor": {
        "_id": "65a1234567890abcdef12345",
        "username": "john_doe"
      },
      "action": "liked_post",
      "target": "65a1234567890abcdef88888",
      "targetModel": "Post",
      "description": "john_doe liked a post",
      "createdAt": "2024-01-15T11:15:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 3
  }
}
\`\`\`

**Verification Steps**:
- [ ] Get activity feed → 200 status
- [ ] Pagination works: `?page=1&limit=10`, `?page=2&limit=10`
- [ ] Activities from blocked users NOT shown
- [ ] Activities ordered by newest first
- [ ] Without token → 401 Unauthorized

---

#### 7.2 Get User-Specific Activities
**Endpoint**: `GET http://localhost:5000/api/activities/user/:userId`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Query Parameters** (Optional):
\`\`\`
?page=1&limit=10
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "65a1234567890abcdef33333",
      "actor": {
        "_id": "65a1234567890abcdef12345",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "action": "created_post",
      "target": "65a1234567890abcdef99999",
      "targetModel": "Post",
      "description": "john_doe made a post",
      "createdAt": "2024-01-15T10:45:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "pages": 2
  }
}
\`\`\`

**Verification Steps**:
- [ ] Get specific user's activities → 200 status
- [ ] All activities are from specified user
- [ ] Pagination works
- [ ] Try non-existent user → 404

---

### 8. Admin Role-Based Testing

#### 8.1 Make User Admin (Owner Only)
**Endpoint**: `POST http://localhost:5000/api/users/admin/make`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}  (Owner token)
\`\`\`

**Request Body**:
\`\`\`json
{
  "userId": "65a1234567890abcdef67890"
}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "User promoted to admin",
  "data": {
    "_id": "65a1234567890abcdef67890",
    "username": "jane_smith",
    "email": "jane@example.com",
    "role": "Admin",
    "profile": { "bio": "" }
  }
}
\`\`\`

**Verification Steps**:
- [ ] As Owner: promote user to Admin → 200 status
- [ ] As regular User: try to make admin → 403 Forbidden
- [ ] Verify user role changed to "Admin"
- [ ] User can now delete posts/users

---

#### 8.2 Remove Admin Privileges (Owner Only)
**Endpoint**: `POST http://localhost:5000/api/users/admin/remove`

**Headers**:
\`\`\`
Authorization: Bearer {{token}}  (Owner token)
\`\`\`

**Request Body**:
\`\`\`json
{
  "userId": "65a1234567890abcdef67890"
}
\`\`\`

**Expected Response** (Status: 200):
\`\`\`json
{
  "success": true,
  "message": "Admin privileges removed",
  "data": {
    "_id": "65a1234567890abcdef67890",
    "username": "jane_smith",
    "role": "User"
  }
}
\`\`\`

**Verification Steps**:
- [ ] As Owner: demote admin → 200 status
- [ ] User role changed back to "User"
- [ ] User cannot delete others' posts anymore

---

### 9. Complete End-to-End Test Workflow

Follow this workflow to test the entire system:

**Step 1: Create 3 Users**
\`\`\`
POST /api/auth/signup (john_doe)
POST /api/auth/signup (jane_smith) 
POST /api/auth/signup (admin_user)
\`\`\`

**Step 2: Promote admin_user to Admin** (use john_doe as owner)
\`\`\`
POST /api/users/admin/make
Body: { "userId": "admin_user_id" }
\`\`\`

**Step 3: john_doe creates a post**
\`\`\`
POST /api/posts
Body: { "content": "My first post!" }
\`\`\`

**Step 4: jane_smith likes the post**
\`\`\`
POST /api/likes
Body: { "postId": "post_id" }
\`\`\`

**Step 5: jane_smith follows john_doe**
\`\`\`
POST /api/follows
Body: { "followingId": "john_doe_id" }
\`\`\`

**Step 6: Check activity feed**
\`\`\`
GET /api/activities
Verify activities: created_post, liked_post, followed_user
\`\`\`

**Step 7: john_doe blocks admin_user**
\`\`\`
POST /api/blocks
Body: { "blockedId": "admin_user_id" }
\`\`\`

**Step 8: Verify blocked user activities don't appear**
\`\`\`
GET /api/posts - admin_user's posts should not appear
GET /api/activities - admin_user's activities should not appear
\`\`\`

**Step 9: Test Admin permissions**
\`\`\`
As admin_user: DELETE /api/posts/:post_id → should succeed
As admin_user: DELETE /api/users/:user_id → should succeed
As jane_smith: DELETE /api/posts/:post_id → 403 Forbidden
\`\`\`

**Step 10: Verify all activity types logged**
\`\`\`
GET /api/activities
Should contain: created_post, liked_post, followed_user, blocked_user, etc.
\`\`\`

---

## 📝 Common Error Responses

| Status | Message | Meaning |
|--------|---------|---------|
| 400 | "Validation error" | Invalid request body |
| 401 | "Unauthorized" | Missing or invalid token |
| 403 | "Forbidden" | No permission for this action |
| 404 | "Not found" | Resource doesn't exist |
| 500 | "Internal server error" | Server error |

---

## 🐛 Troubleshooting

**Q: Getting 401 Unauthorized**
- A: Make sure you have Authorization header with Bearer token

**Q: Getting 403 Forbidden when trying to delete post**
- A: Only post owner or Admin/Owner can delete. Use correct token.

**Q: Posts from blocked users still appearing**
- A: Blocked users' posts are excluded in GET /api/posts. Check block list with GET /api/blocks

**Q: Activities not appearing after actions**
- A: Activities are created for all actions. Check pagination with ?page=1&limit=20

---

## 📄 License

This project is open source and available under the MIT License.
