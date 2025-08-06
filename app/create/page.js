import React from "react";
import Navbar from "./components/Navbar";
import QuizInfo from "./components/QuizInfo";
import QuizCreation from "./components/QuizCreation";
import AnimatedBackground from "../components/AnimatedBackground";

const page = () => {
  return (
    <main>
      <Navbar />
      <AnimatedBackground />
      <QuizInfo />
      <QuizCreation />
    </main>
  );
};

export default page;
