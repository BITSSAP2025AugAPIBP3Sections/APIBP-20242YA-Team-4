package com.openEvent.event_service.DTO;

public class BookingResult {
    private boolean success;
    private Long ticketId;
    private Long paymentId;
    private String message;
    private BookingResult() {
    }

    public static BookingResult success(Long ticketId, Long paymentId) {
        BookingResult r = new BookingResult();
        r.success = true;
        r.ticketId = ticketId;
        r.paymentId = paymentId;
        r.message = "Booking succeeded";
        return r;
    }

    public static BookingResult failure(String message) {
        BookingResult r = new BookingResult();
        r.success = false;
        r.message = message;
        return r;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}