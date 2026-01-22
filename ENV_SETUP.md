# Frontend Environment Variables Setup

## Local Development

Create a `.env` file in the `tourist-event-calendar-frontend` directory:

```env
# Backend API URL (IMPORTANT: Do NOT include /api in the URL)
# The /api prefix is automatically added by the API service
VITE_API_URL=http://localhost:5000

# Google OAuth Client ID (get from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Imgur Client ID (optional, for image uploads - get from https://api.imgur.com/oauth2/addclient)
VITE_IMGUR_CLIENT_ID=your-imgur-client-id
```

## Production Deployment

### Vercel
1. Go to Project Settings > Environment Variables
2. Add:
   - `VITE_API_URL` = `https://your-backend-domain.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID` = `your-google-client-id.apps.googleusercontent.com`
3. Redeploy your application

### Netlify
1. Go to Site settings > Build & deploy > Environment
2. Add:
   - `VITE_API_URL` = `https://your-backend-domain.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID` = `your-google-client-id.apps.googleusercontent.com`
   - `VITE_IMGUR_CLIENT_ID` = `your-imgur-client-id` (optional)
3. Redeploy your application

### Other Platforms
Set environment variables before building:
- `VITE_API_URL` - Your backend URL
- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `VITE_IMGUR_CLIENT_ID` - Your Imgur Client ID (optional, for image uploads)

## Getting Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://your-frontend-domain.vercel.app` (for production)
7. Copy the Client ID and add it to your `.env` file

## Getting Imgur Client ID (Optional - for Image Uploads)

1. Go to [Imgur API](https://api.imgur.com/oauth2/addclient)
2. Log in with your Imgur account (or create one)
3. Select "Anonymous usage without user authorization"
4. Enter an application name and description
5. Copy the Client ID
6. Add it to your `.env` file as `VITE_IMGUR_CLIENT_ID`

**Note:** If you don't set up Imgur, users can still upload images by providing direct URLs.

## Important Notes

- The `VITE_` prefix is required for Vite to expose the variable to your code
- After changing environment variables, you must rebuild your application
- Never commit `.env` files to version control (they should be in `.gitignore`)
- Make sure the Google OAuth Client ID matches between frontend and backend

