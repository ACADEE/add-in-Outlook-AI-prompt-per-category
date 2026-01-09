import { GeminiService } from '../gemini.service';
import { ProjectData, AuditorResponse } from '../../types';

export class AuditorAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  async auditChapter(
    projectData: ProjectData,
    chapterIndex: number,
    chapterText: string
  ): Promise<AuditorResponse> {
    const chapter = projectData.outline.find(c => c.chapter_index === chapterIndex);

    if (!chapter) {
      throw new Error(`Chapter ${chapterIndex} not found`);
    }

    const prompt = this.buildPrompt(projectData, chapter, chapterText);

    try {
      const response = await this.gemini.generateContent(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Auditor Agent Error:', error);
      throw new Error('Failed to audit chapter');
    }
  }

  private buildPrompt(
    projectData: ProjectData,
    chapter: any,
    chapterText: string
  ): string {
    const metadata = projectData.book_metadata;
    const previousChapters = projectData.outline
      .filter(c => c.chapter_index < chapter.chapter_index && c.content)
      .map(c => `Chapitre ${c.chapter_index}: ${c.title}\nRésumé: ${c.summary}\nContenu: ${c.content?.substring(0, 500)}...`)
      .join('\n\n');

    const charactersState = projectData.characters
      .map(c => `${c.name}: ${JSON.stringify(c.current_state || c.initial_state)}`)
      .join('\n');

    return `Tu es "The Auditor", un expert en cohérence narrative et qualité littéraire.

Ta mission: Analyser le chapitre suivant et identifier les incohérences ou problèmes.

CONTEXTE DU LIVRE:
- Titre: ${metadata.title}
- Genre: ${metadata.genre}
- Tonalité: ${metadata.tone}

PERSONNAGES (État actuel):
${charactersState}

CHAPITRES PRÉCÉDENTS:
${previousChapters || 'Aucun (premier chapitre)'}

CHAPITRE À AUDITER:
- Numéro: ${chapter.chapter_index}
- Titre attendu: ${chapter.title}
- Résumé attendu: ${chapter.summary}
- Cliffhanger attendu: ${chapter.cliffhanger}

TEXTE DU CHAPITRE:
${chapterText}

TÂCHE:
Analyse le chapitre sur 3 dimensions:
1. **Continuité** (0-100): Cohérence avec les chapitres précédents et l'état des personnages
2. **Respect du Plan** (0-100): Conformité avec le résumé et le cliffhanger prévus
3. **Style** (0-100): Qualité d'écriture, respect de la tonalité et du genre

Identifie tous les problèmes (erreurs, warnings, infos).

RÉPONSE (JSON STRICT):
{
  "scores": {
    "continuity": 85,
    "outline_respect": 90,
    "style": 75
  },
  "issues": [
    {
      "severity": "error",
      "message": "Description précise du problème"
    }
  ],
  "regeneration_hint": "Si score < 70, donne un conseil pour améliorer (optionnel)"
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;
  }

  private parseResponse(response: string): AuditorResponse {
    try {
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;

      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse Auditor response:', error);
      throw new Error('Invalid response format from Auditor');
    }
  }
}
