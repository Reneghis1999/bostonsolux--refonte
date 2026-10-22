# CLAUDE.md — Refonte du site BostonSolux

Ce fichier décrit le projet de refonte de **https://bostonsolux.com/**. Lis-le entièrement avant toute action et respecte-le à chaque session.

---

## 1. Contexte

- **Entreprise** : BostonSolux, cabinet de conseil et d'intégration IT. Slogan : « Focus on Solutions ».
- **Activités** : intégration de solutions d'entreprise (réseau, sécurité, ERP, sauvegarde, monétique, transformation digitale…), produits logiciels maison et formation.
- **Présence** : siège à Rockville (USA), bureaux à Paris, Lomé, N'Djamena, Malabo, Conakry et Cotonou.
- **Cible** : directions générales et DSI d'entreprises, banques, ministères et institutions publiques, principalement en Afrique de l'Ouest et Centrale.
- **Site actuel** : WordPress + Elementor, bilingue EN/FR. Le design date de 2015-2023 : photos de stock datées, textes superposés et peu lisibles, hiérarchie visuelle confuse, page d'accueil surchargée.

## 2. Objectif de la refonte

Produire une **maquette fonctionnelle et moderne** du site, en **HTML, CSS et JavaScript pur** (vanilla). Si elle est validée, elle sera **intégrée ensuite dans WordPress** sous forme de thème.

La refonte doit donner une image :
- **sérieuse et institutionnelle**, capable de rassurer une banque ou un ministère,
- **moderne et technologique**, celle d'un expert IT et cybersécurité,
- **claire** : on comprend en 5 secondes ce que fait BostonSolux et comment la contacter.

## 3. Contraintes techniques (OBLIGATOIRES)

- **Uniquement HTML5, CSS3 et JavaScript vanilla.** Pas de React, Vue, Tailwind, Bootstrap, jQuery ni d'étape de build (pas de npm, pas de bundler). Chaque page doit s'ouvrir directement dans un navigateur.
- **Polices** : Google Fonts autorisées. **Icônes** : SVG inline, ou une librairie légère via CDN si nécessaire.
- **Pensé pour WordPress** :
  - un header et un footer **identiques sur toutes les pages**, faciles à extraire vers `header.php` et `footer.php` ;
  - chaque section de page est un **bloc autonome** (`<section class="section-xxx">`), facile à convertir en template part ou en bloc Gutenberg ;
  - nommage des classes en **BEM** (`.card`, `.card__title`, `.card--featured`) ;
  - **aucun style inline** et aucun JS inline : tout passe par les fichiers CSS et JS ;
  - les contenus répétitifs (services, solutions, actualités, bureaux, témoignages) suivent une **structure HTML identique** d'un élément à l'autre, pour devenir des boucles WordPress.
- **Design tokens** : toutes les couleurs, polices, espacements et rayons sont des **variables CSS** dans `:root`, au début de `assets/css/main.css`.
- **Responsive mobile-first** : tester à 375 px, 768 px, 1024 px et 1440 px. Le menu devient un menu burger sur mobile.
- **Accessibilité** : HTML sémantique (`header`, `nav`, `main`, `footer`), un seul `h1` par page, attributs `alt` sur les images, contraste suffisant (WCAG AA), menus navigables au clavier.
- **Performance** : images optimisées (WebP si possible), `loading="lazy"` sous la ligne de flottaison, JS léger et chargé avec `defer`.
- **SEO** : balises `<title>` et `meta description` propres à chaque page, structure de titres logique.

## 4. Arborescence du projet

```
bostonsolux-refonte/
├── CLAUDE.md
├── README.md                 # comment ouvrir et prévisualiser la maquette
├── index.html                # Accueil
├── about.html                # À propos
├── services.html             # Liste des services
├── service-detail.html       # Modèle de page d'un service
├── solutions.html            # Liste des solutions
├── solution-detail.html      # Modèle de page d'une solution
├── news.html                 # Actualités
├── careers.html              # Carrières
├── contact.html              # Contact
├── assets/
│   ├── css/main.css
│   ├── js/main.js
│   └── img/                  # logo, images, icônes
└── contenu/                  # textes de référence du site actuel (si fournis)
```

Pour les pages de détail, crée **un seul modèle** (`service-detail.html`, `solution-detail.html`) rempli avec un exemple réel. WordPress générera les autres.

