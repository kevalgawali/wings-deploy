# Express.js Basic Routes

A simple Express.js application demonstrating basic routing patterns.

## Installation

```bash
npm install
```

## Running the Application

### Development (with nodemon)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000`

## Available Routes

### User Routes
- `GET /` - Home route
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Product Routes
- `GET /api/products` - Get all products

### Search Routes
- `GET /api/search?q=term&type=all` - Search with query parameters

## Example Requests

### Get all users
```bash
curl http://localhost:3000/api/users
```

### Get user by ID
```bash
curl http://localhost:3000/api/users/1
```

### Create new user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "New User", "email": "newuser@example.com"}'
```

### Update user
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "email": "updated@example.com"}'
```

### Delete user
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Search
```bash
curl "http://localhost:3000/api/search?q=laptop&type=electronics"
```

## Features Demonstrated

- Basic HTTP methods (GET, POST, PUT, DELETE)
- Route parameters (`:id`)
- Query parameters (`?q=term&type=all`)
- JSON request/response handling
- Error handling middleware
- 404 handling
- Status codes (200, 201, 400, 404, 500)
