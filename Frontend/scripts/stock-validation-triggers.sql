-- Crear trigger para validar que el stock nunca sea negativo
CREATE TRIGGER IF NOT EXISTS validate_positive_stock
BEFORE UPDATE ON products
FOR EACH ROW
WHEN NEW.stock < 0
BEGIN
    SELECT RAISE(ABORT, 'El stock no puede ser negativo');
END;

-- Crear trigger para registrar automáticamente movimientos de inventario
CREATE TRIGGER IF NOT EXISTS auto_inventory_movement
AFTER UPDATE ON products
FOR EACH ROW
WHEN OLD.stock != NEW.stock
BEGIN
    INSERT INTO inventory_movements (
        product_id,
        movement_type,
        quantity,
        previous_stock,
        new_stock,
        reason,
        created_at
    ) VALUES (
        NEW.id,
        CASE 
            WHEN NEW.stock > OLD.stock THEN 'entrada'
            WHEN NEW.stock < OLD.stock THEN 'salida'
            ELSE 'ajuste'
        END,
        ABS(NEW.stock - OLD.stock),
        OLD.stock,
        NEW.stock,
        'Actualización automática',
        CURRENT_TIMESTAMP
    );
END;

-- Crear vista para productos con stock crítico y sus movimientos recientes
CREATE VIEW IF NOT EXISTS critical_stock_with_movements AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.barcode,
    p.stock,
    p.min_stock,
    p.category,
    p.price,
    (SELECT COUNT(*) FROM inventory_movements im WHERE im.product_id = p.id AND DATE(im.created_at) >= DATE('now', '-7 days')) as movements_last_week,
    (SELECT im.created_at FROM inventory_movements im WHERE im.product_id = p.id ORDER BY im.created_at DESC LIMIT 1) as last_movement_date
FROM products p
WHERE p.stock <= p.min_stock;

-- Crear función para obtener resumen de inventario
CREATE VIEW IF NOT EXISTS inventory_summary AS
SELECT 
    DATE(im.created_at) as movement_date,
    COUNT(*) as total_movements,
    SUM(CASE WHEN im.movement_type = 'entrada' THEN im.quantity ELSE 0 END) as total_entries,
    SUM(CASE WHEN im.movement_type = 'salida' THEN im.quantity ELSE 0 END) as total_exits,
    SUM(CASE WHEN im.movement_type = 'ajuste' THEN im.quantity ELSE 0 END) as total_adjustments
FROM inventory_movements im
GROUP BY DATE(im.created_at)
ORDER BY movement_date DESC;
