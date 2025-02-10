import { useSupabase } from './hooks/useSupabase'
import ParticipantTable from './components/ParticipantTable'
import ParticipantForm from './components/ParticipantForm'
import logo from './images/badminton-logo.svg';
import './styles.css';
function App() {
  const { mainList, waitingList, addParticipant, togglePayment, deleteParticipant } = useSupabase()

  return (
    <div className="badminton-container">
      <header className="event-header">
        <img 
          src={logo}
          alt="BadMatTon Logo" 
          className="event-logo"
        />
      </header>
      <ParticipantForm onSubmit={addParticipant} />
      <div className="shuttle-table-container">
        <ParticipantTable
          participants={mainList}
          title={`Main List (${mainList.length}/10)`}
          onToggle={togglePayment}
          onDelete={(id) => deleteParticipant(id, false)}
        />
        {waitingList.length > 0 && (
          <ParticipantTable
            participants={waitingList}
            title="Waiting List"
            onDelete={(id) => deleteParticipant(id, true)}
            isWaitingList={true}
          />
        )}
      </div>
    </div>
  )
}

export default App;