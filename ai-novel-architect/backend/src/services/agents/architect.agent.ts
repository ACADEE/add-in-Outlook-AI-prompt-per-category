import { GeminiService } from '../gemini.service';
import { BookMetadata, ArchitectResponse } from '../../types';

export class ArchitectAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  async structureProject(input: BookMetadata | string, targetChapterCount?: number): Promise<ArchitectResponse> {
    const isRawText = typeof input === 'string';

    const prompt = isRawText
      ? this.buildRawTextPrompt(input, targetChapterCount)
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
- Langue: ${metadata.language}
${metadata.inspirations ? `- Inspirations: ${metadata.inspirations}` : ''}

TÂCHE:
1. Génère un plan de chapitres cohérent (environ 20-25 chapitres)
2. Pour chaque chapitre, crée 3-5 sous-chapitres avec des instructions détaillées pour le Ghostwriter
3. Crée des fiches détaillées pour les personnages principaux
4. Assure une structure narrative solide avec un arc dramatique

IMPORTANT: Les instructions Ghostwriter doivent être TRÈS DÉTAILLÉES et inclure:
- Les éléments narratifs spécifiques à inclure
- Les émotions et ambiances à transmettre
- Les dialogues clés ou informations à révéler
- Les références aux événements précédents

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
          "ghostwriter_instructions": "Instructions TRÈS détaillées: Commence par décrire..., Introduis le personnage X en montrant..., Crée une tension en...",
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

  private buildRawTextPrompt(rawText: string, targetChapterCount?: number): string {
    const chapterInstruction = targetChapterCount
      ? `Découpe le contenu en EXACTEMENT ${targetChapterCount} chapitres.`
      : `Découpe le contenu en un nombre approprié de chapitres (généralement 20-25).`;

    return `Tu es "The Architect", un agent IA expert en structure narrative.

Ta mission : Analyser les notes suivantes et en extraire un plan structuré de roman avec des instructions DÉTAILLÉES pour le Ghostwriter.

NOTES BRUTES:
${rawText}

TÂCHE CRITIQUE:
1. Identifie le concept principal et crée un pitch cohérent
2. Extrais les personnages mentionnés et crée leurs fiches complètes
3. ${chapterInstruction}
4. Pour CHAQUE chapitre identifié, fais un découpage en sous-chapitres (3-5 par chapitre)
5. Pour CHAQUE sous-chapitre, extrais ou crée des INSTRUCTIONS DÉTAILLÉES pour le Ghostwriter basées sur le contenu des notes
6. Détermine le genre, le ton, la langue, et les autres métadonnées

IMPORTANT - Instructions Ghostwriter:
- Si les notes contiennent du contenu narratif, extrais-le comme instructions
- Si les notes sont vagues, déduis des instructions détaillées cohérentes
- Chaque instruction doit être ACTIONNABLE et PRÉCISE
- Inclus les éléments de l'intrigue, les émotions, les dialogues clés
- Fais référence aux personnages et lieux mentionnés

EXEMPLE d'instruction Ghostwriter:
"Commence par décrire la ville de Paris sous la pluie, ambiance sombre. Jean entre dans la boulangerie, encore traumatisé par l'événement du chapitre précédent. Dialogue avec Marie où il révèle indirectement ses doutes. Termine par la découverte d'une lettre mystérieuse."

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
          "ghostwriter_instructions": "Instructions DÉTAILLÉES extraites des notes ou déduites logiquement. Minimum 2-3 phrases avec actions concrètes.",
          "status": "draft"
        },
        {
          "subchapter_index": 2,
          "title": "Titre du sous-chapitre 2",
          "ghostwriter_instructions": "Instructions DÉTAILLÉES...",
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
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;

      const parsed = JSON.parse(jsonString);

      // Ensure subchapters array exists for each chapter
      if (parsed.outline) {
        parsed.outline = parsed.outline.map((chapter: any) => ({
          ...chapter,
          subchapters: chapter.subchapters || [],
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
