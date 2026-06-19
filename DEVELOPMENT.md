# UniRide MVP Development Guide

This guide outlines the remaining features to implement for the MVP.

## Completed

✅ Project setup with Expo SDK 54  
✅ TypeScript configuration  
✅ Zustand state management stores  
✅ Supabase authentication (email/password)  
✅ Database schema with RLS policies  
✅ Auth screens (Login, SignUp Role, Student SignUp, Driver SignUp)  
✅ Navigation structure  
✅ Reusable UI components (Button, Input, Card)  
✅ Service layer for Supabase  

## Remaining Features

### 1. Student Home Screen

**File**: `src/screens/student/StudentHomeScreen.tsx`

**Components needed**:
- Search input for destination
- Map showing current location
- Map markers for online drivers
- "Request Ride" button

**Implementation**:
```typescript
- Use expo-location to get current location
- Use react-native-maps to display map
- Fetch online drivers from rideStore
- Add markers for drivers on map
- Search input for destination address
```

**Store usage**:
- `useLocationStore.updateCurrentLocation()`
- `useRideStore.fetchPendingRideRequests()`

---

### 2. Ride Request Screen

**File**: `src/screens/student/RideRequestScreen.tsx`

**Components needed**:
- Pickup location (autocomplete or map tap)
- Destination location (autocomplete or map tap)
- Map preview of route
- Submit button

**Implementation**:
```typescript
- Show map with two location markers
- Allow selecting locations via:
  - Typing address (with autocomplete)
  - Tapping on map
- Display estimated distance
- Call rideStore.createRideRequest()
```

**Navigation flow**:
```
StudentHome (tap "Request Ride")
  → RideRequestScreen (fill in locations)
    → OffersListScreen (view driver offers)
```

---

### 3. Offers List Screen

**File**: `src/screens/student/OffersListScreen.tsx`

**Components needed**:
- List of ride offers from drivers
- Driver info (name, vehicle, rating)
- Price card
- Accept button → Chat screen

**Implementation**:
```typescript
- Fetch offers for ride request from rideStore
- Display each offer in a card
- Show driver profile info
- Tap offer to go to chat/negotiation
- Accept offer to create ride
```

**Store usage**:
- `useRideStore.fetchRideOffers(rideRequestId)`
- `useChatStore.createConversation()`

---

### 4. Negotiation Chat Screen

**File**: `src/screens/chat/NegotiationChatScreen.tsx`

**Components needed**:
- Message list (scrollable)
- Message input
- Send button
- Price display
- Accept offer button

**Implementation**:
```typescript
- Fetch conversation and messages
- Subscribe to realtime messages
- Send text messages
- Detect price offers in messages
- Show "Accept at $X" button when offer made
- Call rideStore.createRide() on acceptance
```

**Store usage**:
- `useChatStore.fetchMessages(conversationId)`
- `useChatStore.subscribeToMessages(conversationId)`
- `useChatStore.sendMessage()`
- `useRideStore.createRide()`

---

### 5. Ride Tracking Screen

**File**: `src/screens/student/TrackingScreen.tsx`

**Components needed**:
- Map showing driver and student locations
- Live location updates
- ETA display
- Driver info card
- Arrive button

**Implementation**:
```typescript
- Subscribe to driver location updates
- Center map between student and driver
- Draw polyline between locations
- Update in real-time
- Call rideStore.updateRideStatus('in_progress')
- Monitor for driver arrival
```

**Store usage**:
- `useLocationStore.startLocationTracking(driverId)`
- `useRideStore.updateRideStatus()`

---

### 6. Payment Screen

**File**: `src/screens/student/PaymentScreen.tsx`

**Components needed**:
- Ride summary (pickup, destination, price)
- Amount display
- Pay button
- Payment status indicator

**Implementation**:
```typescript
- Display agreed price
- Integrate Flutterwave checkout
- Handle payment response
- Update payment status in database
- Mark ride as completed
```

**Store usage**:
- `useRideStore.createPayment()`
- `useRideStore.updatePaymentStatus()`

---

### 7. Student Ride History Screen

**File**: `src/screens/student/RideHistoryScreen.tsx`

**Components needed**:
- List of completed rides
- Ride details (date, driver, amount paid)
- Filter options (completed, cancelled)

