import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useBookingsApi from "../../../../apis/useBookingsApi";
import BookingCard from "../../../common/booking-card/BookingCard";
import FilterOptions from "../../../common/filter-options/FiltersOptions";
import AppContext from "../../../context/AppContext";

export default function UpcomingBookings() {
  const [bookings, setBookings] = useState([]);
  const { getUpcomingBookings } = useBookingsApi();
  const [filters, setFilters] = useState(null);
  const { showLoader, hideLoader } = useContext(AppContext);

  useEffect(() => {
    async function fetchUpcomingBookings() {
      try {
        showLoader();
        const { data } = (
          await getUpcomingBookings(
            filters.startDate,
            filters.endDate,
            filters.category
          )
        ).data;
        setBookings(data);
      } catch (err) {
      } finally {
        hideLoader();
      }
    }
    if (filters) {
      fetchUpcomingBookings();
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
        <h4 className="py-3 m-0">Upcoming Bookings</h4>
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
