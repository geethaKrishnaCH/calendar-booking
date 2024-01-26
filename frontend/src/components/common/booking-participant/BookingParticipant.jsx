import { IoPersonCircleSharp } from "react-icons/io5";

export default function BookingParticipant({ user, role }) {
  return (
    <>
      {user && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <IoPersonCircleSharp size={36} />
            <div className="ms-2">
              {user.username && <p className="m-0 fs-7">{user.username}</p>}
              {!user.username && (
                <p className="m-0 text-secondary fs-7">{user?.email}</p>
              )}
            </div>
          </div>
          <div>{role}</div>
        </div>
      )}
    </>
  );
}
