-- Reporte de rentabilidad por producto
SELECT 
    name as 'Producto',
    sku as 'SKU',
    category as 'Categoría',
    cost as 'Costo',
    price as 'Precio',
    (price - cost) as 'Ganancia por Unidad',
    ROUND(((price - cost) / cost * 100), 2) as 'Margen %',
    stock as 'Stock',
    (stock * cost) as 'Inversión Total',
    (stock * (price - cost)) as 'Ganancia Potencial'
FROM products
WHERE cost > 0
ORDER BY (price - cost) DESC;

-- Reporte de ganancias por período
SELECT 
    DATE(created_at) as 'Fecha',
    SUM(CASE WHEN movement_type = 'salida' THEN quantity ELSE 0 END) as 'Unidades Vendidas',
    SUM(CASE WHEN movement_type = 'salida' THEN total_cost ELSE 0 END) as 'Costo Total',
    SUM(CASE WHEN movement_type = 'salida' THEN total_value ELSE 0 END) as 'Ventas Total',
    SUM(CASE WHEN movement_type = 'salida' THEN (unit_price - unit_cost) * quantity ELSE 0 END) as 'Ganancia Total'
FROM inventory_movements
WHERE movement_type = 'salida'
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

-- Reporte de productos más rentables
SELECT 
    p.name as 'Producto',
    p.sku as 'SKU',
    SUM(CASE WHEN im.movement_type = 'salida' THEN im.quantity ELSE 0 END) as 'Unidades Vendidas',
    SUM(CASE WHEN im.movement_type = 'salida' THEN (im.unit_price - im.unit_cost) * im.quantity ELSE 0 END) as 'Ganancia Total',
    AVG(CASE WHEN im.movement_type = 'salida' THEN (im.unit_price - im.unit_cost) ELSE NULL END) as 'Ganancia Promedio por Unidad'
FROM products p
LEFT JOIN inventory_movements im ON p.id = im.product_id
GROUP BY p.id, p.name, p.sku
HAVING SUM(CASE WHEN im.movement_type = 'salida' THEN im.quantity ELSE 0 END) > 0
ORDER BY SUM(CASE WHEN im.movement_type = 'salida' THEN (im.unit_price - im.unit_cost) * im.quantity ELSE 0 END) DESC;

-- Reporte de inversión actual en inventario
SELECT 
    category as 'Categoría',
    COUNT(*) as 'Productos',
    SUM(stock) as 'Total Unidades',
    SUM(stock * cost) as 'Inversión Total',
    SUM(stock * price) as 'Valor Potencial',
    SUM(stock * (price - cost)) as 'Ganancia Potencial'
FROM products
WHERE cost > 0
GROUP BY category
ORDER BY SUM(stock * cost) DESC;

-- Reporte de movimientos con valores financieros completos
SELECT 
    im.created_at as 'Fecha',
    p.name as 'Producto',
    p.sku as 'SKU',
    im.movement_type as 'Tipo',
    im.quantity as 'Cantidad',
    im.unit_cost as 'Costo Unitario',
    im.unit_price as 'Precio Unitario',
    im.total_cost as 'Costo Total',
    im.total_value as 'Valor Total',
    CASE 
        WHEN im.movement_type = 'salida' THEN (im.unit_price - im.unit_cost) * im.quantity
        ELSE 0
    END as 'Ganancia',
    im.reason as 'Motivo'
FROM inventory_movements im
JOIN products p ON im.product_id = p.id
ORDER BY im.created_at DESC;
