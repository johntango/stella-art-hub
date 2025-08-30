-- Create admin roles system with security definer functions to prevent RLS recursion
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  );
$$;

-- Create secure admin session tracking table
CREATE TABLE public.admin_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_token text NOT NULL UNIQUE,
    expires_at timestamp with time zone NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    last_used_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create admin login attempts tracking for rate limiting
CREATE TABLE public.admin_login_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address inet NOT NULL,
    attempted_at timestamp with time zone DEFAULT now(),
    success boolean DEFAULT false,
    user_agent text
);

-- Enable RLS on admin_login_attempts  
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Drop the dangerous admin policies and replace with secure ones
DROP POLICY IF EXISTS "Allow admin access to attendee table" ON public.attendee;
DROP POLICY IF EXISTS "Allow admin access to interest table" ON public.interest;

-- Create secure admin policies using the is_admin function
CREATE POLICY "Admin can access all attendee records" 
ON public.attendee 
FOR ALL 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin can access all interest records" 
ON public.interest 
FOR ALL 
TO authenticated  
USING (public.is_admin());

-- Create policies for admin role management (only admins can manage roles)
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Admin session policies
CREATE POLICY "Users can manage their own admin sessions" 
ON public.admin_sessions 
FOR ALL 
TO authenticated
USING (user_id = auth.uid());

-- Admin login attempts policies (admins can view all attempts)
CREATE POLICY "Admins can view all login attempts" 
ON public.admin_login_attempts 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can insert login attempts" 
ON public.admin_login_attempts 
FOR INSERT 
WITH CHECK (true);

-- Create function to validate admin session tokens
CREATE OR REPLACE FUNCTION public.validate_admin_session(token text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER  
AS $$
  SELECT user_id
  FROM public.admin_sessions
  WHERE session_token = token
    AND expires_at > now()
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = admin_sessions.user_id 
      AND role = 'admin'
    );
$$;

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.admin_sessions WHERE expires_at < now();
  DELETE FROM public.admin_login_attempts WHERE attempted_at < now() - interval '24 hours';
$$;

-- Create function to check rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(ip inet, max_attempts int DEFAULT 5, window_minutes int DEFAULT 15)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (
    SELECT COUNT(*)
    FROM public.admin_login_attempts
    WHERE ip_address = ip
      AND attempted_at > now() - interval '1 minute' * window_minutes
      AND success = false
  ) < max_attempts;
$$;