import { IWeatherData, IWeatherForecastDay, IWeatherAlert } from '../../types';
import { logger } from '../../utils/logger';

// Known geographical coordinates for Indian agricultural hubs & districts
const KNOWN_DISTRICT_COORDINATES: Record<string, { lat: number; lon: number; state: string }> = {
  // Rajasthan
  jaipur: { lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  jodhpur: { lat: 26.2389, lon: 73.0243, state: 'Rajasthan' },
  kota: { lat: 25.2138, lon: 75.8648, state: 'Rajasthan' },
  bikaner: { lat: 28.0229, lon: 73.3119, state: 'Rajasthan' },
  ajmer: { lat: 26.4499, lon: 74.6399, state: 'Rajasthan' },
  udaipur: { lat: 24.5854, lon: 73.7125, state: 'Rajasthan' },
  alwar: { lat: 27.5530, lon: 76.6346, state: 'Rajasthan' },
  bhilwara: { lat: 25.3216, lon: 74.6307, state: 'Rajasthan' },
  bharatpur: { lat: 27.2152, lon: 77.5030, state: 'Rajasthan' },
  sikar: { lat: 27.6094, lon: 75.1399, state: 'Rajasthan' },
  sriganganagar: { lat: 29.9038, lon: 73.8772, state: 'Rajasthan' },
  ganganagar: { lat: 29.9038, lon: 73.8772, state: 'Rajasthan' },
  hanumangarh: { lat: 29.5818, lon: 74.3294, state: 'Rajasthan' },
  nagaur: { lat: 27.2070, lon: 73.7423, state: 'Rajasthan' },
  pali: { lat: 25.7711, lon: 73.3234, state: 'Rajasthan' },
  tonk: { lat: 26.1664, lon: 75.7885, state: 'Rajasthan' },
  churu: { lat: 28.2900, lon: 74.9600, state: 'Rajasthan' },
  barmer: { lat: 25.7532, lon: 71.3967, state: 'Rajasthan' },
  jaisalmer: { lat: 26.9157, lon: 70.9083, state: 'Rajasthan' },
  chittorgarh: { lat: 24.8887, lon: 74.6269, state: 'Rajasthan' },
  sawaimadhopur: { lat: 25.9928, lon: 76.3526, state: 'Rajasthan' },
  jhalawar: { lat: 24.5973, lon: 76.1610, state: 'Rajasthan' },
  jhunjhunu: { lat: 28.1289, lon: 75.3995, state: 'Rajasthan' },
  bundi: { lat: 25.4415, lon: 75.6441, state: 'Rajasthan' },
  dausa: { lat: 26.8924, lon: 76.3377, state: 'Rajasthan' },
  dholpur: { lat: 26.7025, lon: 77.8934, state: 'Rajasthan' },
  karauli: { lat: 26.4983, lon: 77.0273, state: 'Rajasthan' },
  baran: { lat: 25.1011, lon: 76.5132, state: 'Rajasthan' },
  pratapgarh: { lat: 24.0321, lon: 74.7811, state: 'Rajasthan' },
  rajsamand: { lat: 25.0715, lon: 73.8814, state: 'Rajasthan' },
  sirohi: { lat: 24.8826, lon: 72.8589, state: 'Rajasthan' },
  jalore: { lat: 25.3444, lon: 72.6157, state: 'Rajasthan' },
  dungarpur: { lat: 23.8431, lon: 73.7147, state: 'Rajasthan' },
  banswara: { lat: 23.5461, lon: 74.4349, state: 'Rajasthan' },

  // Uttar Pradesh
  lucknow: { lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh' },
  kanpur: { lat: 26.4499, lon: 80.3319, state: 'Uttar Pradesh' },
  varanasi: { lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh' },
  agra: { lat: 27.1767, lon: 78.0081, state: 'Uttar Pradesh' },
  prayagraj: { lat: 25.4358, lon: 81.8463, state: 'Uttar Pradesh' },
  allahabad: { lat: 25.4358, lon: 81.8463, state: 'Uttar Pradesh' },
  meerut: { lat: 28.9845, lon: 77.7064, state: 'Uttar Pradesh' },
  bareilly: { lat: 28.3670, lon: 79.4304, state: 'Uttar Pradesh' },
  aligarh: { lat: 27.8974, lon: 78.0880, state: 'Uttar Pradesh' },
  moradabad: { lat: 28.8386, lon: 78.7733, state: 'Uttar Pradesh' },
  saharanpur: { lat: 29.9679, lon: 77.5452, state: 'Uttar Pradesh' },
  gorakhpur: { lat: 26.7606, lon: 83.3732, state: 'Uttar Pradesh' },
  noida: { lat: 28.5355, lon: 77.3910, state: 'Uttar Pradesh' },
  mathura: { lat: 27.4924, lon: 77.6737, state: 'Uttar Pradesh' },
  muzaffarnagar: { lat: 29.4727, lon: 77.7085, state: 'Uttar Pradesh' },
  jhansi: { lat: 25.4484, lon: 78.5685, state: 'Uttar Pradesh' },
  ayodhya: { lat: 26.7922, lon: 82.1998, state: 'Uttar Pradesh' },
  barabanki: { lat: 26.9269, lon: 81.1834, state: 'Uttar Pradesh' },
  hardoi: { lat: 27.3956, lon: 80.1314, state: 'Uttar Pradesh' },
  sitapur: { lat: 27.5685, lon: 80.6829, state: 'Uttar Pradesh' },
  unnao: { lat: 26.5454, lon: 80.4878, state: 'Uttar Pradesh' },

  // Madhya Pradesh
  indore: { lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
  bhopal: { lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh' },
  ujjain: { lat: 23.1765, lon: 75.7885, state: 'Madhya Pradesh' },
  gwalior: { lat: 26.2183, lon: 78.1828, state: 'Madhya Pradesh' },
  jabalpur: { lat: 23.1815, lon: 79.9864, state: 'Madhya Pradesh' },
  dewas: { lat: 22.9676, lon: 76.0534, state: 'Madhya Pradesh' },
  dhar: { lat: 22.5978, lon: 75.2979, state: 'Madhya Pradesh' },
  khargone: { lat: 21.8234, lon: 75.6146, state: 'Madhya Pradesh' },
  khandwa: { lat: 21.8314, lon: 76.3498, state: 'Madhya Pradesh' },
  ratlam: { lat: 23.3315, lon: 75.0367, state: 'Madhya Pradesh' },
  mandsaur: { lat: 24.0722, lon: 75.0682, state: 'Madhya Pradesh' },
  neemuch: { lat: 24.4764, lon: 74.8719, state: 'Madhya Pradesh' },
  sagar: { lat: 23.8388, lon: 78.7378, state: 'Madhya Pradesh' },
  vidisha: { lat: 23.5251, lon: 77.8081, state: 'Madhya Pradesh' },
  hoshangabad: { lat: 22.7519, lon: 77.7289, state: 'Madhya Pradesh' },
  sehore: { lat: 23.2031, lon: 77.0844, state: 'Madhya Pradesh' },
  chhindwara: { lat: 22.0574, lon: 78.9382, state: 'Madhya Pradesh' },

  // Punjab
  ludhiana: { lat: 30.9010, lon: 75.8573, state: 'Punjab' },
  amritsar: { lat: 31.6340, lon: 74.8723, state: 'Punjab' },
  jalandhar: { lat: 31.3260, lon: 75.5762, state: 'Punjab' },
  patiala: { lat: 30.3398, lon: 76.3869, state: 'Punjab' },
  bathinda: { lat: 30.2110, lon: 74.9455, state: 'Punjab' },
  hoshiarpur: { lat: 31.5273, lon: 75.9149, state: 'Punjab' },
  sangrur: { lat: 30.2458, lon: 75.8421, state: 'Punjab' },
  firozpur: { lat: 30.9237, lon: 74.6114, state: 'Punjab' },
  fazilka: { lat: 30.4036, lon: 74.0254, state: 'Punjab' },
  gurdaspur: { lat: 32.0419, lon: 75.4053, state: 'Punjab' },
  moga: { lat: 30.8165, lon: 75.1717, state: 'Punjab' },

  // Haryana
  karnal: { lat: 29.6857, lon: 76.9905, state: 'Haryana' },
  gurugram: { lat: 28.4595, lon: 77.0266, state: 'Haryana' },
  gurgaon: { lat: 28.4595, lon: 77.0266, state: 'Haryana' },
  faridabad: { lat: 28.4089, lon: 77.3178, state: 'Haryana' },
  panipat: { lat: 29.3909, lon: 76.9635, state: 'Haryana' },
  hisar: { lat: 29.1492, lon: 75.7217, state: 'Haryana' },
  ambala: { lat: 30.3782, lon: 76.7767, state: 'Haryana' },
  rohtak: { lat: 28.8955, lon: 76.6066, state: 'Haryana' },
  sonipat: { lat: 28.9931, lon: 77.0151, state: 'Haryana' },
  sirsa: { lat: 29.5349, lon: 75.0298, state: 'Haryana' },
  kurukshetra: { lat: 29.9695, lon: 76.8783, state: 'Haryana' },
  bhiwani: { lat: 28.7831, lon: 76.1397, state: 'Haryana' },

  // Maharashtra
  pune: { lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
  nashik: { lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
  nagpur: { lat: 21.1458, lon: 79.0882, state: 'Maharashtra' },
  mumbai: { lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
  aurangabad: { lat: 19.8762, lon: 75.3433, state: 'Maharashtra' },
  sambhajinagar: { lat: 19.8762, lon: 75.3433, state: 'Maharashtra' },
  solapur: { lat: 17.6599, lon: 75.9064, state: 'Maharashtra' },
  kolhapur: { lat: 16.7050, lon: 74.2433, state: 'Maharashtra' },
  ahmednagar: { lat: 19.0948, lon: 74.7480, state: 'Maharashtra' },
  jalgaon: { lat: 21.0077, lon: 75.5626, state: 'Maharashtra' },
  amravati: { lat: 20.9374, lon: 77.7796, state: 'Maharashtra' },
  satara: { lat: 17.6805, lon: 73.9936, state: 'Maharashtra' },
  sangli: { lat: 16.8524, lon: 74.5815, state: 'Maharashtra' },

  // Gujarat
  ahmedabad: { lat: 23.0225, lon: 72.5714, state: 'Gujarat' },
  surat: { lat: 21.1702, lon: 72.8311, state: 'Gujarat' },
  rajkot: { lat: 22.3039, lon: 70.8022, state: 'Gujarat' },
  vadodara: { lat: 22.3072, lon: 73.1812, state: 'Gujarat' },
  anand: { lat: 22.5645, lon: 72.9289, state: 'Gujarat' },
  bhavnagar: { lat: 21.7645, lon: 72.1519, state: 'Gujarat' },
  jamnagar: { lat: 22.4707, lon: 70.0577, state: 'Gujarat' },
  junagadh: { lat: 21.5222, lon: 70.4579, state: 'Gujarat' },
  mehsana: { lat: 23.5880, lon: 72.3693, state: 'Gujarat' },
  banaskantha: { lat: 24.1724, lon: 72.4346, state: 'Gujarat' },

  // Karnataka
  bengaluru: { lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  bangalore: { lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  mysuru: { lat: 12.2958, lon: 76.6394, state: 'Karnataka' },
  mysore: { lat: 12.2958, lon: 76.6394, state: 'Karnataka' },
  hubballi: { lat: 15.3647, lon: 75.1240, state: 'Karnataka' },
  belagavi: { lat: 15.8497, lon: 74.4977, state: 'Karnataka' },
  kolar: { lat: 13.1367, lon: 78.1291, state: 'Karnataka' },
  shivamogga: { lat: 13.9299, lon: 75.5681, state: 'Karnataka' },
  davanagere: { lat: 14.4644, lon: 75.9218, state: 'Karnataka' },
  ballari: { lat: 15.1394, lon: 76.9214, state: 'Karnataka' },
  vijayapura: { lat: 16.8302, lon: 75.7100, state: 'Karnataka' },
  tumakuru: { lat: 13.3379, lon: 77.1010, state: 'Karnataka' },

  // Tamil Nadu
  chennai: { lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
  coimbatore: { lat: 11.0168, lon: 76.9558, state: 'Tamil Nadu' },
  madurai: { lat: 9.9252, lon: 78.1198, state: 'Tamil Nadu' },
  tiruchirappalli: { lat: 10.7905, lon: 78.7047, state: 'Tamil Nadu' },
  salem: { lat: 11.6643, lon: 78.1460, state: 'Tamil Nadu' },
  erode: { lat: 11.3410, lon: 77.7172, state: 'Tamil Nadu' },
  thanjavur: { lat: 10.7870, lon: 79.1378, state: 'Tamil Nadu' },
  tirunelveli: { lat: 8.7139, lon: 77.7567, state: 'Tamil Nadu' },
  dindigul: { lat: 10.3673, lon: 77.9803, state: 'Tamil Nadu' },

  // Telangana & Andhra Pradesh
  hyderabad: { lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  warangal: { lat: 17.9689, lon: 79.5941, state: 'Telangana' },
  nizamabad: { lat: 18.6725, lon: 78.0941, state: 'Telangana' },
  karimnagar: { lat: 18.4386, lon: 79.1288, state: 'Telangana' },
  khammam: { lat: 17.2473, lon: 80.1514, state: 'Telangana' },
  guntur: { lat: 16.3067, lon: 80.4365, state: 'Andhra Pradesh' },
  vijayawada: { lat: 16.5062, lon: 80.6480, state: 'Andhra Pradesh' },
  kurnool: { lat: 15.8281, lon: 78.0373, state: 'Andhra Pradesh' },
  visakhapatnam: { lat: 17.6868, lon: 83.2185, state: 'Andhra Pradesh' },
  tirupati: { lat: 13.6288, lon: 79.4192, state: 'Andhra Pradesh' },

  // Bihar & West Bengal & Odisha
  patna: { lat: 25.5941, lon: 85.1376, state: 'Bihar' },
  muzaffarpur: { lat: 26.1209, lon: 85.3647, state: 'Bihar' },
  bhagalpur: { lat: 25.2425, lon: 86.9842, state: 'Bihar' },
  gaya: { lat: 24.7914, lon: 85.0002, state: 'Bihar' },
  purnia: { lat: 25.7771, lon: 87.4753, state: 'Bihar' },
  kolkata: { lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
  siliguri: { lat: 26.7271, lon: 88.3953, state: 'West Bengal' },
  bardhaman: { lat: 23.2324, lon: 87.8615, state: 'West Bengal' },
  bhubaneswar: { lat: 20.2961, lon: 85.8245, state: 'Odisha' },
  cuttack: { lat: 20.4625, lon: 85.8828, state: 'Odisha' },
  sambalpur: { lat: 21.4669, lon: 83.9812, state: 'Odisha' },

  // Kerala & Assam & Others
  kozhikode: { lat: 11.2588, lon: 75.7804, state: 'Kerala' },
  calicut: { lat: 11.2588, lon: 75.7804, state: 'Kerala' },
  kochi: { lat: 9.9816, lon: 76.2999, state: 'Kerala' },
  thiruvananthapuram: { lat: 8.5241, lon: 76.9366, state: 'Kerala' },
  palakkad: { lat: 10.7867, lon: 76.6548, state: 'Kerala' },
  raipur: { lat: 21.2514, lon: 81.6296, state: 'Chhattisgarh' },
  ranchi: { lat: 23.3441, lon: 85.3096, state: 'Jharkhand' },
  dehradun: { lat: 30.3165, lon: 78.0322, state: 'Uttarakhand' },
  shimla: { lat: 31.1048, lon: 77.1734, state: 'Himachal Pradesh' },
  delhi: { lat: 28.6139, lon: 77.2090, state: 'Delhi' },
  newdelhi: { lat: 28.6139, lon: 77.2090, state: 'Delhi' },
  srinagar: { lat: 34.0837, lon: 74.7973, state: 'Jammu & Kashmir' },
  jammu: { lat: 32.7266, lon: 74.8570, state: 'Jammu & Kashmir' },
  guwahati: { lat: 26.1445, lon: 91.7362, state: 'Assam' },
};

const DEFAULT_FALLBACK_LOCATION = {
  lat: 22.7196,
  lon: 75.8577,
  district: 'Indore',
  state: 'Madhya Pradesh',
};

/**
 * Maps WMO weather interpretation code to human-readable condition string and icon.
 */
export const mapWeatherCode = (code: number): { condition: string; icon: string } => {
  if (code === 0) return { condition: 'Clear Sky & Sunny', icon: 'Sun' };
  if (code === 1) return { condition: 'Mainly Clear', icon: 'Sun' };
  if (code === 2) return { condition: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 3) return { condition: 'Overcast', icon: 'CloudSun' };
  if (code === 45 || code === 48) return { condition: 'Fog / Haze', icon: 'CloudSun' };
  if (code >= 51 && code <= 55) return { condition: 'Light Drizzle', icon: 'CloudRain' };
  if (code >= 56 && code <= 57) return { condition: 'Freezing Drizzle', icon: 'CloudRain' };
  if (code === 61) return { condition: 'Slight Rain', icon: 'CloudRain' };
  if (code === 63) return { condition: 'Moderate Rain', icon: 'CloudRain' };
  if (code === 65) return { condition: 'Heavy Rain & Showers', icon: 'CloudRain' };
  if (code >= 66 && code <= 67) return { condition: 'Freezing Rain', icon: 'CloudRain' };
  if (code >= 71 && code <= 77) return { condition: 'Snowfall / Hail', icon: 'CloudRain' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: 'CloudRain' };
  if (code >= 85 && code <= 86) return { condition: 'Snow Showers', icon: 'CloudRain' };
  if (code === 95) return { condition: 'Thunderstorm', icon: 'CloudLightning' };
  if (code >= 96 && code <= 99) return { condition: 'Severe Thunderstorm with Hail', icon: 'CloudLightning' };
  return { condition: 'Fair Weather', icon: 'Sun' };
};

export class OpenMeteoWeatherService {
  /**
   * Fetches live weather metrics directly from Open-Meteo API using latitude & longitude.
   * Open-Meteo is keyless and public. No API keys required.
   */
  public static async getWeatherData(params?: {
    latitude?: number;
    longitude?: number;
    district?: string;
    state?: string;
    locationName?: string;
  }): Promise<IWeatherData> {
    let lat = params?.latitude;
    let lon = params?.longitude;
    let district = params?.district?.trim() || '';
    let state = params?.state?.trim() || '';
    let locationName = params?.locationName?.trim() || '';
    let isFallback = false;

    // 1. Resolve coordinates
    if (
      typeof lat === 'number' &&
      typeof lon === 'number' &&
      !isNaN(lat) &&
      !isNaN(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      if (!district) district = 'Local Farm Area';
      if (!state) state = 'India';
      if (!locationName) locationName = `${district}, ${state}`;
    } else if (district) {
      const lookupKey = district.toLowerCase().replace(/[^a-z]/g, '');
      const matched = Object.keys(KNOWN_DISTRICT_COORDINATES).find(
        (k) => lookupKey.includes(k) || k.includes(lookupKey)
      );

      if (matched && KNOWN_DISTRICT_COORDINATES[matched]) {
        const found = KNOWN_DISTRICT_COORDINATES[matched];
        lat = found.lat;
        lon = found.lon;
        if (!state) state = found.state;
        locationName = locationName || `${district}, ${state}`;
      } else {
        lat = DEFAULT_FALLBACK_LOCATION.lat;
        lon = DEFAULT_FALLBACK_LOCATION.lon;
        if (!state) state = DEFAULT_FALLBACK_LOCATION.state;
        locationName = locationName || `${district} (Approximate Coordinates)`;
        isFallback = true;
      }
    } else {
      lat = DEFAULT_FALLBACK_LOCATION.lat;
      lon = DEFAULT_FALLBACK_LOCATION.lon;
      district = DEFAULT_FALLBACK_LOCATION.district;
      state = DEFAULT_FALLBACK_LOCATION.state;
      locationName = `${district}, ${state}`;
      isFallback = true;
    }

    logger.info(
      `[WEATHER REQUEST] Lat: ${lat}, Lon: ${lon}, District: "${district}", State: "${state}", LocationName: "${locationName}", isFallback: ${isFallback}`
    );

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`;

    try {
      logger.info(`[OPEN-METEO REQUEST] URL: ${openMeteoUrl}`);

      const response = await fetch(openMeteoUrl, {
        headers: {
          'User-Agent': 'AGRINEXT-Agritech-Platform/1.0',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      logger.info(`[OPEN-METEO RESPONSE] Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        logger.error(`[OPEN-METEO ERROR] HTTP ${response.status}: ${errorText}`);
        throw new Error(`Open-Meteo HTTP error ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();

      if (!data || !data.current || !data.daily) {
        logger.error('[OPEN-METEO ERROR] Malformed Open-Meteo response structure');
        throw new Error('Invalid Open-Meteo response structure');
      }

      const current = data.current;
      const daily = data.daily;

      const currentTemp = Math.round((current.temperature_2m ?? 26) * 10) / 10;
      const humidity = Math.round(current.relative_humidity_2m ?? 55);
      const windSpeed = Math.round((current.wind_speed_10m ?? 12) * 10) / 10;
      const precipitation = Math.round((current.precipitation ?? current.rain ?? 0) * 10) / 10;
      const weatherMeta = mapWeatherCode(current.weather_code ?? 0);

      const rainProbability = daily.precipitation_probability_max?.[0] ?? (precipitation > 0 ? 80 : 15);

      const forecastTimes: string[] = daily.time || [];
      const forecast: IWeatherForecastDay[] = forecastTimes.map((dateStr: string, idx: number) => {
        const code = daily.weather_code?.[idx] ?? 0;
        const mapped = mapWeatherCode(code);
        const dayLabel =
          idx === 0
            ? 'Today'
            : idx === 1
            ? 'Tomorrow'
            : new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
        const rainChance = daily.precipitation_probability_max?.[idx] ?? 10;
        const precipSum = Math.round((daily.precipitation_sum?.[idx] ?? 0) * 10) / 10;

        return {
          day: dayLabel,
          date: dateStr,
          tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? currentTemp),
          tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? currentTemp - 6),
          condition: mapped.condition,
          rainChance,
          precipitationSum: precipSum,
          weatherCode: code,
          icon: mapped.icon,
        };
      });

      const alerts: IWeatherAlert[] = [];

      if (rainProbability >= 50) {
        alerts.push({
          id: 'w-precip-high',
          type: 'rain',
          severity: 'warning',
          title: 'High Precipitation Advisory',
          description: `${rainProbability}% chance of rain forecast in ${district}. Expected precipitation: ${daily.precipitation_sum?.[0] || 0} mm.`,
          actionableStep: 'Defer foliar pesticide/fungicide sprays and clear field drainage channels.',
        });
      } else if (rainProbability >= 25) {
        alerts.push({
          id: 'w-precip-mod',
          type: 'rain',
          severity: 'info',
          title: 'Light Shower Probability',
          description: `Moderate chance of scattered showers (${rainProbability}%) over the next 24 hours.`,
          actionableStep: 'Monitor soil moisture before scheduling irrigation rounds.',
        });
      }

      if (currentTemp >= 38) {
        alerts.push({
          id: 'w-heat',
          type: 'heat',
          severity: 'critical',
          title: 'High Temperature & Heat Stress Warning',
          description: `Intense heat (${currentTemp}°C) may accelerate soil evapotranspiration and stress shallow-rooted crops.`,
          actionableStep: 'Apply light evening drip irrigation and avoid midday chemical applications.',
        });
      }

      if (windSpeed >= 20) {
        alerts.push({
          id: 'w-wind',
          type: 'wind',
          severity: 'warning',
          title: 'Elevated Wind Speed Advisory',
          description: `Surface wind speeds reaching ${windSpeed} km/h can cause droplet drift during spray operations.`,
          actionableStep: 'Operate sprayers during early morning hours with low-drift nozzles.',
        });
      } else if (windSpeed < 12 && rainProbability < 20) {
        alerts.push({
          id: 'w-spray-opt',
          type: 'irrigation',
          severity: 'info',
          title: 'Optimal Foliar Spray Window',
          description: `Calm wind (${windSpeed} km/h) and moderate humidity (${humidity}%) provide an ideal spray window.`,
          actionableStep: 'Proceed with scheduled nutrient or bio-fungicide foliar applications.',
        });
      }

      return {
        location: locationName,
        district,
        state,
        latitude: lat,
        longitude: lon,
        temperature: currentTemp,
        condition: weatherMeta.condition,
        weatherCode: current.weather_code ?? 0,
        humidity,
        precipitation,
        windSpeed,
        rainProbability,
        forecast,
        alerts,
        source: 'Open-Meteo Weather API',
        sourceStatus: 'LIVE DATA',
        isFallback,
        lastUpdated: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error(`[OPEN-METEO ERROR] API query error: ${err.message}`);

      return {
        location: locationName,
        district,
        state,
        latitude: lat,
        longitude: lon,
        temperature: 0,
        condition: 'Weather data temporarily unavailable',
        weatherCode: -1,
        humidity: 0,
        precipitation: 0,
        windSpeed: 0,
        rainProbability: 0,
        forecast: [],
        alerts: [
          {
            id: 'w-unavailable',
            type: 'disease',
            severity: 'warning',
            title: 'Weather Service Notice',
            description: 'Live weather metrics are temporarily unavailable from Open-Meteo.',
            actionableStep: 'Please check your internet connection or try again in a few moments.',
          },
        ],
        source: 'Open-Meteo Weather API',
        sourceStatus: 'UNAVAILABLE',
        isFallback,
        lastUpdated: new Date().toISOString(),
        errorMessage: 'Weather data temporarily unavailable',
      };
    }
  }
}
