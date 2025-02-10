import '../styles.css';
const ParticipantTable = ({ participants, title, onToggle, onDelete, isWaitingList }) => {
  return (
      <div className="shuttle-table">
        <h1 className="table-title">
          {title}
        </h1>
        <div className="main-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {!isWaitingList && <th>Paid</th>}
                {onDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant.id}>
                  <td>{participant.name}</td>
                  {!isWaitingList && (
                    <td>
                      <button 
                        className={`payment-toggle ${participant.has_paid ? 'paid' : 'unpaid'}`}
                        onClick={() => onToggle(participant.id)}
                      >
                        {participant.has_paid ? '✅ Paid' : '❌ Unpaid'}
                      </button>
                    </td>
                  )}
                  {onDelete && (
                    <td>
                      <button 
                        className="delete" 
                        onClick={() => onDelete(participant.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ParticipantTable;