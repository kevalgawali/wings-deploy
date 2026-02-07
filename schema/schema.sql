create table events(
event_id serial primary key,
event_name varchar(50) unique not null,
is_team_event boolean default true not null,
registration_status boolean default true not null
);

create table utr_number(
utr_id serial primary key,
utr varchar(12) not null unique,
status boolean default false
);

-- Global settings table for viewer registration status and other settings
create table settings(
  setting_key varchar(50) primary key,
  setting_value varchar(255) not null,
  updated_at timestamp with time zone default now()
);

-- Insert default setting for viewer registration
insert into settings(setting_key, setting_value) values('viewer_registration_status', 'open');

create table registrations(
registration_id serial primary key,
leader_name varchar(50) not null,
college varchar(200) not null,
gender varchar(6) not null check (gender in ('M','F','O')),
email varchar(320) not null unique,
branch varchar(50) not null,
phone_no varchar(50) not null,
team_name varchar(50),
event_id int,
rank int default null,
utr_id int,
foreign key (utr_id) references utr_number(utr_id),
foreign key (event_id) references events(event_id) on delete cascade
);


create table team_members(
participant_id serial primary key,
participant_name varchar(50) not null,
gender varchar(6) not null check (gender in ('M','F','O')),
phone_no varchar(50) not null,
team_id int,
foreign key (team_id) references registrations(registration_id) on delete cascade
);

create table admin(
admin_id serial primary key,
username varchar(20) not null unique,
password varchar(60) not null,
role varchar(25) not null,
event_id int,
foreign key (event_id) references events(event_id)
);


--inserting default values
insert into events(event_name) values('Ode To Code');
insert into events(event_name) values('Doctor Fix It');
insert into events(event_name,is_team_event) values('Code Vibes',true);
insert into events(event_name,is_team_event) values('Room 404',true);
insert into events(event_name,is_team_event) values('Dronix',true);
insert into events(event_name,is_team_event) values('Innovex',true);
insert into events(event_name,is_team_event) values('Robo Race',true);
insert into events(event_name,is_team_event) values('Line Follower',true);
insert into events(event_name,is_team_event) values('Robo Soccer',true);
insert into events(event_name,is_team_event) values('Robo Sumo',true);
insert into events(event_name,is_team_event) values('E Arena Championship (BGMI)',true);
insert into events(event_name,is_team_event) values('E Arena Championship (Free Fire)',true);
insert into events(event_name,is_team_event) values('Cade Clash',true);
insert into events(event_name,is_team_event) values('Mechathon',true);
insert into events(event_name,is_team_event) values('Bridge It',true);
insert into events(event_name,is_team_event) values('Quiz O Mania',true);

insert into admin(username,password,role) values('super','$2b$10$FaAwYrBBQmWAMXm0/I6oo.Ke2I8tfQ3a/tKso4amR9nwS6fDRQzQy','Super Admin');

-- Developer accounts table (separate from admin, for query tool access)
create table developers(
  dev_id serial primary key,
  username varchar(50) not null unique,
  password varchar(60) not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

-- Default developer account (password: dev@wings2026)
insert into developers(username, password) values('developer', '$2b$10$BqCTHXmOoCeVSSTYB.9qCu7oNY2xCPGJumHlMyPTovBf4lU3azTvW');

-- Viewer registrations table (payment_status uses utr_number.status as reference)
create table viewer_registrations(
  id serial primary key,
  registration_id varchar(20) unique,
  name varchar(100) not null,
  college_name varchar(200) not null,
  utr_id int,
  created_at timestamp with time zone default now(),
  foreign key (utr_id) references utr_number(utr_id)
);

