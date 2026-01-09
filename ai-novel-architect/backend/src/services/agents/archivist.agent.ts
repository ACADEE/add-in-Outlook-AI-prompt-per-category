import { GeminiService } from '../gemini.service';
import { ProjectData, CharacterPatch } from '../../types';

export class ArchivistAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  async updateCharacterStates(
    projectData: ProjectData,
    chapterIndex: number,
    validatedChapterText: string
  ): Promise<CharacterPatch[]> {
    const prompt = this.buildPrompt(projectData, chapterIndex, validatedChapterText);

    try {
      const response = await this.gemini.generateContent(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Archivist Agent Error:', error);
      throw new Error('Failed to update character states');
    }
  }

  private buildPrompt(
    projectData: ProjectData,
    chapterIndex: number,
    chapterText: string
  ): string {
    const charactersState = projectData.characters
      .map(c => `${c.name}:\n${JSON.stringify(c.current_state || c.initial_state, null, 2)}`)
      .join('\n\n');

    return `Tu es "The Archivist", un gestionnaire d'état narratif expert.

Ta mission: Analyser le chapitre validé et identifier les changements d'état des personnages.

PERSONNAGES (État avant le chapitre):
${charactersState}

CHAPITRE ${chapterIndex} (VALIDÉ):
${chapterText}

TÂCHE:
Identifie tous les changements qui doivent être appliqués aux états des personnages:
- Changements de localisation
- Évolution de relations
- Nouveaux objets/connaissances acquis
- Modifications de PV/santé/état émotionnel
- Changements de motivations

RÉPONSE (JSON STRICT):
{
  "patches": [
    {
      "character_name": "Nom du personnage",
      "field": "location",
      "old_value": "Paris",
      "new_value": "Londres"
    },
    {
      "character_name": "Nom du personnage",
      "field": "health",
      "old_value": 100,
      "new_value": 85
    }
  ]
}

Si aucun changement n'est nécessaire, retourne:
{
  "patches": []
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;
  }

  private parseResponse(response: string): CharacterPatch[] {
    try {
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;

      const parsed = JSON.parse(jsonString);
      return parsed.patches || [];
    } catch (error) {
      console.error('Failed to parse Archivist response:', error);
      throw new Error('Invalid response format from Archivist');
    }
  }
}
