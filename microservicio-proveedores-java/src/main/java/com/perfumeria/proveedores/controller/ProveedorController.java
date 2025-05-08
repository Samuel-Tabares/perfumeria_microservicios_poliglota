package com.perfumeria.proveedores.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {
    
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> listarProveedores() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lista de proveedores funcionando");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerProveedor(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Proveedor " + id + " encontrado");
        return ResponseEntity.ok(response);
    }
        @PostMapping("")  // Asegúrate que este método exista y esté bien configurado
        public ResponseEntity<Map<String, Object>> crearProveedor(@RequestBody Map<String, Object> proveedor) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Proveedor creado correctamente");
            response.put("proveedor", proveedor);
            return ResponseEntity.ok(response);
        }
    }