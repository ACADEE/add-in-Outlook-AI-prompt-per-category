import { GeminiService } from '../gemini.service';
import { ProjectData, Chapter, Subchapter, WritingSettings } from '../../types';

export class GhostwriterAgent {
  private gemini: GeminiService;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  /**
   * Génère un sous-chapitre individuel
   */
  async writeSubchapter(
    projectData: ProjectData,
    chapterIndex: number,
    subchapterIndex: number,
    additionalInstructions?: string
  ): Promise<string> {
    const chapter = projectData.outline.find(c => c.chapter_index === chapterIndex);
    if (!chapter) {
      throw new Error(`Chapter ${chapterIndex} not found`);
    }

    const subchapter = chapter.subchapters.find(s => s.subchapter_index === subchapterIndex);
    if (!subchapter) {
      throw new Error(`Subchapter ${subchapterIndex} not found in chapter ${chapterIndex}`);
    }

    const settings = chapter.writingSettings || projectData.defaultWritingSettings;
    const prompt = this.buildSubchapterPrompt(projectData, chapter, subchapter, settings, additionalInstructions);

    try {
      // In production, upload context as file and use context caching
      // const contextFileUri = await this.uploadContextFile(projectData);
      // return await this.gemini.generateContentWithContext(prompt, contextFileUri);

      return await this.gemini.generateContent(prompt);
    } catch (error) {
      console.error('Ghostwriter Agent Error:', error);
      throw new Error('Failed to write subchapter');
    }
  }

  /**
   * Génère un chapitre complet (tous les sous-chapitres)
   */
  async writeChapter(
    projectData: ProjectData,
    chapterIndex: number,
    userInstructions?: string
  ): Promise<string> {
    const chapter = projectData.outline.find(c => c.chapter_index === chapterIndex);

    if (!chapter) {
      throw new Error(`Chapter ${chapterIndex} not found`);
    }

    // Si le chapitre a des sous-chapitres, générer chacun individuellement
    if (chapter.subchapters && chapter.subchapters.length > 0) {
      const subchapterContents: string[] = [];

      for (const subchapter of chapter.subchapters) {
        const content = await this.writeSubchapter(
          projectData,
          chapterIndex,
          subchapter.subchapter_index,
          userInstructions
        );
        subchapterContents.push(content);
      }

      return subchapterContents.join('\n\n');
    }

    // Sinon, générer le chapitre entier d'un coup
    const settings = chapter.writingSettings || projectData.defaultWritingSettings;
    const prompt = this.buildChapterPrompt(projectData, chapter, settings, userInstructions);

    try {
      return await this.gemini.generateContent(prompt);
    } catch (error) {
      console.error('Ghostwriter Agent Error:', error);
      throw new Error('Failed to write chapter');
    }
  }

