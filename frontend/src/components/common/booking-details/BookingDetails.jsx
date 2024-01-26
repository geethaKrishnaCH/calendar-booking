import { useContext, useEffect, useState } from "react";
import { Badge, Button, Offcanvas } from "react-bootstrap";
import { GoArrowRight } from "react-icons/go";
import useBookingsApi from "../../../apis/useBookingsApi";
import {
  extractTimeFromDateString,
  extractYearAndMonthAndDateFromDateString,
} from "../../../util/date-utils";
import AppContext from "../../context/AppContext";
import GuestVerificationModal from "../modals/guest-verification-modal/GuestVerificationModal";
import BookingParticipant from "../booking-participant/BookingParticipant";

export default function BookingDetails(props) {
  const { show, bookingId, handleClose } = props;
  const [booking, setBooking] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [enableShowModal, setEnableShowModal] = useState(false);
  const { isLoggedIn, showLoader, hideLoader } = useContext(AppContext);
  const { getBookingDetails, getBookingParticipants } = useBookingsApi();

  const handleModalClose = (proceed) => {
    setShowGuestModal(false);
    if (proceed) {
      // perform booking operation
    }
  };

  const makeBooking = () => {
    if (enableShowModal) {
      setShowGuestModal(true);
    } else {
      // perform booking operation
    }
  };

  const fetchBookingDetails = async () => {
    try {
      if (bookingId) {
        showLoader();
        const { data } = (await getBookingDetails(bookingId)).data;
        setBooking(data);
      }
    } catch (err) {
    } finally {
      hideLoader();
    }
  };
  const fetchParticipants = async () => {
    try {
      if (bookingId) {
        showLoader();
        const { data } = (await getBookingParticipants(bookingId)).data;
        setParticipants(data);
      }
    } catch (err) {
    } finally {
      hideLoader();
    }
  };

  const checkIfAlreadyJoined = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (!isLoggedIn) return false;
    if (participants) {
      if (participants.creator._id === userInfo.id) {
        return true;
      }
      const existingUser = participants.participants.find(
        (p) => p._id === userInfo.id
      );
      if (existingUser) return true;
    }
    return false;
  };

  useEffect(() => {
    fetchBookingDetails();
    fetchParticipants();
  }, [bookingId]);

  useEffect(() => {
    if (isLoggedIn) {
      setEnableShowModal(false);
    } else {
      setEnableShowModal(true);
    }
  }, [isLoggedIn]);
  if (!booking) {
    return <></>;
  }
  const startTime = extractTimeFromDateString(booking.startTime);
  const endTime = extractTimeFromDateString(booking.endTime);
  const { day, date, month, year } = extractYearAndMonthAndDateFromDateString(
    booking.startTime
  );
  const alreadyJoined = checkIfAlreadyJoined();
  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header className="shadow-sm" bg="dark" closeButton>
          <Offcanvas.Title>Booking Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 text-gray">
          <div className="border p-3">
            <h5>{booking.title}</h5>
            {booking.location.onlineMode && (
              <p className="link-primary" role="button">
                {booking.location.meetingLink}
              </p>
            )}
            <div className="row">
              <div className="col">
                <h6 className="my-1">Duration</h6>
                <Badge pill className="py-2 px-3" bg="primary">
                  {booking.duration}
                </Badge>
              </div>
              <div className="col d-flex flex-column align-items-center">
                <h6 className="my-1">Category</h6>
                <Badge pill className="py-2 px-3" bg="primary">
                  {booking.category}
                </Badge>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <p className="m-0 display-8">{startTime}</p>
              <GoArrowRight size={24} />
              <p className="m-0 display-8">{endTime}</p>
            </div>
            <p className="text-gray">
              {day}, {month} {date}, {year}
            </p>
            <h6>About</h6>
            <p className="text-gray">{booking.description}</p>
          </div>
          <div className="participants p-3">
            <h6>Participants</h6>
            {!participants && <h6>No Participants</h6>}
            {participants && (
              <>
                <BookingParticipant
                  user={participants.creator}
                  role="Room master"
                />
                {participants.participants.map((p) => (
                  <BookingParticipant
                    key={p._id}
                    user={p}
                    role={"Participant"}
                  />
                ))}
              </>
            )}
          </div>
          <div className="p-3 d-flex justify-content-end">
            <Button
              className="px-4"
              onClick={makeBooking}
              disabled={alreadyJoined}
            >
              Join
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {enableShowModal && showGuestModal && (
        <GuestVerificationModal
          show={showGuestModal}
          handleClose={handleModalClose}
        />
      )}
    </>
  );
}
