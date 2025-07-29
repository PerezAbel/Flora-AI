import React from 'react';   

import ImageSlider from './ImageSlider';
import CropCards from './CropCards';      
import NewsLetter from './NewsLetter';   


       
const Home = () => {
    return (   
        <div className="Home">     
         <ImageSlider/>   
         <CropCards/>
         <NewsLetter/> 
        </div>   
    );
};

export default Home;
