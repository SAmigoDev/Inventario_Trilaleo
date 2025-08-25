-- Reporte de productos con stock crítico
SELECT 
    name as 'Producto',
    category as 'Categoría',
    stock as 'Stock Actual',
    min_stock as 'Stock Mínimo',
    price as 'Precio',
    (stock * price) as 'Valor en Stock',
    observations as 'Observaciones',
    CASE 
        WHEN stock = 0 THEN 'SIN STOCK'
        WHEN stock <= min_stock THEN 'CRÍTICO'
        WHEN stock <= (min_stock * 2) THEN 'BAJO'
        ELSE 'NORMAL'
    END as 'Estado'
FROM products
WHERE stock <= (min_stock * 2)
ORDER BY stock ASC;

-- Reporte de movimientos de inventario por período
SELECT 
    DATE(im.created_at) as 'Fecha',
    p.name as 'Producto',
    im.movement_type as 'Tipo Movimiento',
    im.quantity as 'Cantidad',
    im.previous_stock as 'Stock Anterior',
    im.new_stock as 'Stock Nuevo',
    im.reason as 'Motivo'
FROM inventory_movements im
JOIN products p ON im.product_id = p.id
WHERE DATE(im.created_at) >= DATE('now', '-30 days')
ORDER BY im.created_at DESC;

-- Reporte de valor total del inventario por categoría
SELECT 
    category as 'Categoría',
    COUNT(*) as 'Cantidad Productos',
    SUM(stock) as 'Total Unidades',
    SUM(stock * price) as 'Valor Total',
    AVG(price) as 'Precio Promedio',
    MIN(stock) as 'Stock Mínimo',
    MAX(stock) as 'Stock Máximo'
FROM products
GROUP BY category
ORDER BY SUM(stock * price) DESC;

-- Reporte de productos más vendidos
SELECT 
    p.name as 'Producto',
    p.category as 'Categoría',
    SUM(si.quantity) as 'Cantidad Vendida',
    SUM(si.subtotal) as 'Ingresos Totales',
    AVG(si.unit_price) as 'Precio Promedio Venta',
    COUNT(DISTINCT s.id) as 'Número de Ventas'
FROM products p
JOIN sale_items si ON p.id = si.product_id
JOIN sales s ON si.sale_id = s.id
GROUP BY p.id, p.name, p.category
ORDER BY SUM(si.quantity) DESC
LIMIT 20;

-- Reporte de rotación de inventario
SELECT 
    p.name as 'Producto',
    p.stock as 'Stock Actual',
    COALESCE(SUM(si.quantity), 0) as 'Vendido (30 días)',
    CASE 
        WHEN p.stock > 0 AND COALESCE(SUM(si.quantity), 0) > 0 
        THEN ROUND(p.stock / (COALESCE(SUM(si.quantity), 0) / 30.0), 2)
        ELSE NULL
    END as 'Días de Inventario',
    CASE 
        WHEN p.stock > 0 AND COALESCE(SUM(si.quantity), 0) > 0 
        THEN ROUND((COALESCE(SUM(si.quantity), 0) / 30.0) * 365 / p.stock, 2)
        ELSE 0
    END as 'Rotación Anual'
FROM products p
LEFT JOIN sale_items si ON p.id = si.product_id
LEFT JOIN sales s ON si.sale_id = s.id AND DATE(s.created_at) >= DATE('now', '-30 days')
GROUP BY p.id, p.name, p.stock
ORDER BY 'Rotación Anual' DESC;

-- Reporte de alertas de stock
SELECT 
    p.name as 'Producto',
    p.category as 'Categoría',
    p.stock as 'Stock Actual',
    p.min_stock as 'Stock Mínimo',
    (p.stock - p.min_stock) as 'Diferencia',
    p.price as 'Precio',
    (p.min_stock * p.price) as 'Inversión Mínima Requerida',
    p.observations as 'Observaciones',
    CASE 
        WHEN p.stock = 0 THEN 'URGENTE - SIN STOCK'
        WHEN p.stock < p.min_stock THEN 'CRÍTICO - REABASTECER'
        WHEN p.stock = p.min_stock THEN 'MÍNIMO ALCANZADO'
        ELSE 'NORMAL'
    END as 'Prioridad'
FROM products p
WHERE p.stock <= p.min_stock
ORDER BY p.stock ASC, p.price DESC;