  private buildSubchapterPrompt(
    projectData: ProjectData,
    chapter: Chapter,
    subchapter: Subchapter,
    settings?: WritingSettings,
    additionalInstructions?: string
  ): string {
    const metadata = projectData.book_metadata;
    const language = this.getLanguageInstructions(metadata.language);

    // Chapitres précédents
    const previousChapters = projectData.outline
      .filter(c => c.chapter_index < chapter.chapter_index && c.content)
      .map(c => `Chapitre ${c.chapter_index}: ${c.title}\nContenu: ${c.content?.substring(0, 500)}...`)
      .join('\n\n');

    // Sous-chapitres précédents du même chapitre
    const previousSubchapters = chapter.subchapters
      .filter(s => s.subchapter_index < subchapter.subchapter_index && s.content)
      .map(s => `${s.title}: ${s.content}`)
      .join('\n\n');

    // État des personnages
    const charactersState = projectData.characters
      .map(c => `${c.name} (${c.role}): ${JSON.stringify(c.current_state || c.initial_state)}`)
      .join('\n');

    // Paramètres d'écriture
    const writingInstructions = settings
      ? `
PARAMÈTRES D'ÉCRITURE:
- Nombre de mots cible: ${settings.wordCount} mots
- Style: ${settings.style}
- Niveau de détail: ${settings.detailLevel}
- Longueur des paragraphes: ${settings.paragraphLength}
`
      : '';

    return `Tu es "The Ghostwriter", un auteur de roman professionnel.

${language}

CONTEXTE DU LIVRE:
- Titre: ${metadata.title}
- Genre: ${metadata.genre}
- Tonalité: ${metadata.tone}
- Point de vue: ${metadata.pov}

PERSONNAGES (État actuel - À RESPECTER ABSOLUMENT):
${charactersState}

CHAPITRES PRÉCÉDENTS (Pour la continuité):
${previousChapters || 'Aucun (c\'est le début du livre)'}

CHAPITRE ACTUEL:
- Numéro: ${chapter.chapter_index}
- Titre: ${chapter.title}
- Résumé global: ${chapter.summary}

SOUS-CHAPITRES PRÉCÉDENTS (Dans ce chapitre):
${previousSubchapters || 'Aucun (c\'est le début du chapitre)'}

SOUS-CHAPITRE À ÉCRIRE:
- Titre: ${subchapter.title}
- Instructions détaillées: ${subchapter.ghostwriter_instructions}

${writingInstructions}

${chapter.ghostwriter_instructions ? `INSTRUCTIONS GLOBALES DU CHAPITRE:\n${chapter.ghostwriter_instructions}\n` : ''}

${additionalInstructions ? `INSTRUCTIONS SUPPLÉMENTAIRES DE L'UTILISATEUR:\n${additionalInstructions}\n` : ''}

RÈGLES CRITIQUES:
1. RESPECTE EXACTEMENT les instructions du sous-chapitre ci-dessus
2. MAINTIENS la cohérence avec les personnages (leurs états, localisations, émotions)
3. ASSURE la continuité narrative avec ce qui a été écrit avant
4. RESPECTE le style, la tonalité et le point de vue définis
5. NE JAMAIS contredire les événements passés ou l'état des personnages
6. INTÈGRE les éléments de la Bible des personnages naturellement

Écris directement le contenu du sous-chapitre "${subchapter.title}", sans introduction ni commentaire.`;
  }

  private buildChapterPrompt(
    projectData: ProjectData,
    chapter: Chapter,
    settings?: WritingSettings,
    userInstructions?: string
  ): string {
    const metadata = projectData.book_metadata;
    const language = this.getLanguageInstructions(metadata.language);

    const previousChapters = projectData.outline
      .filter(c => c.chapter_index < chapter.chapter_index)
      .map(c => `Chapitre ${c.chapter_index}: ${c.title}\n${c.summary}`)
      .join('\n\n');

    const charactersState = projectData.characters
      .map(c => `${c.name} (${c.role}): ${JSON.stringify(c.current_state || c.initial_state)}`)
      .join('\n');

    const writingInstructions = settings
      ? `
PARAMÈTRES D'ÉCRITURE:
- Nombre de mots cible: ${settings.wordCount * 3} mots (environ)
- Style: ${settings.style}
- Niveau de détail: ${settings.detailLevel}
- Longueur des paragraphes: ${settings.paragraphLength}
`
      : 'Longueur cible: 2500-3500 mots.';

    return `Tu es "The Ghostwriter", un auteur de roman professionnel.

${language}

CONTEXTE DU LIVRE:
- Titre: ${metadata.title}
- Genre: ${metadata.genre}
- Tonalité: ${metadata.tone}
- Point de vue: ${metadata.pov}

PERSONNAGES (État actuel - À RESPECTER ABSOLUMENT):
${charactersState}

CHAPITRES PRÉCÉDENTS:
${previousChapters || 'Aucun (c\'est le premier chapitre)'}

CHAPITRE À ÉCRIRE:
- Numéro: ${chapter.chapter_index}
- Titre: ${chapter.title}
- Résumé: ${chapter.summary}
- Cliffhanger souhaité: ${chapter.cliffhanger || 'À ta discrétion'}

${chapter.ghostwriter_instructions ? `INSTRUCTIONS DÉTAILLÉES:\n${chapter.ghostwriter_instructions}\n` : ''}

${writingInstructions}

${userInstructions ? `INSTRUCTIONS SUPPLÉMENTAIRES:\n${userInstructions}\n` : ''}

RÈGLES CRITIQUES:
1. RESPECTE EXACTEMENT le résumé et les instructions ci-dessus
2. MAINTIENS la cohérence avec les personnages et leur état
3. ASSURE la continuité narrative parfaite
4. TERMINE avec le cliffhanger prévu (si spécifié)
5. NE JAMAIS contredire ce qui a été écrit avant

Écris le contenu complet du chapitre ${chapter.chapter_index}, sans introduction ni commentaire.`;
  }

  private getLanguageInstructions(language: string): string {
    const instructions: { [key: string]: string } = {
      fr: 'IMPORTANT: Écris EXCLUSIVEMENT en français.',
      en: 'IMPORTANT: Write EXCLUSIVELY in English.',
      es: 'IMPORTANTE: Escribe EXCLUSIVAMENTE en español.',
      de: 'WICHTIG: Schreibe AUSSCHLIESSLICH auf Deutsch.',
      it: 'IMPORTANTE: Scrivi ESCLUSIVAMENTE in italiano.',
      pt: 'IMPORTANTE: Escreva EXCLUSIVAMENTE em português.',
    };

    return instructions[language] || instructions['fr'];
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
