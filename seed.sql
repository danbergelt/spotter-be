create extension if not exists citext;

create table users
(
  id serial primary key,
  email citext unique not null,
  pw text not null
);

create table exercises 
(
  id serial primary key,
  user_id int references users(id) not null on delete cascade,
  exercise_name citext not null,
  pr int,
  pr_date text
);

alter table exercises add constraint no_dup_exercises unique(user_id, exercise_name)