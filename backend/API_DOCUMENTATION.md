# VoiceLockAI Backend API Documentation

## Base URL

http://127.0.0.1:8000



## 1. Register User

### Endpoint

POST /register

### Description

Creates a new user account.

### Request Body

```json
{
  "name": "Jhon",
  "email": "user@examplegmail.com",
  "password": "example123"
}
```
## 2. Login User

### Endpoint

POST /login

### Description

Authenticates the user and returns a JWT access token.

### Request Body

```json
{
  "email": "user@examplegmail.com",
  "password": "example123"
}
```

### Success Response

```json
{
  "access_token": "your_jwt_token",
  "token_type": "bearer"
}
```
## 3. Get User Profile

### Endpoint

GET /profile

### Description

Returns the logged-in user's profile details.

### Authorization

Requires JWT token.

Header:

```
Authorization: Bearer <access_token>
```

### Success Response

```json
{
  "name": "Jhon",
  "email": "user@examplegmail.com"
}
```
## 4. Change Password

### Endpoint

PUT /change-password

### Description

Allows the logged-in user to change their password.

### Authorization

Requires JWT token.

Header:

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "old_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

### Success Response

```json
{
  "message": "Password changed successfully"
}
```
## 5. Upload Voice

### Endpoint

POST /voice/upload

### Description

Uploads the user's voice sample for voice authentication.

### Authorization

Requires JWT token.

Header:

```
Authorization: Bearer <access_token>
```

### Request Type

Form Data:

```
file: audio_file
```

### Success Response

```json
{
  "message": "Voice uploaded successfully",
  "file": "voice_recording.wav",
  "path": "uploads/voices/user_voice.wav"
}
```
## 6. Get My Voice

### Endpoint

GET /voice/my-voice

### Description

Fetches the logged-in user's uploaded voice details.

### Authorization

Requires JWT token.

Header:

```
Authorization: Bearer <access_token>
```

### Success Response

```json
{
  "email": "user@example.com",
  "filename": "voice_recording.wav",
  "path": "uploads/voices/user_voice.wav",
  "uploaded_at": "2026-07-31T10:30:00"
}
```
## 7. Update Voice

### Endpoint

PUT /voice/update

### Description

Updates the existing voice sample of the logged-in user.

### Authorization

Requires JWT token.

Header:

```
Authorization: Bearer <access_token>
```

### Request Type

Form Data:

```
file: new_audio_file
```

### Success Response

```json
{
  "message": "Voice updated successfully",
  "file": "new_voice_recording.wav",
  "path": "uploads/voices/new_voice_recording.wav"
}
```
## 8. Delete Voice

### Endpoint

DELETE /voice/delete

### Description

Deletes the logged-in user's stored voice sample.

### Authorization

Requires JWT token.

Header:

```
Authorization: Bearer <access_token>
```

### Success Response

```json
{
  "message": "Voice deleted successfully"
}
```