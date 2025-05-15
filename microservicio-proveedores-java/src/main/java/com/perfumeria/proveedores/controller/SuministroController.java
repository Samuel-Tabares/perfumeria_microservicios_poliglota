package com.perfumeria.proveedores.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/suministros")
@CrossOrigin(origins = "*")
public class SuministroController {
    
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> listarSuministros() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lista de suministros funcionando");
        response.put("results", new ArrayList<>());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerSuministro(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Suministro " + id + " encontrado");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/por_tiempo_entrega")
    public ResponseEntity<Map<String, Object>> listarPorTiempoEntrega() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Suministros ordenados por tiempo de entrega");
        response.put("results", new ArrayList<>());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> crearSuministro(@RequestBody Map<String, Object> suministro) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Suministro creado correctamente");
        response.put("suministro", suministro);
        return ResponseEntity.ok(response);
    }
}