import { ImageSource } from '@nativescript/core';
import { Http } from '@nativescript/core';

export class ImageGenerationService {
    private readonly API_URL = 'https://api-inference.huggingface.co/models/XLabs-AI/flux-ip-adapter-v2';
    private readonly API_KEY = process.env.HUGGINGFACE_API_KEY;

    async generateImage(sourceImage: ImageSource, prompt: string): Promise<ImageSource> {
        try {
            const base64Image = sourceImage.toBase64String('jpg');
            
            const response = await Http.request({
                url: this.API_URL,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                content: JSON.stringify({
                    inputs: {
                        image: `data:image/jpeg;base64,${base64Image}`,
                        prompt: prompt
                    }
                })
            });

            if (response.statusCode === 200) {
                // Convert response to ImageSource
                return ImageSource.fromData(response.content.toArrayBuffer());
            } else {
                throw new Error(`API request failed with status ${response.statusCode}`);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    }
}