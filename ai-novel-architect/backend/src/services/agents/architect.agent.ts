import { GeminiService } from '../gemini.service';
import { BookMetadata, ArchitectResponse } from '../../types';

export class ArchitectAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  async structureProject(input: BookMetadata | string, targetChapterCount?: number, withScenes: boolean = true): Promise<ArchitectResponse> {
    const isRawText = typeof input === 'string';

    const prompt = isRawText
      ? this.buildRawTextPrompt(input, targetChapterCount, withScenes)
      : this.buildFormPrompt(input, withScenes);

    try {
      const response = await this.gemini.generateContent(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Architect Agent Error:', error);
      throw new Error('Failed to structure project');
    }
  }

  private buildFormPrompt(metadata: BookMetadata, withScenes: boolean): string {
    const sceneInstruction = withScenes
      ? `5. Pour CHAQUE sous-chapitre, génère 2-4 SCÈNES avec Beat Sheet (description courte) et instructions Ghostwriter détaillées`
      : '';

    const sceneExample = withScenes
      ? `,
          "scenes": [
            {
              "scene_index": 1,
              "title": "Titre de la scène",
              "beat": "Description courte de ce qui se passe (Beat Sheet)",
              "ghostwriter_instructions": "Instructions ULTRA détaillées pour le Ghostwriter: Commence par..., Montre..., Termine par...",
              "status": "draft"
            }
          ]`
      : '';

    return `Tu es "The Architect", un agent IA expert en structure narrative et Beat Sheet.

Ta mission : Créer un plan détaillé de roman avec découpage en scènes.

INFORMATIONS DU PROJET:
- Titre: ${metadata.title}
- Pitch: ${metadata.pitch}
- Genre: ${metadata.genre}
- Public cible: ${metadata.targetAudience}
- Tonalité: ${metadata.tone}
- Point de vue: ${metadata.pov}
- Longueur cible: ${metadata.targetLength} mots
- Langue: ${metadata.language}
${metadata.inspirations ? `- Inspirations: ${metadata.inspirations}` : ''}

TÂCHE:
1. Génère un plan de chapitres cohérent (environ 20-25 chapitres)
2. Pour chaque chapitre, crée 3-5 sous-chapitres
3. Crée des fiches détaillées pour les personnages principaux
4. Assure une structure narrative solide avec un arc dramatique
${sceneInstruction}

IMPORTANT - Instructions Ghostwriter:
Les instructions doivent être ULTRA PRÉCISES et inclure:
- Actions spécifiques des personnages
- Émotions et ambiances à transmettre
- Dialogues clés ou informations à révéler
- Références aux événements/personnages/lieux
- Transitions narratives

RÉPONSE (JSON STRICT):
{
  "book_metadata": {
    "title": "...",
    "pitch": "...",
    "genre": "...",
    "targetAudience": "...",
    "tone": "...",
    "pov": "...",
    "targetLength": 0,
    "language": "fr"
  },
  "outline": [
    {
      "chapter_index": 1,
      "title": "Titre du chapitre",
      "summary": "Résumé détaillé de ce qui se passe",
      "cliffhanger": "Comment le chapitre se termine de manière captivante",
      "ghostwriter_instructions": "Instructions globales pour tout le chapitre",
      "subchapters": [
        {
          "subchapter_index": 1,
          "title": "Titre du sous-chapitre",
          "ghostwriter_instructions": "Instructions globales pour le sous-chapitre"${sceneExample},
          "status": "draft"
        }
      ],
      "status": "draft"
    }
  ],
  "characters": [
    {
      "name": "Nom du personnage",
      "role": "Protagoniste/Antagoniste/Secondaire",
      "initial_state": {
        "age": 0,
        "occupation": "...",
        "motivation": "...",
        "fears": "...",
        "location": "..."
      },
      "description": "Description physique et psychologique"
    }
  ]
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;
  }

  private buildRawTextPrompt(rawText: string, targetChapterCount?: number, withScenes: boolean = true): string {
    const chapterInstruction = targetChapterCount
      ? `Découpe le contenu en EXACTEMENT ${targetChapterCount} chapitres.`
      : `Découpe le contenu en un nombre approprié de chapitres (généralement 20-25).`;

    const sceneInstruction = withScenes
      ? `5. Pour CHAQUE sous-chapitre, extrais ou crée 2-4 SCÈNES avec:
   - Beat (description courte de ce qui se passe)
   - Instructions Ghostwriter ULTRA détaillées`
      : '';

    const sceneExample = withScenes
      ? `,
            "scenes": [
              {
                "scene_index": 1,
                "title": "Titre de la scène",
                "beat": "Description courte (Beat Sheet) extraite des notes",
                "ghostwriter_instructions": "Instructions DÉTAILLÉES extraites ou déduites des notes. Minimum 3-4 phrases avec actions concrètes.",
                "status": "draft"
              }
            ]`
      : '';

    return `Tu es "The Architect", un agent IA expert en structure narrative et Beat Sheet.

Ta mission : Analyser les notes et créer un plan structuré avec découpage en scènes.

NOTES BRUTES:
${rawText}

TÂCHE CRITIQUE:
1. Identifie le concept principal et crée un pitch cohérent
2. Extrais les personnages mentionnés et crée leurs fiches complètes
3. ${chapterInstruction}
4. Pour CHAQUE chapitre, fais un découpage en sous-chapitres (3-5 par chapitre)
${sceneInstruction}
6. Détermine le genre, le ton, la langue, et les autres métadonnées

IMPORTANT - Extraction d'instructions:
- Si les notes contiennent du contenu narratif DÉTAILLÉ, extrais-le comme instructions + beats
- Si les notes sont vagues, déduis des instructions cohérentes et précises
- Chaque scène doit avoir un BEAT (ce qui se passe) et des INSTRUCTIONS (comment l'écrire)
- Les instructions doivent être ACTIONNABLES et PRÉCISES

EXEMPLE de scène bien extraite:
Notes: "Jean entre dans la boulangerie. Il est nerveux. Marie lui demande ce qui ne va pas."

Extraction:
{
  "scene_index": 1,
  "title": "L'arrivée troublée",
  "beat": "Jean entre dans la boulangerie, visiblement nerveux.",
  "ghostwriter_instructions": "Décris Jean poussant la porte de la boulangerie. Montre sa nervosité à travers des gestes (mains tremblantes, regard fuyant). Marie est derrière le comptoir, le remarque immédiatement. Dialogue: Marie demande 'Qu'est-ce qui ne va pas, Jean?' avec inquiétude. Insiste sur le contraste entre la chaleur de la boulangerie et l'état troublé de Jean.",
  "status": "draft"
}

RÉPONSE (JSON STRICT):
{
  "book_metadata": {
    "title": "Titre déduit ou suggéré",
    "pitch": "Pitch créé à partir des notes",
    "genre": "Genre identifié",
    "targetAudience": "Public cible suggéré",
    "tone": "Tonalité identifiée",
    "pov": "POV suggéré",
    "targetLength": 80000,
    "language": "Langue détectée (fr, en, es...)"
  },
  "outline": [
    {
      "chapter_index": 1,
      "title": "Titre du chapitre extrait ou suggéré",
      "summary": "Résumé détaillé",
      "cliffhanger": "Cliffhanger suggéré",
      "ghostwriter_instructions": "Instructions globales pour ce chapitre",
      "subchapters": [
        {
          "subchapter_index": 1,
          "title": "Titre du sous-chapitre",
          "ghostwriter_instructions": "Instructions globales pour le sous-chapitre"${sceneExample},
          "status": "draft"
        }
      ],
      "status": "draft"
    }
  ],
  "characters": [
    {
      "name": "Nom extrait des notes",
      "role": "Rôle identifié",
      "initial_state": {
        "Détails extraits des notes..."
      },
      "description": "Description construite"
    }
  ]
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;
  }

  private parseResponse(response: string): ArchitectResponse {
    try {
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;

      const parsed = JSON.parse(jsonString);

      // Ensure subchapters and scenes arrays exist
      if (parsed.outline) {
        parsed.outline = parsed.outline.map((chapter: any) => ({
          ...chapter,
          subchapters: (chapter.subchapters || []).map((sub: any) => ({
            ...sub,
            scenes: sub.scenes || [],
            status: sub.status || 'draft'
          })),
          status: chapter.status || 'draft'
        }));
      }

      return parsed;
    } catch (error) {
      console.error('Failed to parse Architect response:', error);
      throw new Error('Invalid response format from Architect');
    }
  }
}
