# AI Novel Architect - Scene-Level Workflow Guide

## 📖 Overview

The Scene-Level Granularity System (Beat Sheet Mode) provides the **finest level of narrative control** in AI Novel Architect. This 3-tier hierarchical structure enables writers to work at the most granular level:

```
📚 Book
  └── 📖 Chapter
      └── 📄 Subchapter
          └── 🎬 Scene (Beat Sheet)
```

## 🎯 What is a Scene?

A **Scene** is the smallest unit of narrative in your novel. Each scene contains:

| Field | Description | Example |
|-------|-------------|---------|
| **scene_index** | Sequential number within subchapter | `1`, `2`, `3` |
| **title** | Short, evocative name | `"L'éveil brutal"` |
| **beat** | 1-sentence description of what happens | `"Marie se réveille en sursaut, désorientée."` |
| **ghostwriter_instructions** | Detailed AI writing instructions (2-4 sentences minimum) | `"Commence par décrire le réveil brutal de Marie..."` |
| **content** | Generated text (populated after writing) | `"Le soleil se levait à peine..."` |
| **wordCount** | Word count of generated content | `347` |
| **status** | Current state | `draft`, `in_progress`, `completed`, `validated` |

## 🔄 Scene Workflow

### Method 1: Guided Creation (Form-Based)

1. **Fill Project Metadata**
   - Title, genre, language, etc.
   - Select "Guided Creation" mode

2. **Architect Generates Structure**
   ```json
   {
     "outline": [
       {
         "chapter_index": 1,
         "subchapters": [
           {
             "subchapter_index": 1,
             "scenes": [
               {
                 "scene_index": 1,
                 "title": "L'éveil brutal",
                 "beat": "Marie se réveille en sursaut, désorientée.",
                 "ghostwriter_instructions": "Commence par décrire le réveil brutal de Marie dans son appartement sombre. Elle est confuse, transpire. Montre ses pensées chaotiques alors qu'elle se rappelle du cauchemar. Ambiance oppressante. Termine par elle allumant la lumière, la peur encore visible sur son visage."
               }
             ]
           }
         ]
       }
     ]
   }
   ```

3. **Review & Edit Beat Sheet**
   - View all scenes in the subchapter
   - Edit titles, beats, or instructions
   - Add/remove/reorder scenes

4. **Generate Scene-by-Scene**
   - Click "Generate" on individual scenes
   - OR generate entire subchapter at once

### Method 2: Brain Dump Import (Raw Text)

#### Input Example (User's Messy Notes)

```
C'est l'histoire de Marie, une détective à New York.

Chapitre 1: Marie dans son bureau
Elle reçoit un appel mystérieux sur son téléphone.
L'homme au bout du fil parle d'un meurtre.
Marie est sceptique au début mais quelque chose dans la voix de l'homme l'intrigue.

Elle regarde par la fenêtre en réfléchissant.
La nuit tombe sur Manhattan.

Elle décide finalement d'accepter le cas.
Elle appelle son assistant Tom pour lui demander de préparer son équipement.

Langue: Anglais
Nombre de chapitres: 1
```

#### Architect Output (Structured with Scenes)

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
      "summary": "Marie, a NYC detective, receives a mysterious call about a murder and decides to take the case.",
      "subchapters": [
        {
          "subchapter_index": 1,
          "title": "A Quiet Evening",
          "ghostwriter_instructions": "Establish Marie in her office, create calm atmosphere before the call.",
          "scenes": [
            {
              "scene_index": 1,
              "title": "The Call Arrives",
              "beat": "Marie receives a mysterious phone call about a murder.",
              "ghostwriter_instructions": "Describe Marie in her New York office when the phone rings. Show her picking up the call. The voice on the other end mentions a murder. Keep the dialogue cryptic but intriguing. Marie's expression should show initial skepticism.",
              "status": "draft"
            },
            {
              "scene_index": 2,
              "title": "Doubt and Reflection",
              "beat": "Marie looks out the window, uncertain about the call.",
              "ghostwriter_instructions": "Marie walks to the window after hanging up. Describe the Manhattan skyline as night falls. Show her internal conflict - skepticism versus curiosity. The stranger's voice echoes in her mind. Keep the pacing slow and reflective.",
              "status": "draft"
            },
            {
              "scene_index": 3,
              "title": "The Decision",
              "beat": "Marie decides to take the case and calls Tom.",
              "ghostwriter_instructions": "Marie makes her decision. Show the moment she picks up her phone to call Tom. Dialogue: She asks him to prepare her investigation kit. Tom's surprised reaction. End with Marie grabbing her coat, determined look on her face.",
              "status": "draft"
            }
          ]
        }
      ]
    }
  ]
}
```

**🔥 Key Transformation:**
- **Raw notes** → **Structured scenes with beats**
- **Vague descriptions** → **Detailed Ghostwriter instructions**
- **Mixed languages** → **Consistent target language**
- **Unorganized thoughts** → **Narrative progression**

## 🤖 AI Agents

### 1. Architect Agent

**Role:** Structures your story into chapters, subchapters, and scenes.

**Capabilities:**
- ✅ Generates scene beats from project metadata
- ✅ **Extracts scene beats from Brain Dump notes**
- ✅ Creates detailed Ghostwriter instructions for each scene
- ✅ Ensures logical narrative progression

**Example Prompt (Brain Dump Mode):**
```
NOTES BRUTES:
Marie entre dans la boulangerie. Elle est nerveuse.
Jean lui demande ce qui ne va pas.

