export interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: string;
  conditionCode: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly-cloudy' | 'windy' | 'unknown';
  location: string;
}

export interface Photo {
  id: string;
  src: string;
  dataUri?: string; // Original image data URI
  enhancedSrc?: string; // Enhanced image data URI
  alt: string;
  filterApplied?: string;
}

export interface WeatherTheme {
  background: string;
  foreground: string;
  cardBackground?: string;
  cardForeground?: string;
}
