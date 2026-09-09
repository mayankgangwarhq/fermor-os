import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller';

const router = Router();

router.get('/', WeatherController.getWeather);
router.get('/forecast', WeatherController.getWeatherForecast);

export const weatherRoutes = router;
