# Postman Collection Setup Guide

## Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select the file: `Hyr_Customer_Backend.postman_collection.json`
4. Click **Import**

## Setup Environment Variables

### Create Environment

1. Click **Environments** in the left sidebar
2. Click **+** to create a new environment
3. Name it: `Hyr Customer Backend - Local`

### Add Variables

Add these variables to your environment:

| Variable | Initial Value | Current Value | Description |
|----------|---------------|---------------|-------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` | API base URL |
| `auth_token` | (empty) | (empty) | JWT token (auto-set after login) |
| `user_id` | (empty) | (empty) | User ID (auto-set after login) |
| `otp` | (empty) | (empty) | OTP code (auto-set after send-otp) |
| `session_id` | (empty) | (empty) | Session ID (auto-set after verify-otp) |

### Select Environment

1. Select your environment from the dropdown (top right)
2. Make sure it's active before making requests

## API Endpoints

### 1. Health Check
- **GET** `/health`
- No authentication required
- Tests if server is running

### 2. Authentication Endpoints

#### Send OTP
- **POST** `/api/v1/auth/send-otp`
- **Body:**
  ```json
  {
    "phoneNumber": "1234567890",
    "countryCode": "+1",
    "hashKey": "your_hash_key_here",
    "referalId": "REF123" // optional
  }
  ```
- **Response:** Returns OTP in response (development only)
- **Auto-saves:** `otp`, `user_id` to environment

#### Verify OTP
- **POST** `/api/v1/auth/verify-otp`
- **Body:**
  ```json
  {
    "phoneNumber": "1234567890",
    "countryCode": "+1",
    "otp_value": "123456",
    "fcm_token": "your_fcm_token_here" // optional
  }
  ```
- **Response:** Returns JWT token
- **Auto-saves:** `auth_token`, `user_id`, `session_id` to environment

#### Update FCM Token
- **PUT** `/api/v1/auth/update-fcm`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- **Body:**
  ```json
  {
    "fcm_token": "new_fcm_token_here"
  }
  ```
- Requires authentication

#### Logout
- **POST** `/api/v1/log-out`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- Requires authentication

### 3. Profile Endpoints

#### Get Profile
- **GET** `/api/v1/profile`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- Returns current user's profile
- Requires authentication

#### Change Phone Number
- **POST** `/api/v1/profile/change-phone`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- **Body:**
  ```json
  {
    "phoneNumber": "9876543210",
    "countryCode": "+1"
  }
  ```
- Sends OTP to new phone number
- Requires authentication

#### Verify Phone Number
- **POST** `/api/v1/profile/verify-phone`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- **Body:**
  ```json
  {
    "phoneNumber": "9876543210",
    "countryCode": "+1",
    "otp": "123456"
  }
  ```
- Verifies OTP and updates phone number
- Requires authentication

### 4. User Management Endpoints

#### Create User
- **POST** `/api/users`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- **Body:**
  ```json
  {
    "accountName": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123" // optional
  }
  ```
- Requires authentication

#### Get All Users
- **GET** `/api/users`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- Returns list of all users
- Requires authentication

#### Get User by ID
- **GET** `/api/users/:id`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- Uses `{{user_id}}` from environment
- Requires authentication

#### Update User
- **PUT** `/api/users/:id`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- **Body:** (all fields optional)
  ```json
  {
    "accountName": "John Updated",
    "email": "john.updated@example.com",
    "password": "newpassword123"
  }
  ```
- Requires authentication

#### Delete User
- **DELETE** `/api/users/:id`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- Soft delete (marks as deleted)
- Requires authentication

## Testing Workflow

### Complete Authentication Flow

1. **Send OTP**
   - Update phone number and country code in request body
   - Send request
   - OTP will be saved to `{{otp}}` variable automatically

2. **Verify OTP**
   - OTP is automatically used from `{{otp}}` variable
   - Send request
   - Auth token will be saved to `{{auth_token}}` automatically

3. **Test Protected Endpoints**
   - All subsequent requests will use `{{auth_token}}` automatically
   - No need to manually copy/paste tokens

### Example Test Sequence

```
1. Health Check → Verify server is running
2. Send OTP → Get OTP code
3. Verify OTP → Get auth token
4. Get Profile → Test authenticated endpoint
5. Update FCM → Update FCM token
6. Get All Users → List users
7. Logout → End session
```

## Headers

All requests automatically include:
- `Content-Type: application/json` (for POST/PUT requests)
- `Accept-Language: en` (can be changed to `it` for Italian)
- `Authorization: Bearer {{auth_token}}` (for protected endpoints)

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  },
  "code": 200
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "code": 400
}
```

## Tips

1. **Auto-saved Variables**: The collection automatically saves tokens and IDs to environment variables
2. **Language Support**: Change `Accept-Language` header to `it` for Italian responses
3. **Base URL**: Update `base_url` variable for different environments (dev, staging, production)
4. **Token Refresh**: If token expires, run "Verify OTP" again to get a new token

## Troubleshooting

### Token Expired
- Run "Verify OTP" again to get a new token
- Token is automatically saved to `{{auth_token}}`

### 401 Unauthorized
- Check if `{{auth_token}}` is set in environment
- Verify token is valid by checking "Get Profile" endpoint

### 400 Bad Request
- Check request body format
- Verify all required fields are present
- Check validation error messages in response

### Connection Error
- Verify server is running on `{{base_url}}`
- Check if port 3000 is correct
- Verify CORS settings if calling from browser

