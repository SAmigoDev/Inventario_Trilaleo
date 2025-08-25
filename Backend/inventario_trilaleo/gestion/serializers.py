from rest_framework import serializers
from .models import Categorias, Productos, PresentacionesProducto, Merma, Ventas, DetalleVenta

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    # Puedes agregar campos relacionados si quieres mostrar más información
    # nombre_categoria = serializers.CharField(source='id_categoria.nombre', read_only=True)
    
    class Meta:
        model = Productos
        fields = '__all__'

class PresentacionProductoSerializer(serializers.ModelSerializer):
    # nombre_producto = serializers.CharField(source='id_producto.nombre', read_only=True)
    
    class Meta:
        model = PresentacionesProducto
        fields = '__all__'

class MermaSerializer(serializers.ModelSerializer):
    # nombre_producto = serializers.CharField(source='id_producto.nombre', read_only=True)
    
    class Meta:
        model = Merma
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ventas
        fields = '__all__'

class DetalleVentaSerializer(serializers.ModelSerializer):
    # nombre_presentacion = serializers.CharField(source='id_presentacion.descripcion', read_only=True)
    
    class Meta:
        model = DetalleVenta
        fields = '__all__'
