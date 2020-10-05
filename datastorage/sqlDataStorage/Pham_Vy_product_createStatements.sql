drop database if exists productdb;
create database productdb;
use productdb;
create user if not exists 'emil'@'localhost' identified by 'NmjOH7PD';

create table product(
    productId integer not null primary key,
    name varchar(27) not null,
    model integer not null,
    amount integer not null,
    price integer not null
);
grant all privileges on productdb.* to 'emil'@'localhost';

insert into product values(1, 'Mercury', 2000, 7, 100);
insert into product values(2, 'Cosmos', 2017, 1, 300);
insert into product values(3, 'MaxEffect 2000', 2011, 100, 1500);
insert into product values(4, 'NexGen 2', 2015, 25, 499);
insert into product values(5, 'Beast II', 1995, 15, 200);
insert into product values(6, 'Future 2025', 2010, 5, 700);
insert into product values(7, 'Tako delux', 2018, 13, 2000);