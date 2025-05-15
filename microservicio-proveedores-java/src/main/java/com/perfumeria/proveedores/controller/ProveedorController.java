package com.perfumeria.proveedores.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {
    
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> listarProveedores() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lista de proveedores funcionando");
        response.put("results", new ArrayList<>());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerProveedor(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Proveedor " + id + " encontrado");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/suministros")
    public ResponseEntity<Map<String, Object>> obtenerSuministrosProveedor(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Suministros del proveedor " + id);
        response.put("proveedorId", id);
        response.put("results", new ArrayList<>());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/activos")
    public ResponseEntity<Map<String, Object>> listarProveedoresActivos() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lista de proveedores activos");
        response.put("results", new ArrayList<>());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> crearProveedor(@RequestBody Map<String, Object> proveedor) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Proveedor creado correctamente");
        response.put("proveedor", proveedor);
        return ResponseEntity.ok(response);
    }
}