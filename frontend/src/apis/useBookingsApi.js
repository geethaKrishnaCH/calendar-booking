import apiClient from "./config/axiosConfi";
const useBookingsApi = () => {
  const getUpcomingBookings = (startDate, endDate, category) =>
    apiClient.get(
      `booking/upcoming?startDate=${startDate}&endDate=${endDate}&category=${category}`
    );
  const getBookingDetails = (bookingId) =>
    apiClient.get(`booking/${bookingId}`);
  const addBooking = (payload) => apiClient.post("booking/add", payload);
  const getBookingParticipants = (bookingId) =>
    apiClient.get(`booking/${bookingId}/participants`);
  return {
    getUpcomingBookings,
    getBookingDetails,
    addBooking,
    getBookingParticipants,
  };
};

export default useBookingsApi;
