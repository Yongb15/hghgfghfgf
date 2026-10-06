create table public.posts (
  id bigint generated always as identity primary key,
  author text not null check (char_length(btrim(author)) between 1 and 30),
  title text not null check (char_length(btrim(title)) between 1 and 100),
  content text not null check (char_length(btrim(content)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index posts_created_at_idx on public.posts (created_at desc);

alter table public.posts enable row level security;

revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert (author, title, content) on public.posts to anon, authenticated;

create policy "Anyone can read posts"
  on public.posts for select
  to anon, authenticated
  using (true);

create policy "Anyone can create posts"
  on public.posts for insert
  to anon, authenticated
  with check (true);
