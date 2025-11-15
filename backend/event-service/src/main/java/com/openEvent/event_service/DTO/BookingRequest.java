package com.openEvent.event_service.DTO;

public class BookingRequest {
    private Long userId;
    private Long eventId;
    private String seatNumber;
    private Double price;
    private String paymentMethod;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BookingRequest(Long userId, Long eventId, String seatNumber, Double price, String paymentMethod) {
        this.userId = userId;
        this.eventId = eventId;
        this.seatNumber = seatNumber;
        this.price = price;
        this.paymentMethod = paymentMethod;
    }
}