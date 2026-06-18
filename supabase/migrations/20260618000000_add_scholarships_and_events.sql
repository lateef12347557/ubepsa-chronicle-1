-- Scholarships
CREATE TABLE public.scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  eligibility text NOT NULL,
  deadline text,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read scholarships" ON public.scholarships FOR SELECT USING (true);
CREATE POLICY "admin write scholarships" ON public.scholarships FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  location text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "admin write events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
