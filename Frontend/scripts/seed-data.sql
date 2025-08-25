-- Insertar categorías de ejemplo
INSERT OR IGNORE INTO categories (name, description) VALUES
('Electrónicos', 'Dispositivos electrónicos y tecnología'),
('Accesorios', 'Accesorios para computadoras y dispositivos'),
('Oficina', 'Artículos de oficina y papelería'),
('Hogar', 'Artículos para el hogar'),
('Deportes', 'Artículos deportivos y fitness');

-- Insertar productos de ejemplo
INSERT OR IGNORE INTO products (name, price, stock, category, description) VALUES
('Laptop HP Pavilion', 15000.00, 10, 'Electrónicos', 'Laptop HP Pavilion 15" Core i5, 8GB RAM, 256GB SSD'),
('Mouse Inalámbrico Logitech', 500.00, 25, 'Accesorios', 'Mouse inalámbrico ergonómico con receptor USB'),
('Teclado Mecánico RGB', 1200.00, 15, 'Accesorios', 'Teclado mecánico con retroiluminación RGB'),
('Monitor 24" Full HD', 3500.00, 8, 'Electrónicos', 'Monitor LED 24 pulgadas resolución 1920x1080'),
('Webcam HD 1080p', 800.00, 20, 'Accesorios', 'Cámara web HD con micrófono integrado'),
('Disco Duro Externo 1TB', 1800.00, 12, 'Electrónicos', 'Disco duro externo USB 3.0 de 1TB'),
('Audífonos Bluetooth', 2200.00, 18, 'Accesorios', 'Audífonos inalámbricos con cancelación de ruido'),
('Impresora Multifuncional', 4500.00, 5, 'Oficina', 'Impresora, escáner y copiadora todo en uno'),
('Silla Ergonómica', 6500.00, 6, 'Oficina', 'Silla de oficina ergonómica con soporte lumbar'),
('Lámpara LED Escritorio', 450.00, 30, 'Oficina', 'Lámpara LED ajustable para escritorio');

-- Insertar clientes de ejemplo
INSERT OR IGNORE INTO customers (name, email, phone, address) VALUES
('Juan Pérez García', 'juan.perez@email.com', '555-0001', 'Av. Principal 123, Ciudad'),
('María González López', 'maria.gonzalez@email.com', '555-0002', 'Calle Secundaria 456, Ciudad'),
('Carlos Rodríguez Martín', 'carlos.rodriguez@email.com', '555-0003', 'Plaza Central 789, Ciudad'),
('Ana Fernández Silva', 'ana.fernandez@email.com', '555-0004', 'Blvd. Norte 321, Ciudad'),
('Luis Martínez Ruiz', 'luis.martinez@email.com', '555-0005', 'Av. Sur 654, Ciudad');

-- Insertar proveedores de ejemplo
INSERT OR IGNORE INTO suppliers (name, contact_person, email, phone, address) VALUES
('TechnoSupply SA', 'Roberto Vega', 'ventas@technosupply.com', '555-1001', 'Zona Industrial 100'),
('Distribuidora Digital', 'Carmen Morales', 'contacto@digidigital.com', '555-1002', 'Centro Comercial 200'),
('ElectroMayorista', 'Pedro Jiménez', 'pedidos@electromayorista.com', '555-1003', 'Polígono Industrial 300');
