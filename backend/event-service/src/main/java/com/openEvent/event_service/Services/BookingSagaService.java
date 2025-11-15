package com.openEvent.event_service.Services;

import com.openEvent.event_service.DTO.BookingResult;
import com.openEvent.event_service.Entities.Payment;
import com.openEvent.event_service.Entities.Ticket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class BookingSagaService {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private NotificationService notificationService; 


        public BookingResult bookTicket(Long userId, Long eventId, String seatNumber, Double price, String paymentMethod) {

            // Step 1: create ticket in pending state
            Ticket pendingTicket = new Ticket();
            pendingTicket.setUserId(userId);
            pendingTicket.setEventId(eventId);
            pendingTicket.setSeatNumber(seatNumber);
            pendingTicket.setPrice(price);
            pendingTicket.setStatus("PENDING");
            Ticket ticket = ticketService.bookTicket(pendingTicket);

            try {
                // Step 2: initiate payment
                Payment payment = paymentService.initiatePayment(userId, eventId, BigDecimal.valueOf(price), paymentMethod);

                // Step 3: process payment (simulate success / failure)
                payment = paymentService.processPayment(payment.getId());

                if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
                    // Step 4: payment succeeded → update ticket
                    ticketService.updateStatus(ticket.getId(), "BOOKED");
                    // Step 5: send success notification
                    notificationService.sendBookingNotification(userId,
                            "Ticket Booked",
                            "Your ticket for event " + eventId + " has been successfully booked. Ticket id: " + ticket.getId());

                    return BookingResult.success(ticket.getId(), payment.getId());

                } else {
                    // payment failed
                    throw new RuntimeException("Payment failed: " + payment.getFailureReason());
                }

            } catch (Exception ex) {
                // Compensation: cancel ticket
                ticketService.updateStatus(ticket.getId(), "CANCELLED");
                notificationService.sendBookingNotification(userId,
                        "Booking Failed",
                        "Booking for event " + eventId + " failed: " + ex.getMessage());
                return BookingResult.failure(ex.getMessage());
            }
        }
    }