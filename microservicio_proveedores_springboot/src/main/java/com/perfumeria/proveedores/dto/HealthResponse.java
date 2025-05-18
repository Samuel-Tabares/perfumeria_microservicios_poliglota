package com.perfumeria.proveedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthResponse {
    private String status;
    private String service;
    private LocalDateTime timestamp;
}