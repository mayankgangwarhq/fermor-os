import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFarmLocation } from '../contexts/FarmLocationContext';
import { queryAgrinextAI } from '../services/aiService';
import { MarkdownRenderer } from '../components/chat/MarkdownRenderer';
import {
  SchemeCard,
  DiseaseCard,
  PestCard,
  WeatherCard,
  MandiCard,
  SourceBadge,
  ActionButtonGroup,
} from '../components/chat/AgriculturalCards';
import type {
  AIChatMessage,
  AIActionButton,
  ChatSession,
} from '../types';
import {
  Bot,
  Mic,
  Send,
  Image as ImageIcon,
  Sparkles,
  Sprout,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Camera,
  MapPin,
  Search,
  Plus,
  Trash2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  Check,
} from 'lucide-react';

interface AgrinextAIPageProps {
  onNavigate?: (page: string) => void;
}

const STORAGE_SESSIONS_KEY = 'agrinext_chat_sessions_v2';
const STORAGE_CURRENT_ID_KEY = 'agrinext_current_chat_id_v2';

export const AgrinextAIPage: React.FC<AgrinextAIPageProps> = ({ onNavigate }) => {
  const { language, t, setLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const { location } = useFarmLocation();
  const navigate = useNavigate();

  const currentDistrict = location?.district || 'Jaipur';
  const currentState = location?.state || 'Rajasthan';
  const currentVillage = location?.village || 'Sanganer';
  const farmLocationStr = `${currentVillage}, ${currentDistrict}, ${currentState}`;
  const isHindi = language === 'hi';

  // --- Session & History State ---
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    const initialSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: isHindi ? 'नई कृषि सलाह' : 'New Farming Advisory',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    return [initialSession];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_CURRENT_ID_KEY);
    return savedId && sessions.some(s => s.id === savedId) ? savedId : sessions[0]?.id || `session-${Date.now()}`;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Chat Input & AI State ---
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active Session
  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === currentSessionId) || sessions[0];
  }, [sessions, currentSessionId]);

  const messages = activeSession?.messages || [];

  // Persist sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_CURRENT_ID_KEY, currentSessionId);
    } catch (e) {
      // ignore
    }
  }, [sessions, currentSessionId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // --- Conversation Management ---
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: isHindi ? 'नई कृषि सलाह' : 'New Advisory',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInputText('');
    setAttachedImage(null);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        const fallback: ChatSession = {
          id: `session-${Date.now()}`,
          title: isHindi ? 'नई कृषि सलाह' : 'New Advisory',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [],
        };
        setCurrentSessionId(fallback.id);
        return [fallback];
      }
      if (sessionId === currentSessionId) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearCurrentChat = () => {
    if (messages.length === 0) return;
    setSessions(prev =>
      prev.map(s => (s.id === currentSessionId ? { ...s, messages: [], updatedAt: Date.now() } : s))
    );
  };

  // --- Group Sessions by Date ---
  const groupedSessions = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const groups: { label: string; items: ChatSession[] }[] = [
      { label: isHindi ? 'आज' : 'Today', items: [] },
      { label: isHindi ? 'कल' : 'Yesterday', items: [] },
      { label: isHindi ? 'पिछले 7 दिन' : 'Previous 7 Days', items: [] },
      { label: isHindi ? 'पुराने' : 'Older', items: [] },
    ];

    const filtered = sessions.filter(s =>
      searchQuery.trim()
        ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    );

    filtered.forEach(session => {
      const diff = now - session.updatedAt;
      if (diff < oneDay) {
        groups[0].items.push(session);
      } else if (diff < 2 * oneDay) {
        groups[1].items.push(session);
      } else if (diff < 7 * oneDay) {
        groups[2].items.push(session);
      } else {
        groups[3].items.push(session);
      }
    });

    return groups.filter(g => g.items.length > 0);
  }, [sessions, searchQuery, isHindi]);

  // --- Smart Suggestion Prompts ---
  const suggestionCards = [
    {
      icon: '🌿',
      category: isHindi ? 'फसल रोग निदान' : 'Crop Disease Diagnosis',
      prompt: isHindi ? 'गेहूं की पत्तियों पर पीले धब्बे और रतुआ रोग का उपचार बताएं।' : 'Why are my wheat leaves developing yellow stripe spots?',
    },
    {
      icon: '🏛️',
      category: isHindi ? 'सरकारी योजनाएं' : 'Govt Schemes & Subsidies',
      prompt: isHindi ? 'PM-KISAN योजना के लाभ, पात्रता और eKYC की प्रक्रिया क्या है?' : 'What is PM-KISAN, who is eligible, and how to do eKYC?',
    },
    {
      icon: '💳',
      category: isHindi ? 'किसान क्रेडिट कार्ड' : 'Kisan Credit Card (KCC)',
      prompt: isHindi ? 'KCC ऋण के लिए आवश्यक दस्तावेज और 4% ब्याज दर की शर्तें क्या हैं?' : 'How to apply for Kisan Credit Card (KCC) and what are the document requirements?',
    },
    {
      icon: '🌦️',
      category: isHindi ? 'मौसम व स्प्रे विंडो' : 'Weather & Spray Window',
      prompt: isHindi ? 'आज के मौसम अनुसार कीटनाशक छिड़काव का सही समय क्या है?' : 'What is the current agricultural weather and optimal spray window for my plot?',
    },
    {
      icon: '📈',
      category: isHindi ? 'मंडी भाव व बाजार' : 'APMC Mandi Rates',
      prompt: isHindi ? 'नजदीकी मंडी में गेहूं और सरसों का ताजा मॉडल भाव क्या है?' : 'What are the current mandi rates and price trends for wheat and mustard?',
    },
    {
      icon: '🐛',
      category: isHindi ? 'कीट नियंत्रण (IPM)' : 'Pest Management',
      prompt: isHindi ? 'कपास व सब्जियों में सफेद मक्खी (Whitefly) का जैविक नियंत्रण कैसे करें?' : 'How to manage whitefly and sucking pest risk organically?',
    },
  ];

  // --- Voice Input (Web Speech API) ---
  const speechLangMap: Record<string, string> = {
    hi: 'hi-IN',
    en: 'en-IN',
    mr: 'mr-IN',
    ur: 'ur-IN',
    bn: 'bn-IN',
    pa: 'pa-IN',
    ta: 'ta-IN',
    te: 'te-IN',
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(t('voiceNotSupported', 'Voice speech recognition is not supported in this browser. Please type your query.'));
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
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError(t('micPermissionDenied', 'Microphone access was denied. Please allow microphone permissions.'));
        } else if (event.error === 'no-speech') {
          setVoiceError(t('noSpeechDetected', 'No speech detected. Please speak clearly.'));
        } else {
          setVoiceError(`Voice input error (${event.error})`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceError('Could not start microphone.');
    }
  };

  // --- Photo File Upload ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isHindi ? 'कृपया केवल छवि (Image) फ़ाइल चुनें।' : 'Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachedImage(base64);
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be chosen again
    e.target.value = '';
  };

  // --- Send Message Flow ---
  const handleSend = async (customQuery?: string, retryImage?: string) => {
    const textToSend = (customQuery || inputText).trim();
    const imageToSend = retryImage || attachedImage;

    if ((!textToSend && !imageToSend) || isThinking) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const userMessage: AIChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend || (isHindi ? '📷 फसल की पत्ती की फोटो संलग्न की गई' : '📷 Attached crop image for AI diagnosis'),
      image: imageToSend || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update Session Title if it's the first message
    const updatedTitle =
      messages.length === 0 && textToSend
        ? textToSend.length > 32
          ? textToSend.slice(0, 32) + '...'
          : textToSend
        : activeSession.title;

    // Append User Message to Active Session
    setSessions(prev =>
      prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      })
    );

    if (!customQuery) setInputText('');
    setAttachedImage(null);
    setIsThinking(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        content: m.text,
      }));

      const response = await queryAgrinextAI(
        textToSend,
        language,
        {
          farmName: currentUser?.name ? `${currentUser.name}'s Farm` : 'Sanganer Plot #1',
          cropName: 'Wheat',
          plotName: 'Plot #1',
          location: farmLocationStr,
        },
        historyPayload,
        imageToSend || undefined
      );

      const aiMessage: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.information || response.understanding || 'Advisory generated successfully.',
        structuredResponse: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, aiMessage],
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('[AgrinextAI] Error generating AI response:', err);
      const errorMessage: AIChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: isHindi
          ? 'क्षमा करें, AGRINEXT AI सहायक से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'AGRINEXT AI is temporarily unavailable. Please verify your connection or try again.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, errorMessage],
            };
          }
          return s;
        })
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleActionClick = (btn: AIActionButton) => {
    if (btn.target) {
      if (btn.action === 'external' || btn.target.startsWith('http')) {
        window.open(btn.target, '_blank', 'noopener,noreferrer');
      } else if (onNavigate) {
        onNavigate(btn.target.replace('/', ''));
      } else {
        navigate(btn.target);
      }
    } else if (btn.action === 'scan') {
      navigate('/disease-detection');
    } else if (btn.action === 'upload_followup') {
      navigate('/follow-up');
    } else if (btn.action === 'weather') {
      navigate('/weather');
    } else if (btn.action === 'expert') {
      navigate('/experts');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 110px)',
        minHeight: '620px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        position: 'relative',
      }}
    >
      {/* ---------------- 1. LEFT SIDEBAR (CHAT HISTORY) ---------------- */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          transition: 'transform 0.25s ease',
        }}
        className={`ai-sidebar ${isSidebarOpen ? 'ai-sidebar-open' : ''}`}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <button
            onClick={handleNewChat}
            className="btn btn-primary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.86rem',
            }}
          >
            <Plus size={16} />
            <span>{isHindi ? 'नई चैट' : 'New Chat'}</span>
          </button>

          {/* Close drawer on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="mobile-close-sidebar-btn"
            style={{
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Search Chat History */}
        <div style={{ padding: '10px 14px 6px 14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
            }}
          >
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder={isHindi ? 'चैट खोजें...' : 'Search conversations...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.82rem',
                width: '100%',
                color: '#1e293b',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
          {groupedSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '0.82rem' }}>
              {isHindi ? 'कोई बातचीत नहीं मिली' : 'No conversations found'}
            </div>
          ) : (
            groupedSessions.map((group, gIdx) => (
              <div key={gIdx} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px', letterSpacing: '0.04em' }}>
                  {group.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {group.items.map(session => {
                    const isActive = session.id === currentSessionId;
                    return (
                      <div
                        key={session.id}
                        onClick={() => {
                          setCurrentSessionId(session.id);
                          setIsSidebarOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                          color: isActive ? '#065f46' : '#334155',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          border: isActive ? '1px solid #a7f3d0' : '1px solid transparent',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          <MessageSquare size={14} color={isActive ? '#059669' : '#94a3b8'} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {session.title || (isHindi ? 'कृषि संवाद' : 'Conversation')}
                          </span>
                        </div>
                        <button
                          onClick={e => handleDeleteSession(session.id, e)}
                          title={isHindi ? 'हटाएं' : 'Delete chat'}
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer Context Info */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', fontSize: '0.74rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#065f46' }}>
            <Sprout size={14} color="#059669" />
            <span>AGRINEXT OS Engine</span>
          </div>
          <div style={{ marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📍 {currentDistrict}, {currentState}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 35,
          }}
        />
      )}

      {/* ---------------- 2. MAIN CHAT AREA ---------------- */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', minWidth: 0 }}>
        
        {/* Chat Top Header */}
        <header
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="sidebar-toggle-btn"
              style={{
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Toggle Chat History"
            >
              <Menu size={18} color="#475569" />
            </button>

            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
              }}
            >
              <Bot size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  AGRINEXT AI
                </h2>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    border: '1px solid #a7f3d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                  <span>ONLINE</span>
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                {isHindi ? 'आधिकारिक कृषि बुद्धिमत्ता सहायक • योजनाएं, मौसम व रोग निदान' : 'Official Agriculture Assistant • Schemes, Weather & Crop Pathology'}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Switcher Badge */}
            <button
              onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
              style={{
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
              }}
              title="Switch Language"
            >
              🌐 {isHindi ? 'हिन्दी (Change)' : 'English (बदलें)'}
            </button>

            {messages.length > 0 && (
              <button
                onClick={handleClearCurrentChat}
                style={{
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title={isHindi ? 'चैट साफ़ करें' : 'Clear current conversation'}
              >
                <RotateCcw size={12} />
                <span>{isHindi ? 'साफ़ करें' : 'Clear'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Message Stream Viewport */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            backgroundColor: '#f8fafc',
          }}
        >
          {/* WELCOME SCREEN (When current session is empty) */}
          {messages.length === 0 && (
            <div style={{ maxWidth: '780px', margin: 'auto', width: '100%', padding: '24px 12px' }}>
              
              {/* Hero Banner */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#ecfdf5',
                    border: '1.5px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    color: '#059669',
                    boxShadow: '0 4px 12px rgba(5,150,105,0.1)',
                  }}
                >
                  <Sparkles size={28} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {isHindi ? `नमस्ते, ${currentUser?.name || 'किसान साथी'}!` : `Welcome, ${currentUser?.name || 'Farmer'}!`}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.5 }}>
                  {isHindi
                    ? 'मैं AGRINEXT AI कृषि सहायक हूँ। मैं सरकारी योजनाओं (PM-KISAN, KCC, PMFBY), फसल रोगों, कीटनाशक स्प्रे विंडो, और मंडी भावों में आपकी सहायता के लिए तैयार हूँ।'
                    : 'Your official agricultural intelligence companion for government schemes, crop pathology, optimal spray windows, and real-time mandi prices.'}
                </p>
              </div>

              {/* Categorized Prompt Suggestions */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
                  {isHindi ? 'सुझाए गए प्रश्न:' : 'Suggested Agricultural Inquiries:'}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {suggestionCards.map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(card.prompt)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#059669';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,150,105,0.08)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                      }}
                    >
                      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{card.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                          {card.category}
                        </div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b', marginTop: '2px', lineHeight: 1.35 }}>
                          {card.prompt}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MESSAGE LIST */}
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  maxWidth: '85%',
                  width: msg.structuredResponse ? '100%' : 'auto',
                }}
              >
                {/* AI Avatar */}
                {msg.sender === 'ai' && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: msg.isError ? '#ef4444' : '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {msg.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                  </div>
                )}

                {/* Message Bubble Body */}
                <div
                  style={{
                    padding: msg.sender === 'user' ? '12px 16px' : '16px 20px',
                    backgroundColor: msg.sender === 'user' ? '#064e3b' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(6,78,59,0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                    width: '100%',
                  }}
                >
                  {/* Uploaded User Image Preview */}
                  {msg.image && (
                    <div
                      style={{
                        marginBottom: '10px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        maxWidth: '280px',
                        maxHeight: '180px',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                      onClick={() => setPreviewModalImage(msg.image || null)}
                    >
                      <img src={msg.image} alt="Crop sample" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  {/* Message Content: User Text vs AI Markdown */}
                  {msg.sender === 'user' ? (
                    <div style={{ fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div>
                      {/* Markdown rendered text */}
                      <MarkdownRenderer content={msg.text} />

                      {/* Structured Agriculture Response Cards */}
                      {msg.structuredResponse && (
                        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {msg.structuredResponse.schemeCard && (
                            <SchemeCard scheme={msg.structuredResponse.schemeCard} />
                          )}
                          {msg.structuredResponse.diseaseCard && (
                            <DiseaseCard disease={msg.structuredResponse.diseaseCard} isHindi={isHindi} />
                          )}
                          {msg.structuredResponse.pestCard && (
                            <PestCard pest={msg.structuredResponse.pestCard} />
                          )}
                          {msg.structuredResponse.weatherCard && (
                            <WeatherCard weather={msg.structuredResponse.weatherCard} />
                          )}
                          {msg.structuredResponse.mandiCard && (
                            <MandiCard mandi={msg.structuredResponse.mandiCard} />
                          )}

                          {/* Source Attribution Badge */}
                          <SourceBadge
                            sourceStatus={msg.structuredResponse.sourceStatus}
                            sources={msg.structuredResponse.sources}
                          />

                          {/* Interactive Action Pills */}
                          <ActionButtonGroup
                            buttons={msg.structuredResponse.actionButtons}
                            onAction={handleActionClick}
                          />
                        </div>
                      )}

                      {/* Error Retry Option */}
                      {msg.isError && (
                        <div style={{ marginTop: '10px' }}>
                          <button
                            onClick={() => {
                              const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
                              if (lastUserMsg) handleSend(lastUserMsg.text, lastUserMsg.image);
                            }}
                            className="btn btn-outline"
                            style={{ padding: '5px 12px', fontSize: '0.78rem', borderRadius: '6px' }}
                          >
                            <RefreshCw size={12} />
                            <span>{isHindi ? 'पुनः प्रयास करें (Retry)' : 'Retry Request'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: '0.68rem',
                      marginTop: '6px',
                      textAlign: 'right',
                      color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                      fontWeight: 500,
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#064e3b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* AI THINKING LOADING INDICATOR */}
          {isThinking && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Bot size={16} />
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  backgroundColor: '#ffffff',
                  borderRadius: '18px 18px 18px 4px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <RefreshCw size={14} className="spin-icon" color="#059669" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                  {isHindi
                    ? 'AGRINEXT AI कृषि डेटा का विश्लेषण कर रहा है...'
                    : 'AGRINEXT AI is analyzing verified agricultural context...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ---------------- 3. MESSAGE COMPOSER BAR ---------------- */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Attached Image Preview Bar */}
          {attachedImage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                marginBottom: '10px',
                fontSize: '0.8rem',
                color: '#065f46',
                fontWeight: 700,
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={attachedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span>{isHindi ? '📷 फसल की फोटो संलग्न है' : '📷 Crop Photo Attached (Ready for AI analysis)'}</span>
              <button
                onClick={() => setAttachedImage(null)}
                style={{
                  marginLeft: 'auto',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Remove attachment"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Voice Error Banner */}
          {voiceError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#991b1b',
                marginBottom: '8px',
              }}
            >
              <AlertCircle size={14} color="#dc2626" />
              <span>{voiceError}</span>
              <button
                onClick={() => setVoiceError(null)}
                style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: '#991b1b' }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Input Control Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              backgroundColor: '#f8fafc',
              border: isListening ? '1.5px solid #dc2626' : '1.5px solid #cbd5e1',
              borderRadius: '14px',
              padding: '6px 10px',
              transition: 'border-color 0.15s ease',
            }}
          >
            {/* Hidden Photo Upload Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Photo Attachment Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title={isHindi ? 'फसल की फोटो अपलोड करें' : 'Upload crop photo'}
              style={{
                backgroundColor: '#ffffff',
                color: '#059669',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
              }}
            >
              <Camera size={17} />
            </button>

            {/* Voice Input Trigger */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? (isHindi ? 'सुनना रोकें' : 'Stop Listening') : (isHindi ? 'बोलकर पूछें' : 'Voice Input')}
              style={{
                backgroundColor: isListening ? '#fee2e2' : '#ffffff',
                color: isListening ? '#dc2626' : '#059669',
                border: isListening ? '1px solid #fca5a5' : '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
              }}
            >
              <Mic size={17} />
            </button>

            {/* Auto-expanding Input / Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                isListening
                  ? (isHindi ? 'सुन रहा हूँ, कृपया बोलें...' : 'Listening, please speak...')
                  : (isHindi ? 'फसल, बीमारी, योजना (PM-KISAN, KCC), मौसम या मंडी के बारे में पूछें...' : 'Ask AGRINEXT about crop diseases, PM-KISAN, KCC, weather, mandi rates...')
              }
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9rem',
                fontWeight: 500,
                flex: 1,
                color: '#0f172a',
                resize: 'none',
                maxHeight: '120px',
                padding: '6px 4px',
                lineHeight: 1.4,
              }}
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={(!inputText.trim() && !attachedImage) || isThinking}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (!inputText.trim() && !attachedImage) || isThinking ? 0.45 : 1,
                cursor: (!inputText.trim() && !attachedImage) || isThinking ? 'not-allowed' : 'pointer',
                marginBottom: '2px',
                fontWeight: 700,
                fontSize: '0.85rem',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(5,150,105,0.2)',
              }}
            >
              <Send size={15} />
              <span className="send-btn-label">{isHindi ? 'भेजें' : 'Send'}</span>
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span>Shift + Enter for new line</span>
            <span>⚡ Powered by AGRINEXT AI Engine</span>
          </div>
        </div>
      </main>

      {/* Lightbox / Fullscreen Image Preview Modal */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={previewModalImage} alt="Enlarged" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
            <button
              onClick={() => setPreviewModalImage(null)}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS for Responsive Layout */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .ai-sidebar {
            position: absolute !important;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            box-shadow: 4px 0 20px rgba(0,0,0,0.15);
          }
          .ai-sidebar-open {
            transform: translateX(0) !important;
          }
          .sidebar-toggle-btn {
            display: flex !important;
          }
          .mobile-close-sidebar-btn {
            display: flex !important;
          }
          .send-btn-label {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
