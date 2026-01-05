# 🌐 Installation sur Outlook 365 Online

Guide complet pour installer et utiliser l'add-in sur Outlook 365 Online (version web).

## ⚠️ Points importants

Outlook 365 Online a quelques spécificités :
- ✅ Fonctionne avec des add-ins en localhost
- ⚠️ Nécessite d'accepter les certificats HTTPS auto-signés
- ⚠️ Le manifest doit être accessible localement
- ✅ Pas besoin de publier sur l'Office Store pour tester

## 🚀 Installation pas à pas

### Étape 1 : Démarrer les serveurs

#### Terminal 1 : Backend
```bash
cd server
npm run dev
```
✅ Serveur backend sur `https://localhost:8787`

#### Terminal 2 : Add-in
```bash
cd addin
npm run dev
```
✅ Interface add-in sur `https://localhost:3000`

### Étape 2 : Accepter les certificats HTTPS

**Très important !** Vous devez accepter les certificats dans votre navigateur AVANT d'installer l'add-in.

#### 1. Accepter le certificat du backend
1. Ouvrez un nouvel onglet dans votre navigateur
2. Allez sur `https://localhost:8787/health`
3. Vous verrez un avertissement de sécurité
4. Cliquez sur **"Avancé"** ou **"Advanced"**
5. Cliquez sur **"Accepter le risque et continuer"** ou **"Proceed to localhost (unsafe)"**
6. Vous devriez voir : `{"ok":true}`

