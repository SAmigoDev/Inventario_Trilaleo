-- Reporte detallado de movimientos de inventario para exportación
SELECT 
    im.created_at as 'Fecha y Hora',
    p.name as 'Producto',
    p.sku as 'SKU',
    p.barcode as 'Código de Barras',
    im.movement_type as 'Tipo de Movimiento',
    im.quantity as 'Cantidad',
    im.previous_stock as 'Stock Anterior',
    im.new_stock as 'Stock Nuevo',
    im.reason as 'Motivo',
    p.category as 'Categoría',
    (im.new_stock * p.price) as 'Valor Total Stock'
FROM inventory_movements im
JOIN products p ON im.product_id = p.id
ORDER BY im.created_at DESC;

-- Reporte de productos con movimientos frecuentes
SELECT 
    p.name as 'Producto',
    p.sku as 'SKU',
    COUNT(im.id) as 'Total Movimientos',
    SUM(CASE WHEN im.movement_type = 'entrada' THEN im.quantity ELSE 0 END) as 'Total Entradas',
    SUM(CASE WHEN im.movement_type = 'salida' THEN im.quantity ELSE 0 END) as 'Total Salidas',
    p.stock as 'Stock Actual',
    p.min_stock as 'Stock Mínimo',
    MAX(im.created_at) as 'Último Movimiento'
FROM products p
LEFT JOIN inventory_movements im ON p.id = im.product_id
GROUP BY p.id, p.name, p.sku, p.stock, p.min_stock
HAVING COUNT(im.id) > 0
ORDER BY COUNT(im.id) DESC;

-- Reporte de alertas de stock con historial
SELECT 
    p.name as 'Producto',
    p.sku as 'SKU',
    p.stock as 'Stock Actual',
    p.min_stock as 'Stock Mínimo',
    (p.stock - p.min_stock) as 'Diferencia',
    CASE 
        WHEN p.stock = 0 THEN 'SIN STOCK'
        WHEN p.stock < p.min_stock THEN 'CRÍTICO'
        WHEN p.stock <= (p.min_stock * 1.5) THEN 'BAJO'
        ELSE 'NORMAL'
    END as 'Estado',
    (SELECT COUNT(*) FROM inventory_movements im WHERE im.product_id = p.id AND im.movement_type = 'salida' AND DATE(im.created_at) >= DATE('now', '-30 days')) as 'Salidas Último Mes',
    (SELECT im.created_at FROM inventory_movements im WHERE im.product_id = p.id ORDER BY im.created_at DESC LIMIT 1) as 'Último Movimiento'
FROM products p
WHERE p.stock <= (p.min_stock * 1.5)
ORDER BY p.stock ASC, p.min_stock DESC;

-- Reporte de proveedores con productos críticos
SELECT 
    s.name as 'Proveedor',
    s.contact_person as 'Contacto',
    s.email as 'Email',
    s.phone as 'Teléfono',
    COUNT(p.id) as 'Productos con Stock Crítico'
FROM suppliers s
JOIN products p ON JSON_EXTRACT(s.products_supplied, '$') LIKE '%' || p.category || '%'
WHERE p.stock <= p.min_stock
GROUP BY s.id, s.name, s.contact_person, s.email, s.phone
HAVING COUNT(p.id) > 0
ORDER BY COUNT(p.id) DESC;
