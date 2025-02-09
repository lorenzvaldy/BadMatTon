import React from 'react';

const ParticipantTable = ({ participants, title, onDelete, onTogglePayment }) => {
  return (
    <div className="table-container">
      <h2>{title} ({participants.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td>{participant.name}</td>
              <td>
                <button 
                  className={`payment-toggle ${participant.paid ? 'paid' : 'unpaid'}`}
                  onClick={() => onTogglePayment(participant.id)}
                >
                  {participant.paid ? '✅ Paid' : '❌ Unpaid'}
                </button>
              </td>
              <td>
                <button className="delete" onClick={() => onDelete(participant.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;