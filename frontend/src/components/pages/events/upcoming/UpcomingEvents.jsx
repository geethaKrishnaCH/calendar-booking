import { Col, Container, Row } from "react-bootstrap";
import EventCard from "../../../common/event-card/EventCard";

export default function UpcomingEvents({ events }) {
  const eventsPresent = events && events.length > 0;
  return (
    <div className="px-5">
      <h4 className="py-1">Upcoming Events</h4>
      {!eventsPresent && <h1 className="display-6">No upcoming Events</h1>}
      {eventsPresent && (
        <Container fluid className="g-0">
          <Row>
            {events.map((eve) => (
              <Col key={eve.id} lg={3} md={4} sm={6}>
                <EventCard event={eve} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
}
