package com.perfumeria.proveedores.repository;

import com.perfumeria.proveedores.model.Suministro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuministroRepository extends JpaRepository<Suministro, Long> {
    
    List<Suministro> findByProveedorId(Long proveedorId);
    
    List<Suministro> findAllByOrderByTiempoEntregaDiasAsc();
    
    boolean existsByProveedorIdAndProductoCodigo(Long proveedorId, String productoCodigo);
}