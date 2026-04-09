import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Globe } from 'lucide-react';
const SUPPORTED_LANGUAGES = [{
  code: 'en',
  name: 'English'
}, {
  code: 'hi',
  name: 'Hindi'
}, {
  code: 'te',
  name: 'Telugu'
}, {
  code: 'ta',
  name: 'Tamil'
}, {
  code: 'ml',
  name: 'Malayalam'
}, {
  code: 'kn',
  name: 'Kannada'
}, {
  code: 'fr',
  name: 'French'
}, {
  code: 'de',
  name: 'German'
}];
const RESPONSES = {
  en: {
    greeting: "Hi! I'm Aura, your wellness assistant. How are you feeling today?",
    default: "I hear you. Could you tell me more about that? I'm here to support your wellness journey.",
    anxious: "I'm sorry you're feeling that way. Try this: Take a deep breath in for 4 seconds, hold for 7, and exhale for 8. Would you like to try a guided meditation?",
    diet: "For a balanced diet, focus on protein and hydration. I can generate a 7-day meal plan for you. Shall I?",
    sleep: "Sleep is crucial. Try avoiding screens 30 mins before bed. I can track your sleep debt if you like.",
    sad: "It sounds like you're going through a tough time. Remember, the wellness center is always open for you. Should I help you find support?",
    hello: "Hello! How can I help you with your health and wellness today?",
    thanks: "You're very welcome! Stay healthy."
  },
  hi: {
    greeting: "नमस्ते! मैं ऑरा हूँ, आपका वेलनेस असिस्टेंट। आज आप कैसा महसूस कर रहे हैं?",
    default: "मैं समझता हूँ। क्या आप मुझे इसके बारे में और बता सकते हैं? मैं आपकी मदद के लिए यहाँ हूँ।",
    anxious: "मुझे खेद है कि आप ऐसा महसूस कर रहे हैं। यह प्रयास करें: 4 सेकंड के लिए गहरी सांस लें, 7 के लिए रोकें, और 8 के लिए छोड़ें। क्या आप ध्यान करना चाहेंगे?",
    diet: "संतुलित आहार के लिए प्रोटीन और पानी पर ध्यान दें। क्या मैं आपके लिए 7 दिन का भोजन योजना बनाऊं?",
    sleep: "नींद बहुत जरूरी है। सोने से 30 मिनट पहले मोबाइल से बचें।",
    sad: "ऐसा लगता है कि आप कठिन समय से गुजर रहे हैं। याद रखें, वेलनेस सेंटर आपके लिए हमेशा खुला है।",
    hello: "नमस्ते! आज मैं आपकी सेहत के लिए क्या कर सकता हूँ?",
    thanks: "आपका स्वागत है! स्वस्थ रहें।"
  },
  te: {
    greeting: "హలో! నేను ఔరా, మీ వెల్నెస్ అసిస్టెంట్. ఈ రోజు మీరు ఎలా ఉన్నారు?",
    default: "నేను వింటున్నాను. దాని గురించి నాకు మరింత చెప్పగలరా? మీ ఆరోగ్యానికి మద్దతు ఇవ్వడానికి నేను ఇక్కడ ఉన్నాను.",
    anxious: "మీరు అలా భావిస్తున్నందుకు బాధపడుతున్నాను. దీన్ని ప్రయత్నించండి: 4 సెకన్ల పాటు ఊపిరి పీల్చుకోండి, 7 సెకన్ల పాటు ఉంచండి, 8 సెకన్ల పాటు వదలండి.",
    diet: "సమతుల్య ఆహారం కోసం ప్రోటీన్ మరియు నీటిపై దృష్టి పెట్టండి. నేను మీ కోసం 7 రోజుల డైట్ ప్లాన్ తయారు చేయాలా?",
    sleep: "నిద్ర చాలా ముఖ్యం. పడుకునే 30 నిమిషాల ముందు ఫోన్ చూడకండి.",
    sad: "మీరు కష్టకాలంలో ఉన్నట్లుగా అనిపిస్తుంది. వెల్నెస్ సెంటర్ మీ కోసం ఎప్పుడూ తెరిచే ఉంటుంది.",
    hello: "హలో! మీ ఆరోగ్యం విషయంలో నేను ఎలా సహాయపడగలను?",
    thanks: "ధన్యవాదాలు! ఆరోగ్యంగా ఉండండి."
  },
  ta: {
    greeting: "வணக்கம்! நான் ஆரா, உங்கள் நலவாழ்வு உதவியாளர். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?",
    default: "நான் கேட்கிறேன். அதை பற்றி மேலும் சொல்ல முடியுமா?",
    anxious: "கவலைப்படாதீர்கள். இதை முயற்சிக்கவும்: 4 வினாடிகள் மூச்சை உள்ளிழுக்கவும், 7 வினாடிகள் வைத்திருக்கவும்.",
    diet: "சீரான உணவுக்கு புரதம் மற்றும் நீர்ச்சத்தில் கவனம் செலுத்துங்கள்.",
    sleep: "தூக்கம் மிக முக்கியம். தூங்குவதற்கு 30 நிமிடங்களுக்கு முன் திரைகளைத் தவிர்க்கவும்.",
    sad: "நீங்கள் கடினமான நேரத்தை கடந்து செல்கிறீர்கள். ஆரோக்கிய மையம் உங்களுக்காக எப்போதும் திறந்திருக்கும்.",
    hello: "வணக்கம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    thanks: "நன்றி! ஆரோக்கியமாக இருங்கள்."
  },
  ml: {
    greeting: "ഹലോ! ഞാൻ ഓറ. ഇന്ന് നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?",
    default: "എനിക്ക് മനസ്സിലാകുന്നു. അതിനെക്കുറിച്ച് കൂടുതൽ പറയാമോ?",
    anxious: "വിഷമിക്കേണ്ട. ഇത് പരീക്ഷിച്ചുനോക്കൂ: 4 സെക്കൻഡ് ശ്വാസം എടുക്കുക, 7 സെക്കൻഡ് പിടിച്ചുവെക്കുക.",
    diet: "നല്ല ഭക്ഷണത്തിനായി പ്രോട്ടീനിലും വെള്ളത്തിലും ശ്രദ്ധ കേന്ദ്രീകരിക്കുക.",
    sleep: "ഉറക്കം വളരെ പ്രധാനമാണ്. ഉറങ്ങുന്നതിന് മുമ്പ് ഫോൺ ഒഴിവാക്കുക.",
    sad: "നിങ്ങൾ പ്രയാസകരമായ സമയത്തിലൂടെ കടന്നുപോകുന്നുവെന്ന് തോന്നുന്നു. വെൽനസ് സെന്റർ നിങ്ങൾക്കായി എപ്പോഴും തുറന്നിരിക്കും.",
    hello: "ഹലോ! നിങ്ങളുടെ ആരോഗ്യകാര്യം സംബന്ധിച്ച് ഞാൻ എങ്ങനെ സഹായിക്കാം?",
    thanks: "സ്വാഗതം! ആരോഗ്യത്തോടെ ഉയരുക."
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ಆರಾ. ಇಂದು ನೀವು ಹೇಗಿದ್ದೀರಿ?",
    default: "ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ. ಅದರ ಬಗ್ಗೆ ಮತ್ತಷ್ಟು ಹೇಳಬಲ್ಲಿರಾ?",
    anxious: "ಚಿಂತಿಸಬೇಡಿ. ಇದನ್ನು ಪ್ರಯತ್ನಿಸಿ: 4 ಸೆಕೆಂಡುಗಳ ಕಾಲ ದೀರ್ಘವಾಗಿ ಉಸಿರಾಡಿ.",
    diet: "ಸಮತೋಲಿತ ಆಹಾರಕ್ಕಾಗಿ ಪ್ರೋಟೀನ್ ಮತ್ತು ನೀರಿನ ಕಡೆಗೆ ಗಮನ ಕೊಡಿ.",
    sleep: "ನಿದ್ರೆ ಬಹಳ ಮುಖ್ಯ. ಮಲಗುವ 30 ನಿಮಿಷಗಳ ಮುಂಚೆ ಮೊಬೈಲ್ ಬಳಸಬೇಡಿ.",
    sad: "ನೀವು ಕಷ್ಟದ ಸಮಯವನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ತೋರುತ್ತದೆ. ವೆಲ್ನೆಸ್ ಸೆಂಟರ್ ನಿಮಗಾಗಿ ಯಾವಾಗಲೂ ತೆರೆದಿರುತ್ತದೆ.",
    hello: "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ನಾನು ಏನು ಮಾಡಬಹುದು?",
    thanks: "ಧನ್ಯವಾದಗಳು! ಆರೋಗ್ಯವಾಗಿರಿ."
  },
  fr: {
    greeting: "Bonjour! Je suis Aura. Comment vous sentez-vous aujourd'hui?",
    default: "Je vous écoute. Pouvez-vous m'en dire plus?",
    anxious: "Je suis désolé. Essayez ceci : inspirez pendant 4 secondes, retenez 7, expirez 8.",
    diet: "Pour une alimentation équilibrée, concentrez-vous sur les protéines et l'hydratation.",
    sleep: "Le sommeil est crucial. Évitez les écrans 30 minutes avant de dormir.",
    sad: "Vous semblez traverser une période difficile. Le centre de bien-être est là pour vous.",
    hello: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    thanks: "Je vous en prie! Restez en bonne santé."
  },
  de: {
    greeting: "Hallo! Ich bin Aura. Wie fühlen Sie sich heute?",
    default: "Ich höre zu. Können Sie mir mehr darüber erzählen?",
    anxious: "Das tut mir leid. Versuchen Sie dies: 4 Sekunden einatmen, 7 halten, 8 ausatmen.",
    diet: "Achten Sie für eine ausgewogene Ernährung auf Proteine und Flüssigkeitszufuhr.",
    sleep: "Schlaf ist wichtig. Vermeiden Sie Bildschirme 30 Minuten vor dem Schlafengehen.",
    sad: "Es scheint, als hätten Sie eine schwere Zeit. Das Wellness-Center ist für Sie da.",
    hello: "Hallo! Wie kann ich Ihnen heute helfen?",
    thanks: "Gern geschehen! Bleiben Sie gesund."
  }
};
const AIChatbot = ({
  onClose
}) => {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: RESPONSES.en.greeting
  }]);
  const [input, setInput] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'ai') {
      setMessages([{
        role: 'ai',
        text: RESPONSES[language].greeting
      }]);
    }
  }, [language]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSend = () => {
    if (!input.trim()) {
      return;
    }
    const userMsg = {
      role: 'user',
      text: input.trim()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const lowerInput = userMsg.text.toLowerCase();
      const currentRes = RESPONSES[language];
      let response = currentRes.default;
      const isAnxious = ['anxious', 'stress', 'worried', 'tension', 'panic'].some(term => lowerInput.includes(term));
      const isDiet = ['diet', 'food', 'eat', 'meal', 'nutrition'].some(term => lowerInput.includes(term));
      const isSleep = ['sleep', 'tired', 'insomnia', 'wake'].some(term => lowerInput.includes(term));
      const isSad = ['sad', 'depress', 'cry', 'help', 'lonely'].some(term => lowerInput.includes(term));
      const isHello = ['hi', 'hello', 'hey', 'namaste', 'vanakkam'].some(term => lowerInput.includes(term));
      const isThanks = ['thank', 'thx'].some(term => lowerInput.includes(term));
      if (isAnxious) response = currentRes.anxious;else if (isDiet) response = currentRes.diet;else if (isSleep) response = currentRes.sleep;else if (isSad) response = currentRes.sad;else if (isHello) response = currentRes.hello;else if (isThanks) response = currentRes.thanks;
      setMessages(prev => [...prev, {
        role: 'ai',
        text: response
      }]);
    }, 600);
  };
  return <div className="fixed bottom-20 right-4 w-80 h-96 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl border border-purple-200 flex flex-col overflow-hidden z-40">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-semibold">Aura AI</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowLangMenu(prev => !prev)} className="hover:bg-purple-500 p-1 rounded transition-colors" title="Change Language">
            <Globe size={18} />
          </button>
          <button onClick={onClose} className="hover:bg-purple-500 p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        {showLangMenu && <div className="absolute top-12 right-2 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-100 py-2 w-36 z-50 text-sm">
            {SUPPORTED_LANGUAGES.map(lang => <button key={lang.code} onClick={() => {
          setLanguage(lang.code);
          setShowLangMenu(false);
        }} className={`w-full text-left px-4 py-2 hover:bg-purple-50 ${language === lang.code ? 'font-bold text-purple-600' : ''}`}>
                {lang.name}
              </button>)}
          </div>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white" ref={scrollRef}>
        {messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${message.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
              {message.text}
            </div>
          </div>)}
      </div>

      <div className="p-3 bg-white border-t border-purple-100 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={language === 'en' ? 'Ask anything...' : 'Type here...'} className="flex-1 text-sm border border-purple-200 rounded-full px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
        <button onClick={handleSend} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full hover:from-purple-700 hover:to-indigo-700 shadow-md">
          <Send size={16} />
        </button>
      </div>
    </div>;
};
export default AIChatbot;
