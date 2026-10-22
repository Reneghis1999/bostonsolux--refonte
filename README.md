# BostonSolux – Refonte

Maquette HTML/CSS/JS (vanilla, sans build) de la refonte de [bostonsolux.com](https://bostonsolux.com/), destinée à être intégrée ensuite comme thème WordPress.

## Prévisualiser la maquette

- **Le plus simple** : ouvrir `index.html` dans un navigateur (double-clic).
- **Avec un petit serveur local** (recommandé pour tester comme en ligne) :
  ```bash
  python3 -m http.server 8000
  ```
  puis ouvrir http://localhost:8000.

Une connexion Internet est nécessaire pour charger les polices Instrument Serif et IBM Plex Sans (Google Fonts). Sans connexion, le site s'affiche avec des polices de secours.

## Version française

Le site existe en anglais (racine du dossier) et en français (dossier `fr/`). Le sélecteur **EN / FR** du header renvoie vers la même page dans l'autre langue, et chaque page déclare son équivalent avec `<link rel="alternate" hreflang>`.

- Les noms des services reprennent ceux de la version française du site actuel (« Conception et mise en place de réseaux », « Monétique », « Gestion de projet »…).
- Les messages d'erreur des formulaires suivent la langue de la page.
- Dans WordPress, la traduction sera gérée par WPML ou Polylang : les pages de `fr/` servent de référence pour les textes.

## Modifier la maquette

Les pages HTML sont **générées** à partir du dossier `src/`, pour que le header, le footer et les blocs partagés restent identiques sur les 18 pages :

```
src/_head.html              <head> commun
src/en/  et  src/fr/        _header.html, _footer.html, blocs partagés (_offices, _partners, _network-map)
src/<langue>/pages/*.html   contenu principal de chaque page
```

Après une modification dans `src/`, lancer :

```bash
python3 tools/build.py
```

Les fichiers générés sont commités : la maquette s'ouvre toujours directement dans un navigateur, sans étape de build. Le CSS (`assets/css/main.css`) et le JS (`assets/js/main.js`) se modifient directement.

## Pages

| Page | Contenu |
|---|---|
| `index.html` | Accueil : hero avec carte réseau, partenaires, expertise, solutions, CyberSecurity Center, étude de cas MMIE, interviews, actualités, bureaux |
| `services.html` | Les 12 services en 4 domaines, avec navigation par domaine |
| `service-detail.html` | Modèle de page service, rempli avec **Digital Transformation** (le contenu le plus riche du site actuel) |
| `solutions.html` | Les 6 produits, avec leur public et leurs fonctions clés |
| `solution-detail.html` | Modèle de page solution, rempli avec **Bsecured Park** et sa référence MMIE |
| `about.html` | Présentation, forces, présence en Afrique, dates clés, mot du CEO, partenaires, bureaux |
| `contact.html` | Formulaire validé en JS (aucun envoi), contacts par équipe, bureaux |
| `news.html` | Article à la une, archive des actualités, interviews |
| `careers.html` | Les 14 postes groupés par famille, parcours d'Emmanuel Amou, formulaire de candidature avec CV |

Chaque page existe aussi en français dans `fr/` (même nom de fichier).

Toutes les pages partagent exactement le même header et le même footer. Seul change le marquage de la page courante dans le menu (`aria-current`), que WordPress ajoutera lui-même.

## Direction artistique

Inspirée du style de la page d'accueil de CinetPay, adaptée à l'identité BostonSolux :

- **Rouge BostonSolux `#8C2826`**, mesuré sur le site actuel (barre de menu, bouton Blog). Il sert aux boutons, liens, icônes sociales et au mot mis en valeur du hero.
- **Coins carrés partout** : boutons, cartes, images, panneaux, champs de formulaire, badges. Aucun arrondi.
- **Hero de l'accueil** : grand panneau sombre en retrait des bords. En fond, **diaporama des images du carrousel du site actuel** (MMIE Malabo, cabinet informatique, « Building the future », « We are here for you »), agrandies en 1920 px, plus nettes et légèrement plus contrastées, sous un voile sombre et un halo rouge pour garder le texte lisible. Les images se fondent toutes les 6 secondes avec un léger zoom ; un bouton permet de mettre en pause (obligatoire pour l'accessibilité), et le diaporama reste à l'arrêt si l'utilisateur a demandé à réduire les animations.
- Contenu du hero centré : badge, grand titre serif avec un mot dans un bloc rouge, sous-titre, deux boutons, bandeau de chiffres réels (7 bureaux, 3 continents, 12 services, 6 solutions).
- **Header** : logo, menu avec lien Accueil, sélecteur EN / FR, icônes Facebook, X et LinkedIn, bouton « Contact us ».
- **Panneaux** : les blocs sombres (héros des pages intérieures, CyberSecurity Center, appels à l'action) et les sections grises sont des panneaux en retrait des bords.
- **Couleurs** : rouge `#8C2826`, noir nuit `#141112` pour les panneaux, noir du logo `#231F20` pour les textes et le pied de page, blanc et gris clair `#F6F5F5`.
- **Typographie** : Instrument Serif pour les grands titres (h1, h2), IBM Plex Sans pour les textes et l'interface.
- **Carte réseau des 7 bureaux** : dans la section Bureaux de l'accueil et sur la page À propos.
- **Regroupement des services** en 4 domaines : Infrastructure & Networks, Security & Continuity, Business Applications, Consulting & Transformation.
- Tous les tokens (couleurs, polices, espacements, rayons) sont dans `:root`, au début de `assets/css/main.css`.

## Organisation du code (pensée pour WordPress)

- Header et footer délimités par des commentaires `header.php` / `footer.php` dans le HTML.
- Une section = un bloc autonome `<section class="section-xxx">`.
- Classes BEM, aucun style ni script inline. JS unique, chargé en `defer` : `assets/js/main.js`.
- Contenus répétitifs (services, solutions, interviews, actualités, bureaux) : structure HTML identique d'un élément à l'autre, prête pour des boucles WordPress.
- Navigation complète à partir de 1200 px, menu burger en dessous.

## Images

`contenu/images/` ne contenait que le logo. Les autres images ont été **téléchargées depuis le site actuel** et converties en WebP dans `assets/img/` :

- `assets/img/services/` : une image par service
- `assets/img/people/` : portraits des interviews
- `assets/img/news/` : visuels des actualités
- `assets/img/about-building.webp` : photo du bâtiment recadrée depuis la plaquette `company-presentation.webp`
- `assets/img/partners/` : logos partenaires, **recolorés en noir monochrome** pour une bande homogène
- `assets/img/banners/` : anciennes images de carrousel (non utilisées sur l'accueil)

## Éléments `[À COMPLÉTER]` / à valider

### Contenus
- [ ] **Titre du hero** de l'accueil (« Your IT, secured and built to grow. ») : proposition de positionnement, à valider.
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
- [ ] **Diaporama du hero** : l'image `slide3__c.jpeg` du carrousel actuel (477 px de large) est trop petite pour un fond plein écran et n'est pas utilisée. Des versions haute définition des images du carrousel donneraient un rendu encore meilleur.
- [ ] **Photo du bâtiment** : `about-building.webp` est recadrée depuis la couverture de la plaquette de présentation (meilleure définition que l'image d'origine).
