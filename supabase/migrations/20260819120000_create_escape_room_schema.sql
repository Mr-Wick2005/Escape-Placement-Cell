-- ============================================================================
-- Escape Room Game — Supabase Schema + RLS
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Profiles
create table public.profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  email text,
  display_name text,
  created_at timestamptz default now()
);

-- 2. Game Sessions
create table public.game_sessions (
  session_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  current_room int default 1 check (current_room between 1 and 3),
  keys_collected jsonb default '{"keyA":false,"keyB":false,"keyC":false}'::jsonb,
  rooms_completed jsonb default '{"classroom":false,"codingLab":false,"interviewRoom":false}'::jsonb,
  status text default 'in_progress' check (status in ('in_progress','completed','abandoned')),
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  questions jsonb
);

-- 3. Aptitude Attempts
create table public.aptitude_attempts (
  attempt_id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(session_id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  score int not null,
  correct_count int not null,
  total_questions int not null,
  passed boolean not null,
  questions jsonb not null,
  user_answers jsonb not null,
  created_at timestamptz default now()
);

-- 4. Coding Attempts
create table public.coding_attempts (
  attempt_id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(session_id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  language text not null,
  passed boolean not null,
  public_test_results jsonb not null,
  hidden_test_results jsonb not null,
  submitted_code text not null,
  created_at timestamptz default now()
);

-- 5. Interview Attempts
create table public.interview_attempts (
  attempt_id uuid primary key default gen_random_uuid(),
  session_id uuid references public.game_sessions(session_id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  score int not null,
  total_questions int not null,
  passed boolean not null,
  questions jsonb not null,
  answers jsonb not null,
  ai_analysis jsonb,
  created_at timestamptz default now()
);

-- 6. Leaderboard View
create view public.leaderboard as
select
  p.user_id,
  p.email,
  p.display_name,
  count(distinct s.session_id) as games_played,
  sum(case when a.passed then 1 else 0 end) as aptitude_passes,
  sum(case when c.passed then 1 else 0 end) as coding_passes,
  sum(case when i.passed then 1 else 0 end) as interview_passes,
  avg(
    case when a.passed then 100 else 0 end +
    case when c.passed then 100 else 0 end +
    (i.score::float / nullif(i.total_questions,0)) * 100
  ) as avg_overall_score
from public.profiles p
left join public.game_sessions s on s.user_id = p.user_id
left join public.aptitude_attempts a on a.user_id = p.user_id
left join public.coding_attempts c on c.user_id = p.user_id
left join public.interview_attempts i on i.user_id = p.user_id
group by p.user_id, p.email, p.display_name;

-- ============================================================================
-- Enable RLS
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.game_sessions enable row level security;
alter table public.aptitude_attempts enable row level security;
alter table public.coding_attempts enable row level security;
alter table public.interview_attempts enable row level security;

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);

-- Game Sessions
create policy "Users can view own sessions" on public.game_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.game_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.game_sessions for update using (auth.uid() = user_id);

-- Aptitude Attempts
create policy "Users can view own aptitude attempts" on public.aptitude_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own aptitude attempts" on public.aptitude_attempts for insert with check (auth.uid() = user_id);

-- Coding Attempts
create policy "Users can view own coding attempts" on public.coding_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own coding attempts" on public.coding_attempts for insert with check (auth.uid() = user_id);

-- Interview Attempts
create policy "Users can view own interview attempts" on public.interview_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own interview attempts" on public.interview_attempts for insert with check (auth.uid() = user_id);

-- ============================================================================
-- Auto-create profile on signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
