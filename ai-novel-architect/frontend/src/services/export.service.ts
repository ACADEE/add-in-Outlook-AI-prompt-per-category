import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { Project } from './project.service';

export class ExportService {
  static async exportToWord(project: Project): Promise<void> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title Page
            new Paragraph({
              text: project.book_metadata.title,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),
            new Paragraph({
              text: `Par ${project.book_metadata.author || 'Auteur'}`,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 800,
              },
            }),

            // Genre and Metadata
            new Paragraph({
              text: `Genre: ${project.book_metadata.genre}`,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200,
              },
            }),
            new Paragraph({
              text: `Tonalité: ${project.book_metadata.tone}`,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),

            // Page Break
            new Paragraph({
              text: '',
              pageBreakBefore: true,
            }),

            // Pitch/Synopsis
            new Paragraph({
              text: 'Synopsis',
              heading: HeadingLevel.HEADING_1,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            new Paragraph({
              text: project.book_metadata.pitch,
              spacing: {
                after: 400,
              },
            }),

            // Page Break before chapters
            new Paragraph({
              text: '',
              pageBreakBefore: true,
            }),

            // Chapters
            ...this.generateChapters(project.outline),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
    saveAs(blob, fileName);
  }

  private static generateChapters(outline: any[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    outline
      .filter((chapter) => chapter.content)
      .forEach((chapter, index) => {
        // Chapter Title
        paragraphs.push(
          new Paragraph({
            text: `Chapitre ${chapter.chapter_index}: ${chapter.title}`,
            heading: HeadingLevel.HEADING_1,
            spacing: {
              before: index > 0 ? 400 : 0,
              after: 200,
            },
            pageBreakBefore: index > 0,
          })
        );

        // Chapter Content
        const contentParagraphs = chapter.content.split('\n\n');
        contentParagraphs.forEach((paragraph: string) => {
          if (paragraph.trim()) {
            paragraphs.push(
              new Paragraph({
                text: paragraph.trim(),
                spacing: {
                  after: 200,
                },
              })
            );
          }
        });
      });

    return paragraphs;
  }

  static async exportCharacterBible(project: Project): Promise<void> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `Bible des Personnages - ${project.book_metadata.title}`,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),

            ...this.generateCharacterSheets(project.characters),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_personnages.docx`;
    saveAs(blob, fileName);
  }

  private static generateCharacterSheets(characters: any[]): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    characters.forEach((character, index) => {
      // Character Name
      paragraphs.push(
        new Paragraph({
          text: character.name,
          heading: HeadingLevel.HEADING_1,
          spacing: {
            before: index > 0 ? 400 : 0,
            after: 200,
          },
        })
      );

      // Role
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Rôle: ', bold: true }),
            new TextRun({ text: character.role }),
          ],
          spacing: { after: 100 },
        })
      );

      // Description
      if (character.description) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Description: ', bold: true }),
              new TextRun({ text: character.description }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      // Current State
      paragraphs.push(
        new Paragraph({
          text: 'État Actuel:',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
        })
      );

      const state = character.current_state || character.initial_state;
      Object.entries(state).forEach(([key, value]) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `  • ${key}: `, bold: true }),
              new TextRun({ text: String(value) }),
            ],
            spacing: { after: 50 },
          })
        );
      });

      paragraphs.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    });

    return paragraphs;
  }
}
