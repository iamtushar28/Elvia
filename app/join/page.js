"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Hero from "./components/Hero";
import DefaultError from "../components/DefaultError";

// This is a separate component that uses the search params for the Suspense boundary to work correctly.
const RoomManager = () => {
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState(null); //set roomId null

  useEffect(() => {
    const id = searchParams.get("roomId"); //getting roomId from url
    if (id) {
      setRoomId(id); //set roomId that got from url
    }
  }, [searchParams]);

  // Conditional rendering to show the fallback component when room Id is not provided
  if (!roomId) {
    return (
      <DefaultError
        errorMessage={
          "No room ID provided. Please try again to join or create a new quiz."
        }
      />
    );
  }

  return <Hero roomId={roomId} />;
};

// The main page component that uses Suspense
const Page = () => {
  return (
    // The `fallback` prop will display something while waiting for the client to render.
    <Suspense fallback={<div>Loading room...</div>}>
      <RoomManager />
    </Suspense>
  );
};

export default Page;
