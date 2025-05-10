import type { WeatherData } from '@/types/weather';

// Mock function to simulate fetching weather data
export async function getWeather(location: string): Promise<WeatherData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conditions: WeatherData['conditionCode'][] = [
        'sunny',
        'cloudy',
        'rainy',
        'partly-cloudy',
        'windy',
      ];
      const randomConditionCode = conditions[Math.floor(Math.random() * conditions.length)];
      
      let conditionText = "Clear";
      switch(randomConditionCode) {
        case 'sunny': conditionText = "Sunny"; break;
        case 'cloudy': conditionText = "Cloudy"; break;
        case 'rainy': conditionText = "Rainy"; break;
        case 'partly-cloudy': conditionText = "Partly Cloudy"; break;
        case 'windy': conditionText = "Windy"; break;
      }

      resolve({
        location: location,
        temperature: Math.floor(Math.random() * 30) + 5, // Temp between 5 and 35 C
        condition: conditionText,
        windSpeed: `${Math.floor(Math.random() * 20) + 5} km/h`,
        conditionCode: randomConditionCode,
      });
    }, 1000); // Simulate network delay
  });
}
