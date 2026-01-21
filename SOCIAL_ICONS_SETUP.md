# Social Icons & CV Management

This document explains how to manage social icons and CV download on the home page through the admin panel.

## Overview

The social icons and CV download link on the home page are now dynamically managed through the General Details section in the admin panel. You can update social media links and CV document without touching the code.

## Features

- **Dynamic Updates**: Social icons and CV link automatically update when you change them in the admin panel
- **Multiple Platforms**: Supports GitHub, LinkedIn, Twitter, Facebook, Instagram, and Website
- **CV Management**: Upload and manage CV document through the admin panel
- **Smart Display**: Only shows icons for platforms that have valid URLs (not default placeholder URLs)
- **Responsive Design**: Icons adapt properly to different screen sizes

## How to Update Social Icons & CV

1. **Access Admin Panel**: Go to `/admin` and log in with your credentials
2. **Navigate to General Details**: Click on "General Details" in the admin menu
3. **Update Social Links**: In the "General Information" section, you'll find fields for:
   - GitHub
   - LinkedIn  
   - Twitter
   - Facebook
   - Instagram
   - Website
4. **Upload CV Document**: Use the CV Document upload section to upload a new PDF file
5. **Save Changes**: Click "Save Changes" to update the social icons and CV link

## URL Format

Use the full URL format for each platform:
- GitHub: `https://github.com/yourusername`
- LinkedIn: `https://linkedin.com/in/yourusername`
- Twitter: `https://twitter.com/yourusername`
- Facebook: `https://facebook.com/yourusername`
- Instagram: `https://instagram.com/yourusername`
- Website: `https://yourwebsite.com`

## CV Upload

- **Supported Format**: PDF files only
- **Max Size**: 10MB
- **Automatic Update**: The homepage "Download CV" button will automatically use the uploaded document

## How It Works

### Backend
- Social links and CV URL are stored in the `GeneralDetails` model in MongoDB
- API endpoint: `GET /api/general-details` (public)
- Admin endpoint: `PUT /api/general-details` (admin only)

### Frontend
- `SocialIcons` component fetches social links from the API
- Homepage fetches CV URL from the same API endpoint
- Icons are rendered dynamically based on available URLs
- CV download button uses the dynamic CV URL from general details
- Default/placeholder URLs are automatically hidden

### API Response Structure
```json
{
  "socialLinks": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername",
    "twitter": "https://twitter.com/yourusername",
    "facebook": "https://facebook.com/yourusername",
    "instagram": "https://instagram.com/yourusername",
    "website": "https://yourwebsite.com"
  },
  "cvDownloadUrl": "/path/to/uploaded-cv.pdf",
  "sidebarImage": "/path/to/image.jpg"
}
```

## Testing

To test the social icons and CV functionality:

1. **Start the server**: `npm run dev`
2. **Check the home page**: Visit the home page to see social icons and CV download
3. **Test admin updates**: Update social links and upload CV in admin panel
4. **Verify changes**: Refresh home page to see updated social icons and CV link

## Troubleshooting

### Icons Not Showing
- Check if the server is running
- Verify the API endpoint is accessible: `http://localhost:5000/api/general-details`
- Ensure social links have valid URLs (not default placeholders)

### CV Download Not Working
- Check if CV document is properly uploaded in admin panel
- Verify the CV URL is returned by the API
- Ensure the CV file is accessible at the returned URL

### Admin Updates Not Reflecting
- Check browser console for API errors
- Verify admin authentication is working
- Check if MongoDB is connected and data is being saved

### Icons/CV Still Show Old Links
- Clear browser cache
- Check if the API is returning updated data
- Verify the component is re-fetching data after updates

## File Structure

```
src/
├── components/
│   └── SocialIcons.tsx          # Updated to fetch from API
├── pages/
│   ├── index.tsx               # Home page using dynamic CV link
│   └── admin/
│       └── general-details.tsx # Admin interface for managing links & CV
server/
├── models/
│   └── GeneralDetails.js       # MongoDB schema
└── routes/
    └── generalDetails.js       # API endpoints
```
