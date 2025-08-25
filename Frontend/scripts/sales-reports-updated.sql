-- Reportes actualizados sin referencias a clientes

-- Reporte de ventas por número
SELECT 
    sale_number as 'Número de Venta',
    DATE(created_at) as 'Fecha',
    total as 'Total',
    (SELECT COUNT(*) FROM sale_items WHERE sale_id = sales.id) as 'Cantidad Items'
FROM sales 
ORDER BY created_at DESC;

-- Reporte de productos más vendidos con SKU
SELECT 
    p.name as 'Producto',
    p.sku as 'SKU',
    p.barcode as 'Código de Barras',
    p.category as 'Categoría',
    SUM(si.quantity) as 'Cantidad Vendida',
    SUM(si.subtotal) as 'Ingresos Totales',
    AVG(si.unit_price) as 'Precio Promedio'
FROM sale_items si
JOIN products p ON si.product_id = p.id
GROUP BY p.id, p.name, p.sku, p.barcode, p.category
ORDER BY SUM(si.quantity) DESC;

-- Reporte de proveedores y sus productos
SELECT 
    s.name as 'Proveedor',
    s.contact_person as 'Contacto',
    s.email as 'Email',
    s.phone as 'Teléfono',
    s.products_supplied as 'Productos que Suministra'
FROM suppliers s
ORDER BY s.name;

-- Búsqueda de productos por SKU o código de barras
SELECT 
    name as 'Producto',
    sku as 'SKU',
    barcode as 'Código de Barras',
    price as 'Precio',
    stock as 'Stock',
    category as 'Categoría'
FROM products 
WHERE sku LIKE '%LAP%' OR barcode LIKE '%7501234567890%'
ORDER BY name;

-- Reporte de ventas diarias simplificado
SELECT 
    DATE(s.created_at) as 'Fecha',
    COUNT(s.id) as 'Número de Ventas',
    SUM(s.total) as 'Total Vendido',
    AVG(s.total) as 'Venta Promedio'
FROM sales s
GROUP BY DATE(s.created_at)
ORDER BY DATE(s.created_at) DESC;
