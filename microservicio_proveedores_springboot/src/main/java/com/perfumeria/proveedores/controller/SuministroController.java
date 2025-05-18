package com.perfumeria.proveedores.controller;

import com.perfumeria.proveedores.dto.SuministroDTO;
import com.perfumeria.proveedores.service.SuministroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suministros")
@Tag(name = "Suministro", description = "API para gestionar suministros")
public class SuministroController {

    private final SuministroService suministroService;
    
    @Autowired
    public SuministroController(SuministroService suministroService) {
        this.suministroService = suministroService;
    }
    
    @GetMapping
    @Operation(summary = "Obtener todos los suministros", description = "Obtiene la lista completa de suministros")
    public ResponseEntity<List<SuministroDTO>> getAllSuministros() {
        return ResponseEntity.ok(suministroService.getAllSuministros());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un suministro por ID", description = "Obtiene un suministro específico")
    public ResponseEntity<SuministroDTO> getSuministroById(@PathVariable Long id) {
        return ResponseEntity.ok(suministroService.getSuministroById(id));
    }
    
    @PostMapping
    @Operation(summary = "Crear un nuevo suministro", description = "Crea un nuevo suministro en el sistema")
    public ResponseEntity<SuministroDTO> createSuministro(@Valid @RequestBody SuministroDTO suministroDTO) {
        return new ResponseEntity<>(suministroService.createSuministro(suministroDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un suministro", description = "Actualiza los datos de un suministro existente")
    public ResponseEntity<SuministroDTO> updateSuministro(
            @PathVariable Long id,
            @Valid @RequestBody SuministroDTO suministroDTO) {
        return ResponseEntity.ok(suministroService.updateSuministro(id, suministroDTO));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un suministro", description = "Elimina un suministro del sistema")
    public ResponseEntity<Void> deleteSuministro(@PathVariable Long id) {
        suministroService.deleteSuministro(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/por-tiempo-entrega")
    @Operation(summary = "Obtener suministros por tiempo de entrega", 
               description = "Obtiene la lista de suministros ordenados por tiempo de entrega")
    public ResponseEntity<List<SuministroDTO>> getSuministrosByTiempoEntrega() {
        return ResponseEntity.ok(suministroService.getSuministrosByTiempoEntrega());
    }
}