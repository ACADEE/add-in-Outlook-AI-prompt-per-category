import { GeminiService } from '../gemini.service';
import { BookMetadata, ArchitectResponse } from '../../types';

export class ArchitectAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  async structureProject(input: BookMetadata | string): Promise<ArchitectResponse> {
    const isRawText = typeof input === 'string';

    const prompt = isRawText
      ? this.buildRawTextPrompt(input)
      : this.buildFormPrompt(input);

    try {
      const response = await this.gemini.generateContent(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Architect Agent Error:', error);
      throw new Error('Failed to structure project');
    }
  }

  private buildFormPrompt(metadata: BookMetadata): string {
    return `Tu es "The Architect", un agent IA expert en structure narrative.

Ta mission : Créer un plan détaillé de roman à partir des informations suivantes.

INFORMATIONS DU PROJET:
- Titre: ${metadata.title}
- Pitch: ${metadata.pitch}
- Genre: ${metadata.genre}
- Public cible: ${metadata.targetAudience}
- Tonalité: ${metadata.tone}
- Point de vue: ${metadata.pov}
- Longueur cible: ${metadata.targetLength} mots
${metadata.inspirations ? `- Inspirations: ${metadata.inspirations}` : ''}

TÂCHE:
1. Génère un plan de chapitres cohérent (environ 20-25 chapitres)
2. Crée des fiches détaillées pour les personnages principaux
3. Assure une structure narrative solide avec un arc dramatique

RÉPONSE (JSON STRICT):
{
  "book_metadata": {
    "title": "...",
    "pitch": "...",
    "genre": "...",
    "targetAudience": "...",
    "tone": "...",
    "pov": "...",
    "targetLength": 0
  },
  "outline": [
    {
      "chapter_index": 1,
      "title": "Titre du chapitre",
      "summary": "Résumé détaillé de ce qui se passe",
      "cliffhanger": "Comment le chapitre se termine de manière captivante"
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

  private buildRawTextPrompt(rawText: string): string {
    return `Tu es "The Architect", un agent IA expert en structure narrative.

Ta mission : Analyser les notes suivantes et en extraire un plan structuré de roman.

NOTES BRUTES:
${rawText}

TÂCHE:
1. Identifie le concept principal et crée un pitch cohérent
2. Extrais les personnages mentionnés et crée leurs fiches
3. Déduis une structure de chapitres logique
4. Détermine le genre, le ton, et les autres métadonnées

RÉPONSE (JSON STRICT):
{
  "book_metadata": {
    "title": "Titre déduit ou suggéré",
    "pitch": "Pitch créé à partir des notes",
    "genre": "Genre identifié",
    "targetAudience": "Public cible suggéré",
    "tone": "Tonalité identifiée",
    "pov": "POV suggéré",
    "targetLength": 80000
  },
  "outline": [
    {
      "chapter_index": 1,
      "title": "Titre du chapitre",
      "summary": "Résumé détaillé",
      "cliffhanger": "Cliffhanger suggéré"
    }
  ],
  "characters": [
    {
      "name": "Nom extrait des notes",
      "role": "Rôle identifié",
      "initial_state": {
        "details extraits des notes..."
      },
      "description": "Description construite"
    }
  ]
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;
  }

  private parseResponse(response: string): ArchitectResponse {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;

      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse Architect response:', error);
      throw new Error('Invalid response format from Architect');
    }
  }
}
