# NotifyHub Backend

NotifyHub is a Node.js and Express backend for a social posting application.

## Current Features

- User registration
- User login
- JWT authentication
- Current user API
- Create post
- Get all posts
- Get post by id
- Update post
- Delete post
- Like / Unlike post
- Add comment
- Get comments
- Delete own comment
- Kafka based post like events
- Kafka based post comment events
- Notification creation using Kafka consumer
- Get notifications
- Mark notification as read
- Mark all notifications as read

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Apache Kafka
- KafkaJS

## Run Backend

```bash
npm install
npm run dev
```

## Kafka

Kafka can be started with Docker:

```bash
docker compose up -d
```

Then add this to `.env`:

```env
KAFKA_ENABLED=true
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=notifyhub
KAFKA_GROUP_ID=notifyhub-notification-group
```

If Kafka is not running, keep:

```env
KAFKA_ENABLED=false
```

The normal MongoDB APIs will still work.

## Main APIs

### Auth

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Posts

```text
POST   /api/v1/posts
GET    /api/v1/posts
GET    /api/v1/posts/:id
PUT    /api/v1/posts/:id
DELETE /api/v1/posts/:id
POST   /api/v1/posts/:id/like
```

### Comments

```text
POST   /api/v1/comments/post/:postId
GET    /api/v1/comments/post/:postId
DELETE /api/v1/comments/:commentId
```

### Notifications

```text
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
PATCH /api/v1/notifications/read-all
```

## Kafka Flow

When a user likes another user's post:

```text
Like API
   ↓
MongoDB Post
   ↓
Kafka Producer
   ↓
post-liked topic
   ↓
Kafka Consumer
   ↓
Notification Collection
```

When a user comments on another user's post:

```text
Comment API
   ↓
MongoDB Comment
   ↓
Kafka Producer
   ↓
post-commented topic
   ↓
Kafka Consumer
   ↓
Notification Collection
```

## Main API Endpoints

### Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`

### Posts
- POST `/api/v1/posts`
- GET `/api/v1/posts`
- GET `/api/v1/posts/:id`
- PUT `/api/v1/posts/:id`
- DELETE `/api/v1/posts/:id`
- POST `/api/v1/posts/:id/like`

### Comments
- POST `/api/v1/comments/post/:id`
- GET `/api/v1/comments/post/:id`
- DELETE `/api/v1/comments/:id`

### Notifications
- GET `/api/v1/notifications`
- PATCH `/api/v1/notifications/:id/read`
- PATCH `/api/v1/notifications/read-all`

### Users
- GET `/api/v1/users/:id`
- POST `/api/v1/users/:id/follow` — toggles follow/unfollow

### Kafka Events
- `post-liked`
- `post-commented`
- `user-followed`
