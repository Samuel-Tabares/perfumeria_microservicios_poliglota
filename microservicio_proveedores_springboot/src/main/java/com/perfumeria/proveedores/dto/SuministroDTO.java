package com.perfumeria.proveedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuministroDTO {
    private Long id;
    private Long proveedorId;
    private String productoNombre;
    private String productoCodigo;
    private BigDecimal precioUnitario;
    private Integer tiempoEntregaDias;
}