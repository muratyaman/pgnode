create table tbl_test (
  id int,
  name text,
  ts timestamptz,
  info json,
  primary key(id)
);

insert into tbl_test values (1, 'murat', now(), '{"a": "11", "b": "21"}');

insert into tbl_test values (2, 'yaman', now(), '{"a": "12", "b": "22"}');

