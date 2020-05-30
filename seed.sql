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
  user int references users(id) not null,
  exercise_name citext not null,
  pr int,
  prDate text
);

create unique index exercise_name_idx on exercises (user, exercise_name);