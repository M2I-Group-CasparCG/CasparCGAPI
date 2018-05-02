-- Creation des tables
create table if not exists compte(
  id_compte int auto_increment primary key,
  nom varchar(35) not null,
  prenom varchar(35) not null,
  pseudo varchar(35) not null,
  password varchar(45) not null
);

create table if not exists type_media(
  id_type int auto_increment primary key,
  nom_type varchar(40) not null
);

create table if not exists medias(
  id_media int auto_increment primary key,
  id_type int not null,
  nom_media varchar(40) not null,
  chemin varchar(100) not null,
  description varchar(200),
  foreign key (id_type) references type_media(id_type)
);
