import React from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import JoinTheGame from "./components/JoinTheGame";
import CreateTheGame from "./components/CreateTheGame";
import { FaArrowLeft } from "react-icons/fa";
import { PiPlay } from "react-icons/pi";
import Link from "next/link";

const page = () => {
  return (
    <main className="flex justify-center">
      {/* animated background */}
      <AnimatedBackground />

      {/* Instruction */}
      <div className="w-full md:w-[40rem] h-auto pt-8 mb-8 px-3 flex flex-col gap-6 items-start">
        {/* back to home button */}
        <Link href={'/'} className="text-violet-500 hover:underline cursor-pointer flex gap-2 items-center">
          <FaArrowLeft />
          Back to home
        </Link>

        <h2 className="text-2xl font-semibold">How to Play Elvia Live</h2>

        {/* How to join game? */}
        <JoinTheGame />

        {/* How to create game */}
        <CreateTheGame />

        {/* ready to play button */}
        <div className="w-full flex justify-center">
          <Link href={'/'} className="px-4 py-2 text-white bg-[#8570C0] hover:bg-[#886fcbda] rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer">
            <PiPlay className="text-lg" />
            Ready to Play
          </Link>
        </div>
      </div>
    </main>
  );
};

export default page;
