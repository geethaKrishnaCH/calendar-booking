import { useContext, useEffect, useState } from "react";
import { Badge, Button, Col, Offcanvas, Row, Spinner } from "react-bootstrap";
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
  const [bookingData, setBookingData] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [enableShowModal, setEnableShowModal] = useState(false);
  const {
    isLoggedIn,
    showLoader,
    hideLoader,
    handleAPIError,
    handleShowToast,
  } = useContext(AppContext);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [joining, setJoining] = useState(false);
  const { getBookingDetails, getBookingParticipants, joinBooking } =
    useBookingsApi();

  const makeBooking = async () => {
    if (!joining) {
      try {
        setJoining(true);
        const payload = {
          booking: bookingData._id,
          subSlotId: selectedSlot,
        };
        // perform booking operation
        await joinBooking(payload);
        handleShowToast("Booking successful.");
        fetchParticipants();
      } catch (err) {
        handleAPIError(err);
      } finally {
        setTimeout(() => {
          setJoining(false);
        }, 1000);
      }
    }
  };

  const handleModalClose = (proceed) => {
    setShowGuestModal(false);
    if (proceed) {
      makeBooking();
    }
  };

  const handleOnJoin = () => {
    if (enableShowModal) {
      setShowGuestModal(true);
    } else {
      makeBooking();
    }
  };

  const fetchBookingDetails = async () => {
    try {
      if (bookingId) {
        showLoader();
        const { data } = (await getBookingDetails(bookingId)).data;
        setBookingData(data);
      }
    } catch (err) {
      handleAPIError(err);
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
      handleAPIError(err);
    } finally {
      hideLoader();
    }
  };

  const checkIfAlreadyJoined = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (!isLoggedIn) return false;
    if (participants) {
      if (participants.creator._id === userInfo?.id) {
        return true;
      }
      const existingUser = participants.participants.find(
        (p) => p._id === userInfo?.id
      );
      if (existingUser) return true;
    }
    return false;
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot._id);
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

  if (!bookingData) {
    return <></>;
  }
  const startTime = extractTimeFromDateString(bookingData.startTime);
  const endTime = extractTimeFromDateString(bookingData.endTime);
  const { day, date, month, year } = extractYearAndMonthAndDateFromDateString(
    bookingData.startTime
  );
  const alreadyJoined = checkIfAlreadyJoined();
  const slotsAvailable =
    bookingData.subSlots && bookingData.subSlots.length > 0;
  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header className="shadow-sm" bg="dark" closeButton>
          <Offcanvas.Title>Booking Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 text-gray">
          <div className="border p-3">
            <h5>{bookingData.title}</h5>
            {bookingData.location.onlineMode && (
              <p className="link-primary" role="button">
                {bookingData.location.meetingLink}
              </p>
            )}
            <div className="row">
              <div className="col">
                <h6 className="my-1">Duration</h6>
                <Badge pill className="py-2 px-3" bg="primary">
                  {bookingData.duration}
                </Badge>
              </div>
              <div className="col d-flex flex-column align-items-center">
                <h6 className="my-1">Category</h6>
                <Badge pill className="py-2 px-3" bg="primary">
                  {bookingData.category}
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
            <p className="text-gray">{bookingData.description}</p>
          </div>
          {slotsAvailable && (
            <div className="border p-3">
              <h6>Slots Available</h6>
              <Row className="g-0">
                {bookingData.subSlots.map((slot) => (
                  <Col
                    key={slot._id}
                    sm="6"
                    className="mb-2"
                    onClick={() => handleSlotSelection(slot)}
                  >
                    <Badge
                      pill
                      className="px-3 py-2"
                      bg={selectedSlot === slot._id ? "primary" : "secondary"}
                    >
                      {extractTimeFromDateString(slot.startTime)} -{" "}
                      {extractTimeFromDateString(slot.endTime)}
                    </Badge>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          <div className="p-3">
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
              onClick={handleOnJoin}
              disabled={alreadyJoined}
            >
              {joining && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              <span className="ms-2">{alreadyJoined ? "Joined" : "Join"}</span>
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