TÂCHE: Extrais les scènes avec beats et instructions détaillées.

OUTPUT:
{
  "scenes": [
    {
      "scene_index": 1,
      "title": "L'arrivée troublée",
      "beat": "Marie entre dans la boulangerie, visiblement nerveuse.",
      "ghostwriter_instructions": "Décris Marie poussant la porte de la boulangerie. Montre sa nervosité à travers des gestes (mains tremblantes, regard fuyant). Jean est derrière le comptoir, la remarque immédiatement. Dialogue: Marie demande 'Qu'est-ce qui ne va pas, Jean?' avec inquiétude. Insiste sur le contraste entre la chaleur de la boulangerie et l'état troublé de Marie."
    }
  ]
}
```

### 2. Beatsheet Agent (NEW)

**Role:** Generates a list of scenes (Beat Sheet) from a chapter/subchapter summary.

**When to Use:**
- You have a chapter summary but need scene breakdown
- You want to refine narrative pacing before writing
- You need to add scenes to an existing subchapter

**API Call:**
```typescript
POST /api/beatsheet/generate
{
  "projectId": "project_123",
  "chapterId": "1",
  "subchapterId": "1",
  "summary": "Marie investigates the crime scene and discovers a crucial clue.",
  "targetSceneCount": 4
}

Response:
{
  "scenes": [
    {
      "scene_index": 1,
      "title": "Arrival at the Scene",
      "beat": "Marie arrives at the abandoned warehouse.",
      "ghostwriter_instructions": "...",
      "status": "draft"
    },
    // ... 3 more scenes
  ]
}
```

### 3. Ghostwriter Agent

**Role:** Writes the actual narrative content for scenes, subchapters, or chapters.

**Multi-Level Generation:**

```typescript
// Generate a single scene (300-500 words)
writeScene(projectData, chapterIndex: 1, subchapterIndex: 1, sceneIndex: 1)

// Generate entire subchapter (combines all scenes)
writeSubchapter(projectData, chapterIndex: 1, subchapterIndex: 1)

// Generate entire chapter (combines all subchapters)
writeChapter(projectData, chapterIndex: 1)
```

**Scene Generation Prompt Structure:**
```
LANGUE: [Selected Language Instructions]

CONTEXTE DU LIVRE: [Metadata]

PERSONNAGES: [Character States]

SCÈNES PRÉCÉDENTES: [Previous scenes in THIS subchapter]

SCÈNE À ÉCRIRE:
- Titre: "The Call Arrives"
- Beat: "Marie receives a mysterious phone call"
- Instructions: "Describe Marie in her office when the phone rings..."

RÈGLES CRITIQUES:
1. RESPECTE EXACTEMENT le beat et les instructions
2. ASSURE la continuité avec les scènes précédentes
3. MAINTIENS la cohérence des personnages
4. Concentre-toi UNIQUEMENT sur cette scène
```

## 🛠️ API Endpoints

### Scene Management

```typescript
// Generate Beat Sheet from summary
POST /api/beatsheet/generate
Body: {
  projectId: string
  chapterId: string
  subchapterId: string
  summary: string
  targetSceneCount?: number
}

