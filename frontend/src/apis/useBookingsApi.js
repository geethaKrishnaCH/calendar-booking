import apiClient from "./config/axiosConfig";
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
  const joinBooking = (payload) => apiClient.post("userBooking/add", payload);
  const getUpcomingUserBookings = (startDate, endDate, category) =>
    apiClient.get(
      `user/bookings/upcoming?startDate=${startDate}&endDate=${endDate}&category=${category}`
    );
  const getBookingBookedByUser = (startDate, endDate, category) =>
    apiClient.get(
      `userBooking?startDate=${startDate}&endDate=${endDate}&category=${category}`
    );
  return {
    getUpcomingBookings,
    getBookingDetails,
    addBooking,
    getBookingParticipants,
    joinBooking,
    getUpcomingUserBookings,
    getBookingBookedByUser,
  };
};

export default useBookingsApi;
