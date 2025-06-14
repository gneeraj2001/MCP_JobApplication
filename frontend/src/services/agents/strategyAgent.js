import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a Strategy Development Agent specialized in creating effective job application strategies.
Your task is to:
1. Develop a tailored approach for the application
2. Identify key points to emphasize
3. Suggest specific examples and achievements to highlight
4. Create a strategic framework for the application

Format your response as a structured JSON object.`;

export class StrategyAgent {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async develop(contextAnalysis, resumeContext) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `
              Context Analysis: ${JSON.stringify(contextAnalysis, null, 2)}
              
              Resume Context: ${JSON.stringify(resumeContext, null, 2)}
              
              Develop a strategic approach that:
              1. Aligns candidate's experience with job requirements
              2. Emphasizes relevant achievements
              3. Addresses company culture fit
              4. Provides specific talking points
            `
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Strategy Agent Error:', error);
      throw new Error('Failed to develop strategy');
    }
  }
} 