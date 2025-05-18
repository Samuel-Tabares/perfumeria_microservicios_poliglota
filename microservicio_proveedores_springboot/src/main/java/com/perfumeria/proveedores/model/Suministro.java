package com.perfumeria.proveedores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "suministro", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"proveedor_id", "producto_codigo"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Suministro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;
    
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 100, message = "El nombre del producto no puede exceder los 100 caracteres")
    @Column(name = "producto_nombre", nullable = false, length = 100)
    private String productoNombre;
    
    @NotBlank(message = "El código del producto es obligatorio")
    @Size(max = 50, message = "El código del producto no puede exceder los 50 caracteres")
    @Column(name = "producto_codigo", nullable = false, length = 50)
    private String productoCodigo;
    
    @DecimalMin(value = "0.01", message = "El precio unitario debe ser mayor que cero")
    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    
    @Min(value = 1, message = "El tiempo de entrega debe ser al menos 1 día")
    @Column(name = "tiempo_entrega_dias", nullable = false)
    private Integer tiempoEntregaDias = 7;
}