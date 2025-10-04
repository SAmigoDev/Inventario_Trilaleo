from rest_framework import serializers
from .models import Producto, Categoria, PresentacionProducto, Merma, Venta, DetalleVenta, Proveedor

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='id_categoria.nombre', read_only=True)   
    class Meta:
        model = Producto
        fields = [
            'id_producto', 
            'nombre', 
            'descripcion', 
            'sku',
            'barcode',
            'stock', 
            'precio',
            'costo', 
            'min_stock',    
            'id_categoria', 
            'categoria_nombre'
        ]

class PresentacionProductoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='id_producto.nombre', read_only=True)
    class Meta:
        model = PresentacionProducto
        fields = [
            'id_presentacion', 
            'id_producto', 
            'producto_nombre', 
            'descripcion', 
            'factor', 
            'precio'
            ]

class MermaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='id_producto.nombre', read_only=True)
    class Meta:
        model = Merma
        fields = [
            'id_merma', 
            'id_producto', 
            'producto_nombre', 
            'cantidad', 
            'fecha', 
            'motivo'
            ]

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = [
            'id_venta', 
            'numero_venta', 
            'fecha', 
            'total'
        ]

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='id_presentacion.id_producto.nombre', read_only=True)
    presentacion_desc = serializers.CharField(source='id_presentacion.descripcion', read_only=True)
    class Meta:
        model = DetalleVenta
        fields = [
            'id_detalle', 
            'id_venta', 
            'id_presentacion', 
            'producto_nombre', 
            'presentacion_desc', 
            'cantidad', 
            'precio_unitario', 
            'subtotal'
            ]

class ProveedorSerializer(serializers.ModelSerializer):
    # Campo calculado para mostrar estado como texto
    estado_display = serializers.SerializerMethodField()
    class Meta:
        model = Proveedor
        fields = [
            'id_proveedor',
            'empresa',
            'contacto',
            'email',
            'telefono',
            'telefono_secundario',
            'direccion',
            'ciudad',
            'rfc',
            'productos_que_surte',
            'condiciones_pago',
            'tiempo_entrega',
            'activo',
            'estado_display',
            'fecha_registro',
            'notas'
        ]
        read_only_fields = ['fecha_registro', 'id_proveedor']
    def get_estado_display(self, obj):
        return "Activo" if obj.activo else "Inactivo"

# Serializer simplificado para listas
class ProveedorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = [
            'id_proveedor',
            'empresa', 
            'contacto',
            'email',
            'telefono',
            'ciudad',
            'productos_que_surte',
            'activo'
        ]
        
#diego jorquera y felipe seron
#funcion: update script