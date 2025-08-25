from django.contrib import admin
from .models import Categorias, Productos, PresentacionesProducto, Ventas, DetalleVenta, Merma

@admin.register(Categorias)
class CategoriasAdmin(admin.ModelAdmin):
    list_display = ('id_categoria', 'nombre')
    search_fields = ('nombre',)

@admin.register(Productos)
class ProductosAdmin(admin.ModelAdmin):
    list_display = ('id_producto', 'nombre', 'stock', 'id_categoria')
    list_filter = ('id_categoria',)
    search_fields = ('nombre',)

@admin.register(PresentacionesProducto)
class PresentacionesProductoAdmin(admin.ModelAdmin):
    list_display = ('id_presentacion', 'id_producto', 'descripcion', 'factor', 'precio')
    list_filter = ('id_producto',)
    search_fields = ('descripcion',)

@admin.register(Ventas)
class VentasAdmin(admin.ModelAdmin):
    list_display = ('id_venta', 'fecha', 'total')
    list_filter = ('fecha',)

@admin.register(DetalleVenta)
class DetalleVentaAdmin(admin.ModelAdmin):
    list_display = ('id_detalle', 'id_venta', 'id_presentacion', 'cantidad', 'precio_unitario', 'subtotal')
    list_filter = ('id_venta',)

@admin.register(Merma)
class MermaAdmin(admin.ModelAdmin):
    list_display = ('id_merma', 'id_producto', 'cantidad', 'fecha', 'motivo')
    list_filter = ('fecha',)
    search_fields = ('motivo',)

