package com.unimanagement.ai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookController {

    @GetMapping("/api/books")
    public String books() {
        return "AI Library Books Backend API is Working!";
    }
}