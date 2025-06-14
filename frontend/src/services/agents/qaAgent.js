import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a Quality Assurance Agent specialized in reviewing job application materials.
Your task is to:
1. Review application materials for quality and effectiveness
2. Score different aspects of the application
3. Provide specific improvement suggestions
4. Ensure alignment with job requirements and strategy

Format your response as a structured JSON object with scores and analysis.`;

export class QAAgent {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async review(contextAnalysis, strategy, generatedContent) {
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
              
              Generated Content: ${JSON.stringify(generatedContent, null, 2)}
              
              Review and provide:
              1. Overall quality score
              2. Specific scores for email and memo
              3. Alignment with strategy
              4. Improvement suggestions
              5. Tone and professionalism assessment
            `
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('QA Agent Error:', error);
      throw new Error('Failed to review content');
    }
  }
} 