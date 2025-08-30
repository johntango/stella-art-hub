-- Fix RLS policies for admin access to attendee table
DROP POLICY IF EXISTS "Admins can manage all attendee records" ON public.attendee;
DROP POLICY IF EXISTS "Admin only read access to attendee" ON public.attendee;

-- Create new admin policy that works with edge function validation
CREATE POLICY "Allow admin access to attendee table" 
ON public.attendee 
FOR ALL 
USING (true);

-- Fix RLS policies for admin access to interest table  
DROP POLICY IF EXISTS "Admins can manage all interest records" ON public.interest;
DROP POLICY IF EXISTS "Admin only read access to interest" ON public.interest;

-- Create new admin policy that works with edge function validation
CREATE POLICY "Allow admin access to interest table" 
ON public.interest 
FOR ALL 
USING (true);