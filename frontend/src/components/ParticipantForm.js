import React from 'react';

const ParticipantForm = ({ currentName, setCurrentName, onSubmit }) => {
  return (
    <div className="form-container">
      <input
        type="text"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
        placeholder="Enter name"
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
      />
      <button className="button-container" onClick={onSubmit}>
        Add Participant
      </button>
    </div>
  );
};

export default ParticipantForm;