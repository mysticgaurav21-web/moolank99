-- Moolank99 / EVOLVE database foundation
-- Safe, additive migration for Supabase Postgres.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  preferred_name text,
  language_code text not null default 'en',
  country_code text,
  timezone text not null default 'Asia/Kolkata',
  onboarding_status text not null default 'pending' check (onboarding_status in ('pending','in_progress','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.personal_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.user_profiles(id) on delete cascade,
  profile_type text not null default 'self' check (profile_type in ('self','family','partner','friend','child','client')),
  name text not null,
  date_of_birth date not null,
  birth_time time,
  birth_place text,
  gender text,
  language_code text not null default 'en',
  is_primary boolean not null default false,
  consent_status text not null default 'owner_confirmed' check (consent_status in ('owner_confirmed','pending','granted','revoked','not_required')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists personal_profiles_one_primary_per_owner
  on public.personal_profiles(owner_user_id)
  where is_primary = true;

create table if not exists public.birth_blueprints (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.personal_profiles(id) on delete cascade,
  calculation_version text not null default 'chaldean-v1.0',
  moolank smallint not null check (moolank between 1 and 9),
  bhagyank smallint not null check (bhagyank between 1 and 9),
  namank smallint not null check (namank between 1 and 9),
  namank_compound integer,
  birth_day_compound integer,
  life_path_compound integer,
  calculated_name text,
  calculated_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists birth_blueprints_one_active_per_profile
  on public.birth_blueprints(profile_id)
  where is_active = true;

create table if not exists public.number_definitions (
  id uuid primary key default gen_random_uuid(),
  system_type text not null check (system_type in ('moolank','bhagyank','namank','personal_year','personal_month','personal_day')),
  number_value smallint not null check (number_value between 1 and 9),
  title text not null,
  archetype text,
  ruling_planet text,
  short_summary text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  version integer not null default 1,
  language_code text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(system_type, number_value, version, language_code)
);

create table if not exists public.number_section_content (
  id uuid primary key default gen_random_uuid(),
  number_definition_id uuid not null references public.number_definitions(id) on delete cascade,
  section_key text not null,
  content_json jsonb not null default '{}'::jsonb,
  evidence_class text not null default 'traditional_wisdom' check (evidence_class in ('traditional_wisdom','behavioural_science','reflective_practice','internal_framework','user_experience','mixed')),
  review_status text not null default 'draft' check (review_status in ('draft','review','approved','published','archived')),
  version integer not null default 1,
  language_code text not null default 'en',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(number_definition_id, section_key, version, language_code)
);

create table if not exists public.knowledge_nodes (
  id uuid primary key default gen_random_uuid(),
  node_code text not null unique,
  node_name text not null,
  domain_key text not null,
  module_key text,
  node_type text not null,
  stability_type text not null default 'adaptive' check (stability_type in ('stable','adaptive','dynamic')),
  definition text not null,
  deep_meaning text,
  why_it_matters text,
  positive_expression text,
  shadow_expression text,
  evidence_class text not null default 'internal_framework' check (evidence_class in ('traditional_wisdom','behavioural_science','reflective_practice','internal_framework','user_experience','mixed')),
  confidence_level text not null default 'medium' check (confidence_level in ('low','medium','high')),
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  version integer not null default 1,
  language_code text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_relationships (
  id uuid primary key default gen_random_uuid(),
  source_node_id uuid not null references public.knowledge_nodes(id) on delete cascade,
  target_node_id uuid not null references public.knowledge_nodes(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('supports','conflicts_with','develops','influences','requires','balances','often_coexists_with','transforms_into')),
  strength numeric(4,3) not null default 0.500 check (strength between 0 and 1),
  directional boolean not null default true,
  explanation text,
  created_at timestamptz not null default now(),
  unique(source_node_id, target_node_id, relationship_type)
);

create table if not exists public.blueprint_node_mappings (
  id uuid primary key default gen_random_uuid(),
  system_type text not null check (system_type in ('moolank','bhagyank','namank')),
  number_value smallint not null check (number_value between 1 and 9),
  knowledge_node_id uuid not null references public.knowledge_nodes(id) on delete cascade,
  expression_type text not null check (expression_type in ('natural_tendency','supportive_strength','possible_growth_edge','stress_expression','development_path')),
  weight numeric(4,3) not null default 0.500 check (weight between 0 and 1),
  context_conditions jsonb,
  source_note text,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  unique(system_type, number_value, knowledge_node_id, expression_type, version)
);

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.personal_profiles(id) on delete cascade,
  checkin_date date not null default current_date,
  mood_score smallint not null check (mood_score between 1 and 5),
  energy_score smallint not null check (energy_score between 1 and 5),
  stress_score smallint not null check (stress_score between 1 and 5),
  focus_score smallint not null check (focus_score between 1 and 5),
  sleep_quality smallint not null check (sleep_quality between 1 and 5),
  sleep_hours numeric(4,2) check (sleep_hours is null or (sleep_hours between 0 and 24)),
  primary_challenge text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(profile_id, checkin_date)
);

create table if not exists public.human_state_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.personal_profiles(id) on delete cascade,
  snapshot_date date not null default current_date,
  state_version text not null default 'hse-v1.0',
  overall_state jsonb not null default '{}'::jsonb,
  priority_needs jsonb not null default '[]'::jsonb,
  supportive_strengths jsonb not null default '[]'::jsonb,
  risk_flags jsonb not null default '[]'::jsonb,
  generated_by text not null default 'rules' check (generated_by in ('rules','ai','rules_plus_ai','manual')),
  user_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(profile_id, snapshot_date, state_version)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.personal_profiles(id) on delete cascade,
  title text not null,
  goal_domain text not null,
  desired_identity text,
  success_definition text,
  target_date date,
  status text not null default 'active' check (status in ('draft','active','paused','completed','archived')),
  priority smallint not null default 3 check (priority between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transformation_plans (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.personal_profiles(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  plan_type text not null check (plan_type in ('7_day','21_day','41_day','90_day','365_day','custom')),
  title text not null,
  start_date date not null,
  end_date date not null,
  focus_node_ids uuid[] not null default '{}',
  plan_json jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','active','paused','completed','cancelled')),
  generation_source text not null default 'rules_plus_ai' check (generation_source in ('rules','ai','rules_plus_ai','manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.practice_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.personal_profiles(id) on delete cascade,
  transformation_plan_id uuid references public.transformation_plans(id) on delete set null,
  practice_code text not null,
  completed_at timestamptz not null default now(),
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  pre_state jsonb,
  post_state jsonb,
  difficulty_score smallint check (difficulty_score is null or difficulty_score between 1 and 5),
  benefit_score smallint check (benefit_score is null or benefit_score between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_personal_profiles_owner on public.personal_profiles(owner_user_id);
create index if not exists idx_birth_blueprints_profile on public.birth_blueprints(profile_id);
create index if not exists idx_daily_checkins_profile_date on public.daily_checkins(profile_id, checkin_date desc);
create index if not exists idx_human_state_profile_date on public.human_state_snapshots(profile_id, snapshot_date desc);
create index if not exists idx_goals_profile_status on public.goals(profile_id, status);
create index if not exists idx_plans_profile_status on public.transformation_plans(profile_id, status);
create index if not exists idx_practice_logs_profile_completed on public.practice_logs(profile_id, completed_at desc);

create trigger set_user_profiles_updated_at before update on public.user_profiles for each row execute function public.set_updated_at();
create trigger set_personal_profiles_updated_at before update on public.personal_profiles for each row execute function public.set_updated_at();
create trigger set_number_definitions_updated_at before update on public.number_definitions for each row execute function public.set_updated_at();
create trigger set_number_section_content_updated_at before update on public.number_section_content for each row execute function public.set_updated_at();
create trigger set_knowledge_nodes_updated_at before update on public.knowledge_nodes for each row execute function public.set_updated_at();
create trigger set_daily_checkins_updated_at before update on public.daily_checkins for each row execute function public.set_updated_at();
create trigger set_goals_updated_at before update on public.goals for each row execute function public.set_updated_at();
create trigger set_transformation_plans_updated_at before update on public.transformation_plans for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.personal_profiles enable row level security;
alter table public.birth_blueprints enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.human_state_snapshots enable row level security;
alter table public.goals enable row level security;
alter table public.transformation_plans enable row level security;
alter table public.practice_logs enable row level security;

create policy "Users manage their own user profile"
on public.user_profiles for all
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

create policy "Users manage owned personal profiles"
on public.personal_profiles for all
using (owner_user_id in (select id from public.user_profiles where auth_user_id = auth.uid()))
with check (owner_user_id in (select id from public.user_profiles where auth_user_id = auth.uid()));

create policy "Users manage owned blueprints"
on public.birth_blueprints for all
using (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
))
with check (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
));

create policy "Users manage owned checkins"
on public.daily_checkins for all
using (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
))
with check (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
));

create policy "Users manage owned state snapshots"
on public.human_state_snapshots for all
using (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
))
with check (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
));

create policy "Users manage owned goals"
on public.goals for all
using (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
))
with check (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
));

create policy "Users manage owned plans"
on public.transformation_plans for all
using (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
))
with check (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
));

create policy "Users manage owned practice logs"
on public.practice_logs for all
using (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
))
with check (profile_id in (
  select pp.id from public.personal_profiles pp
  join public.user_profiles up on up.id = pp.owner_user_id
  where up.auth_user_id = auth.uid()
));

-- Published knowledge is readable by authenticated and anonymous clients.
alter table public.number_definitions enable row level security;
alter table public.number_section_content enable row level security;
alter table public.knowledge_nodes enable row level security;
alter table public.knowledge_relationships enable row level security;
alter table public.blueprint_node_mappings enable row level security;

create policy "Published number definitions are readable"
on public.number_definitions for select using (status = 'published');

create policy "Published number sections are readable"
on public.number_section_content for select using (review_status = 'published');

create policy "Published knowledge nodes are readable"
on public.knowledge_nodes for select using (status = 'published');

create policy "Knowledge relationships are readable"
on public.knowledge_relationships for select using (true);

create policy "Blueprint mappings are readable"
on public.blueprint_node_mappings for select using (true);
