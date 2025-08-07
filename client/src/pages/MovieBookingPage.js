import React from "react";
import { useParams } from "react-router-dom";
import SeatBooking from "./SeatBooking";

export default function MovieBookingPage() {
  const { movieId } = useParams();

  return <SeatBooking movieId={movieId} />;
}
