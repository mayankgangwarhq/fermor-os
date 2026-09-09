import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFarmLocation } from '../contexts/FarmLocationContext';
import { queryAgrinextAI } from '../services/aiService';
import type { AIChatMessage, AIStructuredResponse, AIDiseaseCardPayload, AIWeatherCardPayload, AIFollowUpCardPayload, AIHotspotCardPayload, AIActionButton } from '../types';
import {
  Bot,
  Mic,
  Send,
  Image as ImageIcon,
  Sparkles,
  Sprout,
  User,
  CheckCircle2,
  CloudRain,
  Leaf,
  Building2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  X,
  Camera,
  MapPin,
  Flame,
  Droplets,
  BarChart3,
  Calendar,
  Layers,
  Check,
  AlertTriangle,
  UploadCloud,
  Sun
} from 'lucide-react';

interface AgrinextAIPageProps {
  onNavigate?: (page: string) => void;
}

export const AgrinextAIPage: React.FC<AgrinextAIPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const { location } = useFarmLocation();
  const currentDistrict = location?.district || 'Jaipur';
  const currentState = location?.state || 'Rajasthan';
  const currentVillage = location?.village || 'Sanganer Farm';
  const navigate = useNavigate();

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHindi = language === 'hi';
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : (isHindi ? 'राजेश' : 'Rajesh');
  const farmLocationStr = `${currentVillage || 'Jagatpura'}, ${currentDistrict || 'Jaipur'}`;

  // Initial welcome message
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: isHindi
        ? `नमस्कार ${userName}! मैं AGRINEXT AI कृषि सहायक हूँ। मैं आपके खेत के फसल स्वास्थ्य, रोग नियंत्रण, मौसम स्प्रे विंडो, और फॉलो-अप रिकवरी में सहायता के लिए सक्रिय हूँ।`
        : `Hello ${userName}! I am AGRINEXT AI, your intelligent farming assistant. I synthesize real-time crop pathology, microclimate weather windows, and continuous follow-up recovery for your farm.`,
      structuredResponse: {
        understanding: isHindi ? 'खेत का संदर्भ: सांगानेर फार्म • भूखंड #1 • गेहूं' : 'Active Farm Context: Sanganer Farm • Plot #1 • Wheat',
        information: isHindi
          ? 'आप अपनी फसल की पत्ती की फोटो अपलोड कर सकते हैं, मौसम जांच सकते हैं, या 3-दिवसीय फॉलो-अप रिकवरी रिपोर्ट देख सकते हैं।'
          : 'You can upload crop leaf photos for instant AI pathology, check optimal spray windows, or track Day 3/7 recovery comparisons.',
        nextSteps: [
          isHindi ? 'पत्ती की फोटो अपलोड करें या नीचे दिए गए स्मार्ट कार्ड पर क्लिक करें।' : 'Upload a leaf photo or click a smart action card below.',
          isHindi ? 'अपनी भाषा में बोलने के लिए माइक बटन दबाएं।' : 'Press the microphone button to speak in your language.'
        ],
        sourceStatus: 'LIVE API'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // 7 Smart Action Cards
  const smartActionCards = [
    {
      id: 'scan',
      icon: '🌱',
      label: isHindi ? 'मेरी फसल स्कैन करें' : 'Scan My Crop',
      sub: isHindi ? 'पत्ती का AI रोग निदान' : 'Instant leaf pathology',
      query: isHindi ? 'मेरी गेहूं की पत्ती पर पीले धब्बे दिख रहे हैं, कृपया जांचें।' : 'My wheat leaves have yellow powdery stripes, please analyze.'
    },
    {
      id: 'weather',
      icon: '🌦️',
      label: isHindi ? 'मौसम व स्प्रे विंडो' : 'Check Weather',
      sub: isHindi ? 'वर्षा व छिड़काव का सही समय' : 'Rain & optimal spray window',
      query: isHindi ? 'आज के मौसम और कीटनाशक स्प्रे विंडो की स्थिति क्या है?' : 'What is the current weather and optimal spray window for my farm?'
    },
    {
      id: 'pest',
      icon: '🐛',
      label: isHindi ? 'कीट जोखिम पहचानें' : 'Detect Pest Risk',
      sub: isHindi ? 'सफेद मक्खी व ट्रैप मॉनिटर' : 'Whitefly & sticky trap advisory',
      query: isHindi ? 'खेत में सफेद मक्खी (Whitefly) का प्रकोप कैसे रोकें?' : 'How to manage whitefly and sucking pest risk in my plot?'
    },
    {
      id: 'hotspot',
      icon: '📍',
      label: isHindi ? 'आसपास के रोग हॉटस्पॉट' : 'Check Nearby Hotspots',
      sub: isHindi ? '15 km में GIS क्लस्टर' : 'GIS outbreak clusters within 15 km',
      query: isHindi ? 'क्या मेरे खेत के आसपास कोई रोग हॉटस्पॉट क्लस्टर सक्रिय है?' : 'Are there any disease outbreak hotspots near my farm?'
    },
    {
      id: 'irrigation',
      icon: '💧',
      label: isHindi ? 'सिंचाई व मिट्टी की नमी' : 'Check Irrigation',
      sub: isHindi ? 'ड्रिप सिंचाई सलाह' : 'Soil moisture & scheduling',
      query: isHindi ? 'वर्तमान मौसम के अनुसार गेहूं के लिए सिंचाई की क्या सलाह है?' : 'What is the irrigation advice based on current soil and weather telemetry?'
    },
    {
      id: 'risk',
      icon: '📊',
      label: isHindi ? 'फार्म जोखिम सूचकांक' : 'View Farm Risk',
      sub: isHindi ? 'समग्र फसल स्वास्थ्य स्कोर' : 'Overall crop health index',
      query: isHindi ? 'मेरे सांगानेर फार्म का वर्तमान समग्र जोखिम स्तर क्या है?' : 'What is the overall disease and microclimate risk level for my farm?'
    },
    {
      id: 'followup',
      icon: '📷',
      label: isHindi ? 'फॉलो-अप फोटो भेजें' : 'Upload Follow-Up Photo',
      sub: isHindi ? 'Day 0 vs Day 3 तुलना' : 'Compare Day 0 vs Day 3 recovery',
      query: isHindi ? 'मैं अपने गेहूं के खेत की Day 3 फॉलो-अप फोटो की तुलना करना चाहता हूँ।' : 'I want to compare my wheat Day 3 follow-up scan for recovery analysis.'
    },
  ];

  // Speech Recognition Language Map
  const speechLangMap: Record<string, string> = {
    hi: 'hi-IN',
    en: 'en-IN',
    mr: 'mr-IN',
    ur: 'ur-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    or: 'or-IN',
    as: 'as-IN',
    ne: 'ne-NP',
    fa: 'fa-IR',
    ar: 'ar-SA',
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(t('voiceNotSupported', 'Voice input is not supported in this browser. Please type your query.'));
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLangMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setInputText(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError(t('micPermissionDenied', 'Microphone permission denied. Please allow microphone access.'));
        } else if (event.error === 'no-speech') {
          setVoiceError(t('noSpeechDetected', 'No speech detected. Please try speaking again.'));
        } else {
          setVoiceError(`${t('voiceInputError', 'Voice input error')} (${event.error}).`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition start error:', err);
      setIsListening(false);
      setVoiceError(t('couldNotStartMic', 'Could not start microphone.'));
    }
  };

  const handleSend = async (queryText?: string, customImage?: string) => {
    const textToSend = queryText || inputText;
    const imageToSend = customImage || attachedImage;
    if ((!textToSend.trim() && !imageToSend) || isThinking) return;

    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend || (isHindi ? '📷 फसल की पत्ती की फोटो भेजी गई' : '📷 Uploaded crop leaf photo'),
      image: imageToSend || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInputText('');
    setAttachedImage(null);
    setIsThinking(true);

    try {
      const response = await queryAgrinextAI(textToSend, language, {
        farmName: 'Sanganer Farm',
        cropName: 'Wheat',
        plotName: 'Plot #1',
        location: farmLocationStr,
      });

      const aiMessage: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.information,
        structuredResponse: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error querying AGRINEXT AI:', err);
      const errorMessage: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: isHindi
          ? 'क्षमा करें, AGRINEXT AI सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Sorry, could not connect to AGRINEXT AI engine. Please try again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAttachPhoto = () => {
    // Sample crop photo upload
    const sampleImg = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80';
    setAttachedImage(sampleImg);
  };

  const handleActionClick = (action: AIActionButton) => {
    if (action.target) {
      if (onNavigate) {
        onNavigate(action.target.replace('/', ''));
      } else {
        navigate(action.target);
      }
    } else if (action.action === 'scan') {
      navigate('/disease-detection');
    } else if (action.action === 'upload_followup') {
      navigate('/follow-up');
    } else if (action.action === 'weather') {
      navigate('/weather');
    } else if (action.action === 'expert') {
      navigate('/experts');
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Dynamic Keyframes & Responsive Layout */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }

        .chat-viewport {
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .chat-viewport::-webkit-scrollbar {
          width: 6px;
        }
        .chat-viewport::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 999px;
        }

        .ai-chat-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 18px;
          align-items: start;
        }

        .smart-action-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .smart-action-btn:hover {
          transform: translateY(-2px);
          border-color: #16A34A !important;
          box-shadow: 0 6px 18px rgba(22,163,74,0.12) !important;
        }

        @media (max-width: 960px) {
          .ai-chat-layout {
            grid-template-columns: 1fr !important;
          }
          .ai-sidebar-context {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. TOP HEADER: AGRINEXT AI IDENTITY + ACTIVE FARM CONTEXT */}
      <div
        className="card"
        style={{
          padding: '16px 24px',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
          border: '1.5px solid #86efac',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 16px rgba(20,83,45,0.04)',
        }}
      >
        {/* Left: Brand Emblem & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(20,83,45,0.25)',
              position: 'relative',
            }}
          >
            <Bot size={24} />
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                border: '2px solid #ffffff',
                animation: 'pulseDot 2s infinite',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#14532D', margin: 0, letterSpacing: '-0.02em' }}>
                AGRINEXT AI
              </h1>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#DCFCE7', color: '#14532D', fontWeight: 800, border: '1px solid #86efac' }}>
                {isHindi ? 'कृषि सहायक' : 'Farming Assistant'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 600 }}>
              {isHindi ? 'आपकी फसल का बुद्धिमान डिजिटल साथी • 17 भाषाएं सक्रिय' : 'Your intelligent farming assistant • Multimodal & Voice enabled'}
            </p>
          </div>
        </div>

        {/* Right: Active Farm Context Pill + Live Engine Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Farm Context Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8FAF5',
              border: '1.5px solid #DCFCE7',
              padding: '6px 14px',
              borderRadius: '12px',
            }}
          >
            <MapPin size={16} color="#16A34A" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#14532D' }}>
              Sanganer Farm • Plot #1 • Wheat ({farmLocationStr})
            </span>
          </div>

          {/* Engine Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#DCFCE7',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid #86efac',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#14532D' }}>LIVE ENGINE</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN AI WORKSPACE */}
      <div className="ai-chat-layout">
        
        {/* MAIN CHAT CONSOLE */}
        <div
          className="card"
          style={{
            height: 'calc(100vh - 180px)',
            minHeight: '620px',
            maxHeight: '820px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          }}
        >
          {/* Chat Messages Viewport */}
          <div
            className="chat-viewport"
            style={{
              flex: 1,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              backgroundColor: '#F8FAF5',
            }}
          >
            {/* WELCOME / SMART ACTIONS PROMPT (Rendered at top) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #DCFCE7',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 4px 14px rgba(20,83,45,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>👋</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#14532D', margin: 0 }}>
                  {isHindi ? `नमस्कार, ${userName}` : `Hello, ${userName}`}
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 16px 0' }}>
                {isHindi ? 'आज AGRINEXT आपके खेत की किस प्रकार सहायता कर सकता है?' : 'How can AGRINEXT help with your farm today?'}
              </p>

              {/* 7 Smart Action Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '8px',
                }}
              >
                {smartActionCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleSend(card.query)}
                    className="smart-action-btn"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid #DCFCE7',
                      backgroundColor: '#F8FAF5',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{card.icon}</span>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#14532D', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {card.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {card.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeInUp 0.2s ease-out forwards',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', maxWidth: '88%', width: 'auto' }}>
                  {msg.sender === 'ai' && (
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        backgroundColor: '#14532D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                        marginTop: '2px',
                        boxShadow: '0 2px 8px rgba(20,83,45,0.2)',
                      }}
                    >
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    style={{
                      padding: '16px 20px',
                      backgroundColor: msg.sender === 'user' ? '#14532D' : '#ffffff',
                      color: msg.sender === 'user' ? '#ffffff' : '#17201A',
                      borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      boxShadow: msg.sender === 'user' ? '0 4px 14px rgba(20,83,45,0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
                      border: msg.sender === 'user' ? 'none' : '1.5px solid #e2e8f0',
                      wordBreak: 'break-word',
                      width: '100%',
                    }}
                  >
                    {/* Uploaded image preview */}
                    {msg.image && (
                      <div style={{ position: 'relative', marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', maxHeight: '200px' }}>
                        <img
                          src={msg.image}
                          alt="Crop scan"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div style={{ fontSize: '0.94rem', lineHeight: 1.55, fontWeight: msg.sender === 'user' ? 600 : 500 }}>
                      {msg.text}
                    </div>

                    {/* RICH STRUCTURED CARDS (AI) */}
                    {msg.sender === 'ai' && msg.structuredResponse && (
                      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        
                        {/* 1. DISEASE DIAGNOSTIC CARD */}
                        {msg.structuredResponse.diseaseCard && (
                          <div
                            style={{
                              backgroundColor: '#F8FAF5',
                              border: '1.5px solid #86efac',
                              borderRadius: '16px',
                              padding: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#16A34A', textTransform: 'uppercase' }}>
                                🌿 {msg.structuredResponse.diseaseCard.crop} • AI Pathology Scan
                              </span>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 900,
                                  padding: '2px 10px',
                                  borderRadius: '999px',
                                  backgroundColor: msg.structuredResponse.diseaseCard.risk === 'HIGH' || msg.structuredResponse.diseaseCard.risk === 'CRITICAL' ? '#fee2e2' : '#fef3c7',
                                  color: msg.structuredResponse.diseaseCard.risk === 'HIGH' || msg.structuredResponse.diseaseCard.risk === 'CRITICAL' ? '#dc2626' : '#b45309',
                                }}
                              >
                                {msg.structuredResponse.diseaseCard.risk} RISK ({msg.structuredResponse.diseaseCard.confidence}% Conf.)
                              </span>
                            </div>

                            <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#14532D', margin: '0 0 8px 0' }}>
                              {msg.structuredResponse.diseaseCard.disease}
                            </h4>

                            {msg.structuredResponse.diseaseCard.environmentalFactors && (
                              <div style={{ marginBottom: '10px', backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                                  {isHindi ? 'पहचाने गए मौसमी कारक' : 'Microclimate Triggers'}
                                </div>
                                {msg.structuredResponse.diseaseCard.environmentalFactors.map((f, i) => (
                                  <div key={i} style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle2 size={12} color="#16A34A" />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {msg.structuredResponse.diseaseCard.chemicalTreatment && (
                              <div style={{ fontSize: '0.82rem', color: '#991b1b', backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: '10px', border: '1px solid #fecaca', marginBottom: '6px', fontWeight: 600 }}>
                                💊 <strong>{isHindi ? 'दवा स्प्रे:' : 'Chemical Action:'}</strong> {msg.structuredResponse.diseaseCard.chemicalTreatment}
                              </div>
                            )}

                            {msg.structuredResponse.diseaseCard.sprayWindow && (
                              <div style={{ fontSize: '0.8rem', color: '#78350f', backgroundColor: '#fffbeb', padding: '8px 12px', borderRadius: '10px', border: '1px solid #fef3c7', fontWeight: 600 }}>
                                ⛅ <strong>{isHindi ? 'स्प्रे विंडो:' : 'Spray Window:'}</strong> {msg.structuredResponse.diseaseCard.sprayWindow}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. WEATHER TELEMETRY CARD */}
                        {msg.structuredResponse.weatherCard && (
                          <div
                            style={{
                              backgroundColor: '#f0f9ff',
                              border: '1.5px solid #bae6fd',
                              borderRadius: '16px',
                              padding: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase' }}>
                                ⛅ Agricultural Weather Telemetry
                              </span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 900, backgroundColor: '#DCFCE7', color: '#14532D', padding: '2px 8px', borderRadius: '6px' }}>
                                {msg.structuredResponse.weatherCard.sprayWindowStatus}
                              </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px', textAlign: 'center' }}>
                              <div style={{ backgroundColor: '#ffffff', padding: '8px 4px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Temp</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>{msg.structuredResponse.weatherCard.temp}</div>
                              </div>
                              <div style={{ backgroundColor: '#ffffff', padding: '8px 4px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Humidity</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>{msg.structuredResponse.weatherCard.humidity}</div>
                              </div>
                              <div style={{ backgroundColor: '#ffffff', padding: '8px 4px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Rain Prob</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284c7' }}>{msg.structuredResponse.weatherCard.rainProb}</div>
                              </div>
                              <div style={{ backgroundColor: '#ffffff', padding: '8px 4px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Wind</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>{msg.structuredResponse.weatherCard.windSpeed}</div>
                              </div>
                            </div>

                            <p style={{ fontSize: '0.82rem', color: '#0369a1', margin: 0, fontWeight: 600 }}>
                              {msg.structuredResponse.weatherCard.recommendation}
                            </p>
                          </div>
                        )}

                        {/* 3. FOLLOW-UP RECOVERY COMPARISON CARD */}
                        {msg.structuredResponse.followUpCard && (
                          <div
                            style={{
                              backgroundColor: '#14532D',
                              color: '#ffffff',
                              borderRadius: '18px',
                              padding: '18px',
                              border: '2px solid #EAB308',
                              boxShadow: '0 8px 20px rgba(20,83,45,0.2)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#EAB308', textTransform: 'uppercase' }}>
                                📊 AI Follow-Up Recovery Comparison
                              </span>
                              <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#86efac' }}>
                                {msg.structuredResponse.followUpCard.recoveryPercent}% Recovery
                              </span>
                            </div>

                            {/* Side-by-Side Day 0 vs Day 3 Photos */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '110px', position: 'relative' }}>
                                <img src={msg.structuredResponse.followUpCard.initialImage} alt="Day 0" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{ position: 'absolute', bottom: '4px', left: '4px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                                  Day 0 (Initial)
                                </span>
                              </div>
                              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '110px', position: 'relative', border: '1.5px solid #86efac' }}>
                                <img src={msg.structuredResponse.followUpCard.followUpImage} alt="Day 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{ position: 'absolute', bottom: '4px', left: '4px', backgroundColor: '#16A34A', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                                  Day 3 (Follow-Up)
                                </span>
                              </div>
                            </div>

                            <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                              <div style={{ width: `${msg.structuredResponse.followUpCard.recoveryPercent}%`, height: '100%', backgroundColor: '#86efac', borderRadius: '999px' }} />
                            </div>

                            <p style={{ fontSize: '0.84rem', color: '#dcfce7', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                              {msg.structuredResponse.followUpCard.recoverySummary}
                            </p>

                            <div style={{ fontSize: '0.75rem', color: '#EAB308', fontWeight: 700 }}>
                              🗓️ Next review scheduled: {msg.structuredResponse.followUpCard.nextCheckupDate}
                            </div>
                          </div>
                        )}

                        {/* 4. GIS HOTSPOT CARD */}
                        {msg.structuredResponse.hotspotCard && (
                          <div
                            style={{
                              backgroundColor: '#fef2f2',
                              border: '1.5px solid #fca5a5',
                              borderRadius: '16px',
                              padding: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase' }}>
                                🚨 Regional GIS Outbreak Warning
                              </span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 900, backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '6px' }}>
                                {msg.structuredResponse.hotspotCard.threatLevel} THREAT
                              </span>
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#991b1b', margin: '0 0 4px 0' }}>
                              {msg.structuredResponse.hotspotCard.disease}
                            </h4>
                            <div style={{ fontSize: '0.8rem', color: '#7f1d1d', marginBottom: '8px' }}>
                              📍 {msg.structuredResponse.hotspotCard.distance} ({msg.structuredResponse.hotspotCard.affectedFarms} farms reported)
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#991b1b', margin: 0, fontWeight: 600 }}>
                              {msg.structuredResponse.hotspotCard.advisory}
                            </p>
                          </div>
                        )}

                        {/* ACTION BUTTONS */}
                        {msg.structuredResponse.actionButtons && msg.structuredResponse.actionButtons.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {msg.structuredResponse.actionButtons.map((btn, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleActionClick(btn)}
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '10px',
                                  border: '1.5px solid #16A34A',
                                  backgroundColor: '#DCFCE7',
                                  color: '#14532D',
                                  fontWeight: 800,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                }}
                              >
                                <span>{btn.label}</span>
                                <ChevronRight size={14} />
                              </button>
                            ))}
                          </div>
                        )}

                      </div>
                    )}

                    <div
                      style={{
                        fontSize: '0.68rem',
                        marginTop: '8px',
                        textAlign: 'right',
                        color: msg.sender === 'user' ? 'rgba(255,255,255,0.75)' : '#94a3b8',
                        fontWeight: 600,
                      }}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* AI THINKING LOADING INDICATOR */}
            {isThinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeInUp 0.2s ease-out forwards' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#14532D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
                  <Bot size={18} />
                </div>
                <div style={{ padding: '12px 18px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1.5px solid #86efac', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <RefreshCw size={15} className="spin-icon" color="#16A34A" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#14532D' }}>
                    {isHindi ? 'AGRINEXT AI आपकी फसल का विश्लेषण कर रहा है...' : 'AGRINEXT AI is analyzing your farm data...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* COMPOSER & IMAGE ATTACHMENT BAR (PINNED BOTTOM) */}
          <div style={{ padding: '14px 18px', borderTop: '1.5px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* ATTACHED IMAGE BANNER */}
            {attachedImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', backgroundColor: '#DCFCE7', border: '1.5px solid #86efac', borderRadius: '12px', fontSize: '0.84rem', color: '#14532D', fontWeight: 800 }}>
                <ImageIcon size={18} color="#16A34A" />
                <span>{isHindi ? '📷 फसल की पत्ती की फोटो संलग्न है' : '📷 Crop Leaf Photo Attached (Ready for AI scan)'}</span>
                <button onClick={() => setAttachedImage(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', marginLeft: 'auto', fontWeight: 'bold' }}>✕</button>
              </div>
            )}

            {/* VOICE ERROR BANNER */}
            {voiceError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', fontSize: '0.78rem', color: '#991b1b', fontWeight: '600' }}>
                <AlertCircle size={14} color="#dc2626" />
                <span>{voiceError}</span>
                <button onClick={() => setVoiceError(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626', marginLeft: 'auto' }}>✕</button>
              </div>
            )}

            {/* MAIN COMPOSER BAR */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F8FAF5',
                borderRadius: '16px',
                border: isListening ? '2px solid #dc2626' : '1.5px solid #cbd5e1',
                padding: '6px 8px 6px 12px',
              }}
            >
              {/* Photo Upload Trigger */}
              <button
                type="button"
                onClick={handleAttachPhoto}
                title={isHindi ? 'फसल फोटो संलग्न करें' : 'Attach crop photo'}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#14532D',
                  cursor: 'pointer',
                  padding: '9px',
                  borderRadius: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #DCFCE7',
                }}
              >
                <Camera size={18} />
              </button>

              {/* Voice Input */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isHindi ? 'बोलकर पूछें' : 'Voice search'}
                style={{
                  border: isListening ? '1.5px solid #fca5a5' : '1px solid #86efac',
                  backgroundColor: isListening ? '#fee2e2' : '#DCFCE7',
                  color: isListening ? '#dc2626' : '#14532D',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                }}
              >
                <Mic size={16} />
                <span>{isListening ? (isHindi ? 'सुन रहा हूँ...' : 'Listening...') : (isHindi ? 'बोलें' : 'Speak')}</span>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? (isHindi ? 'कृपया बोलें...' : 'Listening, please speak...') : (isHindi ? 'फसल, बीमारी, मौसम, स्प्रे या फॉलो-अप के बारे में पूछें...' : 'Ask about crop health, diseases, spray window, or follow-up...')}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  flex: 1,
                  color: '#0f172a',
                }}
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={(!inputText.trim() && !attachedImage) || isThinking}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  backgroundColor: '#14532D',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: ((!inputText.trim() && !attachedImage) || isThinking) ? 0.5 : 1,
                  cursor: ((!inputText.trim() && !attachedImage) || isThinking) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(20,83,45,0.2)',
                }}
              >
                <Send size={16} />
              </button>
            </div>

          </div>

        </div>

        {/* SIDEBAR CONTEXT & RAPID SHORTCUTS */}
        <div className="ai-sidebar-context" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Farm Dossier Snapshot Card */}
          <div className="card" style={{ padding: '20px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1.5px solid #86efac' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sprout size={20} color="#16A34A" />
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#14532D', margin: 0 }}>
                {isHindi ? 'खेत प्रोफाइल संदर्भ' : 'Live Farm Telemetry'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Farm:</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>Sanganer Farm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Active Crop:</span>
                <span style={{ fontWeight: 800, color: '#16A34A' }}>Wheat (HD-3086)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Plot Area:</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>4.5 Acres</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Current Risk:</span>
                <span style={{ fontWeight: 800, color: '#d97706' }}>MODERATE (Yellow Rust)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Spray Window:</span>
                <span style={{ fontWeight: 800, color: '#16A34A' }}>OPEN (until 10:30 AM)</span>
              </div>
            </div>
          </div>

          {/* Quick Module Navigation Links */}
          <div className="card" style={{ padding: '20px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#14532D', marginBottom: '12px' }}>
              {isHindi ? 'त्वरित नेविगेशन' : 'Platform Modules'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: isHindi ? 'AI फसल रोग स्कैनर' : 'AI Crop Scanner', path: '/disease-detection', icon: <Camera size={18} color="#16A34A" /> },
                { label: isHindi ? 'फॉलो-अप रिकवरी ट्रैकर' : 'Follow-Up Tracker', path: '/follow-up', icon: <CheckCircle2 size={18} color="#059669" /> },
                { label: isHindi ? 'माइक्रोक्लाइमेट वेदर' : 'Weather & Spray Window', path: '/weather', icon: <CloudRain size={18} color="#0284c7" /> },
                { label: isHindi ? 'GIS आउटब्रेक हॉटस्पॉट' : 'GIS Hotspot Radar', path: '/hotspots', icon: <Flame size={18} color="#dc2626" /> },
                { label: isHindi ? 'कृषि विशेषज्ञ से बात करें' : 'Talk to Agronomist', path: '/experts', icon: <User size={18} color="#7c3aed" /> },
              ].map((m, i) => (
                <div
                  key={i}
                  onClick={() => navigate(m.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAF5',
                    border: '1px solid #DCFCE7',
                    cursor: 'pointer',
                  }}
                  className="smart-action-btn"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {m.icon}
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#14532D' }}>{m.label}</span>
                  </div>
                  <ChevronRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Tip Banner */}
          <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#DCFCE7', border: '1.5px solid #86efac' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#14532D', textTransform: 'uppercase', marginBottom: '4px' }}>
              💡 {isHindi ? 'AI किसान सुझाव' : 'Continuous AI Tip'}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#14532D', margin: 0, lineHeight: 1.45, fontWeight: 600 }}>
              {isHindi
                ? 'कीटनाशक छिड़काव के 72 घंटे बाद (Day 3) उसी पत्ती की दूसरी फोटो भेजें ताकि AI रिकवरी प्रतिशत सत्यापित कर सके।'
                : 'Upload a review photo 72 hours (Day 3) post-treatment so AGRINEXT AI can verify your recovery percentage.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

