-- Agregar campo de costo a la tabla de productos
ALTER TABLE products ADD COLUMN cost DECIMAL(10,2) DEFAULT 0;

-- Actualizar tabla de movimientos de inventario para incluir valores financieros
ALTER TABLE inventory_movements ADD COLUMN unit_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE inventory_movements ADD COLUMN unit_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE inventory_movements ADD COLUMN total_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE inventory_movements ADD COLUMN total_value DECIMAL(10,2) DEFAULT 0;

-- Actualizar productos existentes con costos de ejemplo
UPDATE products SET cost = 12000 WHERE name LIKE '%Laptop%';
UPDATE products SET cost = 350 WHERE name LIKE '%Mouse%';
UPDATE products SET cost = 800 WHERE name LIKE '%Teclado%';
UPDATE products SET cost = 2800 WHERE name LIKE '%Monitor%';
UPDATE products SET cost = 600 WHERE name LIKE '%Webcam%';
UPDATE products SET cost = 1400 WHERE name LIKE '%Disco%';
UPDATE products SET cost = 1800 WHERE name LIKE '%Audífonos%';
UPDATE products SET cost = 3500 WHERE name LIKE '%Impresora%';
UPDATE products SET cost = 5200 WHERE name LIKE '%Silla%';
UPDATE products SET cost = 300 WHERE name LIKE '%Lámpara%';

-- Crear vista para análisis de rentabilidad por producto
CREATE VIEW IF NOT EXISTS product_profitability AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.category,
    p.cost,
    p.price,
    (p.price - p.cost) as profit_per_unit,
    ROUND(((p.price - p.cost) / p.cost * 100), 2) as profit_margin_percent,
    p.stock,
    (p.stock * p.cost) as total_investment,
    (p.stock * p.price) as total_potential_value,
    (p.stock * (p.price - p.cost)) as total_potential_profit
FROM products p
WHERE p.cost > 0;

-- Crear vista para análisis de ganancias por movimientos
CREATE VIEW IF NOT EXISTS inventory_profit_analysis AS
SELECT 
    DATE(im.created_at) as movement_date,
    SUM(CASE WHEN im.movement_type = 'salida' THEN (im.unit_price - im.unit_cost) * im.quantity ELSE 0 END) as daily_profit,
    SUM(CASE WHEN im.movement_type = 'salida' THEN im.total_value ELSE 0 END) as daily_sales,
    SUM(CASE WHEN im.movement_type = 'salida' THEN im.total_cost ELSE 0 END) as daily_cost,
    COUNT(CASE WHEN im.movement_type = 'salida' THEN 1 END) as sales_count
FROM inventory_movements im
GROUP BY DATE(im.created_at)
ORDER BY movement_date DESC;

-- Crear trigger actualizado para registrar valores financieros
DROP TRIGGER IF EXISTS auto_inventory_movement;

CREATE TRIGGER auto_inventory_movement_with_values
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
        unit_cost,
        unit_price,
        total_cost,
        total_value,
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
        NEW.cost,
        NEW.price,
        ABS(NEW.stock - OLD.stock) * NEW.cost,
        ABS(NEW.stock - OLD.stock) * NEW.price,
        'Actualización automática',
        CURRENT_TIMESTAMP
    );
END;

-- Crear índices para mejorar consultas financieras
CREATE INDEX IF NOT EXISTS idx_inventory_movements_values ON inventory_movements(unit_cost, unit_price, total_value);
CREATE INDEX IF NOT EXISTS idx_products_cost ON products(cost);
CREATE INDEX IF NOT EXISTS idx_products_profit ON products((price - cost));
