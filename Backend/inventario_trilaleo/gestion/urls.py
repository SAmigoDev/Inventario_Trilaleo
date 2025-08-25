from django.urls import path
from . import views

urlpatterns = [
    # URLs para Categorías
    path('categorias/', views.CategoriaListCreate.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', views.CategoriaDetail.as_view(), name='categoria-detail'),
    
    # URLs para Productos
    path('productos/', views.ProductoListCreate.as_view(), name='producto-list'),
    path('productos/<int:pk>/', views.ProductoDetail.as_view(), name='producto-detail'),
    
    # URLs para Presentaciones de Producto
    path('presentaciones/', views.PresentacionProductoListCreate.as_view(), name='presentacion-list'),
    path('presentaciones/<int:pk>/', views.PresentacionProductoDetail.as_view(), name='presentacion-detail'),
    
    # URLs para Merma
    path('merma/', views.MermaListCreate.as_view(), name='merma-list'),
    path('merma/<int:pk>/', views.MermaDetail.as_view(), name='merma-detail'),
    
    # URLs para Ventas
    path('ventas/', views.VentaListCreate.as_view(), name='venta-list'),
    path('ventas/<int:pk>/', views.VentaDetail.as_view(), name='venta-detail'),
    
    # URLs para Detalle de Venta
    path('detalle-venta/', views.DetalleVentaListCreate.as_view(), name='detalle-venta-list'),
    path('detalle-venta/<int:pk>/', views.DetalleVentaDetail.as_view(), name='detalle-venta-detail'),
]
