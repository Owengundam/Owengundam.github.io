import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact">
      <h2>Contact</h2>
      <p>Get in touch: <a href="mailto:owewhm@gmail.com">owewhm@gmail.com</a></p>
      <p>&copy; {currentYear} Haiming Wang. All rights reserved.</p>
    </footer>
  );
}

export default Footer; 