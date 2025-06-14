import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a Context Analysis Agent specialized in analyzing job descriptions and company information.
Your task is to:
1. Extract key requirements and qualifications from job descriptions
2. Identify company culture and values
3. Match candidate skills with job requirements
4. Provide strategic insights for application

Format your response as a structured JSON object.`;

export class ContextAgent {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
    });
  }

  async analyze(jobDescription, companyDescription, resumeContext) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `
              Job Description: ${jobDescription}
              
              Company Description: ${companyDescription}
              
              Candidate Resume Context: ${JSON.stringify(resumeContext, null, 2)}
              
              Analyze this information and provide:
              1. Key job requirements
              2. Company culture insights
              3. Matching skills from resume
              4. Strategic application approach
            `
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Context Agent Error:', error);
      throw new Error('Failed to analyze context');
    }
  }
} 