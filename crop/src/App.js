import './App.css';   
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';   
import Home from './components/Home';
import NavBar from './components/NavBar';      
import ChatBot from './components/ChatBot';  
import Footer from './components/Footer';     
import AI from './components/AI';      
 

function App() {
  return (
    <Router>
      <div className="App">   
        <NavBar />  
        <ChatBot />   

        <Routes>
          <Route path="/home" element={<Home />} /> 
          <Route path="/AI" element={<AI />} /> 
          {/* Add other routes here as needed */}
        </Routes>   

        <Footer />   
      </div>
    </Router>
  );
}

export default App;
