'use client';

import Image from 'next/image';
import type { Photo } from '@/types/weather';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface FloatingPhotosProps {
  photos: Photo[];
}

export function FloatingPhotos({ photos }: FloatingPhotosProps) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
      {photos.map((photo, index) => (
        <Card 
          key={photo.id} 
          className="floating-animation shadow-xl overflow-hidden group"
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          <CardContent className="p-0 aspect-[3/2] relative">
            <Image
              src={photo.enhancedSrc || photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={photo.alt.split(' ').slice(0,2).join(' ')} // Use first two words of alt for hint
            />
          </CardContent>
          {photo.filterApplied && (
            <CardFooter className="p-2 text-xs text-muted-foreground bg-background/80">
              <p>AI Filter: {photo.filterApplied}</p>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
