const API_BASE = 'http://localhost:8000/api';

export const api = {
  // GET - usar español para coincidir con Django
  
  getCategories: () => fetch(`${API_BASE}/categorias/`).then(res => res.json()),
  getPresentaciones: () => fetch(`${API_BASE}/presentaciones_producto/`).then(res => res.json()),

//================================================================================ MODULO PRODUCTOS ================================================================================

// GET
  getProducts: () => fetch(`${API_BASE}/productos/`).then(res => res.json()),

// POST
  createProducto: (data: any) => fetch(`${API_BASE}/productos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ Error del backend:', errorData);
      throw new Error(`Error ${res.status}: ${JSON.stringify(errorData)}`);
    }
    return res.json();
  }),
  
// PUT
  updateProduct: (id: number, data: any) => {
    const url = `${API_BASE}/productos/${id}/`;
    // console.log('🎯 URL completa:', url);
    // console.log('📝 Datos enviados:', JSON.stringify(data, null, 2));
    // console.log('🔧 Método: PUT');
    
    return fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(async (res) => {
      // console.log('📡 Response status:', res.status);
      // console.log('📡 Response URL:', res.url);
      
      if (!res.ok) {
        const errorText = await res.text();
        // console.error('❌ Error response:', errorText);
        // console.error('❌ Status:', res.status);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      return res.json();
    })
    .then(data => {
      // console.log('✅ Success response:', data);
      return data;
    })
    .catch(error => {
      // console.error('💥 Fetch error:', error);
      throw error;
    });
  },
  
// DELETE
  deleteProducto: (id: number) => {
    // VERIFICAR ID ANTES DE HACER LA PETICIÓN
    if (!id || isNaN(id)) {
      // console.error('❌ ID inválido para DELETE:', id);
      return Promise.reject(new Error('ID de producto inválido'));
    }

    const url = `${API_BASE}/productos/${id}/`;
    // console.log('🗑️ DELETE URL:', url);
    
    return fetch(url, {
      method: 'DELETE'
    }).then(async (res) => {
      // console.log('🗑️ DELETE Response status:', res.status);
      
      if (!res.ok) {
        // Para errores 404, no intentar parsear JSON
        if (res.status === 404) {
          throw new Error('Producto no encontrado en la base de datos');
        }
        
        // Para otros errores, intentar obtener mensaje
        try {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        } catch {
          throw new Error(`HTTP ${res.status}`);
        }
      }
      
      // DELETE exitoso
      return { success: true, message: 'Producto eliminado correctamente' };
    });
  },

//================================================================================ MODULO PROVEEDORES ================================================================================

  getProveedores: () => fetch(`${API_BASE}/proveedores/`).then(res => res.json()),
  getProveedor: (id: number) => fetch(`${API_BASE}/proveedores/${id}/`).then(res => res.json()),
  createProveedor: (data: any) => fetch(`${API_BASE}/proveedores/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateProveedor: (id: number, data: any) => fetch(`${API_BASE}/proveedores/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteProveedor: (id: number) => fetch(`${API_BASE}/proveedores/${id}/`, {
    method: 'DELETE'
  }).then(res => res.json()),
  searchProveedores: (query: string) => fetch(`${API_BASE}/proveedores/buscar/?q=${query}`).then(res => res.json()),

//================================================================================ MODULO VENTAS ================================================================================

  getVentas: () => fetch(`${API_BASE}/ventas/`).then(res => res.json()),
  getVenta: (id: number) => fetch(`${API_BASE}/ventas/${id}/`).then(res => res.json()),

  createVenta: (data: any) => {
    console.log('📤 Creando venta en BD:', data);
    return fetch(`${API_BASE}/ventas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(async (res) => {
      console.log('📥 Respuesta de crear venta - Status:', res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error creando venta:', errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('✅ Venta creada exitosamente:', data);
      return data;
    })
  },

  // DETALLE VENTA
  createDetalleVenta: (data: any) => fetch(`${API_BASE}/detalle-venta/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  updateVenta: (id: number, data: any) => fetch(`${API_BASE}/ventas/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  deleteVenta: (id: number) => fetch(`${API_BASE}/ventas/${id}/`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // DETALLE VENTA
  getDetalleVenta: (ventaId: number) => {
    // console.log('🔍 Obteniendo detalles para venta:', ventaId);
    return fetch(`${API_BASE}/detalle-venta/?venta_id=${ventaId}`)
      .then(async (res) => {
        // console.log('📥 Respuesta detalles venta - Status:', res.status);
        const data = await res.json();
        // console.log('📦 Detalles obtenidos para venta', ventaId, ':', data);
        return data;
      })
      .catch(error => {
        console.error('❌ Error obteniendo detalles:', error);
        throw error;
      });
  },

//================================================================================ CLIENTES ================================================================================
  getClientes: () => fetch(`${API_BASE}/clientes/`).then(res => res.json()),
  getCliente: (id: number) => fetch(`${API_BASE}/clientes/${id}/`).then(res => res.json()),
  createCliente: (data: any) => fetch(`${API_BASE}/clientes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

//================================================================================ PROMOCIONES ================================================================================
  getPromociones: () => fetch(`${API_BASE}/promociones/`).then(res => res.json()),
  getPromocion: (id: number) => fetch(`${API_BASE}/promociones/${id}/`).then(res => res.json()),

//================================================================================ MOVIMIENTOS DE INVENTARIO ================================================================================
  getMovimientosInventario: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/api/movimientos-inventario/`);
    if (!response.ok) throw new Error('Error fetching movimientos inventario');
    return response.json();
  },

  getMovimientosByProducto: async (productoId: number): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/api/movimientos-inventario/?producto_id=${productoId}`);
    if (!response.ok) throw new Error('Error fetching movimientos por producto');
    return response.json();
  },

  createMovimientoInventario: async (movimientoData: any) => {
    try {
      console.log('📤 Enviando movimiento a API:', movimientoData);
      
      // Asegúrate de que la URL sea correcta - quita el /api/ duplicado
      const response = await fetch(`${API_BASE}/movimientos-inventario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoData),
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error creating movimiento inventario: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Movimiento creado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en createMovimientoInventario:', error);
      throw error;
    }
  },

  deleteMovimientoInventario: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/movimientos-inventario/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting movimiento inventario');
  },
};