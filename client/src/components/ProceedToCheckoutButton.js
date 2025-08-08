import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function ProceedToCheckoutButton() {
  

  return (
    
    <div className="flex justify-center fixed bottom-4 left-0 right-0 z-50">
  <Link
    to='/booking-summary'
    aria-label="Proceed to Payment"
    className={`bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition 
                disabled:opacity-50 disabled:cursor-not-allowed font-bold`}
  >
    {loadingPayment ? "Processing…" : "Proceed to Payment"}
  </Link>
    </div>
  );
}