// Generate scene content
POST /api/scene/generate
Body: {
  projectId: string
  chapterId: string
  subchapterId: string
  sceneId: string
  userInstructions?: string
}

// Add new scene
POST /api/scene/add
Body: {
  projectId: string
  chapterId: string
  subchapterId: string
  insertAfter?: number  // If specified, inserts after this scene
  sceneData: Partial<Scene>
}

// Update scene
PUT /api/scene/update
Body: {
  projectId: string
  chapterId: string
  subchapterId: string
  sceneId: number
  updates: Partial<Scene>  // Can update title, beat, instructions, etc.
}

// Delete scene
DELETE /api/scene/delete
Body: {
  projectId: string
  chapterId: string
  subchapterId: string
  sceneId: number
}

// Reorder scene
POST /api/scene/reorder
Body: {
  projectId: string
  chapterId: string
  subchapterId: string
  sceneId: number
  newPosition: number
}
```

### Chapter Management

```typescript
// Add chapter (append or insert)
POST /api/chapter/add
Body: {
  projectId: string
  insertAfter?: number  // If specified, inserts after this chapter
  chapterData: Partial<Chapter>
}

// Delete chapter
DELETE /api/chapter/delete
Body: {
  projectId: string
  chapterId: number
}

// Reorder chapter
POST /api/chapter/reorder
Body: {
  projectId: string
  chapterId: number
  newPosition: number
}
```

## 💡 Best Practices

### 1. Brain Dump Extraction Quality

**Good Notes (AI can extract well):**
```
Chapitre 1: La rencontre
Jean entre dans le café. Il est nerveux parce qu'il va rencontrer son ex.
Marie est déjà assise à une table près de la fenêtre.
Ils se regardent. Silence gênant.
Jean s'assoit. Marie commence à parler de leur passé.
```

**Better Notes (More details = Better instructions):**
```
Chapitre 1: La rencontre au café

Scène 1: Jean arrive
Jean pousse la porte du café "Chez Margot". Il est nerveux, ses mains tremblent.
Il voit Marie assise près de la fenêtre, elle regarde dehors.
Il hésite avant d'avancer.

Scène 2: Le face-à-face
Jean s'assoit en face de Marie. Silence pesant.
Marie le regarde enfin. Ses yeux sont tristes.
"Il fallait qu'on parle", dit-elle doucement.

Scène 3: Les souvenirs
Marie évoque leur première rencontre il y a 5 ans.
Jean écoute, mal à l'aise. Il sait où cette conversation mène.
```

**Why Better?**
- Explicit scene separation
- Emotional states mentioned
- Dialogue included
- Sensory details (trembling hands, sad eyes)

### 2. Scene Beat Sheet Guidelines

| Element | Do ✅ | Don't ❌ |
|---------|-------|----------|
| **Beat** | 1 sentence, clear action | Long paragraph with multiple events |
| **Title** | Evocative, 2-4 words | Generic ("Scene 1") |
| **Instructions** | 2-4 sentences minimum, specific actions, emotions, dialogue cues | Vague ("Write about Marie") |
| **Progression** | Each scene advances the plot | Redundant or circular scenes |

### 3. Scene Length

| Type | Word Count | Use Case |
|------|------------|----------|
| **Short Scene** | 200-400 | Action beats, quick dialogue exchanges |
| **Medium Scene** | 400-800 | Standard narrative progression |
| **Long Scene** | 800-1500 | Climactic moments, emotional scenes |

**Configure in WritingSettings:**
```typescript
{
  wordCount: 600,  // Per subchapter (divided by ~3 for scenes)
  style: "dialogues",
  detailLevel: "balanced",
  paragraphLength: "medium"
}
```

## 🎨 User Interface (Recommended)

### Scene Editor View

```
┌─────────────────────────────────────────────────────────────┐
│ Chapter 1 > Subchapter 1.2 > Beat Sheet Editor             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🎬 Scene 1: The Call Arrives                       [Edit]  │
│ ├─ Beat: Marie receives a mysterious phone call            │
│ ├─ Instructions: Describe Marie in her office when...      │
│ ├─ Status: ✓ Completed (347 words)                         │
│ └─ [Regenerate] [View Content] [▼] [▲] [🗑️]              │
│                                                             │
│ 🎬 Scene 2: Doubt and Reflection                  [Edit]  │
│ ├─ Beat: Marie looks out the window, uncertain             │
│ ├─ Instructions: Marie walks to the window after...        │
│ ├─ Status: ⏳ Draft                                        │
│ └─ [Generate] [▼] [▲] [🗑️]                                │
│                                                             │
│ 🎬 Scene 3: The Decision                          [Edit]  │
│ ├─ Beat: Marie decides to take the case                    │
│ ├─ Instructions: Marie makes her decision. Show...         │
│ ├─ Status: ⏳ Draft                                        │
│ └─ [Generate] [▼] [▲] [🗑️]                                │
│                                                             │
│ [+ Add Scene] [Generate All] [Export Beat Sheet]           │
└─────────────────────────────────────────────────────────────┘
```

### Scene Content Viewer

```
┌─────────────────────────────────────────────────────────────┐
│ Scene 1: The Call Arrives (347 words)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ The office was quiet except for the hum of the old air     │
│ conditioner. Marie sat at her desk, reviewing case files   │
│ from last month. The phone rang, cutting through the       │
│ silence like a knife.                                       │
│                                                             │
│ She picked up on the third ring. "Marie Thompson."         │
│                                                             │
│ "I need your help," a man's voice said, low and urgent.    │
│ "There's been a murder."                                    │
│                                                             │
│ Marie frowned. "Who is this?"                              │
│                                                             │
│ [... rest of content ...]                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Edit Content] [Regenerate] [Validate] [Next Scene →]     │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Complete Workflow Example

