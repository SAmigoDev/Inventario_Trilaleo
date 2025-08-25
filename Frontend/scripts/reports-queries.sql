-- Consultas útiles para reportes

-- Reporte de ventas por día
SELECT 
    DATE(created_at) as fecha,
    COUNT(*) as num_ventas,
    SUM(total) as total_ventas,
    AVG(total) as promedio_venta
FROM sales 
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- Productos más vendidos
SELECT 
    p.name as producto,
    p.category as categoria,
    SUM(si.quantity) as cantidad_vendida,
    SUM(si.subtotal) as ingresos_totales
FROM sale_items si
JOIN products p ON si.product_id = p.id
GROUP BY p.id, p.name, p.category
ORDER BY cantidad_vendida DESC;

-- Clientes con más compras
SELECT 
    c.name as cliente,
    c.email,
    COUNT(s.id) as num_compras,
    SUM(s.total) as total_gastado,
    AVG(s.total) as promedio_compra
FROM customers c
JOIN sales s ON c.id = s.customer_id
GROUP BY c.id, c.name, c.email
ORDER BY total_gastado DESC;

-- Productos con stock bajo (menos de 5 unidades)
SELECT 
    name as producto,
    category as categoria,
    stock,
    price as precio
FROM products 
WHERE stock < 5
ORDER BY stock ASC;

-- Ventas por categoría
SELECT 
    p.category as categoria,
    COUNT(si.id) as items_vendidos,
    SUM(si.quantity) as cantidad_total,
    SUM(si.subtotal) as ingresos_categoria
FROM sale_items si
JOIN products p ON si.product_id = p.id
GROUP BY p.category
ORDER BY ingresos_categoria DESC;

-- Reporte mensual de ventas
SELECT 
    strftime('%Y-%m', created_at) as mes,
    COUNT(*) as num_ventas,
    SUM(total) as total_mes,
    AVG(total) as promedio_mes
FROM sales
GROUP BY strftime('%Y-%m', created_at)
ORDER BY mes DESC;
