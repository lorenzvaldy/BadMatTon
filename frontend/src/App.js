import React, { useState } from 'react';
import './App.css';
import ParticipantTable from './components/ParticipantTable';
import ParticipantForm from './components/ParticipantForm';


function App() {
  const [mainList, setMainList] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [currentName, setCurrentName] = useState('');
  const MAX_MAIN_LIST = 25;

  const handleAdd = () => {
    if (!currentName.trim()) return;
    
    const newParticipant = {
      id: Date.now(),
      name: currentName.trim(),
      paid: false
    };

    if (mainList.length < MAX_MAIN_LIST) {
      setMainList([...mainList, newParticipant]);
    } else {
      setWaitingList([...waitingList, newParticipant]);
    }
    
    setCurrentName('');
  };

  const handleDelete = (id) => {
    const newMain = mainList.filter(p => p.id !== id);
    if (newMain.length < MAX_MAIN_LIST && waitingList.length > 0) {
      const [firstWaiting, ...restWaiting] = waitingList;
      setMainList([...newMain, firstWaiting]);
      setWaitingList(restWaiting);
    } else {
      setMainList(newMain);
    }
  };

  const handleTogglePayment = (id) => {
    const updatePayment = (list) => list.map(p => 
      p.id === id ? { ...p, paid: !p.paid } : p
    );

    setMainList(updatePayment(mainList));
    setWaitingList(updatePayment(waitingList));
  };

  const handleReset = () => {
    const password = prompt('Enter password to reset:');
    if (password === process.env.PASS) {
      setMainList([]);
      setWaitingList([]);
      alert('All data has been reset!');
    } else {
      alert('Wrong password!');
    }
  };

  return (
    <div className="container">
      <div className="header-section">
        <h1>Event Registration</h1>
        <button 
          className="reset-button"
          onClick={handleReset}
        >
          Reset All Data
        </button>
      </div>
      
      <ParticipantForm 
        currentName={currentName}
        setCurrentName={setCurrentName}
        onSubmit={handleAdd}
      />
      
      <ParticipantTable
        participants={mainList}
        title="Main List"
        onDelete={handleDelete}
        onTogglePayment={handleTogglePayment}
      />
      
      {waitingList.length > 0 && (
        <ParticipantTable
          participants={waitingList}
          title="Waiting List"
          onDelete={(id) => setWaitingList(waitingList.filter(p => p.id !== id))}
          onTogglePayment={handleTogglePayment}
        />
      )}
    </div>
  );
}

export default App;