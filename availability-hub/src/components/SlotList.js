// SlotList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SlotList = () => {
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        // Fetch available slots
        const fetchSlots = async () => {
            const response = await axios.get('/api/slots');
            setSlots(response.data);
        };
        fetchSlots();
    }, []);

    const handleSignUp = async (slotId) => {
        const userName = prompt("Enter your name:");
        if (userName) {
            const response = await axios.post('/api/signup', { slotId, userName });
            setSlots(response.data); // Update slots with new data
        }
    };

    return (
        <div>
            {slots.map((slot) => (
                <div key={slot.id}>
                    <h4>Time: {slot.time} - {slot.taken}/{slot.capacity} filled</h4>
                    <button
                        onClick={() => handleSignUp(slot.id)}
                        disabled={slot.taken >= slot.capacity}
                    >
                        Sign Up
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SlotList;
