-- Eliminar tabla de customers y crear tabla de suppliers
DROP TABLE IF EXISTS customers;

-- Crear tabla de proveedores
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    products_supplied TEXT, -- JSON array de productos que suministra
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actualizar tabla de productos para incluir SKU y código de barras
ALTER TABLE products ADD COLUMN sku VARCHAR(50) UNIQUE;
ALTER TABLE products ADD COLUMN barcode VARCHAR(50) UNIQUE;

-- Actualizar tabla de ventas para eliminar customer_id y agregar sale_number
ALTER TABLE sales DROP COLUMN customer_id;
ALTER TABLE sales ADD COLUMN sale_number VARCHAR(20) UNIQUE;

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_sales_sale_number ON sales(sale_number);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- Insertar proveedores de ejemplo
INSERT OR IGNORE INTO suppliers (name, contact_person, email, phone, address, products_supplied) VALUES
('TechnoSupply SA', 'Roberto Vega', 'ventas@technosupply.com', '555-1001', 'Zona Industrial 100', '["Laptops", "Computadoras", "Monitores"]'),
('Distribuidora Digital', 'Carmen Morales', 'contacto@digidigital.com', '555-1002', 'Centro Comercial 200', '["Accesorios", "Cables", "Periféricos"]'),
('ElectroMayorista', 'Pedro Jiménez', 'pedidos@electromayorista.com', '555-1003', 'Polígono Industrial 300', '["Componentes", "Hardware", "Herramientas"]'),
('Oficina Total', 'Ana Ruiz', 'compras@oficinatotal.com', '555-1004', 'Centro Empresarial 400', '["Papelería", "Mobiliario", "Suministros"]');

-- Actualizar productos existentes con SKU y códigos de barras
UPDATE products SET 
    sku = 'LAP-HP-001',
    barcode = '7501234567890'
WHERE name = 'Laptop HP Pavilion';

UPDATE products SET 
    sku = 'MOU-LOG-002',
    barcode = '7501234567891'
WHERE name = 'Mouse Inalámbrico Logitech';

UPDATE products SET 
    sku = 'KEY-RGB-003',
    barcode = '7501234567892'
WHERE name = 'Teclado Mecánico RGB';

UPDATE products SET 
    sku = 'MON-24-004',
    barcode = '7501234567893'
WHERE name = 'Monitor 24" Full HD';

UPDATE products SET 
    sku = 'WEB-HD-005',
    barcode = '7501234567894'
WHERE name = 'Webcam HD 1080p';

UPDATE products SET 
    sku = 'HDD-1TB-006',
    barcode = '7501234567895'
WHERE name = 'Disco Duro Externo 1TB';

UPDATE products SET 
    sku = 'AUD-BT-007',
    barcode = '7501234567896'
WHERE name = 'Audífonos Bluetooth';

UPDATE products SET 
    sku = 'PRT-MF-008',
    barcode = '7501234567897'
WHERE name = 'Impresora Multifuncional';

UPDATE products SET 
    sku = 'CHR-ERG-009',
    barcode = '7501234567898'
WHERE name = 'Silla Ergonómica';

UPDATE products SET 
    sku = 'LMP-LED-010',
    barcode = '7501234567899'
WHERE name = 'Lámpara LED Escritorio';
