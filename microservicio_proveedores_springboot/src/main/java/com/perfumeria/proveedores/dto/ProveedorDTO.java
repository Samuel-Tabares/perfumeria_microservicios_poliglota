package com.perfumeria.proveedores.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorDTO {
    private Long id;
    private String nombreEmpresa;
    private String contactoNombre;
    private String contactoEmail;
    private String telefono;
    private String direccion;
    private LocalDateTime fechaRegistro;
    private Boolean activo;
    private List<SuministroDTO> suministros = new ArrayList<>();
}