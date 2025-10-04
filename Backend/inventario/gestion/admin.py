from django.contrib import admin
from .models import Categoria, Producto, PresentacionProducto, Venta, DetalleVenta, Merma, Proveedor

# Registrar los modelos
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(PresentacionProducto)
admin.site.register(Merma)
admin.site.register(Venta)
admin.site.register(DetalleVenta)
admin.site.register(Proveedor)