**Implementation**:
```typescript
- Fetch student ride history
- Display in chronological order
- Show ride details in expandable card
```

**Store usage**:
- `useRideStore.fetchStudentRideHistory(userId)`

---

### 8. Driver Home Screen

**File**: `src/screens/driver/DriverHomeScreen.tsx` (update existing)

**Components needed**:
- Online/Offline toggle
- Map with pending requests
- Nearby requests list
- Navigation to offers screen

**Implementation**:
```typescript
- Use toggle to update driver status
- Fetch pending ride requests
- Show on map near driver location
- List with distance and earnings estimate
- Tap to view details and submit offer
```

**Store usage**:
- `useAuthStore.user` (driver profile)
- `useRideStore.fetchPendingRideRequests()`
- `useLocationStore.updateCurrentLocation()`

---

### 9. Driver Offers Screen

**File**: `src/screens/driver/OfferSubmissionScreen.tsx`

**Components needed**:
- Ride request details
- Price input field
- Message input (optional)
- Submit offer button

**Implementation**:
```typescript
- Show pickup/destination on map
- Allow driver to input price
- Optional message field
- Submit offer to database
- Transition to chat/negotiation
```

**Store usage**:
- `useRideStore.createRideOffer()`
- `useChatStore.createConversation()`

---

### 10. Driver Ride History Screen

**File**: `src/screens/driver/DriverRideHistoryScreen.tsx`

**Components needed**:
- List of completed rides
- Earnings summary
- Ride details

**Implementation**:
```typescript
- Fetch completed rides for driver
- Display earnings for each ride
- Show total earnings
```

**Store usage**:
- `useRideStore.fetchDriverRideHistory(driverId)`

---

## Implementation Order

**Priority 1 (Core Flow):**
1. Update StudentHomeScreen with map and location
2. Create RideRequestScreen
3. Create OffersListScreen
4. Create NegotiationChatScreen
5. Create RideTrackingScreen

**Priority 2 (Completion):**
6. Create PaymentScreen
7. Create StudentRideHistoryScreen
8. Update DriverHomeScreen with toggle and map
9. Create OfferSubmissionScreen
10. Create DriverRideHistoryScreen

## Key Implementation Tips

### Maps Integration
```typescript
import MapView, { Marker, Polyline } from 'react-native-maps';

// Show marker for location
<Marker coordinate={{ latitude: X, longitude: Y }} />

// Draw route between points
<Polyline coordinates={[start, end]} strokeColor="#0057D9" strokeWidth={3} />
```

### Location Tracking
```typescript
import * as Location from 'expo-location';

// Get current location
const location = await Location.getCurrentPositionAsync({});

// Update driver location in database
await updateDriverLocation(driverId, lat, lng);
```

### Realtime Subscriptions
```typescript
// Subscribe to messages
const unsubscribe = useChatStore.subscribeToMessages(conversationId);

// Cleanup on unmount
useEffect(() => {
  return () => unsubscribe();
}, []);
```

### Form Validation
```typescript
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  price: z.number().min(0),
  message: z.string().optional(),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

## Testing Checklist

- [ ] Student can create ride request
- [ ] Driver sees pending requests
- [ ] Driver can submit offer
- [ ] Student sees offers
- [ ] Messages send in real-time
- [ ] Locations update in real-time
- [ ] Payment processes successfully
- [ ] Ride history shows correctly
- [ ] Online/offline toggle works
- [ ] All error cases handled

## Performance Considerations

- Use `useCallback` for handlers
- Memoize components with `React.memo`
- Unsubscribe from realtime on unmount
- Debounce location updates (5 second interval)
- Paginate ride history (20 items per page)

## Error Handling

All async operations should handle errors:
```typescript
try {
  await operation();
} catch (error) {
  Alert.alert('Error', error.message);
  // Log to error tracking service
}
```

## Next Steps

1. Set up Supabase project (see SETUP_GUIDE.md)
2. Test authentication flows
3. Start implementing Priority 1 features
4. Test each screen thoroughly
5. Integrate payment when ready
6. Deploy to Expo Go for testing

---

**Need help?** Check the project structure in README.md or review existing components for patterns.
