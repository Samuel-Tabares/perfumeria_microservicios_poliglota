package com.perfumeria.proveedores.repository;

import com.perfumeria.proveedores.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    
    List<Proveedor> findByActivoTrue();
    
    boolean existsByContactoEmail(String contactoEmail);
}