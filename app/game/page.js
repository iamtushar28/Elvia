import React from "react";
import Navbar from "./component/Navbar";
import QuestionBox from "./component/QuestionBox";
import QuizWarning from "./component/QuizWarning";
import CountDown from "./component/CountDown";
import WaitingScreen from "./component/WaitingScreen";

const page = () => {
  return (
    <main className="bg-gradient-to-b from-violet-50 to-white">
      <Navbar />
      <QuestionBox/>
      {/* <QuizWarning /> */}
      {/* <CountDown /> */}
      {/* <WaitingScreen /> */}
    </main>
  );
};

export default page;
