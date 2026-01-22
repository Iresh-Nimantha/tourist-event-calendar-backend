# Backend Environment Variables Setup

## Local Development

Create a `.env` file in the `tourist-event-calendar-backend` directory:

```env
# Server Configuration
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/tourist-calendar

# JWT Secret (use a strong random string, minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Gemini AI API Key (for chat service)
GEMINI_API_KEY=your-gemini-api-key

# Base URL (for chat service to call backend APIs)
BASE_URL=http://localhost:5000
```

## Production Deployment

### Render
1. Go to your service dashboard
2. Navigate to "Environment" tab
3. Add all the variables listed below

### Railway
1. Go to your project settings
2. Navigate to "Variables" tab
3. Add all the variables listed below

### Required Production Variables

```env
PORT=5000

# Frontend URL - Use comma-separated values for multiple origins
FRONTEND_URL=https://your-frontend.vercel.app,https://your-frontend.netlify.app

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-production-jwt-secret-minimum-32-characters-long

# Google OAuth Client ID
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key

# Backend Base URL (same as your backend deployment URL)
BASE_URL=https://your-backend.onrender.com
```

## Important Notes

- **FRONTEND_URL**: Can accept multiple origins separated by commas
- **MONGODB_URI**: Use MongoDB Atlas for production (free tier available)
- **JWT_SECRET**: Must be at least 32 characters long for security
- **BASE_URL**: Should match your backend deployment URL
- Never commit `.env` files to version control (they should be in `.gitignore`)

## Generating a Secure JWT Secret

You can generate a secure random string using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

