import { Observable } from '@nativescript/core';
import { Camera } from '@nativescript/camera';
import * as imagepicker from '@nativescript/imagepicker';
import { ImageSource } from '@nativescript/core';
import { SocialMediaService } from '../../services/social-media.service';
import { ContentGenerationService } from '../../services/content-generation.service';
import { ImageGenerationService } from '../../services/image-generation.service';

export class HomeViewModel extends Observable {
    private _selectedImage: ImageSource | null = null;
    private _generatedImage: ImageSource | null = null;
    private _contentPrompt: string = '';
    private socialMediaService: SocialMediaService;
    private contentGenerationService: ContentGenerationService;
    private imageGenerationService: ImageGenerationService;

    constructor() {
        super();
        this.socialMediaService = new SocialMediaService();
        this.contentGenerationService = new ContentGenerationService();
        this.imageGenerationService = new ImageGenerationService();
        
        // Initialize social network selections
        this.set('instagram', false);
        this.set('facebook', false);
        this.set('twitter', false);
        this.set('linkedin', false);
        this.set('tiktok', false);
    }

    // ... existing methods ...

    async onGenerateContent() {
        if (!this._selectedImage || !this._contentPrompt) {
            return;
        }

        try {
            // First generate the new image
            this._generatedImage = await this.imageGenerationService.generateImage(
                this._selectedImage,
                this._contentPrompt
            );
            this.notifyPropertyChange('generatedImage', this._generatedImage);

            const selectedNetworks = this.getSelectedNetworks();
            const generatedContent = await this.contentGenerationService.generateContent(
                this._generatedImage, // Use the generated image instead of the original
                this._contentPrompt,
                selectedNetworks
            );

            // Handle the generated content
            await this.socialMediaService.scheduleContent(generatedContent, selectedNetworks);
        } catch (error) {
            console.error('Error generating content:', error);
        }
    }

    get generatedImage(): ImageSource | null {
        return this._generatedImage;
    }

    // ... rest of the existing code ...
}