# Clarisma CMS Admin Guide

## Overview

The Clarisma website now features a modern, database-backed Content Management System (CMS) powered by Neon PostgreSQL. This replaces the previous local-state admin component with a robust, production-ready solution.

## Features

### Admin Dashboard
- **Login Portal**: Secure JWT-based authentication
- **Retreats Management**: Create, read, update, and delete retreat listings
- **Settings Management**: Configure global app settings (hero video URL, etc.)
- **Reservations Tracking**: View and manage all booking submissions

### Core Capabilities

#### Retreats Management
- Create new retreats with comprehensive details:
  - Title, date, location, city
  - Description and pricing
  - Image URL for retreat preview
  - Tags for categorization (comma-separated)
  - Sign-up URL (external form link)
  - Seats available count
  - Agenda PDF URL
  - Payment details
- Edit existing retreats
- Delete retreats with confirmation dialog
- Real-time list updates after operations

#### Settings Management
- Configure hero video URL for the website
- Updates persist to the database immediately
- Changes are available site-wide

#### Reservations Tracking
- View all incoming reservations
- See retreat name, guest details, contact info
- View custom form answers
- Update reservation status (Pending, Confirmed, Cancelled)
- Status-based filtering with color indicators

## How to Access

1. Navigate to `https://yoursite.com/admin`
2. Log in with credentials:
   - **Username**: `Clarisma@retreat`
   - **Password**: `admin123` (set in `.env` file)
3. You're now in the admin dashboard

## Database Structure

The CMS uses three main tables in Neon PostgreSQL:

### `retreats` Table
- `id` - Primary key
- `title`, `date`, `location`, `city` - Basic info
- `description` - Full retreat description
- `image_url` - Image URL
- `price` - Pricing info
- `tags` - JSON array of tags
- `signup_url`, `seats_available`, `agenda_url`, `payment_details` - Additional info
- `custom_form_schema` - JSON schema for custom forms
- `created_at` - Timestamp

### `retreat_reservations` Table
- `id` - Primary key
- `retreat_id` - Foreign key to retreats
- `name`, `email`, `phone` - Guest contact info
- `message` - Message from guest
- `answers` - JSON object of custom form responses
- `status` - Booking status (pending, confirmed, cancelled)
- `created_at` - Submission timestamp

### `settings` Table
- `key` - Setting key (e.g., 'hero_video_url')
- `value` - Setting value

## API Endpoints

All endpoints are available at `/api/`:

### Authentication
- `POST /api/auth/login` - Login endpoint (returns JWT token)

### Retreats (Protected)
- `GET /api/retreats` - Get all retreats
- `POST /api/retreats` - Create new retreat (auth required)
- `PUT /api/retreats/:id` - Update retreat (auth required)
- `DELETE /api/retreats/:id` - Delete retreat (auth required)

### Settings (Protected)
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings (auth required)

### Reservations
- `POST /api/reservations` - Submit reservation
- `GET /api/reservations` - Get all reservations (auth required)
- `PUT /api/reservations/:id/status` - Update reservation status (auth required)

## Environment Variables

Required for the CMS to work:

```
DATABASE_URL=postgresql://...  # Neon PostgreSQL connection string
JWT_SECRET=your-secret-key     # For signing JWT tokens
ADMIN_PASSWORD=your-password   # Admin login password
ADMIN_PSEUDO=your-username     # Admin username (default: Clarisma@retreat)
```

## Technical Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js with Node.js
- **Database**: Neon PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **UI Components**: Lucide React icons

## Development

To run the dev server locally:

```bash
npm install
npm run dev
```

The server runs on `http://localhost:3000`

## File Structure

- `/components/AdminDashboard.tsx` - Main admin dashboard component
- `/server.ts` - Express backend with API routes
- `/App.tsx` - Application routing

## Notes

- The old `AdminPage.tsx` component has been replaced
- All data persists to the Neon database
- JWT tokens are stored in localStorage and expire in 24 hours
- The dashboard is fully responsive and works on mobile devices
- All operations include error handling and user feedback

## Troubleshooting

### Invalid Credentials
- Check username and password in `.env` file
- Ensure `ADMIN_PASSWORD` and `ADMIN_PSEUDO` are set correctly

### Database Connection Error
- Verify `DATABASE_URL` is correct and accessible
- Check Neon dashboard for connection status

### Changes Not Appearing
- Ensure you're logged in with a valid JWT token
- Check browser console for API errors
- Verify database has been initialized with schema

## Support

For issues or feature requests, contact the development team or check the server logs for detailed error messages.
