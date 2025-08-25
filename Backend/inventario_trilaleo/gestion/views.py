from rest_framework import generics
from .models import Categorias, Productos, PresentacionesProducto, Merma, Ventas, DetalleVenta
from .serializers import (
    CategoriaSerializer, 
    ProductoSerializer, 
    PresentacionProductoSerializer,
    MermaSerializer,
    VentaSerializer,
    DetalleVentaSerializer
)

# Vistas para Categorías
class CategoriaListCreate(generics.ListCreateAPIView):
    queryset = Categorias.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categorias.objects.all()
    serializer_class = CategoriaSerializer

# Vistas para Productos
class ProductoListCreate(generics.ListCreateAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductoSerializer

class ProductoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductoSerializer

# Vistas para Presentaciones de Producto
class PresentacionProductoListCreate(generics.ListCreateAPIView):
    queryset = PresentacionesProducto.objects.all()
    serializer_class = PresentacionProductoSerializer

class PresentacionProductoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PresentacionesProducto.objects.all()
    serializer_class = PresentacionProductoSerializer

# Vistas para Merma
class MermaListCreate(generics.ListCreateAPIView):
    queryset = Merma.objects.all()
    serializer_class = MermaSerializer

class MermaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Merma.objects.all()
    serializer_class = MermaSerializer

# Vistas para Ventas
class VentaListCreate(generics.ListCreateAPIView):
    queryset = Ventas.objects.all()
    serializer_class = VentaSerializer

class VentaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ventas.objects.all()
    serializer_class = VentaSerializer

# Vistas para Detalle de Venta
class DetalleVentaListCreate(generics.ListCreateAPIView):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer

class DetalleVentaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
