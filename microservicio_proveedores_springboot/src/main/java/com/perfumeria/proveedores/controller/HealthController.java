package com.perfumeria.proveedores.controller;

import com.perfumeria.proveedores.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> healthCheck() {
        HealthResponse response = new HealthResponse(
            "ok",
            "proveedores-service",
            LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }
}