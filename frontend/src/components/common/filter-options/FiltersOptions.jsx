import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { convertDateToString } from "../../../util/date-utils";
import AppContext from "../../context/AppContext";

const FilterOptions = ({ onApply }) => {
  const [startDate, setStartDate] = useState(convertDateToString(new Date()));
  const [endDate, setEndDate] = useState(
    convertDateToString(new Date(new Date().setDate(new Date().getDate() + 7)))
  );
  const [category, setCategory] = useState("");
  const { categories } = useContext(AppContext);

  useEffect(() => {
    sendFilters();
  }, []);

  const handleStartDateChange = (e) => {
    if (!e.target.value) {
      setStartDate("");
      return;
    }
    const newStartDateString = e.target.value;
    setStartDate(newStartDateString);
    const newStartDate = new Date(newStartDateString);
    const endDate_ = new Date(endDate);
    if (newStartDate > endDate_) setEndDate(newStartDateString);
  };

  const handleEndDateChange = (e) => {
    if (!e.target.value) {
      setEndDate("");
      return;
    }

    setEndDate(e.target.value);
  };

  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    setCategory(e.target.value);
  };

  const checkFormValid = () => {
    if (!!startDate && !!endDate) return true;
    else return false;
  };

  const sendFilters = () => {
    const filters = { startDate, endDate, category };
    onApply(filters);
  };

  const today = convertDateToString(new Date());
  const isFormValid = checkFormValid();
  return (
    <Container fluid className="px-5 py-2 shadow-sm">
      <Form as={Row} className="d-flex justify-content-center">
        <Form.Group as={Col} md="4" className="mb-2">
          <Form.Label>Date Range</Form.Label>
          <InputGroup>
            <Form.Control
              type="date"
              min={today}
              value={startDate}
              onChange={handleStartDateChange}
            />
            <InputGroup.Text>to</InputGroup.Text>
            <Form.Control
              type="date"
              min={startDate ? startDate : today}
              value={endDate}
              onChange={handleEndDateChange}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="2" className="mb-2">
          <Form.Label>Category</Form.Label>
          <Form.Select value={category} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="1" className="d-flex align-items-end mb-2">
          <Button disabled={!isFormValid} onClick={sendFilters}>
            Apply
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default FilterOptions;
