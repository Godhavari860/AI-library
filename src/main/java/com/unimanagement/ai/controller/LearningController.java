package com.unimanagement.ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LearningController {

    @GetMapping("/learning")
    public String learningPage() {
        return "learning";
    }
}
