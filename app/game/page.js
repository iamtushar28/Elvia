import React from "react";
import Navbar from "./component/Navbar";
import QuestionBox from "./component/QuestionBox";

const page = () => {
  return (
    <main className="bg-gradient-to-b from-violet-50 to-white">
      <Navbar />
      <QuestionBox/>
    </main>
  );
};

export default page;