### Scenario: Writing a Mystery Novel in English

**Step 1: Initial Brain Dump**
```
Title: The Last Witness
Language: English
Chapters: 3

My story is about Detective Sarah Chen who investigates
a series of murders in San Francisco.

Chapter 1: The First Murder
Sarah gets called to a crime scene in Chinatown.
The victim is a young woman, no ID.
Sarah finds a strange symbol carved into the wall.
She photographs everything and talks to witnesses.
Nobody saw anything (or they're not talking).

Chapter 2: The Connection
Sarah discovers the symbol is from an old Tong gang.
She visits the gang's former leader in prison.
He warns her to drop the case.
Sarah refuses. That night, someone follows her home.

Chapter 3: The Truth
Sarah realizes the murders are connected to a cold case from 20 years ago.
The killer is someone from her own precinct.
Confrontation in the evidence room.
Sarah survives but the killer escapes.
```

**Step 2: Architect Analysis**
```json
{
  "book_metadata": {
    "title": "The Last Witness",
    "language": "en",
    "genre": "Mystery/Crime Thriller"
  },
  "outline": [
    {
      "chapter_index": 1,
      "title": "The First Murder",
      "subchapters": [
        {
          "subchapter_index": 1,
          "title": "Crime Scene Investigation",
          "scenes": [
            {
              "scene_index": 1,
              "title": "The Call",
              "beat": "Sarah receives an urgent call about a murder in Chinatown.",
              "ghostwriter_instructions": "Sarah is at home having coffee when her phone rings. It's dispatch - homicide in Chinatown. Show her grabbing her badge and gun, the routine transformed by urgency. Brief dialogue with dispatch confirming address."
            },
            {
              "scene_index": 2,
              "title": "Arrival at the Scene",
              "beat": "Sarah arrives at the crime scene and surveys the area.",
              "ghostwriter_instructions": "Describe the narrow alley in Chinatown - neon signs, smell of food mixed with something darker. Police tape, forensics team already working. Sarah ducks under the tape, showing her badge. The body is visible - young woman, no visible ID."
            },
            {
              "scene_index": 3,
              "title": "The Symbol",
              "beat": "Sarah discovers a strange symbol carved into the wall.",
              "ghostwriter_instructions": "Sarah kneels by the body, then notices the wall. A symbol - intricate, deliberate, carved not drawn. She photographs it from multiple angles. Her internal monologue: this isn't random. Someone is sending a message."
            },
            {
              "scene_index": 4,
              "title": "Witness Interviews",
              "beat": "Sarah questions witnesses, but nobody will talk.",
              "ghostwriter_instructions": "Sarah approaches a group of locals watching from nearby. She asks in basic Mandarin about what they saw. Head shakes, averted eyes. An old woman starts to speak but is pulled away by her daughter. The wall of silence is familiar but frustrating."
            }
          ]
        }
      ]
    }
  ]
}
```

