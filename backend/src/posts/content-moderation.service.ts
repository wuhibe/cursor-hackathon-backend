import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContentModerationService {
  private readonly model: ChatGoogleGenerativeAI;
  private readonly promptTemplate: PromptTemplate;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

    if (!apiKey) {
      throw new Error(
        'GOOGLE_API_KEY environment variable is required for content moderation',
      );
    }

    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey,
    });

    this.promptTemplate = PromptTemplate.fromTemplate(`
      You are a content moderator evaluating text for PG-13 appropriateness.

      Evaluate the following content and respond with ONLY "true" if the content is appropriate for PG-13 audiences, or "false" if it contains inappropriate content.

      PG-13 guidelines:
      - No explicit sexual content
      - No graphic violence
      - No hate speech or discrimination
      - No excessive profanity
      - No drug promotion
      - No self-harm content

      Content to evaluate:
      {title}
      {content}

      Response (true/false only):
      `);
  }

  async moderateContent(title: string, content: string): Promise<boolean> {
    try {
      const outputParser = new StringOutputParser();

      const result = await this.promptTemplate
        .pipe(this.model)
        .pipe(outputParser)
        .invoke({
          title,
          content,
        });

      console.log('Moderation result:', result);
      // Parse the boolean response
      if (result === 'true') {
        return true;
      } else if (result === 'false') {
        return false;
      } else {
        // If the response is unclear, default to false for safety
        console.warn(
          `Unexpected moderation response: "${JSON.stringify(result, null, 2)}" for content: "${content.substring(
            0,
            100,
          )}..."`,
        );
        return false;
      }
    } catch (error) {
      console.error('Content moderation failed:', error);
      // Default to false for safety in case of API errors
      return false;
    }
  }
}
