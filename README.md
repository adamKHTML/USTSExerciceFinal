# USTSwebagency

Ce dépôt contient le rendu final de l'exercice avec une architecture complète comprenant un **frontend** développé en **React.js** et un **backend** en **Symfony**. 

Le backend est disponible dans un dépôt séparé : [exercice-php-api-securite](https://github.com/adamKHTML/exercice-php-api-securite.git).

## Description

L'application est divisée en deux parties :
- **Frontend (React.js)** : Pour gérer l'interface utilisateur et interagir avec l'API.
- **Backend (Symfony)** : Pour la gestion des données, des utilisateurs, et la sécurisation des requêtes via des API sécurisées.

## Installation et Exécution

### 1. Cloner les deux dépôts

Tout d'abord, clonez les deux dépôts :
- Cloner ce dépôt (Frontend) : `git clone https://github.com/adamKHTML/USTSwebagency.git`
- Cloner le dépôt du backend : `git clone https://github.com/adamKHTML/exercice-php-api-securite.git`

### 2. Lancer les serveurs

Vous devez lancer deux serveurs simultanément, un pour le frontend et un pour le backend.

#### **Lancer le Frontend**
Dans le répertoire `frontend/` :

cd frontend
npm install  # Installer les dépendances
npm run dev  # Lancer le serveur de développement

Lancer le Backend
Dans le répertoire exercice-php-api-securite/ :

cd ../exercice-php-api-securite
docker-compose up -d  # Lancer Docker pour le backend Symfony
Les migrations de base de données et les fixtures (données d'exemple) sont appliquées automatiquement grâce à Docker. Cependant, cela peut prendre un peu de temps en fonction de votre machine. Soyez patient.

### 3. Tester l'application
Accédez à l'application en ouvrant votre navigateur à l'adresse fournie par le serveur frontend (http://localhost:5173).

Le backend est accessible via les routes configurées par Symfony et exposées par Docker.

Points à noter
Temps de réponse : Le temps de réponse du serveur backend peut parfois être lent, surtout lors du premier lancement. Il est recommandé d'attendre un peu et, si nécessaire, de consulter la console pour diagnostiquer les éventuels retards ou erreurs.

Fiabilité : L'application est opérationnelle dans son ensemble, mais en cas de problème, n'hésitez pas à réessayer ou vérifier les logs de la console.
