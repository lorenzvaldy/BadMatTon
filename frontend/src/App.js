import { useSupabase } from './hooks/useSupabase'
import ParticipantTable from './components/ParticipantTable'
import ParticipantForm from './components/ParticipantForm'
import logo from './images/badminton-logo.svg';
import './styles.css';
function App() {
  const { groups, addParticipant, deleteParticipant, togglePayment, moveGroup1ToGroup2} = useSupabase();

  return (
    <div className="badminton-container">
      <header className="event-header">
        <img 
          src={logo}
          alt="BadMatTon Logo" 
          className="event-logo"
        />
      </header>
      {/* Group 1 */}
      <div className="tournament-group">
        <div className="form-header">
          <h2 className="group-title">Current Form</h2>
          <button className="move-button" onClick={moveGroup1ToGroup2}>
            Clear
          </button>  
        </div>
        <ParticipantForm onSubmit={(name) => addParticipant(name, 1)} />
        
        <ParticipantTable
          participants={groups.group1.main}
          title={"Main List"}
          onDelete={deleteParticipant}
          onToggle={togglePayment}
          isWaitingList={false}
          groupNumber={1}
        />
        <ParticipantTable
          participants={groups.group1.waiting}
          title={"Waiting List"}
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
          participants={groups.group2.main}
          title={"Main List"}
          onDelete={deleteParticipant}
          onToggle={togglePayment}
          isWaitingList={false}
          groupNumber={2}
        />
      </div>
    </div>
  );
}

export default App;