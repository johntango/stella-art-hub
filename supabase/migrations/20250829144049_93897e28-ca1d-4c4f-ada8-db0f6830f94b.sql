-- Fix critical security vulnerability: Remove public access to attendee table
-- and implement proper Row Level Security policies

-- Drop the existing public read policy that exposes sensitive data
DROP POLICY IF EXISTS "Allow public read access to attendee" ON public.attendee;

-- Create a restricted admin-only read policy
-- Note: This will require authentication to be implemented for full functionality
CREATE POLICY "Admin only read access to attendee" 
ON public.attendee 
FOR SELECT 
USING (false); -- Temporarily block all read access until proper auth is implemented

-- Keep the public insert policy for registration functionality
-- but consider restricting this in the future with rate limiting

-- Add a policy for users to read their own registration by email
-- This will work once authentication is implemented
CREATE POLICY "Users can read their own attendee record" 
ON public.attendee 
FOR SELECT 
USING (
  auth.email() = email AND auth.role() = 'authenticated'
);

-- Create admin policy that allows full access (for when auth roles are implemented)
CREATE POLICY "Admins can manage all attendee records" 
ON public.attendee 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);