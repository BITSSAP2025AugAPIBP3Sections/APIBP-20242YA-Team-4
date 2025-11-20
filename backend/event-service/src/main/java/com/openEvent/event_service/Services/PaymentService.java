package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Payment;
import com.openEvent.event_service.Repositories.EventRepositoryInterface;
import com.openEvent.event_service.Repositories.PaymentRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepositoryInterface paymentRepository;

    @Autowired
    private EventRepositoryInterface eventRepositoryInterface;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public Payment initiatePayment(Long userId, Long eventId, BigDecimal amount, String paymentMethod) {
        // Check if event exists
        boolean eventExists = eventRepositoryInterface.existsById(eventId);
        if (!eventExists) {
            throw new RuntimeException("Event not found with id: " + eventId);
        }

        Payment payment = new Payment(userId, eventId, amount, paymentMethod);
        payment.setTransactionId(generateTransactionId());
        payment.setStatus(Payment.PaymentStatus.SUCCESS); // Auto-approve for demo
        Payment saved = paymentRepository.save(payment);
        
        // Send Kafka notification for successful payment
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("userId", userId);
            notification.put("eventId", eventId);
            notification.put("message", "Payment successful!");
            notification.put("type", "success");
            
            kafkaTemplate.send("payment-notifications", notification);
        } catch (Exception e) {
            // Kafka send failed - log or handle silently
        }
        
        return saved;
    }

    /**
     * Process a payment for the given paymentId.
     * Simulates success or failure depending on conditions (e.g., paymentMethod, amount).
     */
    public Payment processPayment(Long paymentId) {
        Optional<Payment> optional = paymentRepository.findById(paymentId);
        if (!optional.isPresent()) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }

        Payment payment = optional.get();


        if ("FAIL_CARD".equalsIgnoreCase(payment.getPaymentMethod())
                || payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason("Simulated payment failure because method is invalid or amount <= 0");
        } else {
            double random = Math.random();
            if (random < 0.05) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Random network error");
            } else {
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
            }
        }

        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public List<Payment> getPaymentsByEventId(Long eventId) {
        return paymentRepository.findByEventId(eventId);
    }

    public Payment updatePaymentStatus(Long paymentId, Payment.PaymentStatus status, String failureReason) {
        Optional<Payment> optional = paymentRepository.findById(paymentId);
        if (!optional.isPresent()) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        Payment payment = optional.get();
        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        if (status == Payment.PaymentStatus.FAILED && failureReason != null) {
            payment.setFailureReason(failureReason);
        }
        return paymentRepository.save(payment);
    }

    public Payment processRefund(Long paymentId) {
        Optional<Payment> optional = paymentRepository.findById(paymentId);
        if (!optional.isPresent()) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        Payment payment = optional.get();
        if (payment.getStatus() != Payment.PaymentStatus.SUCCESS) {
            throw new RuntimeException("Cannot refund payment that is not successful");
        }
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public Payment.PaymentStatus getPaymentStatus(Long paymentId) {
        Optional<Payment> optional = paymentRepository.findById(paymentId);
        if (!optional.isPresent()) {
            throw new RuntimeException("Payment not found with id: " + paymentId);
        }
        return optional.get().getStatus();
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    private String generateTransactionId() {
        return "TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}