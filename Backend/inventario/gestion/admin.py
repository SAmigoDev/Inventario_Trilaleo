from django.contrib import admin
from .models import Categoria, Producto, PresentacionProducto, Venta, DetalleVenta, Merma, Proveedor, MovimientoInventario

# Personalización de la visualización de Proveedores en el admin
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ['empresa', 'contacto', 'email', 'rut', 'ciudad', 'activo']
    list_filter = ['activo', 'ciudad']
    search_fields = ['empresa', 'contacto', 'rut', 'email']
    list_editable = ['activo']

# Personalización de la visualización de Movimientos de Inventario
class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ['id_movimiento', 'id_producto', 'tipo', 'cantidad', 'fecha_movimiento']
    list_filter = ['tipo', 'fecha_movimiento']
    search_fields = ['id_producto__nombre', 'motivo']

# Registro de los modelos con configuraciones personalizadas
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(PresentacionProducto)
admin.site.register(Merma)
admin.site.register(Venta)
admin.site.register(DetalleVenta)
admin.site.register(Proveedor, ProveedorAdmin)
admin.site.register(MovimientoInventario, MovimientoInventarioAdmin)
