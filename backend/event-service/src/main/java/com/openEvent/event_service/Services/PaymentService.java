package com.openEvent.event_service.Services;

import com.openEvent.event_service.Entities.Payment;
import com.openEvent.event_service.Repositories.PaymentRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepositoryInterface paymentRepository;

    public Payment initiatePayment(Long userId, Long eventId, BigDecimal amount, String paymentMethod) {
        Payment payment = new Payment(userId, eventId, amount, paymentMethod);
        payment.setTransactionId(generateTransactionId());
        
        // Simulate payment processing logic here
        // In a real implementation, you would integrate with a payment gateway
        
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
        Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
        if (paymentOptional.isPresent()) {
            Payment payment = paymentOptional.get();
            payment.setStatus(status);
            payment.setUpdatedAt(LocalDateTime.now());
            
            if (status == Payment.PaymentStatus.FAILED && failureReason != null) {
                payment.setFailureReason(failureReason);
            }
            
            return paymentRepository.save(payment);
        }
        throw new RuntimeException("Payment not found with id: " + paymentId);
    }

    public Payment processRefund(Long paymentId) {
        Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
        if (paymentOptional.isPresent()) {
            Payment payment = paymentOptional.get();
            
            if (payment.getStatus() != Payment.PaymentStatus.SUCCESS) {
                throw new RuntimeException("Cannot refund payment that is not successful");
            }
            
            // Simulate refund processing logic
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            payment.setUpdatedAt(LocalDateTime.now());
            
            return paymentRepository.save(payment);
        }
        throw new RuntimeException("Payment not found with id: " + paymentId);
    }

    public Payment.PaymentStatus getPaymentStatus(Long paymentId) {
        Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
        if (paymentOptional.isPresent()) {
            return paymentOptional.get().getStatus();
        }
        throw new RuntimeException("Payment not found with id: " + paymentId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    private String generateTransactionId() {
        return "TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}