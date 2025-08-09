'use client'

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// This is a separate component that uses the search params
const RoomComponent = () => {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const id = searchParams.get("roomId");
    if (id) {
      setRoomId(id);
    }
  }, [searchParams]);

  return (
    <>
      <Navbar roomId={roomId} />
      <Hero roomId={roomId} />
    </>
  );
};

// This is your main page component
const Page = () => {
  return (
    <>
      {/* Wrap the component that uses useSearchParams in a Suspense boundary */}
      <Suspense fallback={<div>Loading...</div>}>
        <RoomComponent />
      </Suspense>
    </>
  );
};

export default Page;