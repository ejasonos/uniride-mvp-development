-- ============================================================================
-- UNIRIDE DATABASE SCHEMA
-- ============================================================================

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('student', 'driver')),
    full_name TEXT NOT NULL,
    phone TEXT,
    university_email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Students can see their own profile
CREATE POLICY "profiles_student_select" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Students can update their own profile
CREATE POLICY "profiles_student_update" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Everyone can read profiles (for ride offers/negotiations)
CREATE POLICY "profiles_public_read" ON profiles
    FOR SELECT
    USING (true);

-- Profiles can be created by authenticated users
CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- DRIVERS TABLE
-- ============================================================================
CREATE TABLE drivers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL,
    vehicle_registration TEXT NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on drivers
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Drivers can see their own data
CREATE POLICY "drivers_self_select" ON drivers
    FOR SELECT
    USING (auth.uid() = id);

-- Drivers can update their own location and status
CREATE POLICY "drivers_self_update" ON drivers
    FOR UPDATE
    USING (auth.uid() = id);

-- Students can see online drivers
CREATE POLICY "drivers_public_read_online" ON drivers
    FOR SELECT
    USING (is_online = true);

-- Drivers can be created by authenticated users
CREATE POLICY "drivers_insert" ON drivers
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RIDE_REQUESTS TABLE
-- ============================================================================
CREATE TABLE ride_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pickup_location TEXT NOT NULL,
    pickup_lat DOUBLE PRECISION NOT NULL,
    pickup_lng DOUBLE PRECISION NOT NULL,
    destination_location TEXT NOT NULL,
    destination_lat DOUBLE PRECISION NOT NULL,
    destination_lng DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'agreed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ride_requests
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;

-- Students can see their own ride requests
CREATE POLICY "ride_requests_student_select" ON ride_requests
    FOR SELECT
    USING (auth.uid() = student_id);

-- Students can update their own ride requests
CREATE POLICY "ride_requests_student_update" ON ride_requests
    FOR UPDATE
    USING (auth.uid() = student_id);

-- Students can insert ride requests
CREATE POLICY "ride_requests_student_insert" ON ride_requests
    FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Drivers can see pending ride requests
CREATE POLICY "ride_requests_driver_select_pending" ON ride_requests
    FOR SELECT
    USING (status = 'pending');

-- ============================================================================
-- RIDE_OFFERS TABLE
-- ============================================================================
CREATE TABLE ride_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_request_id UUID NOT NULL REFERENCES ride_requests(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    offered_price NUMERIC NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ride_offers
ALTER TABLE ride_offers ENABLE ROW LEVEL SECURITY;

-- Students can see offers for their ride requests
CREATE POLICY "ride_offers_student_select" ON ride_offers
    FOR SELECT
    USING (
        ride_request_id IN (
            SELECT id FROM ride_requests WHERE student_id = auth.uid()
        )
    );

-- Drivers can see their own offers
CREATE POLICY "ride_offers_driver_select" ON ride_offers
    FOR SELECT
    USING (auth.uid() = driver_id);

-- Drivers can create offers
CREATE POLICY "ride_offers_driver_insert" ON ride_offers
    FOR INSERT
    WITH CHECK (auth.uid() = driver_id);

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_request_id UUID NOT NULL REFERENCES ride_requests(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Students can see their conversations
CREATE POLICY "conversations_student_select" ON conversations
    FOR SELECT
    USING (auth.uid() = student_id);

-- Drivers can see their conversations
CREATE POLICY "conversations_driver_select" ON conversations
    FOR SELECT
    USING (auth.uid() = driver_id);

-- Students and drivers can create conversations
CREATE POLICY "conversations_insert" ON conversations
    FOR INSERT
    WITH CHECK (auth.uid() = student_id OR auth.uid() = driver_id);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can see messages from their conversations
CREATE POLICY "messages_select" ON messages
    FOR SELECT
    USING (
        conversation_id IN (
            SELECT id FROM conversations WHERE student_id = auth.uid() OR driver_id = auth.uid()
        )
    );

-- Users can insert messages in their conversations
CREATE POLICY "messages_insert" ON messages
    FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        conversation_id IN (
            SELECT id FROM conversations WHERE student_id = auth.uid() OR driver_id = auth.uid()
        )
    );

-- ============================================================================
-- RIDES TABLE
-- ============================================================================
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_request_id UUID NOT NULL REFERENCES ride_requests(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    agreed_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'agreed' CHECK (status IN ('agreed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on rides
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Students can see their rides
CREATE POLICY "rides_student_select" ON rides
    FOR SELECT
    USING (auth.uid() = student_id);

-- Drivers can see their rides
CREATE POLICY "rides_driver_select" ON rides
    FOR SELECT
    USING (auth.uid() = driver_id);

-- Students can update their rides
CREATE POLICY "rides_student_update" ON rides
    FOR UPDATE
    USING (auth.uid() = student_id);

-- Drivers can update their rides
CREATE POLICY "rides_driver_update" ON rides
    FOR UPDATE
    USING (auth.uid() = driver_id);

-- System can insert rides (via backend)
CREATE POLICY "rides_insert" ON rides
    FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_reference TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Students can see payments for their rides
CREATE POLICY "payments_student_select" ON payments
    FOR SELECT
    USING (
        ride_id IN (
            SELECT id FROM rides WHERE student_id = auth.uid()
        )
    );

-- Drivers can see payments for their rides
CREATE POLICY "payments_driver_select" ON payments
    FOR SELECT
    USING (
        ride_id IN (
            SELECT id FROM rides WHERE driver_id = auth.uid()
        )
    );

-- System can insert and update payments
CREATE POLICY "payments_insert" ON payments
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "payments_update" ON payments
    FOR UPDATE
    WITH CHECK (true);

-- ============================================================================
-- INDEXES (for performance)
-- ============================================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_university_email ON profiles(university_email);
CREATE INDEX idx_drivers_is_online ON drivers(is_online);
CREATE INDEX idx_ride_requests_student_id ON ride_requests(student_id);
CREATE INDEX idx_ride_requests_status ON ride_requests(status);
CREATE INDEX idx_ride_requests_created_at ON ride_requests(created_at DESC);
CREATE INDEX idx_ride_offers_ride_request_id ON ride_offers(ride_request_id);
CREATE INDEX idx_ride_offers_driver_id ON ride_offers(driver_id);
CREATE INDEX idx_conversations_student_id ON conversations(student_id);
CREATE INDEX idx_conversations_driver_id ON conversations(driver_id);
CREATE INDEX idx_conversations_ride_request_id ON conversations(ride_request_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_rides_student_id ON rides(student_id);
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_payments_ride_id ON payments(ride_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for drivers (for location tracking)
ALTER PUBLICATION supabase_realtime ADD TABLE drivers;

-- Enable realtime for ride status updates
ALTER PUBLICATION supabase_realtime ADD TABLE ride_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE rides;
