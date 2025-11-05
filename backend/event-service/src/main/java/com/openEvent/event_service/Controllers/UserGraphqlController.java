package com.openEvent.event_service.Controllers;

import com.openEvent.event_service.Entities.User;
import com.openEvent.event_service.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class UserGraphqlController {

    @Autowired
    private UserService userService;

    @QueryMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @QueryMapping
    public Optional<User> getUserById(@Argument Long id) {
        return userService.getUserById(id);
    }

    @QueryMapping
    public User getUserByUsername(@Argument String username) {
        return userService.getUserByUsername(username);
    }

    @QueryMapping
    public Optional<User> getUserByEmail(@Argument String email) {
        return userService.getUserByEmail(email);
    }
}