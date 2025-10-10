from rest_framework import serializers
from .models import Producto, Categoria, PresentacionProducto, Merma, Venta, DetalleVenta, Proveedor, MovimientoInventario

#================================================================================ CLASE CATEGORIA ================================================================================
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

#================================================================================ CLASE PRODUCTO ================================================================================
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

#================================================================================ CLASE DE PRESENTACIÓN DE PRODUCTO ================================================================================
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

#================================================================================ CLASE DE MERMA ================================================================================
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

#================================================================================ CLASE DE VENTAS ================================================================================
class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = [
            'id_venta', 
            'numero_venta', 
            'fecha', 
            'total'
        ]

#================================================================================ CLASE DE DETALLE DE VENTAS ================================================================================
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

#================================================================================ CLASE DE PROVEEDORES ================================================================================
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

#================================================================================ CLASE DE LISTA DE PROVEEDORES ================================================================================
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

#================================================================================ CLASE DE MOVIMIENTOS DEL INVENTARIO ================================================================================
class MovimientoInventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='id_producto.nombre', read_only=True)
    venta_numero = serializers.CharField(source='id_venta.numero_venta', read_only=True, allow_null=True)
    proveedor_nombre = serializers.CharField(source='id_proveedor.empresa', read_only=True, allow_null=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            'id_movimiento',
            'id_producto',
            'producto_nombre',
            'tipo',
            'cantidad',
            'stock_anterior', 
            'stock_nuevo',
            'costo_unitario',
            'precio_unitario',
            'valor_total',
            'motivo',
            'fecha_movimiento',
            'id_venta',
            'venta_numero',
            'id_proveedor',
            'proveedor_nombre',
            'usuario'
        ]