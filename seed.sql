create extension if not exists citext;

drop domain if exists ts;
create domain ts as timestamptz not null default now();

create or replace function set_timestamp() returns trigger as $
begin
  new.updated_at = now();
  return new;
end;
$ language plpgsql;

create trigger if not exists users_set_timestamp
before update on users for each row execute procedure set_timestamp();

create table users
(
  id serial primary key,
  email citext unique not null,
  password text not null,
  created_at ts,
  updated_at ts
);

-- create trigger if not exists exercises_set_timestamp
-- before update on exercises for each row execute procedure set_timestamp();

-- create table exercises 
-- (
--   id serial primary key,
--   user_id int references users(id) not null on delete cascade,
--   exercise_name citext not null,
--   pr int,
--   pr_date text,
--   created_at timestamptz not null default now(),
--   updated_at timestamptz not null default now()
-- );

-- alter table exercises add constraint no_dup_exercises unique(user_id, exercise_name)