import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

async function clearTable(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .not('id', 'is', null)
    
    if (error) {
      throw error
    }
    
    console.log('Table cleared successfully')
    // Add your success handling here (e.g., refresh UI, show message)
    
  } catch (error) {
    console.error('Error clearing table:', error.message)
    // Add your error handling here
  }
}

export function useSupabase() {
  const [MAX_PARTICIPANTS, setMaxParticipants] = useState(0);
  const fetchMaxParticipants = async () => {
    const { data, error } = await supabase
      .from('variables')
      .select('value')
      .eq('variable_name', 'MAX_PARTICIPANTS')
    if (error) {
      console.error('Error fetching max participants:', error.message)
      return
    }
    setMaxParticipants(data[0].value)
  }
  const getCurrentMaxParticipants = () => MAX_PARTICIPANTS;
  const ChangeMaxParticipants = async (newMax) => {
    try {
      // Update the MAX_PARTICIPANTS variable in the database
      const { error: updateError } = await supabase
        .from('variables')
        .update({ value: newMax })
        .eq('variable_name', 'MAX_PARTICIPANTS');
  
      if (updateError) throw updateError;
  
      // Process each group to move excess participants to the waiting list
      for (const groupNumber of [1, 2]) {
        // Fetch current main participants ordered by creation time (oldest first)
        const { data: mainParticipants, error: fetchError } = await supabase
          .from(`participants_${groupNumber}`)
          .select('*')
          .order('created_at', { ascending: true });
  
        if (fetchError) throw fetchError;
  
        const currentCount = mainParticipants.length;
        if (currentCount > newMax) {
          const excess = currentCount - newMax;
          // Get the last 'excess' participants (newest in the main list)
          const participantsToMove = mainParticipants.slice(-excess);
  
          if (participantsToMove.length > 0) {
            // Insert into waiting list with current timestamp (do not specify created_at)
            const { error: insertError } = await supabase
              .from(`waiting_list_${groupNumber}`)
              .insert(participantsToMove.map(p => ({ name: p.name, has_paid: p.has_paid })));
  
            if (insertError) throw insertError;
  
            // Delete moved participants from the main list
            const participantIds = participantsToMove.map(p => p.id);
            const { error: deleteError } = await supabase
              .from(`participants_${groupNumber}`)
              .delete()
              .in('id', participantIds);
  
            if (deleteError) throw deleteError;
          }
        }else{
          // Check if there are any participants in the waiting list
          const { data: waitingParticipants, error: fetchWaitingError } = await supabase
            .from(`waiting_list_${groupNumber}`)
            .select('*')
            .order('created_at', { ascending: true });
  
          if (fetchWaitingError) throw fetchWaitingError;
  
          const waitingCount = waitingParticipants.length;
          if (currentCount < newMax && waitingCount > 0) {
            const toPromote = newMax - currentCount;
            const participantsToPromote = waitingParticipants.slice(0, toPromote);
  
            if (participantsToPromote.length > 0) {
              // Insert into main list with current timestamp (do not specify created_at)
              const { error: insertError } = await supabase
                .from(`participants_${groupNumber}`)
                .insert(participantsToPromote.map(p => ({ name: p.name, has_paid: p.has_paid })));
  
              if (insertError) throw insertError;
  
              // Delete promoted participants from the waiting list
              const participantIds = participantsToPromote.map(p => p.id);
              const { error: deleteError } = await supabase
                .from(`waiting_list_${groupNumber}`)
                .delete()
                .in('id', participantIds);
  
              if (deleteError) throw deleteError;
            }
          }
        }
      }
  
      // Update the state with the new max value
      setMaxParticipants(newMax);
      console.log('Max participants updated and excess moved to waiting lists');
    } catch (error) {
      console.error('Error updating max participants:', error.message);
    }
  };

  const [groups, setGroups] = useState({
    group1: {
      main: [],
      waiting: []
    },
    group2: {
      main: [],
      waiting: []
    },
  })

  const fetchGroupData = async (groupNumber) => {
    const main = await supabase
      .from(`participants_${groupNumber}`)
      .select('*')
      .order('created_at', { ascending: true });

    const waiting = await supabase
      .from(`waiting_list_${groupNumber}`)
      .select('*')
      .order('created_at', { ascending: true });

    setGroups(prev => ({
      ...prev,
      [`group${groupNumber}`]: {
        main: main.data || [],
        waiting: waiting.data || []
      }
    }));
  };

  // Real-time updates using fetchGroupData
  useEffect(() => {
    const participants_1Sub = supabase
      .channel('custom-group1-participants')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'participants_1' },
        () => fetchGroupData(1)
      )
      .subscribe()

    const waiting_1Sub = supabase
      .channel('custom-group1-waiting')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'waiting_list_1' },
        () => fetchGroupData(1)
      )
      .subscribe()

    const participants_2Sub = supabase
      .channel('custom-group2-participants')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'participants_2' },
        () => fetchGroupData(2)
      )
      .subscribe()

    const waiting_2Sub = supabase
      .channel('custom-group2-waiting')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'waiting_list_2' },
        () => fetchGroupData(2)
      )
      .subscribe()
    
    const maxParticipantSub = supabase
      .channel('custom-max-participants')
      .on('postgres_changes',
      { event: '*', schema: 'public', table: 'variables', filter: "value=MAX_PARTICIPANTS" },
      () => fetchMaxParticipants()
      )
      .subscribe()

    return () => {
      participants_1Sub.unsubscribe()
      waiting_1Sub.unsubscribe()
      participants_2Sub.unsubscribe()
      waiting_2Sub.unsubscribe()
      maxParticipantSub.unsubscribe()
    }
  }, [])


  useEffect(() => {
    fetchGroupData(1);
    fetchGroupData(2);
    fetchMaxParticipants();
  }, []);

  const moveGroup1ToGroup2 = async () => {
    try {
      // Clear group 2 tables
      await clearTable('participants_2');
      await clearTable('waiting_list_2');

      // Move main participants from group 1 to group 2
      if (groups.group1.main.length > 0) {
        await supabase
          .from('participants_2')
          .insert(groups.group1.main.map(({ name, has_paid }) => ({ name, has_paid })));
      }

      // Move waiting list participants from group 1 to group 2
      if (groups.group1.waiting.length > 0) {
        await supabase
          .from('waiting_list_2')
          .insert(groups.group1.waiting.map(({ name, has_paid }) => ({ name, has_paid })));
      }

      // Optionally clear group 1 in state
      setGroups(prev => ({
        ...prev,
        group1: { main: [], waiting: [] }
      }));

      await clearTable('participants_1');
      await clearTable('waiting_list_1');

      // Refresh the data for group 2
      fetchGroupData(2);
    } catch (error) {
      console.error('Error moving group1 to group2:', error);
    }
  };

  const addParticipant = async (name, groupNumber) => {
    // Similar to previous logic but using group-specific tables
    const tableName = `participants_${groupNumber}`;
    const waitingTable = `waiting_list_${groupNumber}`;
    try {
      // Check if tables exist
      const { error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (tableError) {
        console.error("Table does not exist: ", tableError);
      }

      // Rest of your existing addParticipant logic
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      if (count < MAX_PARTICIPANTS) {
        await supabase
          .from(tableName)
          .insert([{ name }]);
      } else {
        await supabase
          .from(waitingTable)
          .insert([{ name }]);
      }
    } catch (error) {
      console.error("Error adding participant: ", error);
    }
  };

  const togglePayment = async (id,groupNumber) => {
    const mainTable = `participants_${groupNumber}`;
    const participant = groups[`group${groupNumber}`].main.find(p => p.id === id)
    if (!participant) return

    await supabase
      .from(mainTable)
      .update({ has_paid: !participant.has_paid })
      .eq('id', id)
  }

  // Update other functions to accept groupNumber parameter
  const deleteParticipant = async (id, groupNumber,waiting) => {
    if (!window.confirm("Please confirm that this is you, and do not remove other name without permission 😢🙏")) {
      return;
    }
    // Use group-specific tables
    const mainTable = `participants_${groupNumber}`;
    const waitingTable = `waiting_list_${groupNumber}`;
    if(waiting){
      // Delete from waiting list
      await supabase
        .from(waitingTable)
        .delete()
        .eq('id', id)
    }else{
        // Delete from main list
        await supabase
        .from(mainTable)
        .delete()
        .eq('id', id)

        // Promote from waiting list if needed
        if (groups[`group${groupNumber}`].main.length - 1 < MAX_PARTICIPANTS && groups[`group${groupNumber}`].waiting.length > 0) {
        const [firstWaiting] = groups[`group${groupNumber}`].waiting
        
        await supabase
            .from(mainTable)
            .insert([{
            name: firstWaiting.name,
            has_paid: firstWaiting.has_paid
            }])

        await supabase
            .from(waitingTable)
            .delete()
            .eq('id', firstWaiting.id)
        
        window.alert(`Remind ${firstWaiting.name} that they have been promoted from the waiting list`)
        }
    }
  }

  return { groups, addParticipant, deleteParticipant, togglePayment,moveGroup1ToGroup2,ChangeMaxParticipants,MAX_PARTICIPANTS,getCurrentMaxParticipants};
}
