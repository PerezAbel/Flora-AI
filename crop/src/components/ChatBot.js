import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faTimes, faPaperPlane, faMicrophone, faLeaf } from '@fortawesome/free-solid-svg-icons';

const plantRecommendations = {
  tropical: ['Cassava', 'Banana', 'Coconut', 'Pineapple', 'Mango'],
  temperate: ['Wheat', 'Maize', 'Potatoes', 'Apples', 'Grapes'],
  arid: ['Dates', 'Olives', 'Agave', 'Pomegranate', 'Aloe Vera'],
  mediterranean: ['Olives', 'Grapes', 'Tomatoes', 'Figs', 'Citrus'],
  continental: ['Barley', 'Oats', 'Rye', 'Peas', 'Carrots']
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
}

function ChatBotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [location, setLocation] = useState('');
  const [askingForLocation, setAskingForLocation] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const welcomeMessage = {
      from: 'bot',
      text: 'Hello farmer! I\'m AgriNova Assistant 🌱. To get personalized crop recommendations, please tell me your geographical location (e.g., "I\'m in Nairobi" or "Central Kenya").'
    };
    setMessages([welcomeMessage]);
    speak(welcomeMessage.text);
    setAskingForLocation(true);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    
    if (askingForLocation) {
      handleLocationResponse(input);
    } else {
      handleBotResponse(input);
    }
    
    setInput('');
  };

  const handleLocationResponse = (msg) => {
    let response = "Thank you! Based on your location, here are recommended crops: ";
    let recommendedPlants = [];
    
    // Simple location matching (in a real app, you'd use geolocation API)
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes('coast') || lowerMsg.includes('mombasa')) {
      recommendedPlants = plantRecommendations.tropical;
      response += recommendedPlants.join(', ');
    } else if (lowerMsg.includes('nairobi') || lowerMsg.includes('central')) {
      recommendedPlants = plantRecommendations.temperate;
      response += recommendedPlants.join(', ');
    } else if (lowerMsg.includes('north') || lowerMsg.includes('arid')) {
      recommendedPlants = plantRecommendations.arid;
      response += recommendedPlants.join(', ');
    } else {
      recommendedPlants = plantRecommendations.temperate;
      response = "I'll assume a temperate climate. Recommended crops: " + recommendedPlants.join(', ');
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        from: 'bot', 
        text: response + "\n\nYou can also ask about specific crops, planting techniques, or market prices."
      }]);
      speak(response);
      setAskingForLocation(false);
    }, 500);
  };

  const handleBotResponse = (msg) => {
    const lower = msg.toLowerCase();
    let response = "I'm here to help with agricultural advice. Ask about crops, planting, or market trends.";

    if (lower.includes('plant') || lower.includes('grow')) {
      response = "To get the best planting advice, please share your location first by typing 'I am in [your location]'.";
      setAskingForLocation(true);
    } else if (lower.includes('price') || lower.includes('market')) {
      response = "Current market prices vary by region. For accurate pricing, specify your crop and location.";
    } else if (lower.includes('weather') || lower.includes('rain')) {
      response = "Weather patterns affect planting. In your area, the best planting season is... (please share your location for precise advice).";
    } else if (lower.includes('soil') || lower.includes('fertilizer')) {
      response = "Soil preparation is crucial. For customized advice, may I know your location?";
    } else if (lower.includes('hi') || lower.includes('hello')) {
      response = "Hello again! How can I assist with your farming questions today?";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: response }]);
      speak(response);
    }, 500);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Voice input not supported in your browser");
      return;
    }

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const userMessage = { from: 'user', text: transcript };
      setMessages((prev) => [...prev, userMessage]);
      
      if (askingForLocation) {
        handleLocationResponse(transcript);
      } else {
        handleBotResponse(transcript);
      }
      
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {isOpen && (
        <div style={{
          width: '320px',
          height: '420px',
          backgroundColor: '#f0f7f0',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0a4a1e 0%, #1a936f 100%)',
            color: '#fff',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="https://via.placeholder.com/30x30?text=AN" 
                alt="AgriNova Logo" 
                style={{ height: '30px', filter: 'brightness(0) invert(1)' }}
              />
              AgriNova Assistant
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                border: 'none', 
                color: '#fff',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FontAwesomeIcon icon={faTimes} size="xs" />
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom, #ffffff, #f5faf5)'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                margin: '10px 0',
                textAlign: msg.from === 'user' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: msg.from === 'user' ? '#e1f3e1' : '#f0f7f0',
                  color: '#1a3e1a',
                  padding: '10px 15px',
                  borderRadius: msg.from === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                  maxWidth: '85%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  lineHeight: '1.4',
                  border: msg.from === 'user' ? '1px solid #d0e8d0' : '1px solid #e0f0e0'
                }}>
                  {msg.text.split('\n').map((paragraph, i) => (
                    <p key={i} style={{ margin: i > 0 ? '8px 0 0' : '0' }}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            padding: '12px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#f5faf5'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={askingForLocation ? "Enter your location..." : "Ask about crops..."}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '20px',
                border: '1px solid #d0e8d0',
                marginRight: '8px',
                backgroundColor: '#fff',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button 
              onClick={sendMessage} 
              style={{ 
                marginRight: '8px', 
                background: 'linear-gradient(135deg, #0a4a1e 0%, #1a936f 100%)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '50%', 
                width: '38px', 
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} size="sm" />
            </button>
            <button 
              onClick={handleVoiceInput} 
              style={{
                background: listening ? '#e74c3c' : 'linear-gradient(135deg, #0a4a1e 0%, #1a936f 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <FontAwesomeIcon icon={faMicrophone} size="sm" />
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #0a4a1e 0%, #1a936f 100%)',
            color: '#fff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
          title="Chat with AgriNova Assistant"
        >
          <FontAwesomeIcon icon={faLeaf} size="lg" />
        </div>
      )}
    </div>
  );
}

export default ChatBotAssistant;