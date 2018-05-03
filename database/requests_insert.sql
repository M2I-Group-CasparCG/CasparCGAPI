-- inserts

-- Creer un compte
insert into compte (nom,prenom,pseudo,password)
values("FOTIA","Baptiste","zak","12345"),
("WAYNE","Bruce","admin","admin");

-- Creer les differents types de medias
insert into type_media (nom_type)
values("vidéos"),
("images"),
("sons");

-- Danger : Voir si possible de faire une relation entre
-- la table medias et type_media pour dire que ce media
-- sera uniquement pour "Video", "Son" ou "Image" avec
-- un select (?)

-- Creer un media image
insert into medias (id_type,nom_media,chemin,description)
values (3,"marvel","C:\Users\zak\Picture\","test");

-- Creer un media son
insert into medias (id_type,nom_media,chemin,description)
values (3,"themeThor","C:\Users\zak\Musics\","epic");

-- Creer un media video
insert into medias (id_type,nom_media,chemin,description)
values (1,"captainMarvel_cut_scene","C:\Users\zak\Videos\","secret...");
