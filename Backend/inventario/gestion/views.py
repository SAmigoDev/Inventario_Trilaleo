from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import  Q
from .models import Categoria, Producto, PresentacionProducto, Merma, Venta, DetalleVenta, Proveedor
from .serializers import *

# CATEGORÍAS
@api_view(['GET', 'POST'])
def lista_categorias(request):
    if request.method == 'GET':
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CategoriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# PRODUCTOS
@api_view(['GET', 'POST'])
def lista_productos(request):
    if request.method == 'GET':
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def detalle_producto(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductoSerializer(producto)
        return Response(serializer.data)
    
    elif request.method == 'PUT':  # ← ESTO MANEJA LA EDICIÓN
        serializer = ProductoSerializer(producto, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        producto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#------------------------------------------------------------------------- PRESENTACIONES -------------------------------------------------------------------------------------
@api_view(['GET'])
def lista_presentaciones(request):
    if request.method == 'GET':
        presentaciones = PresentacionProducto.objects.all()
        serializer = PresentacionProductoSerializer(presentaciones, many=True)
        return Response(serializer.data)

#-------------------------------------------------------------------------- MERMAS --------------------------------------------------------------------------------------
@api_view(['GET', 'POST'])
def lista_mermas(request):
    if request.method == 'GET':
        mermas = Merma.objects.all()
        serializer = MermaSerializer(mermas, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = MermaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# VENTAS
@api_view(['GET', 'POST'])
def lista_ventas(request):
    if request.method == 'GET':
        ventas = Venta.objects.all()
        serializer = VentaSerializer(ventas, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = VentaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# DETALLE VENTA
@api_view(['GET', 'POST'])
def lista_detalle_ventas(request):
    if request.method == 'GET':
        # Filtrar por venta específica si se proporciona
        id_venta = request.GET.get('venta_id', None)
        if id_venta:
            detalles = DetalleVenta.objects.filter(id_venta=id_venta)
        else:
            detalles = DetalleVenta.objects.all()
        
        serializer = DetalleVentaSerializer(detalles, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DetalleVentaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def detalle_venta(request, pk):
    try:
        detalle = DetalleVenta.objects.get(pk=pk)
    except DetalleVenta.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = DetalleVentaSerializer(detalle)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = DetalleVentaSerializer(detalle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        detalle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'POST':
        print("Datos recibidos para detalle venta:", request.data)  # ← AGREGAR ESTO
        serializer = DetalleVentaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("Detalle de venta creado exitosamente")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errores en el serializer:", serializer.errors)  # ← AGREGAR ESTO
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#---------------------------------------------------------------- LISTA Y CREAR PROVEEDORES ---------------------------------------------------------------------------------
@api_view(['GET', 'POST'])
def lista_proveedores(request):
    if request.method == 'GET':
        # Filtrar por activos si se solicita
        activo = request.GET.get('activo', None)
        if activo is not None:
            proveedores = Proveedor.objects.filter(activo=activo.lower() == 'true')
        else:
            proveedores = Proveedor.objects.all()
        
        serializer = ProveedorListSerializer(proveedores, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProveedorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DETALLE, ACTUALIZAR Y ELIMINAR PROVEEDOR
@api_view(['GET', 'PUT', 'DELETE'])
def detalle_proveedor(request, pk):
    try:
        proveedor = Proveedor.objects.get(pk=pk)
    except Proveedor.DoesNotExist:
        return Response(
            {'error': 'Proveedor no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = ProveedorSerializer(proveedor)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProveedorSerializer(proveedor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # En lugar de eliminar, marcamos como inactivo
        proveedor.activo = False
        proveedor.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# BUSCAR PROVEEDORES
@api_view(['GET'])
def buscar_proveedores(request):
    query = request.GET.get('q', '')
    if query:
        proveedores = Proveedor.objects.filter(
            Q(empresa__icontains=query) |  # Doble underscore __
            Q(contacto__icontains=query) |
            Q(productos_que_surte__icontains=query) |  # productos_que_surte
            Q(ciudad__icontains=query)
        )
        serializer = ProveedorListSerializer(proveedores, many=True)
        return Response(serializer.data)
    return Response([])








# ACTUALIZAR Y EDICION DE PRODUCTOS
# @api_view(['PUT'])
# def actualizar_producto(request, pk):
#     try:
#         producto = Producto.objects.get(pk=pk)
#     except Producto.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     serializer = ProductoSerializer(producto, data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)