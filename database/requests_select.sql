-- selects

-- Afficher tous les comptes
select *
from compte;

-- Verifier si l'authentification est bonne

-- Afficher tous les types de medias
select *
from type_media;

-- Afficher tous les medias
select *
from medias;

-- Afficher les medias qui sont des images
select *
from medias, type_media
where medias.id_type = 2
and medias.id_type = type_media.id_type;

-- Afficher les medias qui sont des videos
select *
from medias, type_media
where medias.id_type = 1
and medias.id_type = type_media.id_type;

-- Afficher les medias qui sont des sons
select *
from medias, type_media
where medias.id_type = 3
and medias.id_type = type_media.id_type;

-- Afficher le chemin et le nom des medias qui sont des videos
select chemin, nom_media
from medias, type_media
where medias.id_type = 1
and medias.id_type = type_media.id_type;

-- Afficher le chemin et le nom des medias qui sont des images
select chemin, nom_media
from medias, type_media
where medias.id_type = 2
and medias.id_type = type_media.id_type;

-- Afficher le chemin et le nom des medias qui sont des sons
select chemin, nom_media
from medias, type_media
where medias.id_type = 3
and medias.id_type = type_media.id_type;
