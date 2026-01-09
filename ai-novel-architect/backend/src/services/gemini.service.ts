import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  }

  async generateContentWithContext(prompt: string, contextFileUri?: string): Promise<string> {
    try {
      if (contextFileUri) {
        // Use file context if available
        const result = await this.model.generateContent([
          { text: prompt },
          { fileData: { fileUri: contextFileUri, mimeType: 'text/plain' } }
        ]);
        return result.response.text();
      } else {
        return await this.generateContent(prompt);
      }
    } catch (error) {
      console.error('Error generating content with context:', error);
      throw new Error('Failed to generate content with context');
    }
  }

  async uploadFile(content: string, displayName: string): Promise<string> {
    try {
      // Note: File upload requires the Files API
      // For now, we'll return a placeholder
      // In production, implement proper file upload
      console.log(`Uploading file: ${displayName}`);
      return 'placeholder-file-uri';
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }
}
