package com.perfumeria.proveedores.service;

import com.perfumeria.proveedores.dto.SuministroDTO;
import com.perfumeria.proveedores.exception.BadRequestException;
import com.perfumeria.proveedores.exception.ResourceNotFoundException;
import com.perfumeria.proveedores.model.Proveedor;
import com.perfumeria.proveedores.model.Suministro;
import com.perfumeria.proveedores.repository.ProveedorRepository;
import com.perfumeria.proveedores.repository.SuministroRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuministroServiceImpl implements SuministroService {

    private final SuministroRepository suministroRepository;
    private final ProveedorRepository proveedorRepository;
    private final ModelMapper modelMapper;
    
    @Autowired
    public SuministroServiceImpl(SuministroRepository suministroRepository,
                                ProveedorRepository proveedorRepository,
                                ModelMapper modelMapper) {
        this.suministroRepository = suministroRepository;
        this.proveedorRepository = proveedorRepository;
        this.modelMapper = modelMapper;
    }
    
    @Override
    public List<SuministroDTO> getAllSuministros() {
        return suministroRepository.findAll().stream()
                .map(suministro -> {
                    SuministroDTO dto = modelMapper.map(suministro, SuministroDTO.class);
                    dto.setProveedorId(suministro.getProveedor().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public SuministroDTO getSuministroById(Long id) {
        Suministro suministro = suministroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suministro", "id", id));
                
        SuministroDTO dto = modelMapper.map(suministro, SuministroDTO.class);
        dto.setProveedorId(suministro.getProveedor().getId());
        return dto;
    }
    
    @Override
    public SuministroDTO createSuministro(SuministroDTO suministroDTO) {
        // Verificar que exista el proveedor
        Proveedor proveedor = proveedorRepository.findById(suministroDTO.getProveedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", suministroDTO.getProveedorId()));
        
        // Verificar que no exista un suministro con el mismo código para este proveedor
        if (suministroRepository.existsByProveedorIdAndProductoCodigo(
                suministroDTO.getProveedorId(), suministroDTO.getProductoCodigo())) {
            throw new BadRequestException("Ya existe un suministro con el código " + 
                    suministroDTO.getProductoCodigo() + " para este proveedor");
        }
        
        Suministro suministro = modelMapper.map(suministroDTO, Suministro.class);
        suministro.setId(null); // Asegurar que es una creación, no una actualización
        suministro.setProveedor(proveedor);
        
        suministro = suministroRepository.save(suministro);
        
        SuministroDTO createdDTO = modelMapper.map(suministro, SuministroDTO.class);
        createdDTO.setProveedorId(proveedor.getId());
        return createdDTO;
    }
    
    @Override
    public SuministroDTO updateSuministro(Long id, SuministroDTO suministroDTO) {
        Suministro existingSuministro = suministroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suministro", "id", id));
        
        // Verificar si se está cambiando el proveedor
        if (!existingSuministro.getProveedor().getId().equals(suministroDTO.getProveedorId())) {
            Proveedor newProveedor = proveedorRepository.findById(suministroDTO.getProveedorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", suministroDTO.getProveedorId()));
                    
            existingSuministro.setProveedor(newProveedor);
        }
        
        // Verificar si se está cambiando el código y si ya existe para el proveedor
        if (!existingSuministro.getProductoCodigo().equals(suministroDTO.getProductoCodigo()) &&
                suministroRepository.existsByProveedorIdAndProductoCodigo(
                        suministroDTO.getProveedorId(), suministroDTO.getProductoCodigo())) {
            throw new BadRequestException("Ya existe un suministro con el código " + 
                    suministroDTO.getProductoCodigo() + " para este proveedor");
        }
        
        // Actualizar propiedades
        existingSuministro.setProductoNombre(suministroDTO.getProductoNombre());
        existingSuministro.setProductoCodigo(suministroDTO.getProductoCodigo());
        existingSuministro.setPrecioUnitario(suministroDTO.getPrecioUnitario());
        existingSuministro.setTiempoEntregaDias(suministroDTO.getTiempoEntregaDias());
        
        existingSuministro = suministroRepository.save(existingSuministro);
        
        SuministroDTO updatedDTO = modelMapper.map(existingSuministro, SuministroDTO.class);
        updatedDTO.setProveedorId(existingSuministro.getProveedor().getId());
        return updatedDTO;
    }
    
    @Override
    public void deleteSuministro(Long id) {
        Suministro suministro = suministroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suministro", "id", id));
                
        suministroRepository.delete(suministro);
    }
    
    @Override
    public List<SuministroDTO> getSuministrosByTiempoEntrega() {
        return suministroRepository.findAllByOrderByTiempoEntregaDiasAsc().stream()
                .map(suministro -> {
                    SuministroDTO dto = modelMapper.map(suministro, SuministroDTO.class);
                    dto.setProveedorId(suministro.getProveedor().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}