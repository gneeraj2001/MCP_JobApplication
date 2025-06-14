import OpenAI from 'openai';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const SYSTEM_PROMPT = `You are a Resume Parser specialized in converting resume text into structured JSON format.
Your task is to extract:
1. Work experience (with company, title, duration, and highlights)
2. Skills
3. Education
4. Contact information

Format the response as a JSON object matching this structure:
{
  "experience": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "highlights": ["string"]
    }
  ],
  "skills": ["string"],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "year": "string"
    }
  ],
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}`;

export class ResumeParser {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async parseResume(resumeText) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Parse this resume into structured JSON format:\n\n${resumeText}`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Resume Parser Error:', error);
      throw new Error('Failed to parse resume');
    }
  }

  // Helper function to read text file content
  async readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  // Helper function to read PDF file content
  async readPDFFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  }

  // Main function to read file content based on type
  async readFileContent(file) {
    try {
      if (file.type === 'application/pdf') {
        return await this.readPDFFile(file);
      } else {
        return await this.readTextFile(file);
      }
    } catch (error) {
      console.error('File Reading Error:', error);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }
} 