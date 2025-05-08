package com.perfumeria.proveedores.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proveedor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombreEmpresa;
    private String contactoNombre;
    private String contactoEmail;
    private String telefono;
    private String direccion;
    
    private LocalDateTime fechaRegistro = LocalDateTime.now();
    private boolean activo = true;
    
    @OneToMany(mappedBy = "proveedor", cascade = CascadeType.ALL)
    private List<Suministro> suministros;
}