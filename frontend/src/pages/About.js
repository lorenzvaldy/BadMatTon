// src/pages/About.js
import React from 'react';
import Map from '../components/Map';

const About = () => {
  return (
    <div className="page-container">
      <h1 className="about-title">About the BadMatTon</h1>
      <p className="about-description">Welcome to the BadMatTon! This application helps manage
        participants and waiting lists for badminton event initiated by Matthew. 
        The event is held at the <strong>Badminton-Center Mörsenbroich eK</strong> every Saturday if possible.</p>
      <Map apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}/>
      <p className="about-info">This web provides an overview of the event details and information.
        For contributions, please visit {' '}
        <a href="https://github.com/lorenzvaldy/BadMatTon" target="_blank" rel="noopener noreferrer">
          GitHub repository
        </a>.</p>
      <p className="about-contributors">Event Initiator - Matthew Van | Contributor - Laurentius Valdy</p>
    </div>
  );
};

export default About;

