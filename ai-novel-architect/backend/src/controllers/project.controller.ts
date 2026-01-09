import { Request, Response } from 'express';
import { ArchitectAgent } from '../services/agents/architect.agent';
import { GhostwriterAgent } from '../services/agents/ghostwriter.agent';
import { AuditorAgent } from '../services/agents/auditor.agent';
import { ArchivistAgent } from '../services/agents/archivist.agent';
import { CreateProjectRequest, GenerateChapterRequest, AuditChapterRequest } from '../types';

// In-memory storage for demo (replace with database in production)
const projects: Map<string, any> = new Map();

export class ProjectController {
  static async initializeProject(req: Request, res: Response) {
    try {
      const { method, data } = req.body as CreateProjectRequest;
      const apiKey = req.headers['x-api-key'] as string;

      if (!apiKey) {
        return res.status(401).json({ success: false, error: 'API key required' });
      }

      const architect = new ArchitectAgent(apiKey);

      let projectData;
      if (method === 'wizard') {
        projectData = await architect.structureProject(data);
      } else {
        // Raw text mode
        const rawText = (data as any).raw_text;
        projectData = await architect.structureProject(rawText);
      }

      // Generate project ID
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store project
      projects.set(projectId, {
        id: projectId,
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: {
          projectId,
          project: projectData,
        },
      });
    } catch (error: any) {
      console.error('Initialize project error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to initialize project',
      });
    }
  }

  static async generateChapter(req: Request, res: Response) {
    try {
      const { projectId, chapterId, userInstructions } = req.body as GenerateChapterRequest;
      const apiKey = req.headers['x-api-key'] as string;

      if (!apiKey) {
        return res.status(401).json({ success: false, error: 'API key required' });
      }

      const project = projects.get(projectId);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      const ghostwriter = new GhostwriterAgent(apiKey);
      const chapterText = await ghostwriter.writeChapter(
        project,
        parseInt(chapterId),
        userInstructions
      );

      res.json({
        success: true,
        data: {
          chapterText,
        },
      });
    } catch (error: any) {
      console.error('Generate chapter error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate chapter',
      });
    }
  }

  static async auditChapter(req: Request, res: Response) {
    try {
      const { projectId, chapterText } = req.body as AuditChapterRequest;
      const apiKey = req.headers['x-api-key'] as string;
      const chapterId = req.body.chapterId;

      if (!apiKey) {
        return res.status(401).json({ success: false, error: 'API key required' });
      }

      const project = projects.get(projectId);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      const auditor = new AuditorAgent(apiKey);
      const auditResult = await auditor.auditChapter(
        project,
        parseInt(chapterId),
        chapterText
      );

      res.json({
        success: true,
        data: auditResult,
      });
    } catch (error: any) {
      console.error('Audit chapter error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to audit chapter',
      });
    }
  }

  static async validateChapter(req: Request, res: Response) {
    try {
      const { projectId, chapterId, chapterText } = req.body;
      const apiKey = req.headers['x-api-key'] as string;

      if (!apiKey) {
        return res.status(401).json({ success: false, error: 'API key required' });
      }

      const project = projects.get(projectId);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      // Update chapter content
      const chapterIndex = parseInt(chapterId);
      const chapter = project.outline.find((c: any) => c.chapter_index === chapterIndex);
      if (chapter) {
        chapter.content = chapterText;
        chapter.status = 'validated';
      }

      // Update character states
      const archivist = new ArchivistAgent(apiKey);
      const patches = await archivist.updateCharacterStates(project, chapterIndex, chapterText);

      // Apply patches
      patches.forEach(patch => {
        const character = project.characters.find((c: any) => c.name === patch.character_name);
        if (character) {
          if (!character.current_state) {
            character.current_state = { ...character.initial_state };
          }
          character.current_state[patch.field] = patch.new_value;
        }
      });

      project.updatedAt = new Date().toISOString();
      projects.set(projectId, project);

      res.json({
        success: true,
        data: {
          message: 'Chapter validated and states updated',
          patches,
          project,
        },
      });
    } catch (error: any) {
      console.error('Validate chapter error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to validate chapter',
      });
    }
  }

  static async getProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const project = projects.get(projectId);

      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }

      res.json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      console.error('Get project error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get project',
      });
    }
  }

  static async testConnection(req: Request, res: Response) {
    try {
      const { apiKey } = req.body;

      if (!apiKey) {
        return res.status(400).json({ success: false, error: 'API key required' });
      }

      // Test API connection with a simple request
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      await model.generateContent('Test');

      res.json({
        success: true,
        data: { message: 'API connection successful' },
      });
    } catch (error: any) {
      console.error('Test connection error:', error);
      res.status(500).json({
        success: false,
        error: 'API connection failed',
      });
    }
  }
}
