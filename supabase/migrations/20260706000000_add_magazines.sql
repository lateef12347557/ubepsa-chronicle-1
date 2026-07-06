-- Magazines Table
CREATE TABLE public.magazines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volume integer NOT NULL,
  issue integer NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  date text NOT NULL,
  description text NOT NULL,
  bg_gradient text NOT NULL DEFAULT 'from-blue-600 via-indigo-600 to-violet-700',
  pdf_size text NOT NULL DEFAULT '0 MB',
  pdf_url text,
  features text[] NOT NULL DEFAULT '{}',
  pages jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "public read magazines" ON public.magazines FOR SELECT USING (true);
CREATE POLICY "admin write magazines" ON public.magazines FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
