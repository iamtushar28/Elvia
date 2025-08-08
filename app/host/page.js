'use client'
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const page = () => {
  const searchParams = useSearchParams(); // Get URL search parameters
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // Read the roomId from the URL query parameter
    const id = searchParams.get("roomId");
    if (id) {
      setRoomId(id);
    }
  }, [searchParams]); // Re-run effect if searchParams change

  return (
    <>
      <Navbar roomId={roomId} />
      <Hero roomId={roomId} />
    </>
  );
};

export default page;
