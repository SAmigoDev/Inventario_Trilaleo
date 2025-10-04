from django.urls import path
from . import views

urlpatterns = [
    # CATEGORIAS
    path('categorias/', views.lista_categorias, name='lista_categorias'),
    
    # PRODUCTOS
    path('productos/', views.lista_productos, name='lista_productos'),
    path('productos/<int:pk>/', views.detalle_producto, name='detalle_producto'),

    # ACTUALIZACION Y EDICION DE PRODUCTOS
    # path('productos/<int:pk>/', views.actualizar_producto, name='actualizar_producto'),
    
    # PRESENTACIONES
    path('presentaciones_producto/', views.lista_presentaciones, name='lista_presentaciones'),
    
    # MERMAS
    path('mermas/', views.lista_mermas, name='lista_mermas'),
    
    # VENTAS
    path('ventas/', views.lista_ventas, name='lista_ventas'),

    # DETALLES DE VENTA - AGREGAR ESTAS RUTAS
    path('detalle-venta/', views.lista_detalle_ventas, name='lista_detalle_ventas'),
    path('detalle-venta/<int:pk>/', views.detalle_venta, name='detalle_venta'),

    # PROVEEDORES
    path('proveedores/', views.lista_proveedores, name='lista_proveedores'),
    path('proveedores/<int:pk>/', views.detalle_proveedor, name='detalle_proveedor'),
    path('proveedores/buscar/', views.buscar_proveedores, name='buscar_proveedores'),

]