**Step 3: Scene Generation**

**Generating Scene 1:**
```
Input to Ghostwriter:
- Language: ENGLISH
- Beat: "Sarah receives an urgent call about a murder in Chinatown."
- Instructions: "Sarah is at home having coffee when her phone rings..."

Output (Generated Content):
"The morning sun streamed through Sarah Chen's apartment window as she
took her first sip of coffee. The bitter warmth was just starting to
wake her brain when her phone buzzed against the kitchen counter.

She glanced at the screen. Dispatch.

'Detective Chen,' she answered, already setting down the mug.

'We've got a homicide in Chinatown,' the dispatcher's voice was clipped,
professional. 'Grant Avenue, near Washington. Victim is female,
twenties, no ID on scene.'

Sarah was already moving toward her bedroom. 'I'm twenty minutes out.
Who's first on scene?'

'Officer Martinez. He's securing the perimeter now.'

'Tell him I'm on my way.' She ended the call and grabbed her badge from
the nightstand. The coffee would have to wait. It always did."

[Scene 1 Status: Completed - 134 words]
```

**Step 4: Review & Iterate**

User reviews Scene 1 content:
- ✅ Good pacing
- ✅ Character voice is right
- ❌ Too short (need more description)

**Action:** Regenerate with additional instructions:
```
Additional Instructions: "Add more sensory details about Sarah's apartment.
Show her morning routine being interrupted. Make it 300 words minimum."
```

**Step 5: Complete Subchapter**

Once all 4 scenes are validated:
- Scene 1: The Call (327 words) ✓
- Scene 2: Arrival at the Scene (412 words) ✓
- Scene 3: The Symbol (389 words) ✓
- Scene 4: Witness Interviews (356 words) ✓

**Total Subchapter Content:** 1,484 words

**Step 6: Export to WORD**

Final novel structure:
```
THE LAST WITNESS
by [Author Name]

Chapter 1: The First Murder

The morning sun streamed through Sarah Chen's apartment window...
[Complete scene 1 content]

The narrow alley in Chinatown was a sensory assault...
[Complete scene 2 content]

[... etc.]
```

## 📊 Benefits of Scene-Level Workflow

| Benefit | Description |
|---------|-------------|
| **🎯 Precision Control** | Edit individual beats before committing to full text generation |
| **💰 Cost Efficiency** | Generate only scenes you need, not entire chapters at once |
| **🔄 Easy Iterations** | Regenerate single scenes without affecting others |
| **📝 Better Planning** | Review narrative flow via Beat Sheet before writing |
| **🧠 Brain Dump Friendly** | AI extracts granular scenes from messy notes |
| **🌍 Multi-Language** | Works seamlessly across all 6 supported languages |
| **⚡ Faster Feedback** | See results scene-by-scene (300-500 words) vs. chapter-by-chapter (3000+ words) |

## 🔮 Future Enhancements

### Planned Features

1. **Scene Templates**
   - Pre-built templates for common scene types
   - Examples: "Action Scene", "Dialogue-Heavy", "Descriptive Establishing Shot"

2. **Beat Sheet Library**
   - Save and reuse beat patterns
   - Import beat sheets from other projects

3. **Visual Beat Board**
   - Drag-and-drop scene reordering
   - Color-coded by status (draft/completed/validated)
   - Timeline view of narrative progression

4. **AI Scene Suggestions**
   - AI recommends missing scenes based on chapter summary
   - "Your chapter might benefit from a transition scene between 2 and 3"

5. **Scene Analytics**
   - Pacing analysis (scene length distribution)
   - Dialogue vs. description ratio per scene
   - Character presence heatmap

## 📚 Related Documentation

- [FEATURES_V2.md](./FEATURES_V2.md) - Version 2 Features Overview
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Development Status
- [README.md](./README.md) - Project Overview

## 🤝 Contributing

If you're extending the scene system, please ensure:

1. **Type Safety:** All scene operations use the `Scene` interface
2. **Index Management:** Auto-reindex scenes when adding/deleting
3. **Validation:** Check `ghostwriter_instructions` exists before generation
4. **Multi-Language:** Test with all 6 supported languages
5. **Backward Compatibility:** Handle projects without scenes gracefully

---

**Version:** 2.1.0
**Last Updated:** 2026-01-09
**Author:** AI Novel Architect Team
