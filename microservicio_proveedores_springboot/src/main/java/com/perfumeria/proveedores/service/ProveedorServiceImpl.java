package com.perfumeria.proveedores.service;

import com.perfumeria.proveedores.dto.ProveedorDTO;
import com.perfumeria.proveedores.dto.ProveedorSimpleDTO;
import com.perfumeria.proveedores.dto.SuministroDTO;
import com.perfumeria.proveedores.exception.BadRequestException;
import com.perfumeria.proveedores.exception.ResourceNotFoundException;
import com.perfumeria.proveedores.model.Proveedor;
import com.perfumeria.proveedores.repository.ProveedorRepository;
import com.perfumeria.proveedores.repository.SuministroRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProveedorServiceImpl implements ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final SuministroRepository suministroRepository;
    private final ModelMapper modelMapper;
    
    @Autowired
    public ProveedorServiceImpl(ProveedorRepository proveedorRepository, 
                               SuministroRepository suministroRepository,
                               ModelMapper modelMapper) {
        this.proveedorRepository = proveedorRepository;
        this.suministroRepository = suministroRepository;
        this.modelMapper = modelMapper;
    }
    
    @Override
    public List<ProveedorSimpleDTO> getAllProveedores() {
        return proveedorRepository.findAll().stream()
                .map(proveedor -> modelMapper.map(proveedor, ProveedorSimpleDTO.class))
                .collect(Collectors.toList());
    }
    
    @Override
    public ProveedorDTO getProveedorById(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", id));
                
        return modelMapper.map(proveedor, ProveedorDTO.class);
    }
    
    @Override
    public ProveedorDTO createProveedor(ProveedorDTO proveedorDTO) {
        // Verificar si ya existe un proveedor con el mismo email
        if (proveedorRepository.existsByContactoEmail(proveedorDTO.getContactoEmail())) {
            throw new BadRequestException("Ya existe un proveedor con el email: " + proveedorDTO.getContactoEmail());
        }
        
        Proveedor proveedor = modelMapper.map(proveedorDTO, Proveedor.class);
        proveedor.setId(null); // Asegurar que es una creación, no una actualización
        
        proveedor = proveedorRepository.save(proveedor);
        
        return modelMapper.map(proveedor, ProveedorDTO.class);
    }
    
    @Override
    public ProveedorDTO updateProveedor(Long id, ProveedorDTO proveedorDTO) {
        Proveedor existingProveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", id));
        
        // Verificar si se está cambiando el email a uno que ya existe
        if (!existingProveedor.getContactoEmail().equals(proveedorDTO.getContactoEmail()) &&
                proveedorRepository.existsByContactoEmail(proveedorDTO.getContactoEmail())) {
            throw new BadRequestException("Ya existe un proveedor con el email: " + proveedorDTO.getContactoEmail());
        }
        
        // Actualizar propiedades
        existingProveedor.setNombreEmpresa(proveedorDTO.getNombreEmpresa());
        existingProveedor.setContactoNombre(proveedorDTO.getContactoNombre());
        existingProveedor.setContactoEmail(proveedorDTO.getContactoEmail());
        existingProveedor.setTelefono(proveedorDTO.getTelefono());
        existingProveedor.setDireccion(proveedorDTO.getDireccion());
        existingProveedor.setActivo(proveedorDTO.getActivo());
        
        existingProveedor = proveedorRepository.save(existingProveedor);
        
        return modelMapper.map(existingProveedor, ProveedorDTO.class);
    }
    
    @Override
    public void deleteProveedor(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "id", id));
                
        proveedorRepository.delete(proveedor);
    }
    
    @Override
    public List<SuministroDTO> getSuministrosByProveedorId(Long proveedorId) {
        if (!proveedorRepository.existsById(proveedorId)) {
            throw new ResourceNotFoundException("Proveedor", "id", proveedorId);
        }
        
        return suministroRepository.findByProveedorId(proveedorId).stream()
                .map(suministro -> modelMapper.map(suministro, SuministroDTO.class))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProveedorSimpleDTO> getProveedoresActivos() {
        return proveedorRepository.findByActivoTrue().stream()
                .map(proveedor -> modelMapper.map(proveedor, ProveedorSimpleDTO.class))
                .collect(Collectors.toList());
    }
}