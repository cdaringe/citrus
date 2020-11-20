create table citrus.public.fruits(
  id serial,
  name varchar(100) not null,
  tastes varchar(100)
);

insert into fruits (name, tastes) values
  ('strawberry','great'),
  ('apple', 'ok'),
  ('orange', 'freakin great');