## 5. Plan du site et contenu

**Ne pas inventer de faits.** Pas de faux chiffres, faux clients, fausses certifications ni faux témoignages. Si une information manque, mets un texte de remplacement clairement marqué `[À COMPLÉTER : …]`. Tu peux **réécrire et moderniser les textes** existants (plus courts, plus clairs) sans en changer le sens.

### Navigation principale
Accueil · Services ▾ · Solutions ▾ · Actualités · Formation · Carrières · Contact
- Bouton « Blog » : à intégrer dans le menu, ou à fusionner avec Actualités. Propose la meilleure option.
- Sélecteur de langue **EN / FR**.
- Bouton d'appel à l'action visible dans le header : « Nous contacter » ou le téléphone.
- « Formation » pointe vers le site externe https://bostonsoluxacademy.com/

### Services (12) : menu déroulant ou méga-menu
1. Active Directory Design & Implementations
2. Business Continuity and Disaster Recovery
3. Corporate Desktop Deployments and Support
4. Digital Transformation
5. Enterprise Backup Solutions
6. Enterprise Messaging Implementations
7. ERP & PLM Implementations
8. Hardware & Software Application Solutions
9. Monetics
10. Network Design & Implementations
11. Network Security
12. Project Management

Douze éléments, c'est beaucoup : **propose un regroupement en 3 ou 4 catégories** (par exemple Infrastructure & Réseau, Sécurité & Continuité, Applications & ERP, Conseil & Transformation) pour le méga-menu et la page Services.

### Solutions (6 produits maison)
- **Bsecured Park** : solution intégrée de sécurisation du système d'information, basée sur Cisco et Microsoft.
- **BSmartGrid** : gestion intégrée pour les entreprises de services publics (utilities).
- **Mobile Banking** : services bancaires sur mobile.
- **Bsales Pro** : point de vente (POS) pour bars, restaurants, pressings et hôtels.
- **SSLoGe** : lien sécurisé dédié aux banques.
- **Quick Billing** : application de facturation modulaire.

### Page d'accueil : sections proposées (dans l'ordre)
1. **Hero** : titre fort, sous-titre sur la mission (« Speed & Efficiency to better serve our partners » peut inspirer) et 2 boutons (« Nos services », « Nous contacter »). Remplace le carrousel actuel par un visuel moderne et sobre, sans texte superposé illisible.
2. **Bande de confiance** : logos des partenaires technologiques (déjà présents sur le site actuel : Odoo, etc.).
3. **À propos (court)** : BostonSolux est un cabinet de conseil en développement d'entreprise. Il met en place des solutions d'entreprise intégrées et des produits autonomes, avec un fort accent sur la qualité de service, la diversité des compétences et l'adaptabilité. Lien vers la page À propos.
4. **Domaines d'expertise** : grille de cartes des services, groupés par catégorie.
5. **Nos solutions** : les 6 produits avec une icône, une phrase et un lien.
6. **Mise en avant** : BostonSolux CyberSecurity Center et BostonSolux Power Training / Academy.
7. **Référence client** : le Ministère des Mines, de l'Industrie et de l'Énergie (Malabo, Guinée Équatoriale) a choisi Bsecured Park. Prévoir un format « étude de cas ».
8. **Témoignages / interviews** : Richard Dotse (CEO), Yvon Vodounon (expert GED), Spéro Houmey (consultant RH), Ruben M. Coulibaly (Support Lead). Format court avec lien vers l'interview complète.
9. **Actualités** : les 3 derniers articles, sous forme de cartes.
10. **Présence internationale** : les 7 bureaux, en carte stylisée ou en grille.
11. **Appel à l'action final** : « Parlons de votre projet », avec un bouton vers Contact.

Ajoute aussi une mention du contact PMO : « Vous cherchez un PMP ? pmo@bostonsolux.com », à placer où c'est pertinent.

### Footer
- Logo et courte description
- Liens rapides, services, solutions
- Bureaux (version condensée)
- Contacts : info@bostonsolux.com · support@bostonsolux.com · support +228 91 38 17 17
- Réseaux sociaux : LinkedIn, Facebook, X, YouTube
- © 2026 BostonSolux

