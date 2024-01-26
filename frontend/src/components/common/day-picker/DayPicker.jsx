import { Button } from "react-bootstrap";

export default function DayPicker({ day, active, handleSelect }) {
  return (
    <Button
      className="py-1 px-2 me-1 rounded"
      size="sm"
      variant={active ? "primary" : "secondary"}
      onClick={() => handleSelect(day)}
    >
      {day}
    </Button>
  );
}
