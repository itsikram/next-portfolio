# Cloudinary Setup Instructions

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. After logging in, go to your Dashboard
2. You'll find your credentials under "Account Details":
   - **Cloud name**
   - **API Key** 
   - **API Secret**

## 3. Configure Environment Variables

Create a `.env.local` file in the root of your project (this file is already in .gitignore):

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace the placeholder values with your actual Cloudinary credentials.

## 4. Start the Development Servers

1. Start the backend server:
   ```bash
   npm run server:dev
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 5. Test the Image Upload

1. Navigate to `http://localhost:3000/admin/portfolio/new`
2. Fill in the portfolio details
3. Upload an image using the image upload component
4. Submit the form

The image will be automatically uploaded to your Cloudinary account and the URL will be stored in your database.

## Features Implemented

- ✅ Image upload to Cloudinary
- ✅ Image preview before upload
- ✅ File validation (type and size)
- ✅ Error handling and cleanup on failed uploads
- ✅ Support for both create and update operations
- ✅ Automatic image optimization (Cloudinary handles this)
- ✅ Responsive image delivery

## Security Notes

- Your API secrets are stored in environment variables and never exposed to the client
- File uploads are handled securely through multer with Cloudinary storage
- Image validation prevents malicious file uploads
- Automatic cleanup of uploaded files if database operations fail
