create extension if not exists citext;

create table users
(
  id serial primary key,
  email citext unique not null check (length(email) < 255),
  pw text not null check (length(pw) >= 6 and length(pw) < 255)
);