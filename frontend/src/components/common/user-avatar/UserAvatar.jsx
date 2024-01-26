import { IoMdPerson } from "react-icons/io";

export default function UserAvatar({ username }) {
  return (
    <div className="d-flex align-items-center">
      <IoMdPerson size={24} className="border rounded-circle me-2" />
      <p className="m-0">Welcome {username}</p>
    </div>
  );
}
