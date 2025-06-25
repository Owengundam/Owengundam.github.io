import React from 'react';
import Header from './components/Header';
import Bio from './components/Bio';
import TestVideo from './components/testvideo';
import BodyOfWork from './components/BodyOfWork';
import InterestsTools from './components/InterestsTools';
import Footer from './components/Footer';

function App() {
  return (
    <div className="container">
      <Header />
      <Bio />
      <TestVideo />
      <BodyOfWork />
      <InterestsTools />
      <Footer />
    </div>
  );
}

export default App; 