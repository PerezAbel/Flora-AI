import React, { useState } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import '../css/AI.css';

const CropAI = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I can recommend crops based on soil and climate conditions. Try asking about temperature ranges (high/low), humidity levels, rainfall amounts, or soil pH.' }
  ]);

  // Complete crop dataset
  const cropData = [
    { N: 81, P: 53, K: 42, temperature: 23.68, humidity: 81.04, ph: 5.18, rainfall: 233.70, label: "rice" },
    { N: 71, P: 54, K: 16, temperature: 22.61, humidity: 63.69, ph: 5.75, rainfall: 87.76, label: "maize" },
    { N: 40, P: 72, K: 77, temperature: 17.02, humidity: 16.99, ph: 7.49, rainfall: 88.55, label: "chickpea" },
    { N: 13, P: 60, K: 25, temperature: 17.14, humidity: 20.60, ph: 5.69, rainfall: 128.26, label: "kidneybeans" },
    { N: 3, P: 72, K: 24, temperature: 36.51, humidity: 57.93, ph: 6.03, rainfall: 122.65, label: "pigeonpeas" },
    { N: 3, P: 49, K: 18, temperature: 27.91, humidity: 64.71, ph: 3.69, rainfall: 32.68, label: "mothbeans" },
    { N: 32, P: 57, K: 22, temperature: 28.69, humidity: 87.50, ph: 6.77, rainfall: 44.57, label: "mungbean" },
    { N: 56, P: 79, K: 15, temperature: 29.48, humidity: 63.20, ph: 7.45, rainfall: 71.89, label: "blackgram" },
    { N: 32, P: 76, K: 15, temperature: 28.05, humidity: 63.50, ph: 7.60, rainfall: 43.36, label: "lentil" },
    { N: 16, P: 15, K: 42, temperature: 19.68, humidity: 89.09, ph: 6.89, rainfall: 108.55, label: "pomegranate" },
    { N: 91, P: 94, K: 46, temperature: 29.37, humidity: 76.25, ph: 6.15, rainfall: 92.83, label: "banana" },
    { N: 2, P: 40, K: 27, temperature: 29.74, humidity: 47.55, ph: 5.95, rainfall: 90.10, label: "mango" },
    { N: 24, P: 130, K: 195, temperature: 30.00, humidity: 81.54, ph: 6.11, rainfall: 67.13, label: "grapes" },
    { N: 119, P: 25, K: 51, temperature: 26.47, humidity: 80.92, ph: 6.28, rainfall: 53.66, label: "watermelon" },
    { N: 115, P: 17, K: 55, temperature: 27.58, humidity: 94.12, ph: 6.78, rainfall: 28.08, label: "muskmelon" }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', text: chatInput }]);
    setChatInput('');

    // Process after a short delay to simulate thinking
    setTimeout(() => {
      const response = generateAIResponse(chatInput);
      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    const numbers = input.match(/\d+/g)?.map(Number) || [];

    // Helper function to find closest crops by parameter
    const findClosestCrops = (param, value, count = 3) => {
      return cropData
        .sort((a, b) => Math.abs(a[param] - value) - Math.abs(b[param] - value))
        .slice(0, count);
    };

    // Temperature queries
    if (lowerInput.includes('temp') || lowerInput.includes('°c') || lowerInput.includes('temperature')) {
      // For specific temperature queries
      const temp = numbers.find(n => n > 10 && n < 50);
      if (temp) {
        const crops = findClosestCrops('temperature', temp);
        let response = `At ${temp}°C, these crops grow well:\n`;
        crops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.temperature}°C, ${crop.humidity}% humidity, ${crop.rainfall}mm rainfall)\n`;
        });
        return response;
      }
      // For high temperature queries
      else if (lowerInput.includes('high') || lowerInput.includes('hot') || lowerInput.includes('warm')) {
        const highTempCrops = cropData
          .filter(crop => crop.temperature >= 28)
          .sort((a, b) => b.temperature - a.temperature)
          .slice(0, 5);
        
        let response = `For high temperatures (28°C+), these crops thrive:\n`;
        highTempCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.temperature}°C)\n`;
        });
        response += `\nOther heat-tolerant options: pigeonpeas, muskmelon, watermelon, mango, banana`;
        return response;
      }
      // For low temperature queries
      else if (lowerInput.includes('low') || lowerInput.includes('cold') || lowerInput.includes('cool')) {
        const lowTempCrops = cropData
          .filter(crop => crop.temperature <= 20)
          .sort((a, b) => a.temperature - b.temperature)
          .slice(0, 5);
        
        let response = `For cooler temperatures (20°C or below), consider:\n`;
        lowTempCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.temperature}°C)\n`;
        });
        response += `\nOther cold-tolerant options: chickpea, kidneybeans, lentil, pomegranate`;
        return response;
      }
    }

    // Humidity queries
    if (lowerInput.includes('humid') || lowerInput.includes('moisture')) {
      const humidity = numbers.find(n => n > 10 && n <= 100);
      if (humidity) {
        const crops = findClosestCrops('humidity', humidity);
        let response = `For ${humidity}% humidity, consider:\n`;
        crops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.humidity}% humidity, ${crop.temperature}°C)\n`;
        });
        return response;
      } 
      // High humidity
      else if (lowerInput.includes('high')) {
        const highHumidityCrops = cropData
          .filter(crop => crop.humidity >= 70)
          .sort((a, b) => b.humidity - a.humidity)
          .slice(0, 5);
        
        let response = `High humidity crops (70%+):\n`;
        highHumidityCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.humidity}% humidity)\n`;
        });
        response += `\nOther options: rice, pomegranate, banana, muskmelon, blackgram`;
        return response;
      }
      // Low humidity
      else if (lowerInput.includes('low')) {
        const lowHumidityCrops = cropData
          .filter(crop => crop.humidity <= 40)
          .sort((a, b) => a.humidity - b.humidity)
          .slice(0, 5);
        
        let response = `Low humidity crops (40% or less):\n`;
        lowHumidityCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.humidity}% humidity)\n`;
        });
        response += `\nOther options: chickpea, mothbeans, mango, maize, grapes`;
        return response;
      }
    }

    // Rainfall queries
    if (lowerInput.includes('rain') || lowerInput.includes('water')) {
      const rainfall = numbers.find(n => n > 0 && n < 500);
      if (rainfall) {
        const crops = findClosestCrops('rainfall', rainfall);
        let response = `With ${rainfall}mm rainfall:\n`;
        crops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.rainfall}mm rainfall)\n`;
        });
        return response;
      } 
      // High rainfall
      else if (lowerInput.includes('high') || lowerInput.includes('wet')) {
        const highRainfallCrops = cropData
          .filter(crop => crop.rainfall >= 150)
          .sort((a, b) => b.rainfall - a.rainfall)
          .slice(0, 5);
        
        let response = `High rainfall crops (150mm+):\n`;
        highRainfallCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.rainfall}mm)\n`;
        });
        response += `\nOther options: rice, kidneybeans, pomegranate, banana, watermelon`;
        return response;
      }
      // Low rainfall/drought
      else if (lowerInput.includes('low') || lowerInput.includes('drought') || lowerInput.includes('dry')) {
        const lowRainfallCrops = cropData
          .filter(crop => crop.rainfall <= 60)
          .sort((a, b) => a.rainfall - b.rainfall)
          .slice(0, 5);
        
        let response = `Drought-resistant crops (60mm or less):\n`;
        lowRainfallCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (${crop.rainfall}mm)\n`;
        });
        response += `\nOther options: mothbeans, mungbean, blackgram, lentil, maize`;
        return response;
      }
    }

    // Soil pH queries
    if (lowerInput.includes('ph') || lowerInput.includes('soil')) {
      const ph = numbers.find(n => n > 3 && n < 9);
      if (ph) {
        const crops = findClosestCrops('ph', ph);
        let response = `For pH ${ph} soil:\n`;
        crops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (pH ${crop.ph})\n`;
        });
        return response;
      } 
      // Acidic soil
      else if (lowerInput.includes('acidic') || lowerInput.includes('low ph')) {
        const acidicCrops = cropData
          .filter(crop => crop.ph <= 6)
          .sort((a, b) => a.ph - b.ph)
          .slice(0, 5);
        
        let response = `Acid-tolerant crops (pH ≤ 6):\n`;
        acidicCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (pH ${crop.ph})\n`;
        });
        response += `\nOther options: rice, maize, kidneybeans, mothbeans, mango`;
        return response;
      }
      // Alkaline soil
      else if (lowerInput.includes('alkaline') || lowerInput.includes('high ph')) {
        const alkalineCrops = cropData
          .filter(crop => crop.ph >= 7)
          .sort((a, b) => b.ph - a.ph)
          .slice(0, 5);
        
        let response = `Alkaline-tolerant crops (pH ≥ 7):\n`;
        alkalineCrops.forEach((crop, i) => {
          response += `${i+1}. ${crop.label} (pH ${crop.ph})\n`;
        });
        response += `\nOther options: chickpea, blackgram, lentil, pigeonpeas, grapes`;
        return response;
      }
    }

    // Nutrient queries
    if (lowerInput.includes('nitrogen') || lowerInput.includes(' n ')) {
      const highNitrogenCrops = cropData
        .sort((a, b) => b.N - a.N)
        .slice(0, 5);
      
      let response = `High nitrogen crops:\n`;
      highNitrogenCrops.forEach((crop, i) => {
        response += `${i+1}. ${crop.label} (N:${crop.N})\n`;
      });
      response += `\nOther options: watermelon, banana, rice, muskmelon, maize`;
      return response;
    }
    if (lowerInput.includes('phosphorus') || lowerInput.includes(' p ')) {
      const highPhosphorusCrops = cropData
        .sort((a, b) => b.P - a.P)
        .slice(0, 5);
      
      let response = `High phosphorus crops:\n`;
      highPhosphorusCrops.forEach((crop, i) => {
        response += `${i+1}. ${crop.label} (P:${crop.P})\n`;
      });
      response += `\nOther options: grapes, banana, blackgram, lentil, chickpea`;
      return response;
    }
    if (lowerInput.includes('potassium') || lowerInput.includes(' k ')) {
      const highPotassiumCrops = cropData
        .sort((a, b) => b.K - a.K)
        .slice(0, 5);
      
      let response = `High potassium crops:\n`;
      highPotassiumCrops.forEach((crop, i) => {
        response += `${i+1}. ${crop.label} (K:${crop.K})\n`;
      });
      response += `\nOther options: grapes, muskmelon, watermelon, banana, pomegranate`;
      return response;
    }

    // Specific crop queries
    const cropMatch = lowerInput.match(/rice|maize|chickpea|kidneybeans|pigeonpeas|mothbeans|mungbean|blackgram|lentil|pomegranate|banana|mango|grapes|watermelon|muskmelon/);
    if (cropMatch) {
      const cropName = cropMatch[0];
      const crop = cropData.find(c => c.label === cropName);
      if (crop) {
        return `${cropName} growing conditions:\n`
          + `- Temperature: ${crop.temperature}°C\n`
          + `- Humidity: ${crop.humidity}%\n`
          + `- Rainfall: ${crop.rainfall}mm\n`
          + `- Soil pH: ${crop.ph}\n`
          + `- Nutrients (N:P:K): ${crop.N}:${crop.P}:${crop.K}`;
      }
    }

    // General recommendations
    if (lowerInput.includes('recommend') || lowerInput.includes('suggest') || lowerInput.includes('what crops')) {
      return "Here are some general crop recommendations:\n\n" +
        "🌡️ For HOT climates (28°C+): pigeonpeas, muskmelon, watermelon, mango, banana\n" +
        "❄️ For COOL climates (20°C or below): chickpea, kidneybeans, lentil, pomegranate, maize\n" +
        "💧 For HIGH humidity (70%+): rice, pomegranate, banana, muskmelon, blackgram\n" +
        "🏜️ For LOW humidity (40% or less): chickpea, mothbeans, mango, maize, grapes\n" +
        "🌧️ For HIGH rainfall (150mm+): rice, kidneybeans, pomegranate, banana, watermelon\n" +
        "☀️ For DROUGHT conditions (60mm or less): mothbeans, mungbean, blackgram, lentil, maize\n" +
        "🧪 For ACIDIC soil (pH ≤ 6): rice, maize, kidneybeans, mothbeans, mango\n" +
        "🧫 For ALKALINE soil (pH ≥ 7): chickpea, blackgram, lentil, pigeonpeas, grapes\n\n" +
        "Ask me for more specific recommendations!";
    }

    // Fallback responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I can help recommend crops based on your local conditions. What would you like to know?";
    }

    return "I can recommend crops based on:\n" +
      "🌡️ Temperature ranges (high/low)\n" +
      "💧 Humidity levels\n" +
      "🌧️ Rainfall amounts\n" +
      "🧪 Soil pH (acidic/alkaline)\n" +
      "⚗️ Nutrient levels (N/P/K)\n\n" +
      "Try asking:\n" +
      "- 'What crops for high temperatures?'\n" +
      "- 'Recommend crops for acidic soil'\n" +
      "- 'What grows with low rainfall?'\n" +
      "- 'Crops that need high nitrogen'";
  };

  return (
    <div className="ai-assistant-container">
      <div className="leaf-pattern-bg"></div>
      <div className="field-line"></div>
      <div className="floating-seeds"></div>
      
      <div className="ai-assistant-content">
        <div className="ai-title-container">
          <h1 className="ai-title">Crop Recommendation AI</h1>
          <div className="title-divider"></div>
          <p className="ai-subtitle">Get personalized crop suggestions based on your local conditions</p>
        </div>

        <div className="ai-agent-section">
          <div className="ai-icon-container">
            <div className="pulse-ring"></div>
            <FaRobot className="ai-icon" />
          </div>

          <div className="chat-with-agent">
            <button 
              className={`chat-toggle chat-btn ${chatOpen ? 'active' : ''}`}
              onClick={() => setChatOpen(!chatOpen)}
            >
              <FaRobot /> {chatOpen ? 'Close Chat' : 'Chat with Crop AI'}
            </button>

            {chatOpen && (
              <div className="chat-box">
                <div className="chat-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.type}`}>
                      {msg.text.split('\n').map((line, j) => (
                        <React.Fragment key={j}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="chat-input-area">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about crops..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAI;