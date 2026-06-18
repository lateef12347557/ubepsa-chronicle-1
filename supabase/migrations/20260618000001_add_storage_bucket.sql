-- Create media bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ubepsa-media', 'ubepsa-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'ubepsa-media');

-- Allow authenticated users (staff) to upload media
CREATE POLICY "Staff Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'ubepsa-media' AND (public.has_role(auth.uid(), 'admin'))
);

-- Allow authenticated users (staff) to delete media
CREATE POLICY "Staff Delete" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'ubepsa-media' AND (public.has_role(auth.uid(), 'admin'))
);
