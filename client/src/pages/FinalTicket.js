import React from "react";

export default function FinalTicket() {
  const handleDownload = () => {
    alert("Download functionality like PDF export can be added with jsPDF or html2canvas.");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-3xl font-bold mb-6">Your Ticket</h2>
      <div className="mx-auto mb-8 w-48 h-48 bg-purple-700 rounded-xl flex items-center justify-center text-white text-4xl font-extrabold select-none">
        QR CODE
      </div>
      <button
        onClick={handleDownload}
        className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold hover:opacity-90 transition"
      >
        Download Ticket
      </button>
    </div>
  );
}
