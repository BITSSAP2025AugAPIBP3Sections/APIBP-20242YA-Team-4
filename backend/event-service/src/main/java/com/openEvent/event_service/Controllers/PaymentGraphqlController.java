package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.Payment;
import com.openEvent.event_service.Services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class PaymentGraphqlController {

    @Autowired
    private PaymentService paymentService;

    @QueryMapping
    public Optional<Payment> payment(@Argument Long id) {
        return paymentService.getPaymentById(id);
    }

    @QueryMapping
    public List<Payment> paymentsByUser(@Argument Long userId) {
        return paymentService.getPaymentsByUserId(userId);
    }

    @MutationMapping
    public Payment refundPayment(@Argument Long id) {
        return paymentService.processRefund(id);
    }
}