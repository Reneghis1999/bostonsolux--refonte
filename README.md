# BostonSolux – Refonte

Maquette HTML/CSS/JS (vanilla, sans build) de la refonte de [bostonsolux.com](https://bostonsolux.com/), destinée à être intégrée ensuite comme thème WordPress.

## Prévisualiser la maquette

- **Le plus simple** : ouvrir `index.html` dans un navigateur (double-clic).
- **Avec un petit serveur local** (recommandé pour tester comme en ligne) :
  ```bash
  python3 -m http.server 8000
  ```
  puis ouvrir http://localhost:8000.

Une connexion Internet est nécessaire pour charger la police IBM Plex Sans (Google Fonts). Sans connexion, le site s'affiche avec une police de secours.

## Pages

| Page | État |
|---|---|
| `index.html` (Accueil) | ✅ Faite, en attente de retours |
| `services.html`, `service-detail.html`, `solutions.html`, `solution-detail.html`, `about.html`, `contact.html`, `news.html`, `careers.html` | ⏳ À venir (les liens du menu y pointent déjà) |

## Direction artistique

- **Charte** : rouge, noir et blanc, tirés du logo.
  - Rouge `#991B1F` (accent : boutons, liens, nœuds de la carte)
  - Noir `#231F20` (titres, bloc CyberSecurity Center, pied de page)
  - Blanc `#FFFFFF`, gris clair `#F6F5F5` pour les fonds alternés
- **Typographie** : IBM Plex Sans, une seule famille.
- **Élément signature** : la carte réseau des 7 bureaux dans le hero. Elle se dessine au chargement ; c'est la seule animation automatique du site, désactivée si l'utilisateur a demandé à réduire les animations.
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
- `assets/img/partners/` : logos partenaires, **recolorés en noir monochrome** pour une bande homogène
- `assets/img/banners/` : anciennes images de carrousel (non utilisées sur l'accueil)

## Éléments `[À COMPLÉTER]` / à valider

- [ ] **Titre du hero** (« Secure, integrated IT for banks, ministries and enterprises. ») : c'est une proposition de positionnement, à valider.
- [ ] **Sélecteur FR** : lien visuel uniquement (`#`), la traduction sera gérée par WPML ou Polylang.
- [ ] **Logo blanc officiel** : dans le pied de page, le logo est passé en blanc par un filtre CSS. Fournir une version blanche officielle si elle existe.
- [ ] **Images en haute définition** : la photo du bâtiment (`about-office.webp`, 367×275 px) et les portraits (170 à 335 px de large) sont en basse résolution sur le site actuel.
- [ ] **Images avec texte incrusté** (ERP, « Backup & Restore », « Network Security ») : des versions sans texte seraient plus propres.
- [ ] **Citations des interviews** : celles de Richard Dotse et Yvon Vodounon viennent des témoignages du site ; celles de Spéro Houmey et Ruben M. Coulibaly sont des extraits de leurs interviews. À valider.
- [ ] **Étude de cas MMIE** : aucun chiffre de résultat disponible ; seule la mention « livré dans les délais et le budget » (annonce d'origine) est reprise.
- [ ] **URL de l'Academy** : le CLAUDE.md indique https://bostonsoluxacademy.com/, mais la page Power Training du site actuel mentionne https://bostonsoluxedu.com/. Laquelle est la bonne ?
- [ ] **Liens des interviews et actualités** : ils pointent vers les articles du site actuel, en attendant les pages WordPress.
