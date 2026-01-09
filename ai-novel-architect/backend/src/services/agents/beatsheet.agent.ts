import { GeminiService } from '../gemini.service';
import { ProjectData, Scene, BeatSheetResponse } from '../../types';

/**
 * BeatsheetGenerator Agent
 *
 * Génère une liste de scènes (Beat Sheet) à partir d'un résumé.
 * Permet un contrôle narratif granulaire avant la génération du texte.
 */
export class BeatsheetAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  /**
   * Génère une Beat Sheet (liste de scènes) à partir d'un résumé
   */
  async generateBeatSheet(
    projectData: ProjectData,
    chapterIndex: number,
    subchapterIndex: number,
    summary: string,
    targetSceneCount?: number
  ): Promise<BeatSheetResponse> {
    const chapter = projectData.outline.find(c => c.chapter_index === chapterIndex);
    if (!chapter) {
      throw new Error(`Chapter ${chapterIndex} not found`);
    }

    const subchapter = chapter.subchapters.find(s => s.subchapter_index === subchapterIndex);
    if (!subchapter) {
      throw new Error(`Subchapter ${subchapterIndex} not found`);
    }

    const prompt = this.buildBeatSheetPrompt(
      projectData,
      chapter,
      subchapter,
      summary,
      targetSceneCount
    );

    try {
      const response = await this.gemini.generateContent(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Beatsheet Agent Error:', error);
      throw new Error('Failed to generate beat sheet');
    }
  }

  private buildBeatSheetPrompt(
    projectData: ProjectData,
    chapter: any,
    subchapter: any,
    summary: string,
    targetSceneCount?: number
  ): string {
    const metadata = projectData.book_metadata;
    const sceneCountInstruction = targetSceneCount
      ? `Génère EXACTEMENT ${targetSceneCount} scènes.`
      : `Génère entre 3 et 7 scènes selon la complexité du contenu.`;

    // Contexte des chapitres précédents
    const previousContext = projectData.outline
      .filter(c => c.chapter_index < chapter.chapter_index && c.content)
      .map(c => `Chapitre ${c.chapter_index}: ${c.title}\n${c.summary}`)
      .join('\n\n');

    // État des personnages
    const charactersState = projectData.characters
      .map(c => `${c.name} (${c.role}): ${JSON.stringify(c.current_state || c.initial_state)}`)
      .join('\n');

    return `Tu es "The Beatsheet Generator", un expert en structure narrative et découpage de scènes.

Ta mission : Découper un résumé en une liste de scènes (Beat Sheet) détaillée et actionnable.

CONTEXTE DU LIVRE:
- Titre: ${metadata.title}
- Genre: ${metadata.genre}
- Tonalité: ${metadata.tone}
- Langue: ${metadata.language}

PERSONNAGES (État actuel):
${charactersState}

CHAPITRES PRÉCÉDENTS:
${previousContext || 'Aucun (début du livre)'}

CHAPITRE ACTUEL:
- Numéro: ${chapter.chapter_index}
- Titre: ${chapter.title}

SOUS-CHAPITRE:
- Numéro: ${subchapter.subchapter_index}
- Titre: ${subchapter.title}

RÉSUMÉ À DÉCOUPER EN SCÈNES:
${summary}

TÂCHE:
${sceneCountInstruction}

Pour chaque scène, définis:
1. Un TITRE court et évocateur
2. Un BEAT (description courte de ce qui se passe - 1 phrase)
3. Des INSTRUCTIONS GHOSTWRITER détaillées (2-4 phrases minimum)

Les instructions Ghostwriter doivent être TRÈS PRÉCISES et inclure:
- Actions spécifiques des personnages
- Émotions et ambiances à transmettre
- Éléments de dialogue ou informations à révéler
- Références au contexte (personnages, lieux, événements)

EXEMPLE de scène bien structurée:
{
  "scene_index": 1,
  "title": "L'éveil brutal",
  "beat": "Marie se réveille en sursaut, désorientée.",
  "ghostwriter_instructions": "Commence par décrire le réveil brutal de Marie dans son appartement sombre. Elle est confuse, transpire. Montre ses pensées chaotiques alors qu'elle se rappelle du cauchemar. Ambiance oppressante. Termine par elle allumant la lumière, la peur encore visible sur son visage.",
  "status": "draft"
}

RÉPONSE (JSON STRICT):
{
  "scenes": [
    {
      "scene_index": 1,
      "title": "...",
      "beat": "...",
      "ghostwriter_instructions": "...",
      "status": "draft"
    },
    {
      "scene_index": 2,
      "title": "...",
      "beat": "...",
      "ghostwriter_instructions": "...",
      "status": "draft"
    }
  ]
}

RÈGLES CRITIQUES:
1. Les scènes doivent suivre une progression logique
2. Chaque scène doit faire avancer l'histoire
3. Les instructions doivent être ACTIONABLES et DÉTAILLÉES
4. Respecte la cohérence avec les personnages et le contexte
5. Assure une bonne distribution du rythme narratif

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;
  }

  private parseResponse(response: string): BeatSheetResponse {
    try {
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;

      const parsed = JSON.parse(jsonString);

      // Ensure all scenes have required fields
      if (parsed.scenes) {
        parsed.scenes = parsed.scenes.map((scene: any, index: number) => ({
          scene_index: scene.scene_index || index + 1,
          title: scene.title || `Scène ${index + 1}`,
          beat: scene.beat || '',
          ghostwriter_instructions: scene.ghostwriter_instructions || '',
          status: scene.status || 'draft',
          content: scene.content,
          wordCount: scene.wordCount
        }));
      }

      return parsed;
    } catch (error) {
      console.error('Failed to parse Beatsheet response:', error);
      throw new Error('Invalid response format from Beatsheet Generator');
    }
  }
}
