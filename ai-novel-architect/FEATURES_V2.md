# AI Novel Architect - Version 2 Features

## 🆕 Nouvelles Fonctionnalités Majeures

### 1. 🌍 Sélection de Langue

L'utilisateur peut désormais choisir la langue dans laquelle il souhaite écrire son roman:
- Français (fr)
- Anglais (en)
- Espagnol (es)
- Allemand (de)
- Italien (it)
- Portugais (pt)

Le Ghostwriter AI s'adapte automatiquement à la langue sélectionnée et produit du contenu exclusivement dans cette langue.

### 2. 📖 Système de Sous-Chapitres

#### Structure Hiérarchique
Chaque chapitre peut maintenant être divisé en sous-chapitres:
```
Chapitre 1: Le Début
├── Sous-chapitre 1.1: L'éveil
├── Sous-chapitre 1.2: La découverte
└── Sous-chapitre 1.3: Le départ
```

#### Instructions Ghostwriter Détaillées
Chaque sous-chapitre contient des **instructions détaillées** pour le Ghostwriter AI:
- Éléments narratifs spécifiques à inclure
- Émotions et ambiances à transmettre
- Dialogues clés ou informations à révéler
- Références aux événements précédents

#### Génération Individuelle
Les sous-chapitres peuvent être générés:
- Individuellement (un par un)
- En bloc (tout le chapitre d'un coup)

### 3. 🧠 "Brain Dump" Import Amélioré

Lors de l'utilisation du mode **Import Rapide** (Raw Text), l'IA Architect effectue maintenant:

#### Analyse Intelligente
1. **Découpage automatique** en chapitres et sous-chapitres
2. **Extraction des instructions Ghostwriter** depuis le texte brut
3. **Structuration cohérente** de l'histoire

#### Exemple de Transformation

**Input utilisateur (notes en vrac):**
```
C'est l'histoire de Jean, un boulanger à Paris qui découvre un secret.
Chapitre 1: Jean ouvre sa boulangerie tôt le matin.
Il trouve une lettre mystérieuse.
Il est troublé et ne sait pas quoi faire.

Chapitre 2: Jean enquête sur la lettre...
```

**Output AI Architect:**
```json
{
  "outline": [
    {
      "chapter_index": 1,
      "title": "La Découverte",
      "subchapters": [
        {
          "subchapter_index": 1,
          "title": "L'aube à la boulangerie",
          "ghostwriter_instructions": "Décris Jean ouvrant sa boulangerie tôt le matin. Ambiance calme, ville endormie. Montre sa routine habituelle."
        },
        {
          "subchapter_index": 2,
          "title": "La lettre mystérieuse",
          "ghostwriter_instructions": "Jean trouve une lettre glissée sous la porte. Décris sa réaction, sa surprise. Ne révèle pas encore le contenu complet."
        },
        {
          "subchapter_index": 3,
          "title": "Le trouble",
          "ghostwriter_instructions": "Jean lit la lettre. Il est troublé et confus. Montre ses pensées chaotiques. Termine sur son indécision."
        }
      ]
    }
  ]
}
```

### 4. ⚙️ Paramètres d'Écriture Personnalisables

#### Paramètres Globaux (Livre)
- Nombre de mots par sous-chapitre
- Style d'écriture
- Niveau de détail
- Longueur des paragraphes

#### Paramètres Spécifiques (Chapitre)
Possibilité de définir des paramètres différents pour chaque chapitre.

```typescript
interface WritingSettings {
  wordCount: number;
  style: string; // "descriptif", "dialogues", "action"
  detailLevel: 'concise' | 'balanced' | 'detailed';
  paragraphLength: 'short' | 'medium' | 'long';
}
```

### 5. 📝 Gestion Flexible des Chapitres

#### Opérations Disponibles
- ✅ **Ajouter** un nouveau chapitre à la fin
- ✅ **Insérer** un chapitre entre deux chapitres existants
- ✅ **Supprimer** un chapitre
- ✅ **Réorganiser** l'ordre des chapitres

#### Ré-indexation Automatique
Lors de l'insertion ou suppression, les indices des chapitres sont automatiquement réajustés.

### 6. 🎯 Cohérence Narrative Renforcée

#### Règles Strictes pour le Ghostwriter
1. **TOUJOURS** respecter l'état actuel des personnages
2. **TOUJOURS** maintenir la continuité avec les chapitres précédents
3. **TOUJOURS** suivre les instructions détaillées du sous-chapitre
4. **JAMAIS** contredire les événements passés

#### Vérification Multi-Niveaux
- Cohérence au niveau des personnages (Bible)
- Cohérence au niveau des chapitres précédents
- Cohérence au niveau des sous-chapitres précédents (même chapitre)

### 7. 🔄 Workflow Amélioré

#### Ancien Workflow
```
1. Créer projet
2. Générer plan
3. Écrire chapitre entier
4. Auditer
5. Valider
```

#### Nouveau Workflow
```
1. Créer projet (avec langue)
2. Générer plan avec sous-chapitres et instructions
3. Pour chaque chapitre:
   a. Voir les sous-chapitres et leurs instructions
   b. Générer sous-chapitre 1 (ou tous d'un coup)
   c. Voir le résultat, ajuster si besoin
   d. Générer sous-chapitre 2
   e. etc.
4. Auditer le chapitre complet
5. Valider
```

## 🏗️ Architecture Backend Modifiée

### Types TypeScript

```typescript
// Metadata avec langue
interface BookMetadata {
  language: string; // NEW
  // ... autres champs
}

// Paramètres d'écriture
interface WritingSettings {
  wordCount: number;
  style: string;
  detailLevel: 'concise' | 'balanced' | 'detailed';
  paragraphLength: 'short' | 'medium' | 'long';
}

// Sous-chapitre
interface Subchapter {
  subchapter_index: number;
  title: string;
  ghostwriter_instructions: string; // CRITICAL
  content?: string;
  wordCount?: number;
  status: 'draft' | 'in_progress' | 'completed' | 'validated';
}

// Chapitre mis à jour
interface Chapter {
  // ... champs existants
  ghostwriter_instructions?: string; // Instructions globales
  subchapters: Subchapter[]; // NEW
  writingSettings?: WritingSettings; // NEW
}

// Projet avec paramètres par défaut
interface ProjectData {
  // ... champs existants
  defaultWritingSettings?: WritingSettings; // NEW
}
```

### Agents IA Modifiés

#### 1. Architect Agent
- ✅ Génère des sous-chapitres avec instructions détaillées
- ✅ Mode Raw: Extrait les instructions depuis les notes
- ✅ Découpage intelligent selon le nombre de chapitres demandé

#### 2. Ghostwriter Agent
- ✅ Nouveau: `writeSubchapter()` - Génère un sous-chapitre individuel
- ✅ Amélioré: `writeChapter()` - Génère tous les sous-chapitres ou le chapitre entier
- ✅ Respect strict des instructions Ghostwriter
- ✅ Support multi-langue
- ✅ Application des paramètres d'écriture

#### 3. Auditor Agent
- ⚠️ À mettre à jour pour vérifier les sous-chapitres

#### 4. Archivist Agent
- ⚠️ À mettre à jour pour gérer les sous-chapitres

### Nouveaux Endpoints API (à implémenter)

```typescript
POST /api/project/initialize
  - Accepte targetChapterCount dans raw mode
  - Retourne structure avec sous-chapitres

POST /api/chapter/generate-subchapter
  Body: { projectId, chapterId, subchapterId, instructions? }

POST /api/chapter/add
  Body: { projectId, insertAfter?, chapterData }

POST /api/chapter/delete
  Body: { projectId, chapterId }
```

## 🎨 Interface Utilisateur (À Créer)

### 1. Page Onboarding Améliorée

#### Mode Wizard
- [ ] Ajout du sélecteur de langue
- [ ] Choix du nombre de chapitres souhaité

#### Mode Raw Import
- [ ] Ajout d'un champ "Nombre de chapitres souhaité"
- [ ] Message pendant l'analyse: "Extraction des instructions..."

### 2. Page Project Editor

Vue en arbre des chapitres:
```
📚 Mon Roman
  📖 Chapitre 1: Le Début [25% ✓]
    📄 1.1: L'éveil [✓]
    📄 1.2: La découverte [✓]
    📄 1.3: Le départ [⏳ en cours]
  📖 Chapitre 2: L'aventure [0%]
    📄 2.1: Le départ
    📄 2.2: La rencontre
```

Actions:
- [ ] Cliquer sur un sous-chapitre pour voir/éditer les instructions
- [ ] Bouton "Générer" sur chaque sous-chapitre
- [ ] Bouton "Générer tout le chapitre"
- [ ] Bouton "Ajouter un chapitre"
- [ ] Bouton "Insérer un chapitre ici"

### 3. Éditeur de Sous-Chapitre

```
┌─────────────────────────────────────────┐
│ Chapitre 1 > Sous-chapitre 1.2          │
├─────────────────────────────────────────┤
│ Instructions Ghostwriter:               │
│ ┌─────────────────────────────────────┐ │
│ │ Jean trouve une lettre sous la      │ │
│ │ porte. Décris sa surprise...        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Générer]  [Régénérer]                │
│                                         │
│ Contenu généré:                        │
│ ┌─────────────────────────────────────┐ │
│ │ Le soleil se levait à peine...      │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Valider]  [Éditer Instructions]       │
└─────────────────────────────────────────┘
```

### 4. Paramètres d'Écriture

Panel de configuration:
```
⚙️ Paramètres d'Écriture

  Nombre de mots: [800] par sous-chapitre

  Style: [Descriptif ▼]
    - Descriptif
    - Dialogues
    - Action
    - Mixte

  Niveau de détail: (●)Concis  (○)Équilibré  (○)Détaillé

  Paragraphes: (○)Courts  (●)Moyens  (○)Longs

  [Appliquer à tout le livre]  [Appliquer à ce chapitre]
```

## 🚀 Avantages pour l'Utilisateur

1. **Contrôle Granulaire**: Génération sous-chapitre par sous-chapitre
2. **Instructions Précises**: Chaque section a des directives claires pour l'IA
3. **Flexibilité Maximale**: Ajout/insertion de chapitres à tout moment
4. **Multi-Langue**: Écriture dans 6 langues différentes
5. **Cohérence Garantie**: Le Ghostwriter suit strictement les instructions et la Bible
6. **Workflow Efficace**: Brain Dump transformé automatiquement en plan détaillé

## 📊 Exemple Complet

### Input Utilisateur (Brain Dump)
```
Mon histoire parle de Marie, une détective privée à New York.
Elle reçoit un appel mystérieux concernant un meurtre.

Chapitre 1: Marie dans son bureau, reçoit l'appel. Elle est sceptique au début.
Ensuite elle décide d'accepter le cas. Elle appelle son assistant Tom.

Chapitre 2: Marie se rend sur la scène de crime...

Langue: Anglais
Nombre de chapitres: 2
```

### Output Architect
```json
{
  "book_metadata": {
    "title": "The Detective's Call",
    "language": "en",
    "genre": "Mystery/Thriller"
  },
  "outline": [
    {
      "chapter_index": 1,
      "title": "The Mysterious Call",
      "ghostwriter_instructions": "Establish Marie's character and routine",
      "subchapters": [
        {
          "subchapter_index": 1,
          "title": "A Quiet Morning",
          "ghostwriter_instructions": "Describe Marie in her New York office. Show her daily routine. Mood: calm before the storm. She's reviewing paperwork when the phone rings."
        },
        {
          "subchapter_index": 2,
          "title": "The Call",
          "ghostwriter_instructions": "Marie receives the mysterious call about the murder. Show her skepticism. The caller is anonymous but insistent. Dialogue-heavy section."
        },
        {
          "subchapter_index": 3,
          "title": "The Decision",
          "ghostwriter_instructions": "Marie weighs her options. Show internal monologue. Finally decides to take the case. Calls Tom, her assistant. End with her preparing to leave."
        }
      ]
    }
  ]
}
```

### Génération Subchapter 1.1
```
Input to Ghostwriter:
- Language: ENGLISH
- Instructions: "Describe Marie in her New York office. Show her daily routine..."
- Characters: Marie (Detective, 35, motivated by justice)

Output:
"The morning sun filtered through the blinds of Marie's cramped Manhattan office,
casting long shadows across stacks of case files..."
```

## ⚠️ Notes pour le Développeur

1. **Backward Compatibility**: Les anciens projets sans sous-chapitres doivent être gérés
2. **Index Management**: Lors de l'insertion/suppression, ré-indexer correctement
3. **Performance**: Générer tous les sous-chapitres peut prendre du temps - ajouter indicateurs de progression
4. **Cache Context**: Implémenter le Gemini File Upload pour optimiser les coûts
5. **Validation**: Vérifier que chaque sous-chapitre a des instructions avant génération
