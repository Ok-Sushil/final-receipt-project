import React, { useState } from "react";
import API from "../services/api";
import './ReceiptForm.css';

export default function ReceiptForm() {
    const [customerId, setCustomerId] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const username = localStorage.getItem('username');

    const fetchDetails = async () => {
        try {
            const res = await API.post('/receipt/getCustomer', { customerId });
            setName(res.data.name);
        } catch {
            alert("Invalid Customer ID");
        }
    };

    const generateReceipt = async () => {
        try {
            const enteredBy = localStorage.getItem('username');
            const res = await API.post('/receipt/generate', 
                { customerId, amount, enteredBy },
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Receipt_${customerId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            alert("Error generating receipt");
        }
    };

    return (
        <div className="receipt-form-container">
            <input 
                type="text" 
                placeholder="Customer ID" 
                value={customerId} 
                onChange={(e) => setCustomerId(e.target.value)} 
                className="receipt-input"
            />
            <button onClick={fetchDetails} className="receipt-button receipt-button-green">Get Details</button>

            {name && (
                <>
                    <p className="receipt-name">Name: <strong>{name}</strong></p>
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="receipt-input"
                    />
                    <button onClick={generateReceipt} className="receipt-button">Generate Receipt</button>
                </>
            )}
        </div>
    );
}
