package com.perfumeria.proveedores.service;

import com.perfumeria.proveedores.dto.SuministroDTO;

import java.util.List;

public interface SuministroService {
    
    List<SuministroDTO> getAllSuministros();
    
    SuministroDTO getSuministroById(Long id);
    
    SuministroDTO createSuministro(SuministroDTO suministroDTO);
    
    SuministroDTO updateSuministro(Long id, SuministroDTO suministroDTO);
    
    void deleteSuministro(Long id);
    
    List<SuministroDTO> getSuministrosByTiempoEntrega();
}