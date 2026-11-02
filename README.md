# BostonSolux – Refonte

Maquette HTML/CSS/JS (vanilla, sans build) de la refonte de [bostonsolux.com](https://bostonsolux.com/), destinée à être intégrée ensuite comme thème WordPress.

## Prévisualiser la maquette

- **Le plus simple** : ouvrir `index.html` dans un navigateur (double-clic).
- **Avec un petit serveur local** (recommandé pour tester comme en ligne) :
  ```bash
  python3 -m http.server 8000
  ```
  puis ouvrir http://localhost:8000.

Une connexion Internet est nécessaire pour charger les polices Archivo et JetBrains Mono (Google Fonts). Sans connexion, le site s'affiche avec des polices de secours.

## Version française

Le site existe en anglais (racine du dossier) et en français (dossier `fr/`). Le menu de langue de la barre du haut (icône globe) renvoie vers la même page dans l'autre langue, et chaque page déclare son équivalent avec `<link rel="alternate" hreflang>`.

- Les noms des services reprennent ceux de la version française du site actuel (« Conception et mise en place de réseaux », « Monétique », « Gestion de projet »…).
- Les messages d'erreur des formulaires suivent la langue de la page.
- Dans WordPress, la traduction sera gérée par WPML ou Polylang : les pages de `fr/` servent de référence pour les textes.

## Modifier la maquette

Les pages HTML sont **générées** à partir du dossier `src/`, pour que le header, le footer et les blocs partagés restent identiques sur les 18 pages :

```
src/_head.html              <head> commun
src/_world-dots.html        continents de la carte du monde (généré, voir plus bas)
src/en/  et  src/fr/        _header.html, _footer.html, blocs partagés (_offices, _partners, _world-map, _location)
src/<langue>/pages/*.html   contenu principal de chaque page
```

Après une modification dans `src/`, lancer :

```bash
python3 tools/build.py
```

Les fichiers générés sont commités : la maquette s'ouvre toujours directement dans un navigateur, sans étape de build. Le CSS (`assets/css/main.css`) et le JS (`assets/js/main.js`) se modifient directement.

La carte du monde en points est produite une fois pour toutes par `tools/world_map.py`, à partir des contours des continents de Natural Earth (domaine public). Il n'y a à le relancer que pour changer le cadrage ou la densité des points ; le mode d'emploi est en tête du script. Il affiche aussi la position de chaque bureau, à reporter sur les repères de `src/<langue>/_world-map.html`.

## Pages

| Page | Contenu |
|---|---|
| `index.html` | Accueil : hero avec diaporama, à propos, expertise, explorateur des solutions, CyberSecurity Center, Power Training, étude de cas MMIE, interviews, actualités, bureaux, appel à l'action, partenaires |
| `services.html` | Les 12 services en 4 domaines, avec navigation par domaine |
| `service-detail.html` | Modèle de page service, rempli avec **Digital Transformation** (le contenu le plus riche du site actuel) |
| `solutions.html` | Les 6 produits, avec leur public et leurs fonctions clés |
| `solution-detail.html` | Modèle de page solution, rempli avec **Bsecured Park** et sa référence MMIE |
| `about.html` | Présentation, forces, présence en Afrique, dates clés, mot du CEO, partenaires, bureaux |
| `contact.html` | Formulaire validé en JS (aucun envoi), contacts par équipe, carte Google du bureau de Kpogan, bureaux |
| `news.html` | Article à la une, archive des actualités, interviews |
| `careers.html` | Les 14 postes groupés par famille, parcours d'Emmanuel Amou, formulaire de candidature avec CV |

Chaque page existe aussi en français dans `fr/` (même nom de fichier).

Toutes les pages partagent exactement le même header et le même footer. Seul change le marquage de la page courante dans le menu (`aria-current`), que WordPress ajoutera lui-même.

## Direction artistique

Inspirée du site de [The IT Foundation](https://the-itf.com/) (grande typographie élargie, étiquettes en monospace, grilles à filets, animations orchestrées), adaptée à l'identité BostonSolux : le rouge de la marque reste la seule couleur d'accent. À la demande du client, le site est **majoritairement blanc** : barre du haut, header, sections, pages intérieures et pied de page sont clairs ; le noir est réservé au hero photo de l'accueil, au panneau de la carte du monde, à l'appel à l'action final et à trois bandeaux des pages intérieures.

- **Couleurs** (tokens dans `:root`, au début de `assets/css/main.css`) :
  - blanc et papier `#F4F3F0` (et `#EBE9E4` en alternance) pour la barre du haut, le header, les sections, les pages intérieures (avec une fine grille grise) et le pied de page ;
  - encre `#141112` pour les rares blocs sombres (appel à l'action, carte du monde, bandeaux), avec une **fine grille** de 84 px ;
  - **rouge BostonSolux `#8C2826`** pour les boutons, liens et petits repères ; sur fond sombre, une version éclaircie `#E0554A` (contraste AA) pour les étiquettes, les carrés et les repères de la carte. Le rouge ne remplit jamais de grands aplats.
- **Typographie** : **Archivo** (police variable en largeur) pour tout le site, en version **élargie et très grasse** pour les titres (hero en capitales), et **JetBrains Mono** en petites capitales espacées pour les étiquettes, numéros, dates et légendes. Les deux viennent de Google Fonts.
- **Coins carrés partout**, sections bord à bord, cartes séparées par des filets (grilles à bordures partagées).
- **Étiquettes de section** : `01 ■ À PROPOS`, numéro, carré rouge, libellé en monospace, au-dessus de chaque titre de l'accueil.
- **Logo d'origine**, sans aucune modification, dans le header, le pied de page et le loader de chaque page.
- **Header blanc** sous une fine barre du haut claire : logo, menu centré (un petit carré rouge marque la page courante et apparaît au survol), bouton « Contact us » à flèche. Il **se cache quand on descend** et **réapparaît dès qu'on remonte**, avec un fond flouté. Les éléments collants (navigation par domaine de la page Services, colonnes fixes) suivent sa position.
- **Menu mobile** plein écran, blanc, liens numérotés en grands caractères qui montent l'un après l'autre ; burger carré rouge.
- **Boutons** : le bouton principal porte une case flèche à droite ; au survol, son remplissage envahit tout le bouton et la flèche sort puis revient. Les boutons secondaires se remplissent depuis le bas. Les liens texte ont un soulignement qui part vers la droite et se redessine.

### Accueil, section par section

1. **Hero** (version précédente, rétablie à la demande du client) : photo bord à bord sous le header blanc, **diaporama de 5 images** (ministère des Mines à Malabo et 4 photos libres de droits) sous un voile sombre, texte blanc aligné à gauche (surtitre, grand titre, sous-titre, deux boutons). Toutes les 6 secondes, l'image suivante glisse depuis la droite ; la barre du bas affiche la légende de la photo, des traits pour choisir une image et un bouton pause (obligatoire pour l'accessibilité). En mouvement réduit, les images changent en fondu.
2. **À propos** : titre, photo du bâtiment, texte et les trois forces numérotées.
3. **Domaines d'expertise** : grille de 4 cartes à filets (icône dans un carré noir, numéro, titre, liste des services). Au survol, la carte se remplit d'encre depuis le bas.
4. **Nos solutions** : sur fond blanc, liste des 6 produits en très grands caractères, un seul ouvert à la fois (public visé, phrase, lien) ; à droite, un panneau collant où l'**icône du produit se dessine** trait par trait, avec un compteur `01 / 06`. Sans JavaScript, tous les produits restent ouverts.
5. **CyberSecurity Center** : présentation collante à gauche (texte, image, bouton), liste numérotée des 5 prestations à droite, dont les filets se tracent à l'apparition.
6. **Power Training** : image et texte, bouton vers l'Academy.
7. **Étude de cas MMIE** : grande photo, fiche Client / Enjeu / Solution / Résultat.
8. **Interviews** : grille à filets, portraits carrés en noir et blanc (couleur au survol), citation, nom, fonction.
9. **Actualités** : 3 cartes avec date en monospace.
10. **Bureaux** : carte du monde dans un panneau sombre, puis grille des 7 bureaux (le siège en carte sombre).
11. **Appel à l'action** : très grand titre « Let's talk about your project. », boutons, mention PMO.
12. **Partenaires** : bande blanche de logos en couleur qui défile, juste avant le footer.

**Pages intérieures** : même header et même footer ; hero clair à fine grille grise avec fil d'Ariane en monospace, grand titre élargi et, quand il n'y a pas de photo, deux blocs (un blanc, un carré rouge) qui poussent à droite. Les cartes de services passent du noir et blanc à la couleur au survol.

**Footer** clair : logo d'origine, colonnes avec titres en monospace, puis le mot **« BostonSolux » en très grand** sur toute la largeur, dans un gris très léger (ses lettres montent une à une ; au survol, elles prennent les couleurs du logo : B et S foncés, le reste en rouge), et le copyright.

**Bouton « retour en haut »** (toutes les pages), sur le modèle du bouton flottant de [reinvent-labs.com](https://www.reinvent-labs.com/) : un rond en bas à droite, anneau rouge, disque blanc avec une flèche, ombre portée et halo qui pulse doucement toutes les 3 secondes. Il apparaît après 600 px de défilement, grossit légèrement au survol et remonte en douceur en haut de la page.

### Animations

- **Loader (rideau de page)** : à chaque ouverture ou actualisation d'une page, l'écran est couvert de cinq colonnes blanches portant le **logo BostonSolux** et un trait rouge qui se remplit comme une barre de chargement ; le logo s'efface vers le haut, puis les colonnes se lèvent l'une après l'autre (environ 1,4 s en tout). Quand on suit un lien interne, les colonnes remontent pour couvrir la page, le logo réapparaît, et la page suivante s'ouvre sur ce même logo : la transition est continue. L'arrivée est en CSS pur : la page s'affiche toujours, même sans JavaScript.
- **Hero** : le contenu monte en séquence une fois le rideau levé, léger zoom sur la photo affichée, images qui glissent, légende qui change en fondu.
- **Titres de section** : les mots montent depuis un masque quand le titre entre à l'écran.
- **Apparitions au défilement** : textes et cartes qui montent en cascade, photos qui s'ouvrent depuis le bas en se posant, filets qui se tracent.
- **Survols** : cartes qui se remplissent d'encre, icônes qui pivotent, photos qui reprennent leurs couleurs, flèches qui glissent.
- Carte du monde (arcs, repères, pulsation), bande des partenaires en continu (pause au survol), barre rouge de progression de lecture, halo du bouton « retour en haut ».
- **Mouvement réduit** : si le visiteur l'a demandé, pas de loader, pas de halo, rien ne glisse ; le contenu s'affiche directement.

- **Carte du monde des 7 bureaux** (accueil, page À propos) : continents dessinés en points (projection Miller) dans un panneau sombre, chaque bureau placé à ses coordonnées réelles, arcs depuis le siège de Rockville, chiffres clés (7 bureaux, 7 pays, 3 continents) et légende. Survoler ou parcourir au clavier la fiche d'un bureau allume son repère, son nom et son arc sur la carte. Quand la carte dispose de moins de 900 px de large, elle zoome sur l'Atlantique pour que les bureaux restent lisibles.
- **Carte Google du bureau de Lomé (Kpogan)** : uniquement sur la page Contact, dans sa propre section juste après le formulaire (« Visit us »), chargée en différé, dans la langue de la page.
- **Regroupement des services** en 4 domaines : Infrastructure & Networks, Security & Continuity, Business Applications, Consulting & Transformation.

## Favicon

Monogramme « BS » bordeaux (`#8C2826`) sur carré blanc (Plus Jakarta Sans ExtraBold, lettres vectorisées, police de la maquette précédente), dans `assets/img/favicon/` :

| Fichier | Usage |
|---|---|
| `favicon.svg` | navigateurs récents, net à toutes les tailles (fichier source) |
| `favicon.ico` | anciens navigateurs (16, 32 et 48 px) |
| `apple-touch-icon.png` | icône d'écran d'accueil iPhone et iPad (180 px, carré plein : iOS arrondit lui-même) |
| `icon-512.png` | à charger dans WordPress (Apparence › Personnaliser › Identité du site › Icône du site), qui génère lui-même toutes les tailles |

La barre du navigateur mobile prend la couleur de la barre du haut (`theme-color` `#F4F3F0`).

## Organisation du code (pensée pour WordPress)

- Header et footer délimités par des commentaires `header.php` / `footer.php` dans le HTML.
- Une section = un bloc autonome `<section class="section-xxx">`.
- Classes BEM, aucun style ni script inline. JS unique, chargé en `defer` : `assets/js/main.js`.
- Contenus répétitifs (services, solutions, interviews, actualités, bureaux) : structure HTML identique d'un élément à l'autre, prête pour des boucles WordPress.
- Navigation complète à partir de 1024 px, menu burger en dessous.

## Images

`contenu/images/` ne contenait que le logo. Les autres images ont été **téléchargées depuis le site actuel** et converties en WebP dans `assets/img/` :

- `assets/img/services/` : une image par service
- `assets/img/people/` : portraits des interviews
- `assets/img/news/` : visuels des actualités
- `assets/img/about-building.webp` : photo du bâtiment recadrée depuis la plaquette `company-presentation.webp`
- `assets/img/partners/` : logos partenaires **en couleur**, détourés sur fond transparent et recadrés au plus près pour une bande homogène. Les logos blancs posés sur une pastille de couleur (Oracle, Infor, Odoo, Bluehost) ont pris la couleur de leur pastille. Les fichiers d'origine sont de petite taille : des logos officiels en haute définition (SVG) seraient plus nets sur écran Retina.
- `assets/img/banners/` : anciennes images de carrousel (non utilisées sur l'accueil)

## Crédits photo du hero

À la demande du client, 4 images du diaporama de l'accueil ne viennent pas du site actuel. Ce sont des photos Unsplash, sous licence Unsplash (usage commercial gratuit, sans attribution obligatoire) :

| Fichier | Photo Unsplash |
|---|---|
| `assets/img/hero/data-center.webp` | `photo-1558494949-ef010cbdcc31` |
| `assets/img/hero/consulting-team.webp` | `photo-1531482615713-2afd69097998` |
| `assets/img/hero/network-cabling.webp` | `photo-1544197150-b99a580bb7a8` |
| `assets/img/hero/client-partnership.webp` | `photo-1600880292203-757bb62b4baf` |

Elles peuvent être remplacées à tout moment par des photos propres à BostonSolux (bureaux, équipes, projets).

## Éléments `[À COMPLÉTER]` / à valider

### Contenus
- [ ] **Siège** : la fiche Google Maps s'intitule « BostonSolux Siege - Kpogan », alors que le site présente Rockville comme siège. Le bloc de la carte parle donc de « bureau de Lomé, Kpogan ». À clarifier (siège Afrique ?).
- [ ] **Carte Google et cookies** : la carte intégrée dépose des cookies Google. Selon la politique de confidentialité retenue (RGPD pour le bureau de Paris), WordPress pourra la charger seulement après consentement.
- [ ] **Hero de l'accueil** : titre (« Speed and efficiency to better serve our partners. », d'après le slogan) et sous-titre repris de la maquette fournie, à valider. Les légendes des 4 photos libres de droits indiquent seulement le domaine d'expertise illustré. Le titre utilise désormais la police du site (Archivo) au lieu de Plus Jakarta Sans.
- [ ] **URL de l'Academy** : le CLAUDE.md indique https://bostonsoluxacademy.com/, mais la page Power Training du site actuel mentionne https://bostonsoluxedu.com/. Laquelle est la bonne ?
- [ ] **Page ERP & PLM du site actuel** : elle affiche par erreur le texte de Network Security. Le texte réellement consacré à l'ERP se trouve sur la page Project Management ; c'est lui qui a été utilisé pour ERP & PLM.
- [ ] **Project Management** : sans texte propre sur le site actuel, la description reprend l'article « BostonSolux PMO: Center of Excellence ».
- [ ] **Adresse de Conakry** : le CLAUDE.md indique « Sonoco Trade Center, Office 175 », mais la page Contact du site actuel indique « ALMAMYA I, Commune of Kaloum ». La maquette garde celle du CLAUDE.md.
- [ ] **« Number one business and IT partner in Equatorial Guinea »** : affirmation reprise de la page À propos du site actuel, à confirmer.
- [ ] **Citations des interviews** : celles de Richard Dotse et Yvon Vodounon viennent des témoignages du site ; celles de Spéro Houmey et Ruben M. Coulibaly sont des extraits de leurs interviews. Sur la page À propos, la citation du CEO est une version raccourcie de son témoignage. À valider.
- [ ] **Étude de cas MMIE** : aucun chiffre de résultat disponible ; seule la mention « livré dans les délais et le budget » (annonce d'origine) est reprise.
- [ ] **Carrières** : lieu et type de contrat des postes non communiqués ; adresse email RH à confirmer (la page renvoie vers info@bostonsolux.com). L'option « Spontaneous application » est un ajout de la maquette.
- [ ] **Liens des interviews et actualités** : ils pointent vers les articles du site actuel, en attendant les pages WordPress.
- [ ] **Actualités en français** : la version française du site actuel publie des articles absents de la version anglaise (« Recrutement : commercial(e) », « Recrutement : business developer », « Soirée des certifiés à BostonSolux »). La maquette FR reprend pour l'instant les mêmes articles que la version anglaise, traduits.
- [ ] **Traductions** : les citations de Richard Dotse et Yvon Vodounon reprennent les versions françaises du site actuel ; les autres textes sont traduits depuis l'anglais et sont à relire.

### Images
- [ ] **Logo en SVG** : le logo d'origine (`logo-bostonsolux.webp`, 1011 × 247 px) est utilisé tel quel ; une version vectorielle officielle serait plus nette sur écran Retina.
- [ ] **Portraits en haute définition** : les portraits font 170 à 335 px de large sur le site actuel.
- [ ] **Active Directory** : pas d'image dédiée sur le site actuel ; une ancienne image de bannière (globe) la remplace.
- [ ] **Images avec texte incrusté** (ERP, « Backup & Restore », « Network Security », « Project Management ») : des versions sans texte seraient plus propres.
- [ ] **Diaporama du hero** : des photos propres à BostonSolux (bureaux, équipes, projets) remplaceraient avantageusement les 4 photos Unsplash.
- [ ] **Loader** : durée à valider par le client (logo affiché environ 0,6 s, page entièrement visible après environ 1,4 s).
- [ ] **Photo du bâtiment** : `about-building.webp` est recadrée depuis la couverture de la plaquette de présentation (meilleure définition que l'image d'origine).
