-- Allow anonymous users to view all orders (WARNING: exposes PII)
CREATE POLICY "Anon can view all orders"
ON public.orders
FOR SELECT
TO anon
USING (true);