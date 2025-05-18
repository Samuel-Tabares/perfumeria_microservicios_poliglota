package com.perfumeria.proveedores.service;

import com.perfumeria.proveedores.dto.ProveedorDTO;
import com.perfumeria.proveedores.dto.ProveedorSimpleDTO;
import com.perfumeria.proveedores.dto.SuministroDTO;

import java.util.List;

public interface ProveedorService {
    
    List<ProveedorSimpleDTO> getAllProveedores();
    
    ProveedorDTO getProveedorById(Long id);
    
    ProveedorDTO createProveedor(ProveedorDTO proveedorDTO);
    
    ProveedorDTO updateProveedor(Long id, ProveedorDTO proveedorDTO);
    
    void deleteProveedor(Long id);
    
    List<SuministroDTO> getSuministrosByProveedorId(Long proveedorId);
    
    List<ProveedorSimpleDTO> getProveedoresActivos();
}