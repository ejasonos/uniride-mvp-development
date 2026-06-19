# UniRide - University Ride Marketplace MVP

A React Native mobile application built with Expo that connects student riders with campus drivers for convenient ride sharing.

## Features

- **Student Capabilities**
  - Register and login
  - Request rides with pickup/destination
  - View available drivers
  - Receive and negotiate ride offers
  - Realtime chat with drivers
  - Accept negotiated fares
  - Track driver location in real-time
  - Pay via Flutterwave
  - View ride history

- **Driver Capabilities**
  - Register and login
  - Toggle online/offline status
  - View pending ride requests
  - Submit price offers with messages
  - Realtime chat with riders
  - Share live location
  - View ride history

## Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Language**: TypeScript
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Flutterwave
- **Maps**: React Native Maps
- **Location**: Expo Location
- **Forms**: React Hook Form + Zod

## Project Structure

```
src/
├── navigation/          # Navigation stacks and routing
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── student/       # Student flow screens
│   └── driver/        # Driver flow screens
├── components/        # Reusable UI components
├── services/          # API and service integrations
│   ├── supabase/     # Supabase database operations
│   ├── flutterwave/  # Payment integration
│   └── location/     # Location services
├── store/            # Zustand stores
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── constants/        # App constants and config
├── styles/           # Shared styles
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 16+ and pnpm
- Expo CLI: `npm install -g expo-cli`
- Supabase account and project
- Flutterwave account (for payments)

### Installation

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Supabase and Flutterwave credentials to `.env`

3. **Set up Supabase database**
   - Log into your Supabase project
   - Go to SQL Editor
   - Copy contents of `database_schema.sql`
   - Run the SQL to create tables and RLS policies

4. **Start the development server**
   ```bash
   pnpm start
   ```

5. **Run on platform**
   - iOS: `pnpm ios`
   - Android: `pnpm android`
   - Web: `pnpm web`

## Environment Variables

Create a `.env` file with:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
EXPO_PUBLIC_FLUTTERWAVE_MERCHANT_KEY=your_flutterwave_merchant_key
```

## Database Schema

The application uses 8 core tables:

1. **profiles** - User accounts (students and drivers)
2. **drivers** - Driver-specific data (vehicle, location)
3. **ride_requests** - Ride requests with locations
4. **ride_offers** - Driver price offers for rides
5. **conversations** - Chat conversations between students and drivers
6. **messages** - Messages in conversations
7. **rides** - Completed ride agreements
8. **payments** - Payment records

All tables have Row Level Security (RLS) policies enforcing data isolation.

## Authentication Flow

1. User selects role (Student or Driver)
2. Complete registration with role-specific fields
3. Email/password authentication via Supabase
4. JWT token stored securely
5. Role-based navigation to student or driver home

## Realtime Features

The app uses Supabase Realtime for:
- Instant messaging in negotiations
- Live driver location updates
- Ride status changes

Subscriptions automatically clean up on component unmount.

## Payment Integration

Payments are processed through Flutterwave:
1. Student initiates payment after ride completion
2. Flutterwave checkout opens
3. Payment status updates database
4. Ride marked as completed

## Styling

- Uses React Native StyleSheet only (no NativeWind)
- Consistent color scheme (#0057D9 primary, #FFFFFF secondary, #FFC107 accent)
- Mobile-first responsive design
- Reusable style utilities in `src/styles/index.ts`

## State Management

**Zustand Stores:**
- `authStore` - User authentication and profile
- `rideStore` - Ride requests, offers, and rides
- `chatStore` - Conversations and messages
- `locationStore` - Current and driver locations

## Development Notes

- All API calls use Supabase client
- Form validation with React Hook Form + Zod
- Error handling with try/catch and user alerts
- Loading states for async operations
- Type-safe throughout with TypeScript

## Next Steps

To complete the MVP, implement:

1. **Student Flows**
   - Ride request form with map selection
   - View offers list with driver details
   - Negotiation chat interface
   - Live tracking map
   - Payment checkout

2. **Driver Flows**
   - Online/offline toggle
   - Pending requests list
   - Offer submission form
   - Negotiation chat interface
   - Live location sharing

3. **Shared**
   - Location permissions setup
   - Error handling and retry logic
   - Offline support if needed
   - App testing and optimization

## Testing

Before deploying:
- Test authentication flows (signup/login)
- Verify database RLS policies
- Test realtime subscriptions
- Validate payment integration
- Test location tracking permissions

## Troubleshooting

**Supabase connection errors**: Check credentials in `.env`

**RLS policy errors**: Verify database schema was run and policies created

**Location permission denied**: Check app permissions in device settings

**Realtime updates not working**: Confirm Realtime is enabled in Supabase project

## License

Proprietary - UniRide MVP
