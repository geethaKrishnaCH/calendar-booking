import { useContext, useEffect, useState } from "react";
import useBookingsApi from "../../../../apis/useBookingsApi";
import AppContext from "../../../context/AppContext";
import FilterOptions from "../../../common/filter-options/FiltersOptions";
import { Col, Container, Row } from "react-bootstrap";
import BookingCard from "../../../common/booking-card/BookingCard";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const { getBookingBookedByUser } = useBookingsApi();
  const [filters, setFilters] = useState(null);
  const { showLoader, hideLoader, handleAPIError, handleShowToast } =
    useContext(AppContext);

  useEffect(() => {
    async function fetchMyUpcomingBookings() {
      try {
        showLoader();
        const { data } = (
          await getBookingBookedByUser(
            filters.startDate,
            filters.endDate,
            filters.category
          )
        ).data;
        setBookings(data.map((item) => item.bookingDetails));
      } catch (err) {
        handleAPIError(err);
        handleShowToast("Unknown error!", true);
      } finally {
        hideLoader();
      }
    }
    if (filters) {
      fetchMyUpcomingBookings();
    }
  }, [filters]);

  const handleApplyFilters = (filters) => {
    setFilters(filters);
  };
  const bookingsPresent = bookings && bookings.length > 0;
  return (
    <>
      <FilterOptions onApply={handleApplyFilters} />
      <div className="px-5">
        <h4 className="py-3 m-0">My Bookings</h4>
        {!bookingsPresent && (
          <h1 className="display-6">No Upcoming Bookings</h1>
        )}
        {bookingsPresent && (
          <Container fluid className="g-0">
            <Row>
              {bookings.map((booking) => (
                <Col key={booking._id} lg={3} md={4} sm={6} className="mb-3">
                  <BookingCard booking={booking} />
                </Col>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
}
