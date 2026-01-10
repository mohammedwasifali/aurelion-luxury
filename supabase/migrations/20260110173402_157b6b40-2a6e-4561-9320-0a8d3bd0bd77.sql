-- Allow anonymous users to view all user roles
CREATE POLICY "Anon can view all user roles"
ON public.user_roles
FOR SELECT
TO anon
USING (true);