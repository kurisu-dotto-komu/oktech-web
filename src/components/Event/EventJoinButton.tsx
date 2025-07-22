import { LuTicket } from "react-icons/lu";

export default function EventJoinButton() {
  return (
    <a
      href="https://meetup.com"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary btn-lg w-full gap-4"
    >
      Join Event
      <LuTicket />
    </a>
  );
}
