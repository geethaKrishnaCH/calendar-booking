import { Button, Card } from "react-bootstrap";
import {
  extractTimeFromDateString,
  extractYearAndMonthAndDateFromDateString,
} from "../../../util/date-utils";
import styles from "./BookingCard.module.css";
import BookingDetails from "../booking-details/BookingDetails";
import { useState } from "react";

export default function BookingCard({ booking }) {
  const [show, setShow] = useState(false);

  const startTime = extractTimeFromDateString(booking.startTime);
  const endTime = extractTimeFromDateString(booking.endTime);
  const { year, month, date } = extractYearAndMonthAndDateFromDateString(
    booking.startTime
  );
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const showDetails = () => {};
  return (
    <>
      <Card className={`${styles["bg-sky-blue"]} shadow`}>
        <Card.Body className="py-4">
          <p className="fw-bold">{booking.title}</p>
          <p className="m-0">
            {month} {date}, {year}
          </p>
          <p className="g-0">
            {startTime} - {endTime}
          </p>
          <p className="text-secondary">{booking.description}</p>
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              className="rounded-pill"
              onClick={handleShow}
            >
              Details
            </Button>
          </div>
        </Card.Body>
      </Card>
      {show && (
        <BookingDetails
          bookingId={booking._id}
          handleClose={handleClose}
          show={show}
        />
      )}
    </>
  );
}
