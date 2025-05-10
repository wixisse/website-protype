'use server';

import { enhanceImage, type EnhanceImageInput, type EnhanceImageOutput } from '@/ai/flows/enhance-image-for-weather';

export async function enhancePhotoAction(
  photoDataUri: string,
  weatherCondition: string,
  location: string
): Promise<EnhanceImageOutput> {
  try {
    const input: EnhanceImageInput = {
      photoDataUri,
      weatherCondition,
      location,
    };
    const result = await enhanceImage(input);
    return result;
  } catch (error) {
    console.error('Error enhancing image:', error);
    throw new Error('Failed to enhance image. Please try again.');
  }
}
