package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Payment;
import com.openEvent.event_service.Services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment initiated successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Payment.class))),
        @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\n" +
                       "  \"userId\": 1,\n" +
                       "  \"eventId\": 1,\n" +
                       "  \"amount\": 100.50,\n" +
                       "  \"paymentMethod\": \"CREDIT_CARD\"\n" +
                       "}"
            )
        )
    )
    public ResponseEntity<?> initiatePayment(@org.springframework.web.bind.annotation.RequestBody Map<String, Object> paymentRequest) {
        try {
            Long userId = Long.valueOf(paymentRequest.get("userId").toString());
            Long eventId = Long.valueOf(paymentRequest.get("eventId").toString());
            BigDecimal amount = new BigDecimal(paymentRequest.get("amount").toString());
            String paymentMethod = paymentRequest.get("paymentMethod").toString();

            Payment payment = paymentService.initiatePayment(userId, eventId, amount, paymentMethod);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to initiate payment: " + e.getMessage()));
        }
    }

    @GetMapping("/status/{paymentId}")
    public ResponseEntity<?> checkPaymentStatus(@PathVariable Long paymentId) {
        try {
            Payment.PaymentStatus status = paymentService.getPaymentStatus(paymentId);
            return ResponseEntity.ok(Map.of("paymentId", paymentId, "status", status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Payment not found"));
        }
    }

    @GetMapping("/{paymentId}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment retrieved successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Payment.class))),
        @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    public ResponseEntity<?> getPaymentById(@PathVariable Long paymentId) {
        try {
            Optional<Payment> payment = paymentService.getPaymentById(paymentId);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Payment not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch payment: " + e.getMessage()));
        }
    }

    @PostMapping("/refund/{paymentId}")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Refund processed successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Payment.class))),
        @ApiResponse(responseCode = "400", description = "Bad request")
    })
    public ResponseEntity<?> initiateRefund(@PathVariable Long paymentId) {
        try {
            Payment refundedPayment = paymentService.processRefund(paymentId);
            return ResponseEntity.ok(refundedPayment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to process refund: " + e.getMessage()));
        }
    }

    @PatchMapping("/{paymentId}/status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment status updated successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Payment.class))),
        @ApiResponse(responseCode = "400", description = "Invalid payment status"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = "{\n" +
                       "  \"status\": \"SUCCESS\",\n" +
                       "  \"failureReason\": \"Optional failure reason if status is FAILED\"\n" +
                       "}"
            )
        )
    )
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long paymentId,
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> statusUpdate) {
        try {
            String statusStr = statusUpdate.get("status");
            String failureReason = statusUpdate.get("failureReason");
            
            Payment.PaymentStatus status = Payment.PaymentStatus.valueOf(statusStr.toUpperCase());
            Payment updatedPayment = paymentService.updatePaymentStatus(paymentId, status, failureReason);
            
            return ResponseEntity.ok(updatedPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid payment status"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update payment status: " + e.getMessage()));
        }
    }
}