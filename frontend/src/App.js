import { useSupabase } from './hooks/useSupabase'
import ParticipantTable from './components/ParticipantTable'
import ParticipantForm from './components/ParticipantForm'
import logo from './images/badminton-logo.svg';
import { useState } from 'react';
import './styles.css';
function App() {
  const { groups, addParticipant, deleteParticipant, togglePayment, moveGroup1ToGroup2,ChangeMaxParticipants,MAX_PARTICIPANTS,getCurrentMaxParticipants} = useSupabase();
  const [newMax, setNewMax] = useState(MAX_PARTICIPANTS);
  const handleMaxParticipantsSubmit = (e) => {
    e.preventDefault();
    const password = prompt(`Change the maximum participants to join \n\nEnter password:`);
    if (password === process.env.REACT_APP_RESET_PASSWORD) {
      ChangeMaxParticipants(newMax);
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="badminton-container">
      <header className="event-header">
        <img 
          src={logo}
          alt="BadMatTon Logo" 
          className="event-logo"
        />
        <form className="max-participants-form" onSubmit={handleMaxParticipantsSubmit}>
          <label htmlFor="maxParticipants"></label>
          <input
            id="maxParticipants"
            type="number"
            placeholder="Enter max participants"
            onChange={(e) => setNewMax(e.target.value)}
          />
          <button type="submit">🔒 Update</button>
        </form>
      </header>
      {/* Group 1 */}
      <div className="tournament-group">
        <div className="form-header">
          <h2 className="group-title">Current Form</h2>
          <button
            className="move-button"
            onClick={() => {
              const password = prompt(`Clear the current form and move to the old form \n\nEnter password:`);
              if (password === process.env.REACT_APP_RESET_PASSWORD) {
                moveGroup1ToGroup2();
              } else {
                alert("Incorrect password!");
              }
            }}
          >
            🔒 Clear
          </button>
        </div>
        <ParticipantForm onSubmit={(name) => addParticipant(name, 1)} />
        
        <ParticipantTable
          participants={groups.group1.main}
          title={`Main List (${groups.group1.main.length}/${getCurrentMaxParticipants()})`}
          onDelete={deleteParticipant}
          onToggle={togglePayment}
          isWaitingList={false}
          groupNumber={1}
        />
        <ParticipantTable
          participants={groups.group1.waiting}
          title={`Waiting List (${groups.group1.waiting.length})`}
          onDelete={deleteParticipant}
          onToggle={togglePayment}
          isWaitingList={true}
          groupNumber={1}
        />
      </div>

      {/* Group 2 */}
      <div className="tournament-group">
        <h2 className="group-title">Old Form</h2>

        <ParticipantTable
          participants={groups.group2.main.filter(p => !p.has_paid)}
          title={`Unpaid Participants (${groups.group2.main.filter(p => !p.has_paid).length})`}
          onToggle={togglePayment}
          isWaitingList={false}
          groupNumber={2}
        />

        <ParticipantTable
          participants={groups.group2.main.filter(p => p.has_paid)}
          title={`Paid Participants (${groups.group2.main.filter(p => p.has_paid).length})`}
          onToggle={togglePayment}
          isWaitingList={false}
          groupNumber={2}
        />
      </div>
    </div>
  );
}

export default App;