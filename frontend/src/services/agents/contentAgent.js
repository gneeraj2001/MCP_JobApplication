import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a Content Generation Agent specialized in creating compelling job application materials.
Your task is to:
1. Write professional and engaging application emails
2. Create detailed application memos
3. Ensure content aligns with strategy and context
4. Maintain appropriate tone and formality

Format your response as a structured JSON object with email and memo sections.`;

export class ContentAgent {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generate(contextAnalysis, strategy, resumeContext) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `
              Context Analysis: ${JSON.stringify(contextAnalysis, null, 2)}
              
              Strategy: ${JSON.stringify(strategy, null, 2)}
              
              Resume Context: ${JSON.stringify(resumeContext, null, 2)}
              
              Generate:
              1. A compelling application email
              2. A detailed application memo
              3. Follow-up suggestions
              
              Ensure all content aligns with the provided strategy and context analysis.
            `
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Content Agent Error:', error);
      throw new Error('Failed to generate content');
    }
  }
} 