### Bureaux
| Ville | Adresse | Téléphone |
|---|---|---|
| Rockville, USA (siège) | 11140 Rockville Pike, Suite 400, Rockville, MD 20852 | +1 240-342-3141 |
| Paris, France | 34 Avenue des Champs-Élysées, 75008 Paris | +33 6 67 63 75 81 |
| Lomé, Togo | Route Nationale N°2, Kpogan | +228 91 06 18 73 |
| N'Djamena, Tchad | Radisson Blu Hotel, Bureau N°20, 2e étage, Bloc C | +235 68 80 81 80 |
| Malabo, Guinée Équatoriale | Edificio Davinci, Malabo II | +240 551 95 85 00 |
| Conakry, Guinée | Sonoco Trade Center, Bureau 175 | +224 628 35 58 81 |
| Cotonou, Bénin | 003 BP 2277, partenariat Sodexca | +229 21 04 96 78 |

### Page Contact
Formulaire (nom, entreprise, email, téléphone, service concerné, message) avec validation en JS. Pas d'envoi réel : WordPress s'en chargera avec Contact Form 7 ou WPForms. À côté du formulaire, les coordonnées et les bureaux.

## 6. Direction artistique

### Règle d'or : nouveau design, même contenu
- **Le design doit être TOTALEMENT différent de l'ancien site.** Ne reprends ni sa mise en page, ni son header rouge plein, ni son carrousel, ni ses blocs gris superposés. Pars d'une feuille blanche, au niveau d'un site de grand cabinet de conseil ou d'intégrateur IT international (références d'esprit : Accenture, Capgemini, Sopra Steria, Orange Business).
- **Le contenu reste le même** : mêmes informations, mêmes services, mêmes solutions, mêmes bureaux, mêmes contacts, mêmes témoignages, mêmes actualités. Tu peux reformuler pour plus de clarté, sans rien inventer ni supprimer d'information.
- **Les images restent les mêmes** : utilise exclusivement les images du site actuel, placées dans `contenu/images/`. N'ajoute pas de photos de banques d'images extérieures. C'est la **mise en scène** des images qui change : recadrage (`object-fit`), formats plus généreux, coins arrondis, superposition d'un dégradé ou d'un filtre de couleur de la marque pour harmoniser des photos hétérogènes, alternance texte / image… Ne pose jamais de texte directement sur une photo chargée sans voile de contraste.
- Si une image manque dans `contenu/images/`, mets un emplacement neutre de même format, nommé clairement, et signale-le dans le README (liste `[À COMPLÉTER]`).

### Identité visuelle
- **Garder** le logo BostonSolux et le **rouge bordeaux** de la marque (environ `#8B2525`, à confirmer sur le logo). Le rouge sert d'accent : boutons, liens, détails. Il ne doit pas remplir de grands aplats comme la barre de menu actuelle.
- **Palette proposée** : bordeaux (accent), bleu nuit ou anthracite très foncé (textes, sections sombres, footer), blanc et gris très clairs (fonds). Tu peux ajuster si tu justifies le choix.
- **Typographie** : une sans-serif moderne et lisible (par exemple Inter, Manrope ou Plus Jakarta Sans), titres grands et affirmés.
- **Style** : beaucoup d'espace blanc, grille claire et aérée, cartes sobres, icônes au trait cohérentes, micro-animations discrètes (apparition au scroll, survol des cartes, header qui se réduit au scroll). Rien de clinquant : le rendu doit être haut de gamme et institutionnel.
- **À éviter** : carrousels automatiques, texte illisible sur photo, trop de couleurs, effets gadget, tout ce qui rappelle l'ancien site.

## 7. Bilinguisme

Le site est en anglais (langue principale) et en français. Pour la maquette :
- réalise les pages **en anglais** ;
- prévois le sélecteur EN/FR dans le header (visuel seulement) ;
- dans WordPress, la traduction sera gérée par un plugin (WPML ou Polylang). Ne duplique donc pas toutes les pages en FR, sauf demande explicite.

## 8. Méthode de travail

1. **Avant de coder**, présente un plan court : palette, typographies, structure de la page d'accueil, regroupement des services. Attends ma validation.
2. Construis d'abord **`index.html`** (header, footer, toutes les sections), puis attends mes retours.
3. Ensuite seulement, les autres pages, dans l'ordre : services, service-detail, solutions, solution-detail, about, contact, news, careers.
4. Fais des commits clairs et fréquents, en français (ex. : `feat: section hero de l'accueil`).
5. Tiens à jour le `README.md` avec la façon de prévisualiser la maquette et la liste des éléments `[À COMPLÉTER]`.
6. En cas de doute sur un contenu ou un choix important, **pose la question** au lieu d'inventer.

## 9. Ressources

- Site actuel : https://bostonsolux.com/ (version FR : https://bostonsolux.com/?lang=fr)
- Logo : https://bostonsolux.com/wp-content/uploads/2026/05/logoBS-HD-removebg-preview-1-1.webp (à placer dans `assets/img/` ; si tu ne peux pas le télécharger, demande-le-moi)
- Académie : https://bostonsoluxacademy.com/
- Réseaux : https://www.linkedin.com/company/bostonsolux · https://www.facebook.com/BostonSolux/ · https://twitter.com/Bostonsolux · https://www.youtube.com/channel/UCd7b9K_BGh5menUsi_QJyAg
- Dossier `contenu/` : textes et images du site actuel, quand ils sont fournis. Ils font foi par rapport au site en ligne.

### Images du site actuel (à placer dans `contenu/images/`)
Commence par les fichiers présents dans `contenu/images/`. S'il en manque et que tu peux les télécharger depuis ces adresses, place-les dans `assets/img/` ; sinon, demande-les-moi.

Hero / bannières :
- https://bostonsolux.com/wp-content/uploads/2023/05/Boston-solux-mmie.jpg (référence MMIE Malabo)
- https://bostonsolux.com/wp-content/uploads/2023/05/cabinet-informatiqueslide.jpg
- https://bostonsolux.com/wp-content/uploads/2023/01/slide3__c.jpeg
- https://bostonsolux.com/wp-content/uploads/2023/05/Bostonsolux-slide.jpg
- https://bostonsolux.com/wp-content/uploads/2023/05/solutions-informatiques.jpg

À propos / mises en avant :
- https://bostonsolux.com/wp-content/uploads/2023/01/Picture1.webp (À propos)
- https://bostonsolux.com/wp-content/uploads/2023/04/Cyber-security.webp (CyberSecurity Center)
- https://bostonsolux.com/wp-content/uploads/2023/01/1-2-1.webp (Power Training)
- https://bostonsolux.com/wp-content/uploads/2023/01/Cat_BS-min.jpg
- https://bostonsolux.com/wp-content/uploads/2023/04/Couv-2-2048x2048-1-12-min.jpg
- https://bostonsolux.com/wp-content/uploads/2023/05/bstv.webp (BostonSolux TV)

Domaines d'expertise (une image par service) :
- https://bostonsolux.com/wp-content/uploads/2023/05/Bostonsolux-Business-1.jpg (Business Continuity)
- https://bostonsolux.com/wp-content/uploads/2023/05/Bostonsolux-solutions.jpg (Desktop Deployments)
- https://bostonsolux.com/wp-content/uploads/2023/05/Bostonsolux-digital-transformatoin.jpg (Digital Transformation)
- https://bostonsolux.com/wp-content/uploads/2023/05/Bostonsolux-BackupDisasterRecovery.jpg (Enterprise Backup)
- https://bostonsolux.com/wp-content/uploads/2023/05/the-best-business-messaging-bostonsolux.jpg (Enterprise Messaging)
- https://bostonsolux.com/wp-content/uploads/2023/05/bostonsolux-erp.jpg (ERP & PLM)
- https://bostonsolux.com/wp-content/uploads/2023/05/bostonsolux-hard_1-1.jpg (Hardware & Software)
- https://bostonsolux.com/wp-content/uploads/2023/05/bostonsoluxmonetiques-min-1.jpg (Monetics)
- https://bostonsolux.com/wp-content/uploads/2023/05/Bostonsolux-Network_.jpg (Network Design)
- https://bostonsolux.com/wp-content/uploads/2023/05/Bostonsolyux-network.jpg (Network Security)
- https://bostonsolux.com/wp-content/uploads/2023/05/boston-projectprojects-1.jpg (Project Management)

Logos partenaires (bande de confiance) :
- https://bostonsolux.com/wp-content/uploads/2023/01/1.jpg · 3-1.jpg · 4-1.png · 5.png · 6.jpg · 7-1-1.png · 8.jpg · 9.png · 10.png · 11.png · 13.png · 14.png
- https://bostonsolux.com/wp-content/uploads/2023/01/odoo-logo-62B6A3D625-seeklogo.com_.png