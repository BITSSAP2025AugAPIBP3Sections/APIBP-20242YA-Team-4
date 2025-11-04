package com.openEvent.event_service.Repositories;

import com.openEvent.event_service.Entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepositoryInterface extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
    List<Payment> findByEventId(Long eventId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
}