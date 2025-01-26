import React from 'react';
import Hero from './componentsHome/Hero';
import Organizational from './componentsHome/Organizational';
import Features from './componentsHome/Features';
import Events from './componentsHome/Events';
import Footer from './componentsHome/Footer';
import Header from './componentsHome/Header';
import News from './componentsHome/News';
export default function Home() {
  return (
    <>
    <Header/> 
    <div className='w-full h-3/4'>
      <Hero/>
      
      <News/>
      <Features/>
      <Events/>
      <Footer/>
    </div>
    </>
  );
}
