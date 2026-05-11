INSERT INTO storage.buckets (id, name, public) VALUES ('ubepsa-media', 'ubepsa-media', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read ubepsa-media" ON storage.objects FOR SELECT USING (bucket_id = 'ubepsa-media');
CREATE POLICY "admin upload ubepsa-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ubepsa-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update ubepsa-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ubepsa-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete ubepsa-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ubepsa-media' AND public.has_role(auth.uid(), 'admin'));