'use client';

import type { WeatherData, WeatherTheme } from '@/types/weather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WeatherIcon } from '@/components/icons';
import { Thermometer, Wind, MapPin } from 'lucide-react';

interface WeatherDisplayProps {
  weather: WeatherData;
  theme: WeatherTheme;
}

export function WeatherDisplay({ weather, theme }: WeatherDisplayProps) {
  const cardStyle: React.CSSProperties = {};
  if (theme.cardBackground) cardStyle.backgroundColor = theme.cardBackground;
  if (theme.cardForeground) cardStyle.color = theme.cardForeground;
  
  return (
    <Card className="w-full max-w-md shadow-xl" style={cardStyle}>
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold flex items-center justify-between">
          <span>{weather.location}</span>
          <WeatherIcon conditionCode={weather.conditionCode} className="w-12 h-12" />
        </CardTitle>
        <CardDescription style={theme.cardForeground ? { color: theme.cardForeground } : {}}>{weather.condition}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-lg">
        <div className="flex items-center gap-2">
          <Thermometer className="w-6 h-6 text-primary" />
          <span>Temperature: {weather.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-primary" />
          <span>Wind: {weather.windSpeed}</span>
        </div>
      </CardContent>
    </Card>
  );
}
