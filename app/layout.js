import "./globals.css";
import ReduxProvider from "./provider/ReduxProvider";

export const metadata = {
  title: "Elvia | Interactive quiz game",
  description:
    "An elegant, AI-powered quiz platform for creating, hosting, and joining real-time quizzes — solo or with friends. Simple, smart, and interactive.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
