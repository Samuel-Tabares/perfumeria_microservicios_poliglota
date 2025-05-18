package com.perfumeria.proveedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorSimpleDTO {
    private Long id;
    private String nombreEmpresa;
    private String contactoNombre;
    private String contactoEmail;
    private Boolean activo;
}