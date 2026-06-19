# UniRide MVP Setup Guide

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details:
   - Name: `uniride`
   - Database Password: Create a strong password
   - Region: Choose closest to your location
4. Wait for project creation (2-3 minutes)

### 1.2 Get Credentials
1. Go to Settings → API
2. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 1.3 Run Database Schema
1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy contents from `database_schema.sql` in project root
4. Paste into the editor
5. Click "Run"
6. Wait for schema to complete

### 1.4 Enable Realtime
1. Go to Database → Replication
2. Enable replication for:
   - `messages`
   - `drivers`
   - `ride_requests`
   - `rides`

### 1.5 Setup Email Auth
1. Go to Authentication → Providers
2. Email provider should be enabled by default
3. (Optional) Enable other providers as needed

## Step 2: Flutterwave Setup (Optional - Payments)

### 2.1 Create Flutterwave Account
1. Go to [flutterwave.com](https://flutterwave.com)
2. Sign up for a business account
3. Complete KYC verification

### 2.2 Get API Keys
1. Go to Settings → API Keys
2. Copy:
   - **Public Key** → `EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`
   - **Merchant Key** → `EXPO_PUBLIC_FLUTTERWAVE_MERCHANT_KEY`

Note: For now, you can skip this and just structure the payment flow.

## Step 3: Local Development Setup

### 3.1 Install Dependencies
```bash
cd /path/to/uniride
pnpm install
```

### 3.2 Create Environment File
```bash
cp .env.example .env
```

### 3.3 Add Credentials to .env
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key_here
EXPO_PUBLIC_FLUTTERWAVE_MERCHANT_KEY=your_flutterwave_merchant_key_here
```

### 3.4 Start Development Server
```bash
pnpm start
```

You'll see the Expo menu:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on phone

## Step 4: Testing Authentication

### 4.1 Test Student Signup
1. Click "Choose Your Role"
2. Tap "Student"
3. Fill in form:
   - Name: John Doe
   - Email: john@university.edu
   - Phone: +1234567890
   - Password: Test@123
4. Tap "Create Account"
5. Should see success message

### 4.2 Test Login
1. Go back to Login screen
2. Enter email: john@university.edu
3. Enter password: Test@123
4. Should see Student Home screen

### 4.3 Test Driver Signup
1. Go to "Choose Your Role"
2. Tap "Driver"
3. Fill in form with additional fields
4. Tap "Create Driver Account"
5. Should navigate to Driver Home

## Step 5: Verify Database

### 5.1 Check Data in Supabase
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "profiles" table
4. You should see your test accounts
5. Select "drivers" table
6. You should see your driver account with vehicle info

### 5.2 Check RLS Policies
1. Go to Database → Policies
2. Select each table and verify policies are created:
   - `profiles`
   - `drivers`
   - `ride_requests`
   - `ride_offers`
   - `conversations`
   - `messages`
   - `rides`
   - `payments`

## Step 6: Next Development Steps

After setup is complete, implement features in this order:

### Phase 1: Core Ride Flow
1. Ride Request Screen (pick location from map)
2. Driver Offers List (view offers for ride)
3. Chat Screen (realtime negotiation)
4. Offer Acceptance Flow (create ride from offer)

### Phase 2: Driver Features
1. Online/Offline Toggle
2. Pending Requests List
3. Submit Offer Form
4. Accept/Decline rides

### Phase 3: Tracking & Payment
1. Location Tracking Screen
2. Live Location Updates
3. Payment Initialization
4. Flutterwave Checkout Integration

### Phase 4: Polish
1. Ride History Screens
2. Error handling
3. Loading states
4. Offline support
5. Testing and optimization

## Troubleshooting

### "Missing Supabase credentials" error
- Check `.env` file exists and has values
- Verify `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server: `pnpm start`

### Can't create account
1. Check email is unique
2. Verify password is at least 6 characters
3. Check Supabase Auth is enabled
4. Look at Supabase dashboard → Logs for errors

### Can't login after signup
1. Check email/password are correct
2. Verify account exists in Supabase → Authentication → Users
3. Try with a different account

### Database tables don't exist
1. Go to Supabase SQL Editor
2. Run `database_schema.sql` again
3. Check for SQL errors in Supabase dashboard

### Realtime not working
1. Verify Realtime is enabled for each table
2. Check network connection
3. Restart app

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Flutterwave public key (optional) | `FLWPUBK_TEST...` |
| `EXPO_PUBLIC_FLUTTERWAVE_MERCHANT_KEY` | Flutterwave merchant key (optional) | `FLWSECK_TEST...` |

## Next: Building Features

Once setup is verified, see `DEVELOPMENT.md` for feature implementation details.
