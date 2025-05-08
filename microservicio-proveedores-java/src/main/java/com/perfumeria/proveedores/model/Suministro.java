package com.perfumeria.proveedores.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"proveedor_id", "producto_codigo"})})
public class Suministro {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String productoNombre;
    private String productoCodigo;
    private double precioUnitario;
    private int tiempoEntregaDias = 7;
    
    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    @JsonIgnore
    private Proveedor proveedor;
}