'use client';

import { useState, useEffect } from 'react';
import type { WeatherData, Photo, WeatherTheme } from '@/types/weather';
import { getWeather } from '@/lib/weather-api';
import { enhancePhotoAction } from '@/app/actions';
import { LocationForm } from '@/components/location-form';
import { WeatherDisplay } from '@/components/weather-display';
import { FloatingPhotos } from '@/components/floating-photos';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // For potential manual enhance button

async function toDataURL(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getWeatherThemeStyle(conditionCode?: WeatherData['conditionCode']): WeatherTheme {
  switch (conditionCode) {
    case 'sunny':
      return { background: 'hsl(200, 100%, 90%)', foreground: 'hsl(200, 25%, 20%)', cardBackground: 'hsl(200, 80%, 97%)', cardForeground: 'hsl(200, 25%, 15%)' };
    case 'cloudy':
      return { background: 'hsl(210, 20%, 85%)', foreground: 'hsl(210, 15%, 25%)', cardBackground: 'hsl(210, 15%, 95%)', cardForeground: 'hsl(210, 15%, 20%)' };
    case 'rainy':
      return { background: 'hsl(220, 20%, 75%)', foreground: 'hsl(220, 15%, 20%)', cardBackground: 'hsl(220, 15%, 85%)', cardForeground: 'hsl(220, 15%, 15%)' };
    case 'partly-cloudy':
        return { background: 'hsl(205, 60%, 88%)', foreground: 'hsl(205, 30%, 22%)', cardBackground: 'hsl(205, 50%, 96%)', cardForeground: 'hsl(205, 30%, 18%)' };  
    default: // Neutral theme from globals.css effectively
      return { background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground))', cardBackground: 'hsl(var(--card))', cardForeground: 'hsl(var(--card-foreground))' };
  }
}

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<WeatherTheme>(getWeatherThemeStyle());
  const { toast } = useToast();

  useEffect(() => {
    if (weatherData) {
      setCurrentTheme(getWeatherThemeStyle(weatherData.conditionCode));
    } else {
      setCurrentTheme(getWeatherThemeStyle());
    }
  }, [weatherData]);

  const handleLocationSubmit = async (location: string) => {
    setIsLoading(true);
    setWeatherData(null);
    setPhotos([]);
    toast({ title: 'Fetching weather...', description: `Getting data for ${location}.` });

    try {
      const weather = await getWeather(location);
      setWeatherData(weather);
      toast({ title: 'Weather Update', description: `Weather for ${weather.location}: ${weather.condition}, ${weather.temperature}°C` });

      // Generate placeholder photos
      const placeholderPhotos: Photo[] = Array.from({ length: 3 }).map((_, i) => {
        // Create more specific alt text based on weather and location
        const hint = `${weather.conditionCode} ${location.split(',')[0] || 'scene'}`.toLowerCase();
        return {
          id: `${Date.now()}-${i}`,
          src: `https://picsum.photos/600/400?random=${i}&blur=1&=${encodeURIComponent(hint)}`, // Added blur and hint
          alt: `${weather.condition} in ${weather.location} - view ${i + 1}`,
        };
      });
      setPhotos(placeholderPhotos);

      // Sequentially enhance photos to avoid overwhelming the browser/network
      // and to show progress.
      const enhancedPhotosPromises = placeholderPhotos.map(async (photo) => {
        try {
          const dataUri = await toDataURL(photo.src);
          const enhancedResult = await enhancePhotoAction(dataUri, weather.condition, weather.location);
          return {
            ...photo,
            dataUri, // Store original data URI if needed later
            enhancedSrc: enhancedResult.enhancedPhotoDataUri,
            filterApplied: enhancedResult.filterApplied,
          };
        } catch (e) {
          console.error(`Failed to enhance photo ${photo.id}:`, e);
          toast({
            title: 'Image Enhancement Failed',
            description: `Could not enhance photo: ${photo.alt.substring(0,30)}...`,
            variant: 'destructive',
          });
          return photo; // Return original photo if enhancement fails
        }
      });
      
      // Update photos one by one as they get enhanced
      for (const promise of enhancedPhotosPromises) {
        const enhancedPhoto = await promise;
        setPhotos(prevPhotos => prevPhotos.map(p => p.id === enhancedPhoto.id ? enhancedPhoto : p));
      }
      toast({ title: 'Photos Enhanced!', description: 'All images have been processed.' });

    } catch (error) {
      console.error('Error fetching weather or photos:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to fetch data. Please try again.',
        variant: 'destructive',
      });
      setWeatherData(null);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const pageStyle: React.CSSProperties = {
    backgroundColor: currentTheme.background,
    color: currentTheme.foreground,
    minHeight: '100vh',
    transition: 'background-color 0.5s ease, color 0.5s ease',
  };

  return (
    <div style={pageStyle} className="flex flex-col items-center p-6 sm:p-12">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight" style={{ color: currentTheme.foreground === 'hsl(var(--foreground))' ? 'hsl(var(--primary))' : currentTheme.foreground }}>
          WeatherFloat
        </h1>
        <p className="text-lg mt-2" style={{opacity: 0.8}}>
          Get current weather and enjoy dynamically enhanced photos.
        </p>
      </header>

      <section className="w-full max-w-md mb-12">
        <LocationForm onLocationSubmit={handleLocationSubmit} isLoading={isLoading} />
      </section>

      {isLoading && !weatherData && (
        <div className="flex flex-col items-center justify-center my-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Fetching weather data...</p>
        </div>
      )}

      {weatherData && (
        <section className="w-full max-w-md mb-12">
          <WeatherDisplay weather={weatherData} theme={currentTheme} />
        </section>
      )}

      {photos.length > 0 && (
        <section className="w-full max-w-5xl">
           <h2 className="text-3xl font-semibold mb-6 text-center" style={{ color: currentTheme.foreground === 'hsl(var(--foreground))' ? 'hsl(var(--primary))' : currentTheme.foreground }}>
            Floating Views
          </h2>
          <FloatingPhotos photos={photos} />
        </section>
      )}
      
      {!isLoading && !weatherData && photos.length === 0 && (
         <div className="text-center mt-10 p-8 border-2 border-dashed rounded-lg max-w-lg">
            <h2 className="text-2xl font-medium">Welcome to WeatherFloat!</h2>
            <p className="mt-2 text-muted-foreground">
              Enter a location above to see the current weather and some beautiful, AI-enhanced images.
            </p>
          </div>
      )}
    </div>
  );
}