#### 2. Accepter le certificat de l'add-in
1. Dans le même navigateur, ouvrez un nouvel onglet
2. Allez sur `https://localhost:3000/src/taskpane.html`
3. Acceptez le certificat (même procédure)
4. Vous devriez voir l'interface de l'add-in (même si elle affiche une erreur, c'est normal)

#### 3. Tester l'admin
1. Ouvrez `https://localhost:3000/src/admin.html`
2. Acceptez le certificat si nécessaire

### Étape 3 : Configurer l'add-in (Admin)

#### 1. Ouvrir l'interface d'administration
`https://localhost:3000/src/admin.html`

#### 2. Remplir les champs

| Champ | Valeur |
|-------|--------|
| Backend | `https://localhost:8787` |
| Admin token | `my_admin_token_change_this_in_production` |
| Clé OpenAI | Votre clé (commence par `sk-...`) |

Cliquez sur **"Enregistrer la clé"**

#### 3. Créer un prompt par défaut

Remplissez les champs :

| Champ | Valeur |
|-------|--------|
| Catégorie | `*` |
| Nom | `Réponse générique` |
| Priorité | `100` |
| Actif | `Actif` |
| Template | `Réponds de manière professionnelle et concise en français. Rappelle le point clé de l'email reçu. Si des informations manquent, demande-les clairement. Termine par une question pour obtenir confirmation ou clarification.` |

Cliquez sur **"Créer"**

Vous devriez voir le prompt apparaître dans la liste en bas.

### Étape 4 : Installer l'add-in dans Outlook 365 Online

#### Méthode 1 : Via les paramètres Outlook (Recommandée)

1. **Ouvrir Outlook 365 Online**
   - Allez sur `https://outlook.office.com` ou `https://outlook.office365.com`
   - Connectez-vous avec vos identifiants

2. **Accéder aux paramètres**
   - Cliquez sur l'icône **⚙️ Paramètres** (en haut à droite)
   - Cliquez sur **"Afficher tous les paramètres Outlook"** (en bas du panneau)

3. **Gérer les compléments**
   - Dans le panneau de gauche : **"Général"** → **"Gérer les compléments"**
   - Ou directement : **"Personnaliser"** → **"Gérer les compléments"**

4. **Ajouter l'add-in**
   - Cliquez sur **"+ Mes compléments"** ou **"+ Ajouter un complément"**
   - Sélectionnez **"Ajouter un complément personnalisé"**
   - Choisissez **"Ajouter à partir d'un fichier"**

5. **Sélectionner le manifest**
   - Cliquez sur **"Parcourir"** ou **"Browse"**
   - Naviguez vers votre projet : `addin/manifest.xml`
   - Sélectionnez le fichier
   - Cliquez sur **"Ouvrir"**

6. **Confirmer l'installation**
   - Lisez l'avertissement (normal pour les add-ins en développement)
   - Cliquez sur **"Installer"** ou **"Install"**
   - Fermez le panneau de paramètres

#### Méthode 2 : Via le centre d'administration (Si vous êtes admin)

Si vous êtes administrateur de votre tenant Office 365 :

1. Allez sur `https://admin.microsoft.com`
2. **Paramètres** → **Services intégrés** → **Compléments**
3. **Charger le complément**
4. Sélectionnez le fichier `manifest.xml`

### Étape 5 : Utiliser l'add-in

#### 1. Ouvrir un email

1. Dans Outlook 365 Online, ouvrez un email (ou créez un nouveau message)
2. Cliquez sur le bouton **"Répondre"** ou **"Reply"**

#### 2. Activer l'add-in

Vous devriez voir l'add-in de deux façons :

**Option A : Dans le ruban**
- Cherchez le bouton **"AI Draft"** dans le ruban en haut
- Cliquez dessus

**Option B : Menu "..."**
- Cliquez sur les **trois points (...)** dans la barre d'outils
- Cherchez **"AI Draft"** ou **"Outlook AI"**
- Cliquez dessus

#### 3. Générer une réponse

1. Le panneau de l'add-in s'ouvre sur le côté droit
2. Les catégories détectées s'affichent (si l'email en a)
3. Le prompt est automatiquement sélectionné
4. Cliquez sur **"Générer le brouillon"**
5. Attendez quelques secondes (l'IA génère la réponse)
6. La réponse s'affiche dans la zone de texte
7. Cliquez sur **"Insérer dans la réponse"**
8. Le texte est inséré dans votre email
9. Modifiez si nécessaire et envoyez

## 🐛 Dépannage

### L'add-in n'apparaît pas dans Outlook

**Solution 1 : Actualiser la page**
```
Ctrl + F5 (Windows) ou Cmd + Shift + R (Mac)
```

**Solution 2 : Vider le cache**
1. Fermez tous les onglets Outlook
2. Videz le cache du navigateur
3. Rouvrez Outlook
4. Réinstallez l'add-in si nécessaire

**Solution 3 : Vérifier l'installation**
1. ⚙️ Paramètres → Afficher tous les paramètres
2. Général → Gérer les compléments
3. Vérifiez que **"Outlook AI Draft"** est dans la liste
4. S'il n'y est pas, réinstallez-le

### Erreur "Unable to load"

**Cause** : Certificats HTTPS non acceptés

**Solution** :
1. Ouvrez un nouvel onglet
2. Allez sur `https://localhost:8787/health`
3. Acceptez le certificat
4. Allez sur `https://localhost:3000/src/taskpane.html`
5. Acceptez le certificat
6. Rechargez Outlook (Ctrl + F5)

### Erreur "OpenAI API key not set"

**Solution** :
1. Ouvrez `https://localhost:3000/src/admin.html`
2. Vérifiez que la clé OpenAI est bien enregistrée
3. Si nécessaire, enregistrez-la à nouveau
4. Créez au moins un prompt avec catégorie `*`

### L'add-in charge mais ne génère rien

**Vérifications** :
1. Les deux serveurs sont bien démarrés
2. Le backend répond : `https://localhost:8787/health` → `{"ok":true}`
3. L'admin fonctionne : `https://localhost:3000/src/admin.html`
4. La clé OpenAI est valide et a des crédits
5. Au moins un prompt existe dans la base de données

**Vérifier dans l'admin** :
1. Ouvrez `https://localhost:3000/src/admin.html`
2. Cliquez sur **"Recharger"**
3. Vous devriez voir au moins un prompt dans la liste

### Erreur réseau (CORS)

Si vous voyez des erreurs CORS dans la console :

**Solution** :
1. Vérifiez que le backend URL dans l'add-in est `https://localhost:8787` (pas `http`)
2. Redémarrez les serveurs
3. Rechargez la page

### Les catégories ne sont pas détectées

**Normal !** Les catégories Outlook ne sont pas toujours accessibles dans Outlook Online.

**Solution** : Sélectionnez manuellement le prompt à utiliser dans la liste déroulante.

## 🎨 Personnalisation

### Créer des prompts pour vos catégories

1. Dans Outlook, créez des catégories (ex : "Urgent", "Client VIP", "Support")
2. Dans l'admin de l'add-in, créez des prompts correspondants :

**Exemple : Catégorie "Urgent"**
```
Catégorie : Urgent
Nom : Réponse urgente
Priorité : 10
Template : Accuse réception immédiatement. Confirme la prise en compte de l'urgence. Propose une solution rapide ou un délai précis. Sois concis.
```

**Exemple : Catégorie "Support"**
```
Catégorie : Support
Nom : Réponse support client
Priorité : 50
Template : Réponds avec empathie. Résume le problème pour confirmer la compréhension. Propose une solution étape par étape. Demande si le client a besoin d'aide supplémentaire.
```

### Ordre de sélection des prompts

Le système sélectionne le prompt dans cet ordre :
1. Prompt avec catégorie correspondante et priorité la plus basse (ex: 10 avant 50)
2. Prompt avec catégorie `*` (fallback)

## 📊 Tester avec un email de test

Pour tester rapidement :

1. Dans Outlook Online, créez un **nouveau message**
2. Dans "À", mettez votre propre adresse
3. Objet : `Test add-in IA`
4. Corps :
   ```
   Bonjour,

   Pourriez-vous me donner une mise à jour sur le projet XYZ ?
   J'aimerais savoir où nous en sommes et quand nous pourrons livrer.

   Merci,
   Client
   ```
5. **Envoyez** l'email
6. **Recevez** l'email dans votre boîte
7. Cliquez sur **"Répondre"**
8. Ouvrez l'add-in **"AI Draft"**
9. Cliquez sur **"Générer le brouillon"**
10. La réponse générée devrait apparaître

## 🔄 Mettre à jour l'add-in

Si vous modifiez le code :

1. **Rechargez les serveurs**
   ```bash
   # Arrêtez avec Ctrl+C puis relancez
   cd server && npm run dev
   cd addin && npm run dev
   ```

2. **Dans Outlook Online**
   - Rechargez la page (Ctrl + F5)
   - Ou fermez/rouvrez l'add-in

3. **Si le manifest change**
   - Désinstallez l'ancien add-in (Paramètres → Gérer les compléments)
   - Réinstallez avec le nouveau manifest

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur (F12) pour voir les erreurs
2. Vérifiez que les serveurs sont démarrés
3. Consultez le [README.md](README.md) pour plus d'informations

## ✅ Checklist de vérification

Avant de demander de l'aide, vérifiez :

- [ ] Les deux serveurs (backend + addin) sont démarrés
- [ ] Les certificats HTTPS sont acceptés dans le navigateur
- [ ] `https://localhost:8787/health` retourne `{"ok":true}`
- [ ] `https://localhost:3000/src/admin.html` s'affiche
- [ ] La clé OpenAI est enregistrée dans l'admin
- [ ] Au moins un prompt existe (catégorie `*`)
- [ ] L'add-in est installé dans Outlook (Paramètres → Gérer les compléments)
- [ ] Outlook a été rechargé (Ctrl + F5)

## 🎉 Prochaines étapes

Une fois l'add-in installé et fonctionnel :

1. Créez des prompts pour vos catégories spécifiques
2. Testez avec différents types d'emails
3. Ajustez les templates de prompts selon vos besoins
4. Partagez avec votre équipe !
