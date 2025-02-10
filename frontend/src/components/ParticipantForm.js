import React, { useState } from 'react';
import '../styles.css';

const ParticipantForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName('');
    } catch (error) {
      console.error('Error adding participant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="badminton-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name"
          className="shuttle-input"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className="smash-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Player'}
        </button>
      </div>
    </form>
  );
};

export default ParticipantForm;