import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [uniqueUsers, setUniqueUsers] = useState([]);

    useEffect(() => {
        fetchData();
        fetchUsers();
    }, []);

    const fetchData = async () => {
        const res = await API.get('api/receipt');
        setData(res.data);
    };

    const fetchUsers = async () => {
        const res = await API.get('api/receipt/users');
        setUniqueUsers(res.data);
    };

    const filteredData = data.filter(item =>
        (
            item.customerId.includes(search) ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.enteredBy && item.enteredBy.toLowerCase().includes(search.toLowerCase()))
        ) &&
        (filterUser ? item.enteredBy === filterUser : true)
    );

    const exportCSV = () => {
        const headers = "CustomerID,Name,Amount,ReceiptNumber,TransactionID,EnteredBy,Date\n";
        const rows = filteredData.map(d =>
            `${d.customerId},${d.name},${d.amount},${d.receiptNumber},${d.transactionId},${d.enteredBy || ""},${new Date(d.createdAt).toLocaleString()}`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="admin-dashboard-container">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>

            <div className="filters">
                <input 
                    type="text" 
                    placeholder="Search by Name, ID or Entered By..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="filter-input"
                />

                <select 
                    value={filterUser} 
                    onChange={(e) => setFilterUser(e.target.value)} 
                    className="filter-select"
                >
                    <option value="">सभी Users</option>
                    {uniqueUsers.map(user => (
                        <option key={user} value={user}>{user}</option>
                    ))}
                </select>

                <button onClick={exportCSV} className="filter-button">Export to CSV</button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Receipt No</th>
                            <th>Transaction ID</th>
                            <th>Entered By</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(d => (
                            <tr key={d._id}>
                                <td>{d.customerId}</td>
                                <td>{d.name}</td>
                                <td>₹{d.amount}</td>
                                <td>{d.receiptNumber}</td>
                                <td>{d.transactionId}</td>
                                <td>{d.enteredBy || "-"}</td>
                                <td>{new Date(d.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
