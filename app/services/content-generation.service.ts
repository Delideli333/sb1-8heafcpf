import { ImageSource } from '@nativescript/core';
import OpenAI from 'openai';

export class ContentGenerationService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateContent(
        image: ImageSource,
        prompt: string,
        networks: string[]
    ): Promise<any> {
        try {
            // Convert image to base64
            const base64Image = image.toBase64String('jpg');

            // Generate content using OpenAI
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ]
            });

            // Process the response and format it for different networks
            return this.formatContentForNetworks(completion.choices[0].message.content, networks);
        } catch (error) {
            console.error('Error generating content:', error);
            throw error;
        }
    }

    private formatContentForNetworks(content: string, networks: string[]): any {
        // Format content according to each network's requirements
        const formattedContent = {};
        
        networks.forEach(network => {
            switch (network) {
                case 'instagram':
                    formattedContent[network] = this.formatForInstagram(content);
                    break;
                case 'twitter':
                    formattedContent[network] = this.formatForTwitter(content);
                    break;
                // Add other networks as needed
            }
        });

        return formattedContent;
    }

    private formatForInstagram(content: string): any {
        // Format content for Instagram (caption length, hashtags, etc.)
        return {
            caption: content.substring(0, 2200), // Instagram caption limit
            hashtags: this.extractHashtags(content)
        };
    }

    private formatForTwitter(content: string): any {
        // Format content for Twitter (character limit, etc.)
        return {
            text: content.substring(0, 280) // Twitter character limit
        };
    }

    private extractHashtags(content: string): string[] {
        const hashtags = content.match(/#[a-zA-Z0-9]+/g);
        return hashtags || [];
    }
}