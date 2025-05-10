import type { WeatherData } from '@/types/weather';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudSun, HelpCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  conditionCode: WeatherData['conditionCode'];
}

export function WeatherIcon({ conditionCode, ...props }: WeatherIconProps) {
  switch (conditionCode) {
    case 'sunny':
      return <Sun {...props} />;
    case 'cloudy':
      return <Cloud {...props} />;
    case 'rainy':
      return <CloudRain {...props} />;
    case 'snowy':
      return <CloudSnow {...props} />;
    case 'windy':
      return <Wind {...props} />;
    case 'partly-cloudy':
      return <CloudSun {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
}
