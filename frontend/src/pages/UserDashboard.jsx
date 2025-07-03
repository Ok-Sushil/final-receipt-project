import React from "react";

import ReceiptForm from "../components/ReceiptForm";

export default function UserDashboard() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Generate Receipt</h1>
            <ReceiptForm />
        </div>
    );
}
