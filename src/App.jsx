import React from 'react';
import Header from './components/Header';
import Bio from './components/Bio';
import TestVideo from './components/testvideo';
import Projects from './components/Projects';
import InterestsTools from './components/InterestsTools';
import Footer from './components/Footer';

function App() {
  return (
    <div className="container">
      <Header />
      <Bio />
      <TestVideo />
      <Projects />
      <InterestsTools />
      <Footer />
    </div>
  );
}

export default App; 