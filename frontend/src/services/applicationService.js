import { ContextAgent } from './agents/contextAgent';
import { StrategyAgent } from './agents/strategyAgent';
import { ContentAgent } from './agents/contentAgent';
import { QAAgent } from './agents/qaAgent';

export class ApplicationService {
  constructor(apiKey) {
    this.contextAgent = new ContextAgent(apiKey);
    this.strategyAgent = new StrategyAgent(apiKey);
    this.contentAgent = new ContentAgent(apiKey);
    this.qaAgent = new QAAgent(apiKey);
  }

  async generateMaterials(jobDescription, companyDescription, resumeContext) {
    try {
      // Step 1: Analyze context
      const contextAnalysis = await this.contextAgent.analyze(
        jobDescription,
        companyDescription,
        resumeContext
      );

      // Step 2: Develop strategy
      const strategy = await this.strategyAgent.develop(
        contextAnalysis,
        resumeContext
      );

      // Step 3: Generate content
      const generatedContent = await this.contentAgent.generate(
        contextAnalysis,
        strategy,
        resumeContext
      );

      // Step 4: Review and score
      const qualityAnalysis = await this.qaAgent.review(
        contextAnalysis,
        strategy,
        generatedContent
      );

      // Return combined results
      return {
        email: generatedContent.email,
        memo: generatedContent.memo,
        quality_score: qualityAnalysis.overall_score,
        context_analysis: contextAnalysis,
        strategy: strategy,
        quality_analysis: qualityAnalysis
      };
    } catch (error) {
      console.error('Application Service Error:', error);
      throw new Error('Failed to generate application materials');
    }
  }
} 