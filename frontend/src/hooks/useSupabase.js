import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const MAX_PARTICIPANTS = 10

export function useSupabase() {
  const [mainList, setMainList] = useState([])
  const [waitingList, setWaitingList] = useState([])

   // Initialize database tables
   const initializeDB = async () => {
    try {
      // Create participants table
      await supabase.rpc(`
        CREATE TABLE IF NOT EXISTS participants (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          has_paid BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Create waiting_list table
      await supabase.rpc(`
        CREATE TABLE IF NOT EXISTS waiting_list (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          has_paid BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      console.log("Tables initialized successfully");
    } catch (error) {
      console.error("Error initializing tables:", error);
    }
  };


  // Load initial data
  useEffect(() => {
    fetchParticipants()
    fetchWaitingList()
  }, [])

  // Real-time updates
  useEffect(() => {
    const participantsSub = supabase
      .channel('custom-all-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        () => fetchParticipants()
      )
      .subscribe()

    const waitingSub = supabase
      .channel('custom-waiting-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'waiting_list' },
        () => fetchWaitingList()
      )
      .subscribe()

    return () => {
      participantsSub.unsubscribe()
      waitingSub.unsubscribe()
    }
  }, [])

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error) setMainList(data)
  }

  const fetchWaitingList = async () => {
    const { data, error } = await supabase
      .from('waiting_list')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error) setWaitingList(data)
  }

  const addParticipant = async (name) => {
    try {
      // Check if tables exist
      const { error: tableError } = await supabase
        .from('participants')
        .select('*')
        .limit(1);

      if (tableError) {
        await initializeDB(); // Auto-create tables if they don't exist
      }

      // Rest of your existing addParticipant logic
      const { count } = await supabase
        .from('participants')
        .select('*', { count: 'exact' });

      if (count < MAX_PARTICIPANTS) {
        await supabase
          .from('participants')
          .insert([{ name }]);
      } else {
        await supabase
          .from('waiting_list')
          .insert([{ name }]);
      }
    } catch (error) {
      console.error("Error adding participant: ", error);
    }
  };

  const togglePayment = async (id) => {
    const participant = mainList.find(p => p.id === id)
    if (!participant) return

    await supabase
      .from('participants')
      .update({ has_paid: !participant.has_paid })
      .eq('id', id)
  }

  const deleteParticipant = async (id,waiting) => {
    if(waiting){
      // Delete from waiting list
      await supabase
        .from('waiting_list')
        .delete()
        .eq('id', id)
    }else{
        // Delete from main list
        await supabase
        .from('participants')
        .delete()
        .eq('id', id)

        // Promote from waiting list if needed
        if (mainList.length - 1 < MAX_PARTICIPANTS && waitingList.length > 0) {
        const [firstWaiting] = waitingList
        
        await supabase
            .from('participants')
            .insert([{
            name: firstWaiting.name,
            has_paid: firstWaiting.has_paid
            }])

        await supabase
            .from('waiting_list')
            .delete()
            .eq('id', firstWaiting.id)
        }
    }
  }

  return { mainList, waitingList, addParticipant, togglePayment, deleteParticipant };
}