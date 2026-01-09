import { GeminiService } from '../gemini.service';
import { ProjectData, Chapter } from '../../types';

export class GhostwriterAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  async writeChapter(
    projectData: ProjectData,
    chapterIndex: number,
    userInstructions?: string
  ): Promise<string> {
    const chapter = projectData.outline.find(c => c.chapter_index === chapterIndex);

    if (!chapter) {
      throw new Error(`Chapter ${chapterIndex} not found`);
    }

    const prompt = this.buildPrompt(projectData, chapter, userInstructions);

    try {
      // In production, upload context as file and use context caching
      // const contextFileUri = await this.uploadContextFile(projectData);
      // return await this.gemini.generateContentWithContext(prompt, contextFileUri);

      return await this.gemini.generateContent(prompt);
    } catch (error) {
      console.error('Ghostwriter Agent Error:', error);
      throw new Error('Failed to write chapter');
    }
  }

  private buildPrompt(
    projectData: ProjectData,
    chapter: Chapter,
    userInstructions?: string
  ): string {
    const metadata = projectData.book_metadata;
    const previousChapters = projectData.outline
      .filter(c => c.chapter_index < chapter.chapter_index)
      .map(c => `Chapitre ${c.chapter_index}: ${c.title}\n${c.summary}`)
      .join('\n\n');

    const charactersState = projectData.characters
      .map(c => `${c.name} (${c.role}): ${JSON.stringify(c.current_state || c.initial_state)}`)
      .join('\n');

    return `Tu es "The Ghostwriter", un auteur de roman professionnel.

CONTEXTE DU LIVRE:
- Titre: ${metadata.title}
- Genre: ${metadata.genre}
- Tonalité: ${metadata.tone}
- Point de vue: ${metadata.pov}

PERSONNAGES (État actuel):
${charactersState}

CHAPITRES PRÉCÉDENTS:
${previousChapters || 'Aucun (c\'est le premier chapitre)'}

CHAPITRE À ÉCRIRE:
- Numéro: ${chapter.chapter_index}
- Titre: ${chapter.title}
- Résumé: ${chapter.summary}
- Cliffhanger souhaité: ${chapter.cliffhanger || 'À ta discrétion'}

${userInstructions ? `INSTRUCTIONS SUPPLÉMENTAIRES:\n${userInstructions}\n` : ''}

TÂCHE:
Écris le contenu complet du chapitre ${chapter.chapter_index} en respectant:
1. Le style et la tonalité définis
2. La continuité avec les chapitres précédents
3. L'état actuel des personnages
4. Le résumé et le cliffhanger prévus

Longueur cible: 2500-3500 mots.

Écris directement le chapitre, sans introduction ni commentaire.`;
  }

  private async uploadContextFile(projectData: ProjectData): Promise<string> {
    const contextContent = this.buildContextFile(projectData);
    return await this.gemini.uploadFile(contextContent, 'project_context.txt');
  }

  private buildContextFile(projectData: ProjectData): string {
    let context = `=== CONTEXTE GLOBAL DU PROJET ===\n\n`;
    context += `MÉTADONNÉES:\n${JSON.stringify(projectData.book_metadata, null, 2)}\n\n`;
    context += `PERSONNAGES:\n${JSON.stringify(projectData.characters, null, 2)}\n\n`;
    context += `PLAN DES CHAPITRES:\n${JSON.stringify(projectData.outline, null, 2)}\n\n`;

    const writtenChapters = projectData.outline.filter(c => c.content);
    if (writtenChapters.length > 0) {
      context += `=== CHAPITRES ÉCRITS ===\n\n`;
      writtenChapters.forEach(c => {
        context += `CHAPITRE ${c.chapter_index}: ${c.title}\n${c.content}\n\n`;
      });
    }

    return context;
  }
}
