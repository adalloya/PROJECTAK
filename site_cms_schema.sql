-- 1. Create Gallery Table
CREATE TABLE IF NOT EXISTS public.homepage_gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  image_url text NOT NULL,
  alt text,
  sort_order integer DEFAULT 0
);
ALTER TABLE public.homepage_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON public.homepage_gallery;
DROP POLICY IF EXISTS "Enable write access for all users" ON public.homepage_gallery;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.homepage_gallery;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.homepage_gallery;

CREATE POLICY "Enable read access for all users" ON public.homepage_gallery FOR SELECT USING (true);
CREATE POLICY "Enable write access for all users" ON public.homepage_gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.homepage_gallery FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.homepage_gallery FOR DELETE USING (true);

-- 2. Create Site Settings Table (For key-value configuration like About Me text)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.site_settings;
DROP POLICY IF EXISTS "Enable write access for all users" ON public.site_settings;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.site_settings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.site_settings;

CREATE POLICY "Enable read access for all users" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Enable write access for all users" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.site_settings FOR DELETE USING (true);

-- 3. Create Destinations Table
CREATE TABLE IF NOT EXISTS public.destinations (
  slug text PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  hero_image text NOT NULL,
  overview text NOT NULL,
  highlights jsonb DEFAULT '[]'::jsonb NOT NULL,
  must_dos jsonb DEFAULT '[]'::jsonb NOT NULL,
  tips jsonb DEFAULT '[]'::jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.destinations;
DROP POLICY IF EXISTS "Enable write access for all users" ON public.destinations;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.destinations;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.destinations;

CREATE POLICY "Enable read access for all users" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Enable write access for all users" ON public.destinations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.destinations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.destinations FOR DELETE USING (true);

-- 4. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  date text NOT NULL,
  read_time text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable write access for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.blog_posts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.blog_posts;

CREATE POLICY "Enable read access for all users" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Enable write access for all users" ON public.blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.blog_posts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.blog_posts FOR DELETE USING (true);

-- 5. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Gallery
DROP POLICY IF EXISTS "Public Access Gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Gallery" ON storage.objects;

CREATE POLICY "Public Access Gallery" ON storage.objects FOR select USING ( bucket_id = 'gallery' );
CREATE POLICY "Public Upload Gallery" ON storage.objects FOR insert WITH check ( bucket_id = 'gallery' );
CREATE POLICY "Public Update Gallery" ON storage.objects FOR update WITH check ( bucket_id = 'gallery' );
CREATE POLICY "Public Delete Gallery" ON storage.objects FOR delete USING ( bucket_id = 'gallery' );

-- Storage Policies for Blog
DROP POLICY IF EXISTS "Public Access Blog" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Blog" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Blog" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Blog" ON storage.objects;

CREATE POLICY "Public Access Blog" ON storage.objects FOR select USING ( bucket_id = 'blog' );
CREATE POLICY "Public Upload Blog" ON storage.objects FOR insert WITH check ( bucket_id = 'blog' );
CREATE POLICY "Public Update Blog" ON storage.objects FOR update WITH check ( bucket_id = 'blog' );
CREATE POLICY "Public Delete Blog" ON storage.objects FOR delete USING ( bucket_id = 'blog' );
