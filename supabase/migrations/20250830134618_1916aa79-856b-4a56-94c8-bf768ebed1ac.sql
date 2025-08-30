-- Fix function search path security issues
ALTER FUNCTION public.is_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.validate_admin_session(text) SET search_path = 'public';  
ALTER FUNCTION public.cleanup_expired_sessions() SET search_path = 'public';
ALTER FUNCTION public.check_rate_limit(inet, int, int) SET search_path = 'public';