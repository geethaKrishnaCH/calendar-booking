import { Card } from "react-bootstrap";

export default function EventCard({ event }) {
  return (
    <Card>
      <Card.Body>{JSON.stringify(event)}</Card.Body>
    </Card>
  );
}
