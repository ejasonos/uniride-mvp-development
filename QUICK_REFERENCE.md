# UniRide MVP - Quick Reference Card

## Start Here

```bash
# 1. Setup
cp .env.example .env          # Add Supabase credentials
pnpm install                  # Install dependencies
pnpm start                    # Start dev server

# 2. Choose platform
i  # iOS
a  # Android
w  # Web
```

## Project at a Glance

| Aspect | Status |
|--------|--------|
| **Screens** | 6 built, 10 to build |
| **Stores** | 4 Zustand stores ready |
| **Database** | 8 tables with RLS |
| **Auth** | Email/password working |
| **Navigation** | Role-based setup |

## File Quick Links

### Start with these files
- `SETUP_GUIDE.md` - Get running locally
- `PROJECT_SUMMARY.md` - What's built
- `DEVELOPMENT.md` - Build features

### Edit these files to add features
- `src/screens/student/StudentHomeScreen.tsx`
- `src/screens/driver/DriverHomeScreen.tsx`
- `src/store/*.ts` - Add actions as needed

### Reference these for patterns
- `src/screens/auth/LoginScreen.tsx` - Form pattern
- `src/components/Button.tsx` - Component pattern
- `src/store/authStore.ts` - Store pattern

## Common Commands

```bash
# Development
pnpm start                    # Start dev server
pnpm ios                      # Run on iOS
pnpm android                  # Run on Android
pnpm web                      # Run on web

# Build
eas build                     # Build for iOS/Android

# Formatting
pnpm lint                     # Check linting

# Database
# Run database_schema.sql in Supabase SQL Editor
```

## Environment Setup

```env
# .env file
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_...
EXPO_PUBLIC_FLUTTERWAVE_MERCHANT_KEY=FLWSECK_...
```

## Import Patterns

```typescript
// Screens
import { StudentHomeScreen } from '@screens/student/StudentHomeScreen';

// Components
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Card } from '@components/Card';

// Stores
import { useAuthStore } from '@store/authStore';
import { useRideStore } from '@store/rideStore';
import { useChatStore } from '@store/chatStore';
import { useLocationStore } from '@store/locationStore';

// Services
import * as authService from '@services/supabase/client';
import * as rideService from '@services/supabase/rides';
import * as chatService from '@services/supabase/chat';

// Constants & Types
import { COLORS, VEHICLE_TYPES } from '@constants/index';
import { Profile, RideRequest, Message } from '@types/index';
import { globalStyles } from '@styles/index';
```

## Common Patterns

### Using a Store
```typescript
const { user, signIn, isLoading } = useAuthStore();

const handleLogin = async () => {
  try {
    await signIn(email, password);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

### Creating a Form
```typescript
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const [value, setValue] = useState('');
const [error, setError] = useState('');

const validate = () => {
  if (!value.trim()) {
    setError('Field is required');
    return false;
  }
  return true;
};

<Input
  label="Field Name"
  placeholder="Enter value"
  value={value}
  onChangeText={setValue}
  error={error}
  containerStyle={styles.input}
/>
<Button title="Submit" onPress={validate} />
```

### Navigation
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate
navigation.navigate('ScreenName');

// Go back
navigation.goBack();

// Reset
navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
```

## Color System

```typescript
import { COLORS } from '@constants/index';

COLORS.PRIMARY       // #0057D9 (blue)
COLORS.SECONDARY     // #FFFFFF (white)
COLORS.ACCENT        // #FFC107 (yellow)
COLORS.TEXT_PRIMARY  // #000000
COLORS.TEXT_SECONDARY// #666666
COLORS.ERROR         // #D32F2F
COLORS.SUCCESS       // #388E3C
COLORS.LIGHT_GRAY    // #F5F5F5
COLORS.GRAY          // #E0E0E0
```

## Components

### Button
```typescript
<Button
  title="Click Me"
  onPress={() => {}}
  variant="primary"        // or "secondary"
  loading={false}
  disabled={false}
/>
```

### Input
```typescript
<Input
  label="Email"
  placeholder="example@email.com"
  value={email}
  onChangeText={setEmail}
  error={error}
  keyboardType="email-address"
  secureTextEntry={false}
/>
```

### Card
```typescript
<Card style={{ marginVertical: 8 }}>
  <Text>Card content here</Text>
</Card>
```

## Features to Build

**Priority 1:**
1. StudentHomeScreen (map + drivers)
2. RideRequestScreen
3. OffersListScreen
4. NegotiationChatScreen
5. TrackingScreen

**Priority 2:**
6. PaymentScreen
7. StudentRideHistoryScreen
8. Update DriverHomeScreen
9. OfferSubmissionScreen
10. DriverRideHistoryScreen

## Debugging Tips

### Check Supabase Data
```
Supabase Dashboard → Table Editor → Select table
```

### Check Auth
```typescript
const { user, isInitialized } = useAuthStore();
console.log('User:', user);
console.log('Initialized:', isInitialized);
```

### Check Store Data
```typescript
const { currentRide, rideOffers } = useRideStore();
console.log('Ride:', currentRide);
console.log('Offers:', rideOffers);
```

### Check Errors
```typescript
try {
  await operation();
} catch (error) {
  console.log('Error:', error.message);
  Alert.alert('Error', error.message);
}
```

## Testing Checklist

- [ ] App starts without errors
- [ ] Splash screen loads
- [ ] Can signup as student
- [ ] Can signup as driver
- [ ] Can login with both accounts
- [ ] Navigation works correctly
- [ ] Data appears in Supabase
- [ ] Logout works
- [ ] Can login again

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing Supabase credentials" | Check .env file |
| "Cannot find module '@screens'" | Verify tsconfig.json paths |
| "Database error" | Run database_schema.sql |
| "Auth not working" | Check Supabase Auth enabled |
| "Can't see drivers" | Implement map integration |

## Resources

- 📖 [React Native](https://reactnative.dev)
- 🚀 [Expo](https://docs.expo.dev)
- 🗄️ [Supabase](https://supabase.com/docs)
- 🧭 [Navigation](https://reactnavigation.org)
- 📦 [Zustand](https://github.com/pmndrs/zustand)

## Remember

- ✅ Always add types
- ✅ Handle errors in try/catch
- ✅ Clean up subscriptions on unmount
- ✅ Test on real device
- ✅ Check RLS policies for data issues
- ✅ Use constants instead of magic strings
- ✅ Keep components small and focused

---

**More Help?** → See INDEX.md for full documentation
