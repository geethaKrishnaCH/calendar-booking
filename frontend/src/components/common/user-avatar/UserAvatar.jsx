import { IoMdPerson } from "react-icons/io";

export default function UserAvatar() {
  return (
    <div className="d-flex align-items-center">
      <IoMdPerson size={36} className="border rounded-circle mx-2" />
      <p className="fw-bold m-0">Welcome User01</p>
    </div>
  );
}
