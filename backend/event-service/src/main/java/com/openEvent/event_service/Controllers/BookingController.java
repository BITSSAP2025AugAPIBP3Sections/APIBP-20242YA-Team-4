package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Services.BookingSagaService;
import com.openEvent.event_service.DTO.BookingRequest;
import com.openEvent.event_service.DTO.BookingResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    @Autowired
    private BookingSagaService bookingSagaService;

    @PostMapping
    @Operation(summary = "Book ticket", description = "Book a ticket for an event using the booking saga pattern. Returns booking result with status and details.")
    public ResponseEntity<BookingResult> bookTicket(@RequestBody BookingRequest request) {
        BookingResult result = bookingSagaService.bookTicket(
                request.getUserId(),
                request.getEventId(),
                request.getSeatNumber(),
                request.getPrice(),
                request.getPaymentMethod()
        );
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
}