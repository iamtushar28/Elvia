import React from "react";
import Navbar from "./components/Navbar";
import QuizInfo from "./components/QuizInfo";
import QuizCreation from "./components/QuizCreation";

const page = () => {
  return (
    <>
      <Navbar />
      <QuizInfo />
      <QuizCreation />
    </>
  );
};

export default page;
