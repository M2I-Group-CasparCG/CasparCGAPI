-- Creation des tables
create table if not exists compte(
  id_compte integer primary key autoincrement,
  nom varchar(35) not null,
  prenom varchar(35) not null,
  pseudo varchar(35) not null,
  password varchar(45) not null
);

create table if not exists type_media(
  id_type integer primary key autoincrement,
  nom_type varchar(40) not null
);

create table if not exists medias(
  id_media integer primary key autoincrement,
  id_type int not null,
  nom_media varchar(40) not null,
  chemin varchar(100) not null,
  description varchar(200),
  foreign key (id_type) references type_media(id_type)
);
