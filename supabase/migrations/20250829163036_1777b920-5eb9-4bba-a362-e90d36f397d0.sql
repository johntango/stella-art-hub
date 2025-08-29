-- Fix critical security vulnerability: Remove public read access to interest table
-- Personal contact information (emails, names, affiliations) should not be publicly accessible

-- Drop the existing public read policy that exposes personal data
DROP POLICY IF EXISTS "Allow public read access to interest" ON public.interest;

-- Create a restricted admin-only read policy
CREATE POLICY "Admin only read access to interest" 
ON public.interest 
FOR SELECT 
USING (false); -- Temporarily block all read access until proper auth is implemented

-- Keep the public insert policy for interest registration functionality
-- This allows the contact/interest forms to continue working

-- Add a policy for users to read their own interest submission by email
-- This will work once authentication is implemented
CREATE POLICY "Users can read their own interest record" 
ON public.interest 
FOR SELECT 
USING (
  auth.email() = email AND auth.role() = 'authenticated'
);

-- Create admin policy for full access (for when auth roles are implemented)
CREATE POLICY "Admins can manage all interest records" 
ON public.interest 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);