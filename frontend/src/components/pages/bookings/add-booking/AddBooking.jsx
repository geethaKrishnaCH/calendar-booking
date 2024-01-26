import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { GoArrowRight } from "react-icons/go";
import useBookingsApi from "../../../../apis/useBookingsApi";
import {
  convertDateStringTimeStringToDate,
  convertDateToString,
} from "../../../../util/date-utils";
import DayPicker from "../../../common/day-picker/DayPicker";
import AppContext from "../../../context/AppContext";

function AddBooking() {
  const { addBooking } = useBookingsApi();
  const { showLoader, hideLoader, handleAPIError, handleShowToast } =
    useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [showReccurenceEndDate, setShowReccurenceEndDate] = useState(false);
  const [showDaysToChoose, setShowDaysToChoose] = useState(false);
  const [bookingData, setBookingData] = useState({
    title: "",
    repeatFrequency: "",
    description: "",
    category: "",
    subSlotInfo: {
      duration: "",
      buffer: "",
    },
    maxParticipants: "",
    repeatedDays: [],
    repeatEndDate: "",
    location: {
      meetingLink: "",
      onlineMode: false,
      address: "",
    },
  });
  const [eventTimings, setEventTimings] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const DAYS_IN_A_WEEK = [
    { value: "SUN", selected: false },
    { value: "MON", selected: false },
    { value: "TUE", selected: false },
    { value: "WED", selected: false },
    { value: "THU", selected: false },
    { value: "FRI", selected: false },
    { value: "SAT", selected: false },
  ];
  const [selectedDays, setSelectedDays] = useState(DAYS_IN_A_WEEK);
  const REPEAT_FREQUENCIES = ["Do Not Repeat", "Daily", "Weekly"];
  const SUB_SLOT_DURATIONS = [
    { label: "5 Min", value: 5 },
    { label: "10 Min", value: 10 },
    { label: "15 Min", value: 15 },
    { label: "20 Min", value: 20 },
    { label: "25 Min", value: 25 },
  ];
  const BUFFER_DURATIONS = [
    { label: "1 Min", value: 1 },
    { label: "2 Min", value: 2 },
    { label: "3 Min", value: 3 },
    { label: "5 Min", value: 5 },
  ];
  const HALF_AN_HOUR_SLOTS = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];
  const { categories } = useContext(AppContext);
  const handleDaySelect = (day) => {
    const tempSelectedDays = selectedDays;
    const selectedDay = tempSelectedDays.find((d) => d.value === day);
    selectedDay.selected = !selectedDay.selected;
    setSelectedDays([...tempSelectedDays]);
  };
  const handleSubmit = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      try {
        const startTime = convertDateStringTimeStringToDate(
          eventTimings.startDate,
          eventTimings.startTime
        );
        const endTime = convertDateStringTimeStringToDate(
          eventTimings.endDate,
          eventTimings.endTime
        );
        bookingData.startTime = startTime;
        bookingData.endTime = endTime;
        if (bookingData.repeatFrequency === "Weekly") {
          bookingData.repeatedDays = selectedDays
            .filter((day) => day.selected)
            .map((day) => day.value);
        }
        cleanBookingData();
        showLoader();
        await addBooking(bookingData);
        handleShowToast("Booking created.");
      } catch (err) {
        handleAPIError(err);
      } finally {
        hideLoader();
      }
      // return;
    }
    setValidated(true);
  };

  const cleanBookingData = () => {
    bookingData.maxParticipants = parseInt(bookingData.maxParticipants);
    bookingData.subSlotInfo.duration = parseInt(
      bookingData.subSlotInfo.duration
    );
    bookingData.subSlotInfo.buffer = parseInt(bookingData.subSlotInfo.buffer);
    if (!bookingData.repeatEndDate) bookingData.repeatEndDate = null;
  };

  const handleFormChange = (e) => {
    if (e.target.name === "onlineMode") {
      const onlineMode = e.target.checked;
      if (onlineMode) {
        // remove address
      } else {
        // remove meetingLink
      }
      setBookingData((prev) => {
        return { ...prev, location: { ...prev.location, onlineMode } };
      });
      return;
    }
    if (["address", "meetingLink"].includes(e.target.name)) {
      setBookingData((prev) => {
        return {
          ...prev,
          location: { ...prev.location, [e.target.name]: e.target.value },
        };
      });
      return;
    }
    if ("maxParticipants" === e.target.name) {
      setBookingData((prev) => {
        return {
          ...prev,
          [e.target.name]: parseInt(e.target.value),
        };
      });
      return;
    }
    if (["duration", "buffer"].includes(e.target.name)) {
      setBookingData((prev) => {
        return {
          ...prev,
          subSlotInfo: { ...prev.subSlotInfo, [e.target.name]: e.target.value },
        };
      });
      return;
    }
    if (e.target.name === "repeatFrequency") {
      if (e.target.value === "Daily") {
        setShowReccurenceEndDate(true);
        setShowDaysToChoose(false);
      } else if (e.target.value === "Weekly") {
        setShowDaysToChoose(true);
        setShowReccurenceEndDate(true);
      } else {
        setShowReccurenceEndDate(false);
        setShowDaysToChoose(false);
      }
    }
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e) => {
    if (e.target.name === "startDate") {
      setEventTimings((prev) => {
        return {
          ...prev,
          endDate: e.target.value.trim(),
        };
      });
    }
    setEventTimings((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value.trim(),
      };
    });
  };

  const today = convertDateToString(new Date());
  return (
    <Container className="my-3">
      <h4 className="mb-3">Add Booking details</h4>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3 g-0">
          <Form.Group
            className="mb-md-0 mb-1"
            as={Col}
            md={9}
            controlId="title"
          >
            <Form.Control
              required
              type="text"
              placeholder="Add title"
              value={bookingData.title}
              name="title"
              onChange={handleFormChange}
            />
            {/* <Form.Control.Feedback type="invalid">
              Title is required
            </Form.Control.Feedback> */}
          </Form.Group>
        </Row>
        <Row className="mb-3 g-0">
          <Form.Group
            className="mb-md-0 mb-1"
            as={Col}
            md="2"
            controlId="startDate"
          >
            <Form.Control
              required
              name="startDate"
              type="date"
              min={today}
              value={eventTimings.startDate}
              onChange={handleDateChange}
            />
          </Form.Group>
          <Form.Group
            className="mb-md-0 mb-1"
            as={Col}
            md="2"
            controlId="startTime"
          >
            <Form.Select
              required
              name="startTime"
              value={eventTimings.startTime}
              onChange={handleDateChange}
            >
              <option value="">Select</option>
              {HALF_AN_HOUR_SLOTS.map((slot) => (
                <option value={slot} key={slot}>
                  {slot}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Col
            md="1"
            className="d-flex justify-content-center align-items-center"
          >
            <GoArrowRight size={24} />
          </Col>
          <Form.Group
            className="mb-md-0 mb-1"
            as={Col}
            md="2"
            controlId="endDate"
          >
            <Form.Control
              required
              name="endDate"
              type="date"
              value={eventTimings.endDate}
              disabled
            />
          </Form.Group>
          <Form.Group
            className="mb-md-0 mb-1"
            as={Col}
            md="2"
            controlId="endTime"
          >
            <Form.Select
              required
              name="endTime"
              value={eventTimings.endTime}
              onChange={handleDateChange}
            >
              <option value="">Select</option>
              {HALF_AN_HOUR_SLOTS.map((slot) => (
                <option value={slot} key={slot}>
                  {slot}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Row className="mb-3 g-0">
          <Form.Group
            className="mb-md-0 mb-1"
            as={Col}
            md={9}
            controlId="description"
          >
            <Form.Control
              required
              as="textarea"
              name="description"
              placeholder="Add description here"
              value={bookingData.description}
              onChange={handleFormChange}
              style={{ height: "100px" }}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3 g-0">
          <Form.Group className="mb-md-0 mb-1" as={Col} md="2">
            <Form.Label className="fs-7 text-gray">Reccurence</Form.Label>
            <Form.Select
              required
              value={bookingData.repeatFrequency}
              name="repeatFrequency"
              onChange={handleFormChange}
            >
              <option value="">Select</option>
              {REPEAT_FREQUENCIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {showReccurenceEndDate && (
            <Form.Group
              className="mb-2 ms-4"
              as={Col}
              md="2"
              controlId="repeatEndDate"
            >
              <Form.Label className="fs-7 text-gray">Ends At</Form.Label>
              <Form.Control
                required
                name="repeatEndDate"
                type="date"
                min={today}
                value={bookingData.repeatEndDate}
                onChange={handleFormChange}
              />
            </Form.Group>
          )}
          {showDaysToChoose && (
            <Form.Group
              className="mb-2 ms-4"
              as={Col}
              md="4"
              controlId="repeatedDays"
            >
              <Form.Label className="fs-7 text-gray">Repeated On</Form.Label>
              <div>
                {selectedDays.map((day) => (
                  <DayPicker
                    key={day.value}
                    day={day.value}
                    active={day.selected}
                    handleSelect={handleDaySelect}
                  />
                ))}
              </div>
            </Form.Group>
          )}
          {/* <RepeatBookingModal show={show} handleClose={handleClose} /> */}
        </Row>
        <Row className="mb-3 g-0">
          <Form.Group className="mb-md-0 mb-1" as={Col} md="2">
            <Form.Label className="fs-7 text-gray">Category</Form.Label>
            <Form.Select
              required
              name="category"
              value={bookingData.category}
              onChange={handleFormChange}
            >
              <option value={""}>Select</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-md-0 mb-1 ms-md-4" as={Col} md="2">
            <Form.Label className="fs-7 text-gray">Max Participants</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={bookingData.maxParticipants}
              onChange={handleFormChange}
              name="maxParticipants"
            ></Form.Control>
          </Form.Group>
        </Row>
        <Row className="mb-3 g-0">
          <Form.Group
            as={Col}
            md={2}
            className="d-flex align-items-center mb-2"
            controlId="location"
          >
            Online meeting
            <Form.Check
              type="switch"
              checked={bookingData.location.onlineMode}
              onChange={handleFormChange}
              name="onlineMode"
              className="d-inline mx-2"
            />
          </Form.Group>
          {!bookingData.location.onlineMode && (
            <Form.Group
              className="mb-md-0 mb-1"
              as={Col}
              md={6}
              controlId="location"
            >
              <Form.Control
                type="text"
                placeholder="Add location"
                name="address"
                value={bookingData.location.address}
                onChange={handleFormChange}
              />
            </Form.Group>
          )}
          {bookingData.location.onlineMode && (
            <Form.Group
              className="mb-1 mb-md-0"
              as={Col}
              md={6}
              controlId="meetingLink"
            >
              <Form.Control
                type="text"
                placeholder="Meeting Link"
                name="meetingLink"
                value={bookingData.location.meetingLink}
                onChange={handleFormChange}
              />
            </Form.Group>
          )}
        </Row>
        <Row className="mb-3 g-0">
          <Form.Label>Subslot Info</Form.Label>
          <Form.Group
            className="mb-2"
            as={Col}
            md="2"
            controlId="validationCustom04"
          >
            <Form.Label className="fs-7 text-gray">Duration</Form.Label>
            <Form.Select
              name="duration"
              value={bookingData.subSlotInfo.duration}
              onChange={handleFormChange}
            >
              <option value="">Select</option>
              {SUB_SLOT_DURATIONS.map((item) => (
                <option value={item.value} key={item.label}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group
            className="mb-2 ms-4"
            as={Col}
            md="2"
            controlId="validationCustom04"
          >
            <Form.Label className="fs-7 text-gray">Buffer</Form.Label>
            <Form.Select
              name="buffer"
              value={bookingData.subSlotInfo.buffer}
              onChange={handleFormChange}
            >
              <option value="">Select</option>
              {BUFFER_DURATIONS.map((item) => (
                <option value={item.value} key={item.label}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Button type="submit">Create Booking</Button>
      </Form>
    </Container>
  );
}

export default AddBooking;
