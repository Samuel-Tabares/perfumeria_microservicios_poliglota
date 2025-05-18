-- Datos de ejemplo para Proveedores
MERGE INTO proveedor (id, nombre_empresa, contacto_nombre, contacto_email, telefono, direccion, fecha_registro, activo) 
KEY(id) VALUES
(1, 'Fragancias Internacionales S.A.', 'Juan Pérez', 'juan.perez@fragancias.com', '+521234567890', 'Av. Reforma 123, CDMX, México', CURRENT_TIMESTAMP(), true),
(2, 'Esencias Naturales Europa', 'María González', 'maria@esencias.eu', '+341234567', 'Calle Gran Vía 45, Madrid, España', CURRENT_TIMESTAMP(), true),
(3, 'Químicos Selectos', 'Carlos Rodríguez', 'carlos@quimicos.com', '+528765432109', 'Calle Industria 789, Monterrey, México', CURRENT_TIMESTAMP(), true);

-- Datos de ejemplo para Suministros
MERGE INTO suministro (id, proveedor_id, producto_nombre, producto_codigo, precio_unitario, tiempo_entrega_dias)
KEY(id) VALUES
(1, 1, 'Aceite de bergamota', 'MP-ESE-001', 85.50, 5),
(2, 1, 'Alcohol etílico cosmético', 'MP-ALC-001', 32.75, 3),
(3, 2, 'Esencia de jazmín', 'MP-ESE-002', 120.00, 10),
(4, 2, 'Esencia de rosa búlgara', 'MP-ESE-003', 225.50, 15),
(5, 3, 'Fijador sintético', 'MP-FIJ-001', 45.30, 7),
(6, 3, 'Glicerina refinada', 'MP-GLI-001', 28.90, 4);