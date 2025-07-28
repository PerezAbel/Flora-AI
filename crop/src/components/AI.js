import React, { useState } from 'react';
import { FaRobot, FaMicrophone, FaStop, FaChevronDown, FaComments, FaPaperPlane } from 'react-icons/fa';
import '../css/AI.css';

function SellDevice() {
  const [isListening, setIsListening] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! I can help you with crop growing recommendations. Ask me anything.' }
  ]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;

    const userMessage = { type: 'user', text: chatInput };
    const botResponse = {
      type: 'bot',
      text: `Here’s a suggestion for "${chatInput}": 🌱 Ensure the soil is well-drained and rich in organic matter. Provide adequate sunlight and water regularly.`
    };

    setChatMessages((prev) => [...prev, userMessage, botResponse]);
    setChatInput('');
  };

  const faqs = [
    {
      question: "How does the AI assistant work?",
      answer: "Our AI uses advanced natural language processing to understand your queries about electronics and provide accurate responses."
    },
    {
      question: "What devices can I sell through this platform?",
      answer: "You can sell smartphones, laptops, tablets, gaming consoles, and other consumer electronics in good condition."
    },
    {
      question: "How is the pricing determined?",
      answer: "Our AI analyzes market trends, device condition, and specifications to suggest fair market prices."
    },
    {
      question: "Is my conversation with the AI secure?",
      answer: "Yes, all communications are encrypted and we don't store personal data without your consent."
    }
  ];

  const imageUrls = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShoWdSHinHRGftyKlR-C9uRHH1Z3PaWOOa3g&s', // Corn field
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vehn%C3%A4pelto_6.jpg/1200px-Vehn%C3%A4pelto_6.jpg', // Wheat
  'https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg', // Tomatoes
  'https://plus.unsplash.com/premium_photo-1664910307279-7f8e551e1e1d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmljZSUyMGZpZWxkfGVufDB8fDB8fHww', // Rice field
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBr1lSezoYnG8V5eqAk22zQTmGvnKUzdP1uA&s', // Strawberries
  'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce'  // Lettuce
];

  return (
    <div className="ai-assistant-container">
      {/* Futuristic background elements */}
      <div className="circuit-bg"></div>
      <div className="holographic-line"></div>
      <div className="floating-dots"></div>

      <div className="ai-assistant-content">
        {/* Page Title */}
        <div className="ai-title-container">
          <h1 className="ai-title">NibbleStore Assistant</h1>
          <div className="title-divider"></div>
        </div>

        {/* AI Agent Section */}
        <div className="ai-agent-section">
          <div className="ai-icon-container">
            <FaRobot className="ai-icon" />
            <div className={`pulse-ring ${isListening ? 'listening' : ''}`}></div>
          </div>

          <div className="image-grid">
            {imageUrls.map((url, index) => (
              <div key={index} className="grid-item" style={{ backgroundImage: `url(${url})` }}></div>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="voice-controls">
          <button 
            className={`voice-btn start-btn ${isListening ? 'active' : ''}`}
            onClick={() => setIsListening(true)}
          >
            <FaMicrophone /> {isListening ? 'Listening...' : 'Start Conversation'}
          </button>
          <button 
            className="voice-btn stop-btn"
            onClick={() => setIsListening(false)}
            disabled={!isListening}
          >
            <FaStop /> End Conversation
          </button>
        </div>

        {/* Chat with Agent */}
        <div className="chat-with-agent">
          <button 
            className="chat-btn" 
            onClick={() => setChatOpen(!chatOpen)}
          >
            <FaComments /> {chatOpen ? 'Close Chat' : 'Chat with Agent'}
          </button>

          {chatOpen && (
            <div className="chat-box">
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.type}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about crop growing..."
                />
                <button onClick={handleSendMessage}><FaPaperPlane /></button>
              </div>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-card ${activeFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  {faq.question}
                  <FaChevronDown className={`faq-arrow ${activeFaq === index ? 'rotated' : ''}`} />
                </div>
                {activeFaq === index && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellDevice;
