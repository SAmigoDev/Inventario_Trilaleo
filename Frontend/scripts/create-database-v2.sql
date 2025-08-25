-- Actualizar tabla de productos para incluir nuevos campos
ALTER TABLE products ADD COLUMN min_stock INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN observations TEXT DEFAULT '';

-- Crear tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entrada', 'salida', 'ajuste')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason VARCHAR(255),
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Crear tabla de configuración de alertas
CREATE TABLE IF NOT EXISTS alert_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    min_stock_alert INTEGER NOT NULL DEFAULT 5,
    critical_stock_alert INTEGER NOT NULL DEFAULT 2,
    email_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Crear tabla de reportes generados
CREATE TABLE IF NOT EXISTS generated_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    parameters TEXT, -- JSON con parámetros del reporte
    generated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_products_min_stock ON products(min_stock);
CREATE INDEX IF NOT EXISTS idx_alert_settings_product_id ON alert_settings(product_id);

-- Crear vista para productos con stock crítico
CREATE VIEW IF NOT EXISTS critical_stock_products AS
SELECT 
    p.id,
    p.name,
    p.stock,
    p.min_stock,
    p.category,
    p.price,
    p.observations,
    CASE 
        WHEN p.stock <= p.min_stock THEN 'CRÍTICO'
        WHEN p.stock <= (p.min_stock * 2) THEN 'BAJO'
        ELSE 'NORMAL'
    END as stock_status
FROM products p
WHERE p.stock <= (p.min_stock * 2);

-- Crear vista para resumen de movimientos por producto
CREATE VIEW IF NOT EXISTS product_movement_summary AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    COUNT(im.id) as total_movements,
    SUM(CASE WHEN im.movement_type = 'entrada' THEN im.quantity ELSE 0 END) as total_entries,
    SUM(CASE WHEN im.movement_type = 'salida' THEN im.quantity ELSE 0 END) as total_exits,
    SUM(CASE WHEN im.movement_type = 'ajuste' THEN im.quantity ELSE 0 END) as total_adjustments,
    MAX(im.created_at) as last_movement_date
FROM products p
LEFT JOIN inventory_movements im ON p.id = im.product_id
GROUP BY p.id, p.name;
