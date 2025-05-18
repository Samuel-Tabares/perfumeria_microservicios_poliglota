package com.perfumeria.proveedores.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "proveedor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre de la empresa es obligatorio")
    @Size(max = 100, message = "El nombre de la empresa no puede exceder los 100 caracteres")
    @Column(name = "nombre_empresa", nullable = false, length = 100)
    private String nombreEmpresa;
    
    @NotBlank(message = "El nombre del contacto es obligatorio")
    @Size(max = 100, message = "El nombre del contacto no puede exceder los 100 caracteres")
    @Column(name = "contacto_nombre", nullable = false, length = 100)
    private String contactoNombre;
    
    @NotBlank(message = "El email del contacto es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Column(name = "contacto_email", nullable = false)
    private String contactoEmail;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 15, message = "El teléfono no puede exceder los 15 caracteres")
    @Column(nullable = false, length = 15)
    private String telefono;
    
    @NotBlank(message = "La dirección es obligatoria")
    @Column(nullable = false)
    private String direccion;
    
    @CreationTimestamp
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;
    
    @Column(nullable = false)
    private Boolean activo = true;
    
    @OneToMany(mappedBy = "proveedor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Suministro> suministros = new ArrayList<>();
}
