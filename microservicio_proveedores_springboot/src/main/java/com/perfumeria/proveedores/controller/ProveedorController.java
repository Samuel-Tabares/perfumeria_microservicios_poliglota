package com.perfumeria.proveedores.controller;

import com.perfumeria.proveedores.dto.ProveedorDTO;
import com.perfumeria.proveedores.dto.ProveedorSimpleDTO;
import com.perfumeria.proveedores.dto.SuministroDTO;
import com.perfumeria.proveedores.service.ProveedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@Tag(name = "Proveedor", description = "API para gestionar proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;
    
    @Autowired
    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }
    
    @GetMapping
    @Operation(summary = "Obtener todos los proveedores", description = "Obtiene una lista simplificada de todos los proveedores")
    public ResponseEntity<List<ProveedorSimpleDTO>> getAllProveedores() {
        return ResponseEntity.ok(proveedorService.getAllProveedores());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un proveedor por ID", description = "Obtiene un proveedor específico con sus suministros")
    public ResponseEntity<ProveedorDTO> getProveedorById(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.getProveedorById(id));
    }
    
    @PostMapping
    @Operation(summary = "Crear un nuevo proveedor", description = "Crea un nuevo proveedor en el sistema")
    public ResponseEntity<ProveedorDTO> createProveedor(@Valid @RequestBody ProveedorDTO proveedorDTO) {
        return new ResponseEntity<>(proveedorService.createProveedor(proveedorDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un proveedor", description = "Actualiza los datos de un proveedor existente")
    public ResponseEntity<ProveedorDTO> updateProveedor(
            @PathVariable Long id,
            @Valid @RequestBody ProveedorDTO proveedorDTO) {
        return ResponseEntity.ok(proveedorService.updateProveedor(id, proveedorDTO));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un proveedor", description = "Elimina un proveedor y todos sus suministros")
    public ResponseEntity<Void> deleteProveedor(@PathVariable Long id) {
        proveedorService.deleteProveedor(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/suministros")
    @Operation(summary = "Obtener suministros de un proveedor", description = "Obtiene todos los suministros de un proveedor específico")
    public ResponseEntity<List<SuministroDTO>> getSuministrosByProveedor(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.getSuministrosByProveedorId(id));
    }
    
    @GetMapping("/activos")
    @Operation(summary = "Obtener proveedores activos", description = "Obtiene una lista de todos los proveedores activos")
    public ResponseEntity<List<ProveedorSimpleDTO>> getProveedoresActivos() {
        return ResponseEntity.ok(proveedorService.getProveedoresActivos());
    }
}