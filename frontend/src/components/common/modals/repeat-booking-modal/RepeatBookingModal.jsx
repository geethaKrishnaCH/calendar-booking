import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DayPicker from "../../day-picker/DayPicker";

export default function RepeatBookingModal({ show, handleClose }) {
  const DAYS_IN_A_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [selectedDays, setSelectedDays] = useState([]);
  const handleSelect = (day) => {
    if (selectedDays.includes(day)) {
      const tempArr = selectedDays;
      const idx = selectedDays.findIndex((item) => item === day);
      tempArr.splice(idx, 1);
      setSelectedDays([...tempArr]);
    } else {
      setSelectedDays((prev) => {
        prev.push(day);
        return [...prev];
      });
    }
  };
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Set Occurence</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form as={Row}>
          <Form.Group as={Col} md={6} controlId="startDate" className="mt-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control name="startDate" type="date" />
          </Form.Group>
          <Form.Group as={Col} md={6} controlId="endDate" className="mt-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control name="endDate" type="date" />
          </Form.Group>
        </Form>
        <div className="mt-3">
          {DAYS_IN_A_WEEK.map((day) => (
            <DayPicker
              key={day}
              day={day}
              active={selectedDays.includes(day)}
              handleSelect={handleSelect}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
