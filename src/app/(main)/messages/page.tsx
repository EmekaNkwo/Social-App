import { Metadata } from "next";
import Chat from "./Chat";
import Messenger from "@/components/messages/Messenger";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return (
    <>
      <Chat />;{/* <Messenger /> */}
    </>
  );
}
