import { assistantApi } from './api';
import { Language, AIStructuredResponse } from '../types';

export { type AIStructuredResponse };

export const queryAgrinextAI = async (
  query: string,
  language: Language = 'en',
  farmContext?: { farmName?: string; cropName?: string; plotName?: string; location?: string },
  conversationHistory?: Array<{ role: 'user' | 'model'; content: string }>,
  imageBase64?: string
): Promise<AIStructuredResponse> => {
  try {
    const response = await assistantApi.query({
      query,
      language,
      farmContext,
      conversationHistory,
      imageBase64,
    });
    if (response && (response.information || response.understanding)) {
      return response;
    }
  } catch (err: any) {
    console.error('[AI Service] Live Gemini assistant query failed:', err?.message || err);
  }

  const isHindi = language === 'hi';

  // Honest, transparent unavailable state when live Gemini inference is unreachable
  return {
    understanding: isHindi
      ? '⚠️ AI कृषि सहायक सेवा अस्थायी रूप से अनुपलब्ध है'
      : '⚠️ AI Assistant Service Temporarily Unavailable',
    information: isHindi
      ? 'क्षमा करें, वास्तविक समय Google Gemini AI सहायक से संपर्क नहीं हो सका। कृपया अपना नेटवर्क कनेक्शन जांचें अथवा कुछ समय पश्चात पुनः प्रयास करें।\n\nकृषि संबंधी योजनाओं और रीयल-टाइम डेटा के लिए नीचे दिए गए प्रमाणित अनुभागों को देखें।'
      : 'Live Gemini AI Assistant inference could not be completed. Please verify your network connection or try again shortly.\n\nFor verified agricultural services and telemetry, explore the official portals below.',
    nextSteps: [
      isHindi ? 'सरकारी योजनाओं के लिए योजनाएं अनुभाग देखें।' : 'Browse official schemes on the Schemes page.',
      isHindi ? 'फसल रोग निदान के लिए AI लीफ स्कैनर का उपयोग करें।' : 'Use the AI Leaf Scanner for visual crop diagnosis.',
      isHindi ? 'ताजा कृषि मौसम व स्प्रे विंडो की जांच करें।' : 'Inspect live microclimate spray windows on the Weather page.',
    ],
    sourceStatus: 'AI SERVICE UNAVAILABLE',
    actionButtons: [
      { label: isHindi ? '📜 सरकारी योजनाएं' : '📜 View Schemes', action: 'schemes', target: '/schemes' },
      { label: isHindi ? '📷 फसल स्कैन करें' : '📷 Scan Crop', action: 'scan', target: '/disease-detection' },
      { label: isHindi ? '🌦️ लाइव मौसम' : '🌦️ Live Weather', action: 'weather', target: '/weather' },
    ],
  };
};
