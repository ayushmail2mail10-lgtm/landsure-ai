import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Bot, X, Send, Sparkles, User, HelpCircle } from 'lucide-react';

export const AIAssistantModal = ({ isOpen, onClose, contextDocumentId = null }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: language === 'mr'
        ? 'नमस्कार! मी LandSure AI महसूल सहाय्यक आहे. मी तुम्हाला सातबारा, फेरफार, सर्व्हे नंबर आणि जमिनीच्या पडताळणी प्रक्रियेबद्दल कशी मदत करू?'
        : language === 'hi'
        ? 'नमस्ते! मैं LandSure AI का राजस्व सहायक हूँ। मैं आपको 7/12, खतौनी, दाखिल-खारिज और भूमि सत्यापन संबंधी प्रश्नों में कैसे मदद करूँ?'
        : 'Hello! I am LandSure AI Assistant. How can I assist you with your 7/12 extracts, survey numbers, mutations, or discrepancy inquiries today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What is a Survey Number?",
    "What is Mutation (Ferfar)?",
    "Why was my land record flagged?",
    "How does SHA-256 tamper detection work?"
  ];

  if (!isOpen) return null;

  const sendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', {
        message: query,
        context_document_id: contextDocumentId,
        language: language || 'en'
      });

      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'I am temporarily unable to connect to the knowledge engine. Please check your query or backend connection.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col h-[580px] overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">LandSure AI Assistant</h3>
              <p className="text-[10px] text-blue-200">GovTech Cadastral &amp; Revenue Knowledge Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing cadastral regulations...</span>
            </div>
          )}
        </div>

        <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex space-x-1.5 overflow-x-auto text-[10px]">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium rounded-full border border-slate-300 shrink-0 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about 7/12, Survey No, Mutation, or why a record was flagged..."
            className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
