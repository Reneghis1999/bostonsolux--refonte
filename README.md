# BostonSolux – Refonte

Maquette HTML/CSS/JS (vanilla, sans build) de la refonte de [bostonsolux.com](https://bostonsolux.com/), destinée à être intégrée ensuite comme thème WordPress.

## Prévisualiser la maquette

- **Le plus simple** : ouvrir `index.html` dans un navigateur (double-clic).
- **Avec un petit serveur local** (recommandé pour tester comme en ligne) :
  ```bash
  python3 -m http.server 8000
  ```
  puis ouvrir http://localhost:8000.

Une connexion Internet est nécessaire pour charger la police Plus Jakarta Sans (Google Fonts). Sans connexion, le site s'affiche avec des polices de secours.

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
| `index.html` | Accueil : hero plein écran avec diaporama, partenaires, expertise, solutions, CyberSecurity Center, étude de cas MMIE, interviews, actualités, bureaux |
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

Inspirée du style de la page d'accueil de CinetPay, adaptée à l'identité BostonSolux :

- **Rouge BostonSolux `#8C2826`**, mesuré sur le site actuel (barre de menu, bouton Blog). Il sert aux boutons, liens et icônes sociales.
- **Coins carrés partout** : boutons, cartes, images, panneaux, champs de formulaire, badges. Aucun arrondi.
- **Hero de l'accueil** : photo **bord à bord**, juste sous la barre du haut et le header blanc (le même header que sur toutes les pages). Le hero occupe le reste de la hauteur de l'écran.
- En fond, **diaporama de 5 images** : la photo du ministère des Mines, de l'Industrie et de l'Énergie à Malabo (site actuel) et 4 photos professionnelles libres de droits (salle serveurs, équipe de consultants, câblage réseau, réunion client), sous un voile sombre plus dense côté texte pour garder le texte lisible. Le diaporama démarre seul : toutes les 6 secondes, l'image suivante glisse depuis la droite. Si le visiteur a demandé à réduire les animations, les images changent en fondu au lieu de glisser.
- Contenu du hero aligné à gauche : surtitre « BOSTONSOLUX », grand titre (« Speed and efficiency to better serve our partners. »), sous-titre, deux boutons (« See what we do » en rouge, « Contact us » en contour blanc ; empilés en pleine largeur sur téléphone).
- Sur ordinateur, la taille du titre et les espacements suivent aussi la **hauteur de l'écran** : tout le hero, barre du bas comprise, reste visible sur les portables (1280×620, 1366×657, 1536×730…) comme sur les grands écrans.
- Barre du bas du hero : légende de la photo affichée (attribut `data-caption` de chaque image, mise à jour par le JS) à gauche ; à droite, des traits indiquent l'image affichée et permettent d'en choisir une, et un bouton met en pause (obligatoire pour l'accessibilité).
- **Partenaires technologiques** : bande de logos **en couleur** placée en bas de page, juste avant le footer (accueil et À propos).
- **Barre du haut** (fine, noire) : téléphone du siège et email à gauche ; à droite, menu de langue (icône globe : English / Français) et icônes Facebook, X et LinkedIn.
- **Header** : logo à gauche, menu complet **centré sur la page** (Accueil, Services, Solutions, Actualités, Formation, Carrières, Contact), bouton « Contact us » à droite. Le contenu du header est aligné sur un conteneur large (1480 px). Le menu complet s'affiche dès 1024 px ; en dessous, menu burger (la barre du haut reste visible pour la langue et les réseaux).
- **Panneaux** : les blocs sombres (héros des pages intérieures, CyberSecurity Center, appels à l'action) et les sections grises sont des panneaux en retrait des bords.
- **Couleurs** : rouge `#8C2826`, noir nuit `#141112` pour les panneaux, noir du logo `#231F20` pour les textes et le pied de page, blanc et gris clair `#F6F5F5`.
- **Typographie** : **Plus Jakarta Sans sur tout le site**. Grands titres (h1, h2) en demi-gras avec un interlettrage serré, textes et interface en regular ou medium.
- **Animations** (toutes les pages, EN et FR) :
  - apparition en cascade des sections, cartes et images au défilement (les images glissent depuis le côté) ;
  - carte du monde : arcs puis repères des bureaux qui apparaissent au défilement, pulsation lente des repères, flux le long des arcs ;
  - trait rouge qui se dessine sous les titres de section ;
  - hero : contenu qui monte en séquence, léger zoom sur la photo affichée, légende qui change en fondu ;
  - survol : cartes qui se soulèvent, images qui s'éclairent, barre rouge qui glisse au-dessus des solutions et des bureaux, icônes qui basculent, boutons avec un remplissage qui glisse ;
  - bande des partenaires qui défile en continu (pause au survol) ;
  - barre rouge de progression de lecture en haut de l'écran et bouton « retour en haut ».
  - Si le visiteur a demandé à réduire les animations, le contenu apparaît en fondu, sans aucun déplacement, et la bande des partenaires reste fixe.
- **Carte du monde des 7 bureaux** (section Bureaux de l'accueil, page À propos) : continents dessinés en points (projection Miller) dans un panneau sombre, chaque bureau placé à ses coordonnées réelles, arcs depuis le siège de Rockville, chiffres clés (7 bureaux, 7 pays, 3 continents) et légende. Survoler ou parcourir au clavier la fiche d'un bureau allume son repère, son nom et son arc sur la carte. Quand la carte dispose de moins de 900 px de large (téléphone, tablette, colonne de la page À propos), elle zoome sur l'Atlantique pour que les bureaux restent lisibles. Tout le dessin des continents tient dans un seul tracé SVG de 8 Ko.
- **Carte Google du bureau de Lomé (Kpogan)** : uniquement sur la page Contact, dans sa propre section juste après le formulaire (« Visit us »), avec l'adresse, le téléphone, un bouton « Get directions » et un lien « Open in Google Maps ». La carte est chargée en différé (`loading="lazy"`), dans la langue de la page.
- **Regroupement des services** en 4 domaines : Infrastructure & Networks, Security & Continuity, Business Applications, Consulting & Transformation.
- Tous les tokens (couleurs, polices, espacements, rayons) sont dans `:root`, au début de `assets/css/main.css`.

## Favicon

Monogramme « BS » bordeaux (`#8C2826`) sur carré blanc, dans la police du site (Plus Jakarta Sans ExtraBold, lettres vectorisées), dans `assets/img/favicon/` :

| Fichier | Usage |
|---|---|
| `favicon.svg` | navigateurs récents, net à toutes les tailles (fichier source) |
| `favicon.ico` | anciens navigateurs (16, 32 et 48 px) |
| `apple-touch-icon.png` | icône d'écran d'accueil iPhone et iPad (180 px, carré plein : iOS arrondit lui-même) |
| `icon-512.png` | à charger dans WordPress (Apparence › Personnaliser › Identité du site › Icône du site), qui génère lui-même toutes les tailles |

La barre du navigateur mobile prend la couleur de la barre du haut (`theme-color` `#141112`).

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
- [ ] **Hero de l'accueil** : titre (« Speed and efficiency to better serve our partners. », d'après le slogan) et sous-titre repris de la maquette fournie, à valider. Les légendes des 4 photos libres de droits indiquent seulement le domaine d'expertise illustré.
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
- [ ] **Logo blanc officiel** : dans le pied de page, le logo est passé en blanc par un filtre CSS.
- [ ] **Portraits en haute définition** : les portraits font 170 à 335 px de large sur le site actuel.
- [ ] **Active Directory** : pas d'image dédiée sur le site actuel ; une ancienne image de bannière (globe) la remplace.
- [ ] **Images avec texte incrusté** (ERP, « Backup & Restore », « Network Security », « Project Management ») : des versions sans texte seraient plus propres.
- [ ] **Diaporama du hero** : des photos propres à BostonSolux (bureaux, équipes, projets) remplaceraient avantageusement les 4 photos Unsplash.
- [ ] **Photo du bâtiment** : `about-building.webp` est recadrée depuis la couverture de la plaquette de présentation (meilleure définition que l'image d'origine).
