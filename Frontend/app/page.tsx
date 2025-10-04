"use client"

import type React from "react"

import { useState, useEffect } from "react"; // useEffect
import { api } from "@/lib/api"; // servicio API

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Plus,
  Minus,
  TrendingUp,
  Edit,
  Trash2,
  FileSpreadsheet,
  History,
  Bell,
  BarChart3,
  PieChart,
  Activity,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Star,
  UserCheck,
  Tag,
  Download,
  XCircle,
  Calendar,
  ShoppingBag,
  AlertCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Importar componentes personalizados
import { MetricCard } from "@/components/metric-card"
import { SidebarNav } from "@/components/sidebar-nav"
import { SalesChart, ProductsPieChart, CategoryBarChart } from "@/components/chart-components"
import { exportToExcel } from "@/utils/excel-export"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

//------------------------------------------------------------------- INTERFAZES --------------------------------------------------------------------------------
// INTERFAZ DE PRODUCTO
interface Product {
  id: number
  name: string
  sku: string
  barcode: string
  price: number
  cost: number
  stock: number
  minStock: number
  category: string  
  categoryId: number  
  description: string
  wholesalePrice: number
  expiryDate?: string
  warrantyMonths?: number
  lastSoldDate?: string
}

// INTERFAZ DE PROVEEDORES
interface Supplier {
    id_proveedor: number;           
    empresa: string;                 
    contacto: string;               
    email: string;
    telefono: string;               
    direccion: string;              
    productos_que_surte: string; 
    ciudad?: string;
    rfc?: string;
    condiciones_pago?: string;
    tiempo_entrega?: string;
    activo?: boolean;
}

// INTERFAZ DE VENTA
interface Sale {
  id: number
  saleNumber: string
  items: SaleItem[]
  subtotal: number
  total: number
  date: string
  customerId?: number
  customerName?: string
  discount: number
  promotionId?: number
  promotionName?: string
  discountBreakdown: DiscountBreakdown[]
  isWholesale: boolean
  status: "completed" | "cancelled"
  paymentMethod?: "cash" | "transfer" | "card"
}

// INTERFAZ DEL PRODUCTO VENDIDO
interface SaleItem {
  productId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
  discount: number
}

// INTERFAZ MOVIMIENTOS DE INVENTARIO
interface InventoryMovement {
  id: number
  productId: number
  productName: string
  type: "entrada" | "salida" | "ajuste"
  quantity: number
  previousStock: number
  newStock: number
  unitCost: number
  unitPrice: number
  totalCost: number
  totalValue: number
  reason: string
  date: string
}

// INTERFAZ PARA LOS DATOS DE LA API
interface ProductoFromAPI {
  id_producto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  id_categoria: number;
  categoria_nombre: string;
  precio?: number;
  costo?: number;
  min_stock?: number;
  sku?: string;
  barcode?: string;
  observaciones?: string;
}

// INTERFAZ DE CLIENTES
interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  isFrequent: boolean
  isWholesale: boolean
  totalPurchases: number
  totalSpent: number
  registrationDate: string
  lastPurchaseDate: string
  notes: string
}

// INTERFAZ PARA PROMOCIONES
interface Promotion {
  id: number
  name: string
  description: string
  discountType: "percentage" | "fixed" | "bundle"
  discountValue: number
  bundleBuy: number
  bundlePay: number
  appliesTo: "all" | "specific" | "category"
  specificProducts: number[]
  specificCategories: string[]
  minPurchase: number
  forFrequentOnly: boolean
  isActive: boolean
  startDate: string
  endDate: string
}

// INTERFAZ PARA DESGLOSE DE DESCUENTOS
interface DiscountBreakdown {
  productId: number
  productName: string
  promotionName: string
  discountAmount: number
}

interface VentaFromAPI {
  id_venta: number;
  numero_venta: string;
  id_cliente: number | null;
  id_promocion: number | null;
  subtotal: number;
  descuento: number;
  total: number;
  fecha: string;
  metodo_pago: string;
  es_mayorista: boolean;
  estado: string;
}

interface DetalleVentaFromAPI {
  id_detalle: number; 
  id_presentacion: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const EditProductForm: React.FC<{ 
    product: Product; 
    onSave: (product: Product) => void; 
    onCancel: () => void;
    categories: any[];
  }> = ({
    product,
    onSave,
    onCancel,
    categories
  }) => {
    const [editedProduct, setEditedProduct] = useState(product)

    const handleSave = () => {
      onSave(editedProduct)
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="edit-product-name">Nombre</Label>
          <Input
            id="edit-product-name"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            placeholder="Nombre del producto"
          />
        </div>
        
        {/* QUITAMOS EL CAMPO SKU EDITABLE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-product-sku">SKU</Label>
            <div className="p-2 border rounded-md bg-gray-50 text-gray-600">
              {editedProduct.sku}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              El SKU no se puede modificar
            </p>
          </div>
          <div>
            <Label htmlFor="edit-product-barcode">Código de Barras</Label>
            <Input
              id="edit-product-barcode"
              value={editedProduct.barcode}
              onChange={(e) => setEditedProduct({ ...editedProduct, barcode: e.target.value })}
              placeholder="7501234567890"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="edit-product-price">Precio</Label>
            <Input
              id="edit-product-price"
              type="number"
              value={editedProduct.price}
              onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="edit-product-cost">Costo</Label>
            <Input
              id="edit-product-cost"
              type="number"
              value={editedProduct.cost}
              onChange={(e) => setEditedProduct({ ...editedProduct, cost: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="edit-product-stock">Stock</Label>
            <Input
              id="edit-product-stock"
              type="number"
              value={editedProduct.stock}
              onChange={(e) => setEditedProduct({ ...editedProduct, stock: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-product-minstock">Stock Mínimo</Label>
            <Input
              id="edit-product-minstock"
              type="number"
              value={editedProduct.minStock}
              onChange={(e) => setEditedProduct({ ...editedProduct, minStock: Number(e.target.value) })}
              placeholder="1"
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="edit-product-category">Categoría</Label>
            <Select
              value={editedProduct.category}
              onValueChange={(value) => setEditedProduct({ ...editedProduct, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id_categoria} value={category.nombre}>
                    {category.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="edit-product-description">Descripción</Label>
          <Textarea
            id="edit-product-description"
            value={editedProduct.description}
            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
            placeholder="Descripción del producto"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    )
  }

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default function BusinessSalesSystem() {
  // Estados
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null)
  const [currentSubtotal, setCurrentSubtotal] = useState(0)
  const [currentDiscount, setCurrentDiscount] = useState(0)
  const [currentTotal, setCurrentTotal] = useState(0)
  const [currentBreakdown, setCurrentBreakdown] = useState<DiscountBreakdown[]>([])
  const [movementCounter, setMovementCounter] = useState(0)
  
// ------------------------------------------------------ FUNCION ADICION DE DATOS AL BACKEND ---------------------------------------------------------------
  // Función para adaptar datos del frontend al backend
  const adaptProductToAPI = (product: any) => {
    return {
      nombre: product.name,           // frontend: name → backend: nombre
      descripcion: product.description,
      sku: product.sku,
      barcode: product.barcode,
      precio: product.price,          // frontend: price → backend: precio
      stock: product.stock,
      // Necesitas el ID de categoría, no el nombre
      id_categoria: 1, // ← TEMPORAL: Cambia esto por un select de categorías
    };
  };

//---------------------------------------------------------------------------------------- FUNCIONES DE PROVEEDORES --------------------------------------------------------------------------------------------------

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([]);
  // console.log('📦 Productos disponibles en estado:', products.length, 'productos');
  // console.log('🔍 Primeros 3 productos:', products.slice(0, 3).map(p => ({
  //   id: p.id,
  //   name: p.name
  // })));
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1); // Valor por defecto
  const DEFAULT_MIN_STOCK = 5;
  // Carga de categorías al iniciar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriasData = await api.getCategories();
        setCategories(categoriasData);
        if (categoriasData.length > 0) {
          setSelectedCategoryId(categoriasData[0].id_categoria);
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };
    loadCategories();
  }, []);

//----------------------------------------------------------------------------------------- CARGA DE DATOS DESDE LA API ------------------------------------------------------------------------------------------------
  // 2. MODIFICAR LA ADAPTACIÓN DE PRODUCTOS DESDE LA API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productosData: ProductoFromAPI[] = await api.getProducts();
        const adaptedProducts: Product[] = productosData.map(producto => ({
          id: producto.id_producto,           
          name: producto.nombre,              
          sku: producto.sku || `SKU-${producto.id_producto}`,
          barcode: producto.barcode || "",    
          price: producto.precio || 0,        
          cost: producto.costo || 0,            
          stock: producto.stock,              
          minStock: producto.min_stock || DEFAULT_MIN_STOCK,
          category: producto.categoria_nombre, 
          categoryId: producto.id_categoria,  // ← GUARDAR EL ID
          description: producto.descripcion,  
          wholesalePrice: producto.precio ? producto.precio * 0.9 : 0,
        }));
        setProducts(adaptedProducts);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    };
    loadProducts();
  }, []);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  // CARGA DATOS PROVEEDORES DESDE LA API
  const loadSuppliers = async () => {
      try {
          setLoading(true);
          const proveedoresData = await api.getProveedores();
          setSuppliers(proveedoresData);
      } catch (error) {
          console.error('Error cargando proveedores:', error);
          setSuppliers([]);
      } finally {
          setLoading(false);
      }
  };
  // FUNCIÓN PARA AGREGAR NUEVO PROVEEDOR
  const handleAddSupplier = async (newSupplier: Omit<Supplier, 'id_proveedor'>) => {
      try {
          const createdSupplier = await api.createProveedor(newSupplier);
          setSuppliers(prev => [...prev, createdSupplier]);
          return createdSupplier;
      } catch (error) {
          console.error('Error creando proveedor:', error);
          throw error;
      }
  };
  // FUNCIÓN PARA EDITAR PROVEEDOR
  const handleEditSupplier = async (id: number, updatedData: Partial<Supplier>) => {
      try {
          const updatedSupplier = await api.updateProveedor(id, updatedData);
          setSuppliers(prev => prev.map(s => 
              s.id_proveedor === id ? updatedSupplier : s
          ));
          return updatedSupplier;
      } catch (error) {
          console.error('Error actualizando proveedor:', error);
          throw error;
      }
  };
  // Función para eliminar proveedor
  const handleDeleteSupplier = async (id: number) => {
      try {
          await api.deleteProveedor(id);
          setSuppliers(prev => prev.filter(s => s.id_proveedor !== id));
      } catch (error) {
          console.error('Error eliminando proveedor:', error);
          throw error;
      }
  };
  // FUNCIÓN PARA BUSCAR PROVEEDORES
  const handleSearchSuppliers = async (query: string) => {
      try {
          if (query.trim() === '') {
              loadSuppliers();
              return;
          }
          const resultados = await api.searchProveedores(query);
          setSuppliers(resultados);
      } catch (error) {
          console.error('Error buscando proveedores:', error);
      }
  };
  useEffect(() => {
      loadSuppliers();
  }, []);

// ----------------------------------------------------------- FUNCION EXPORTAR PROVEEDORES ---------------------------------------------------------------------------

  const exportSuppliersToExcel = () => {
    const data = suppliers.map((supplier) => ({
      Empresa: supplier.empresa,
      Contacto: supplier.contacto,
      Email: supplier.email,
      Teléfono: supplier.telefono,
      Dirección: supplier.direccion,
      Ciudad: supplier.ciudad || "",
      RFC: supplier.rfc || "",
      "Condiciones de Pago": supplier.condiciones_pago || "",
      "Tiempo de Entrega": supplier.tiempo_entrega || "",
      "Productos que Surte": supplier.productos_que_surte,
      Estado: supplier.activo ? "Activo" : "Inactivo"
    }))

    exportToExcel(data, "proveedores", "Lista de Proveedores")
  }

// ----------------------------------------------------------- Detalle Ventas ---------------------------------------------------------------------------

  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    loadSalesFromDB()
  }, [])

  const loadSalesFromDB = async () => {
    try {
      // console.log('🔄 Cargando ventas desde la BD...');
      const ventasData = await api.getVentas()
      // console.log('📊 Ventas obtenidas de la BD:', ventasData.length, 'ventas');

      // ORDEN POR ID (MÁS RECIENTE PRIMERO)
      const ventasOrdenadas = [...ventasData].sort((a, b) => b.id_venta - a.id_venta);

      const ultimaVenta = ventasOrdenadas[0];
      // console.log('🔍 Última venta (más reciente):', ultimaVenta);
      
      const salesWithDetails = await Promise.all(
        ventasOrdenadas.map(async (venta: VentaFromAPI) => {
          const detallesData: DetalleVentaFromAPI[] = await api.getDetalleVenta(venta.id_venta);
          const clienteInfo = venta.id_cliente ? await api.getCliente(venta.id_cliente) : null
          const promocionInfo = venta.id_promocion ? await api.getPromocion(venta.id_promocion) : null

          const itemsConNombresReales = detallesData.map(detalle => {
            // Busca el producto por ID en nuestro estado local
            const product = products.find(p => p.id === detalle.id_presentacion);
            
            let nombreFinal;
            
            if (product) {
              nombreFinal = product.name; 
            } else if (detalle.nombre_producto && detalle.nombre_producto !== 'Producto') {
              nombreFinal = detalle.nombre_producto;
            } else {
              nombreFinal = detalle.nombre_producto || 'Producto Desconocido';
            }

            // DEBUG para ventas recientes
            // if (venta.id_venta >= 40) { // Últimas 5 ventas
            //   console.log('🔍 Mapeando producto venta', venta.id_venta, ':', {
            //     detalleId: detalle.id_detalle,
            //     id_presentacion: detalle.id_presentacion,
            //     nombreBD: detalle.nombre_producto,
            //     productFound: product ? `${product.id}: ${product.name}` : 'NO ENCONTRADO',
            //     nombreFinal: nombreFinal
            //   });
            // }

            return {
              productId: detalle.id_presentacion,
              productName: nombreFinal, // 🔥 NOMBRE CORREGIDO
              quantity: detalle.cantidad,
              price: detalle.precio_unitario,
              discount: detalle.descuento || 0,
              subtotal: detalle.subtotal
            }
          });    

          return {
            id: venta.id_venta,
            saleNumber: venta.numero_venta,
            customerId: venta.id_cliente || undefined,
            customerName: clienteInfo?.nombre || undefined,
            items: itemsConNombresReales, // 🔥 ITEMS CON NOMBRES REALES
            subtotal: venta.subtotal || detallesData.reduce((sum, d) => sum + d.subtotal, 0),
            discount: venta.descuento || 0,
            promotionId: venta.id_promocion || undefined,
            promotionName: promocionInfo?.nombre || undefined,
            discountBreakdown: [],
            total: venta.total,
            date: venta.fecha,
            paymentMethod: mapPaymentMethod(venta.metodo_pago),
            isWholesale: venta.es_mayorista || false,
            status: mapSaleStatus(venta.estado)
          }
        })
      )      
      // console.log('✅ Ventas procesadas y ordenadas:', salesWithDetails.length);

      // VERIFICACION DE ÚLTIMAS VENTAS
      const ultimasVentas = salesWithDetails.slice(0, 3);
      // console.log('🔍 Últimas 3 ventas procesadas:', ultimasVentas.map(v => ({
      //   id: v.id,
      //   saleNumber: v.saleNumber,
      //   items: v.items.map(i => `${i.productName} x${i.quantity}`)
      // })));
      
      setSales(salesWithDetails)
      
    } catch (error) {
      console.error('❌ Error cargando ventas:', error)
    }
  }

  // Funciones helper para mapear valores
  const mapPaymentMethod = (metodo: string): "cash" | "transfer" | "card" => {
    switch(metodo) {
      case 'efectivo': return 'cash'
      case 'transferencia': return 'transfer'
      case 'tarjeta': return 'card'
      default: return 'cash'
    }
  }

  const mapPaymentMethodToDB = (method: "cash" | "transfer" | "card"): string => {
    switch(method) {
      case 'cash': return 'efectivo'
      case 'transfer': return 'transferencia'
      case 'card': return 'tarjeta'
      default: return 'efectivo'
    }
  }

  const mapSaleStatus = (estado: string): "completed" | "cancelled" => {
    switch(estado) {
      case 'completada': return 'completed'
      case 'cancelada': return 'cancelled'
      default: return 'completed'
    }
  }

//--------------------------------------------------------- ----------------------------------------------------------------------------------

const completeSale = async () => {
  if (cart.length === 0) return

  try {
    // console.log('🛒 Iniciando venta con carrito:', cart);

    // Preparacion de datos para la BD
    const saleData = {
      numero_venta: `V-${Date.now().toString().slice(-6)}`,
      id_cliente: selectedCustomer?.id || null,
      id_promocion: currentPromotion?.id || null,
      subtotal: Number(currentSubtotal),
      descuento: Number(currentDiscount),
      total: Number(currentTotal) || 0.01,
      fecha: new Date().toISOString().split('T')[0],
      metodo_pago: mapPaymentMethodToDB(paymentMethod),
      es_mayorista: selectedCustomer?.isWholesale || false,
      estado: 'completada'
    }

    // console.log('📤 Enviando venta a BD:', saleData)
    
    // Guardado de venta en BD
    const ventaCreada = await api.createVenta(saleData)
    // console.log('✅ Venta creada en BD:', ventaCreada)

    // OBTENER PRESENTACIONES DE LA BD
    let presentaciones = [];
    try {
      presentaciones = await api.getPresentaciones();
      // console.log('🔍 Presentaciones obtenidas:', presentaciones.length);
    } catch (error) {
      // console.warn('⚠️ Error cargando presentaciones:', error);
    }

    // GUARDAR DETALLES DE VENTA
    // console.log('🔄 Creando detalles de venta...');
    
    for (const item of cart) {
      let id_presentacion = null;
      
      if (presentaciones.length > 0) {
        const presentacion = presentaciones.find((p: any) => p.id_producto === item.productId);
        if (presentacion) {
          id_presentacion = presentacion.id_presentacion;
          // console.log(`✅ Presentación encontrada: ${id_presentacion} para producto ${item.productId}`);
        } else {
          id_presentacion = presentaciones[0].id_presentacion;
          // console.warn(`⚠️ Usando presentación por defecto: ${id_presentacion}`);
        }
      } else {
        throw new Error('No hay presentaciones configuradas en el sistema');
      }

      const itemData = {
        id_venta: ventaCreada.id_venta,
        id_presentacion: id_presentacion,
        cantidad: item.quantity,
        precio_unitario: Number(item.price),
        descuento: Number(item.discount) || 0,
        subtotal: Number(item.subtotal),
        nombre_producto: item.productName
      }
      
      // console.log('📦 Enviando detalle:', itemData);
      const resultadoDetalle = await api.createDetalleVenta(itemData);
      // console.log('✅ Detalle creado:', resultadoDetalle);
    }

    // console.log('🎉 Todos los detalles creados exitosamente');

    // 🔥 LUEGO ACTUALIZAR STOCK
    console.log('📊 Actualizando stock en BD...');
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const nuevoStock = product.stock - item.quantity;
        console.log(`🔄 Actualizando stock producto ${product.id}: ${product.stock} -> ${nuevoStock}`);
        await updateStockInDatabase(product.id, nuevoStock);
      }
    }

    // 🔥 RECARGAR DATOS
    console.log('🔄 Recargando ventas desde BD...');
    await loadSalesFromDB();

    console.log('🔄 Recargando productos desde BD...');
    await loadProducts();

    console.log('✅ Datos recargados desde BD');

    // 🔥 AGREGAR MOVIMIENTOS DE INVENTARIO
    console.log('📦 Agregando movimientos de inventario...');
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const nuevoStock = product.stock - item.quantity;
        addInventoryMovement(
          product.id,
          product.name,
          "salida",
          item.quantity,
          product.stock,
          nuevoStock,
          `Venta ${ventaCreada.numero_venta}`,
        );
        console.log(`📝 Movimiento agregado para ${product.name}`);
      }
    }

    // Limpiar carrito
    setCart([]);
    setSelectedCustomer(null);
    setCurrentSubtotal(0);
    setCurrentDiscount(0);
    setCurrentTotal(0);
    setCurrentBreakdown([]);
    setCurrentPromotion(null);
    
    console.log('🎉 Venta completada y datos persistidos');
    alert('✅ Venta completada exitosamente!');

  } catch (error: any) {
    console.error('❌ Error completando venta:', error)
    alert('Error al procesar la venta: ' + error.message)
  }
}

//------------------------------------------------------- FUNCIONES ---------------------------------------------------------------------
  
  const [cart, setCart] = useState<SaleItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

//------------------------------------------------------- ESTADO CLIENTES/PROMOCIONES/ESTADO CARRO/ ---------------------------------------------------------------------

  // Estados para clientes
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Estados para promociones
  const [promotions, setPromotions] = useState<Promotion[]>([])

  // Estados para el carrito mejorado
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "card">("cash")

  const [newPromotion, setNewPromotion] = useState({
  name: "",
  description: "",
  discountType: "percentage" as "percentage" | "fixed" | "bundle",
  discountValue: 0,
  bundleBuy: 0,
  bundlePay: 0,
  appliesTo: "all" as "all" | "specific" | "category",
  specificProducts: [] as number[],
  specificCategories: [] as string[],
  minPurchase: 0,
  forFrequentOnly: false,
  isActive: true,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
})

//------------------------------------------------------ FUNCION PARA CALCULAR DESCUENTOS POR PRODUCTO ----------------------------------------------------------------

  const calculateProductDiscount = (
    productId: number,
    productPrice: number,
    quantity: number,
    customer: Customer | null,
  ): { discount: number; promotion: Promotion | null } => {
    const product = products.find((p) => p.id === productId)
    if (!product) return { discount: 0, promotion: null }

    const today = new Date().toISOString().split("T")[0]
    let bestDiscount = 0
    let bestPromotion: Promotion | null = null

    promotions.forEach((promo) => {
      if (
        !promo.isActive ||
        promo.startDate > today ||
        promo.endDate < today ||
        (promo.forFrequentOnly && (!customer || !customer.isFrequent))
      ) {
        return
      }

      let applies = false
      if (promo.appliesTo === "all") {
        applies = true
      } else if (promo.appliesTo === "specific" && promo.specificProducts.includes(productId)) {
        applies = true
      } else if (promo.appliesTo === "category" && promo.specificCategories.includes(product.category)) {
        applies = true
      }

      if (!applies) return

      let discount = 0
      if (promo.discountType === "percentage") {
        discount = (productPrice * quantity * promo.discountValue) / 100
      } else if (promo.discountType === "fixed") {
        discount = Math.min(promo.discountValue, productPrice * quantity)
      } else if (promo.discountType === "bundle") {
        if (quantity >= promo.bundleBuy) {
          const sets = Math.floor(quantity / promo.bundleBuy)
          const itemsToDiscount = sets * (promo.bundleBuy - promo.bundlePay)
          discount = itemsToDiscount * productPrice
        }
      }

      if (discount > bestDiscount) {
        bestDiscount = discount
        bestPromotion = promo
      }
    })

    return { discount: bestDiscount, promotion: bestPromotion }
  }

//----------------------------------------------------------- FUNCION PARA GESTION DE CLIENTES ----------------------------------------------------------------------------

  const addCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      const customer: Customer = {
        id: Date.now(),
        ...newCustomer,
        isFrequent: false,
        totalPurchases: 0,
        totalSpent: 0,
        registrationDate: new Date().toISOString(),
        lastPurchaseDate: "",
      }
      setCustomers([...customers, customer])
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        isWholesale: false,
      })
      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement
      if (closeButton) closeButton.click()
    }
  }

  const deleteCustomer = (customerId: number) => {
    setCustomers(customers.filter((c) => c.id !== customerId))
  }

//------------------------------------------------------ FUNCION PARA GESTION DE PROMOCIONES ---------------------------------------------------------------------------------

  const addPromotion = () => {
    if (newPromotion.name) {
      if (newPromotion.discountType === "bundle") {
        if (
          newPromotion.bundleBuy <= 0 ||
          newPromotion.bundlePay <= 0 ||
          newPromotion.bundleBuy <= newPromotion.bundlePay
        ) {
          alert("Para ofertas X por Y, debes especificar cantidades válidas (ejemplo: compra 3, paga 2)")
          return
        }
      } else if (newPromotion.discountValue <= 0) {
        alert("Debes especificar un valor de descuento")
        return
      }

      const promotion: Promotion = {
        id: Date.now(),
        ...newPromotion,
      }
      setPromotions([...promotions, promotion])
      setNewPromotion({
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        bundleBuy: 0,
        bundlePay: 0,
        appliesTo: "all",
        specificProducts: [],
        specificCategories: [],
        minPurchase: 0,
        forFrequentOnly: false,
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      })
      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement
      if (closeButton) closeButton.click()
    }
  }

  const togglePromotionStatus = (promotionId: number) => {
    setPromotions(promotions.map((p) => (p.id === promotionId ? { ...p, isActive: !p.isActive } : p)))
  }

  const deletePromotion = (promotionId: number) => {
    setPromotions(promotions.filter((p) => p.id !== promotionId))
  }

//------------------------------------------------------------- FUNCION PARA CANCELAR VENTA ------------------------------------------------------------------------------

  const cancelSale = (saleId: number) => {
    const sale = sales.find((s) => s.id === saleId)
    if (!sale || sale.status === "cancelled") return

    // Restaurar stock
    sale.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        updateStock(product.id, product.stock + item.quantity, `Anulación de venta ${sale.saleNumber}`)
      }
    })

    // Actualizar estado de la venta
    setSales(sales.map((s) => (s.id === saleId ? { ...s, status: "cancelled" } : s)))

    // Actualizar cliente si existe
    if (sale.customerId) {
      setCustomers(
        customers.map((c) => {
          if (c.id === sale.customerId) {
            return {
              ...c,
              totalPurchases: Math.max(0, c.totalPurchases - 1),
              totalSpent: Math.max(0, c.totalSpent - sale.total),
              isFrequent: c.totalPurchases - 1 >= 5,
            }
          }
          return c
        }),
      )
    }
  }

//------------------------------------------------------ FUNCION PARA CALCULAR DESCUENTOS DEL CARRITO ----------------------------------------------------------------

  const calculateCartDiscount = (cartItems: SaleItem[], customer: Customer | null) => {
    let totalDiscount = 0
    const discountBreakdown: DiscountBreakdown[] = []
    let appliedPromotion: Promotion | null = null

    cartItems.forEach((item) => {
      const { discount, promotion } = calculateProductDiscount(item.productId, item.price, item.quantity, customer)
      if (discount > 0 && promotion) {
        totalDiscount += discount
        discountBreakdown.push({
          productId: item.productId,
          productName: item.productName,
          promotionName: promotion.name,
          discountAmount: discount,
        })
        if (!appliedPromotion) appliedPromotion = promotion
      }
    })

    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
    if (appliedPromotion && subtotal < (appliedPromotion as Promotion).minPurchase) {
      return { discount: 0, promotion: null, breakdown: [] }
    }

    return { discount: totalDiscount, promotion: appliedPromotion, breakdown: discountBreakdown }
  }

  // AGREGAR ESTE USEEFFECT JUSTO AQUÍ
  // Efecto para calcular descuentos automáticamente cuando cambia el carrito
  useEffect(() => {
    if (cart.length === 0) {
      setCurrentSubtotal(0)
      setCurrentDiscount(0)
      setCurrentTotal(0)
      setCurrentBreakdown([])
      setCurrentPromotion(null)
      return
    }

    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
    const { discount, promotion, breakdown } = calculateCartDiscount(cart, selectedCustomer)
    
    setCurrentSubtotal(subtotal)
    setCurrentDiscount(discount)
    setCurrentTotal(subtotal - discount)
    setCurrentBreakdown(breakdown)
    setCurrentPromotion(promotion)
  }, [cart, selectedCustomer])

//----------------------------------------------------------------- FUNCION PARA BUSQUEDA ---------------------------------------------------------------------------------

  const searchCustomers = (term: string) => {
    if (!term) return customers

    const searchLower = term.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(term),
    )
  }

//----------------------------------------------------------------- FUNCIONES DE EXPORTACION ---------------------------------------------------------------------------------

  const exportCustomersToExcel = () => {
    const data = customers.map((customer) => ({
      Nombre: customer.name,
      Email: customer.email,
      Teléfono: customer.phone,
      Tipo: customer.isWholesale ? "Mayorista" : "Minorista",
      Estado: customer.isFrequent ? "VIP ⭐" : "Regular",
      "Total Compras": customer.totalPurchases,
      "Total Gastado": `$${customer.totalSpent.toFixed(2)}`,
      "Ticket Promedio":
        customer.totalPurchases > 0 ? `$${(customer.totalSpent / customer.totalPurchases).toFixed(2)}` : "$0.00",
      "Última Compra": customer.lastPurchaseDate
        ? new Date(customer.lastPurchaseDate).toLocaleDateString()
        : "Sin compras",
      Notas: customer.notes,
    }))

    exportToExcel(data, "clientes", "Base de Clientes")
  }

  const exportPromotionsToExcel = () => {
    const data = promotions.map((promo) => {
      const uses = sales.filter((s) => s.promotionId === promo.id).length
      const totalDiscounted = sales.filter((s) => s.promotionId === promo.id).reduce((sum, s) => sum + s.discount, 0)

      let appliesTo = ""
      if (promo.appliesTo === "all") {
        appliesTo = "Todos los productos"
      } else if (promo.appliesTo === "specific") {
        const productNames = promo.specificProducts
          .map((id) => products.find((p) => p.id === id)?.name)
          .filter(Boolean)
          .join(", ")
        appliesTo = `Productos: ${productNames}`
      } else if (promo.appliesTo === "category") {
        appliesTo = `Categorías: ${promo.specificCategories.join(", ")}`
      }

      let discountDescription = ""
      if (promo.discountType === "percentage") {
        discountDescription = `${promo.discountValue}% de descuento`
      } else if (promo.discountType === "fixed") {
        discountDescription = `$${promo.discountValue} de descuento`
      } else if (promo.discountType === "bundle") {
        discountDescription = `${promo.bundleBuy}x${promo.bundlePay}`
      }
      return {
        Promoción: promo.name,
        Descripción: promo.description,
        "Aplica a": appliesTo,
        Tipo:
          promo.discountType === "percentage"
            ? "Porcentaje"
            : promo.discountType === "fixed"
              ? "Monto Fijo"
              : "X por Y",
        Descuento: discountDescription,
        "Compra Mínima": `$${promo.minPurchase.toFixed(2)}`,
        "Solo VIP": promo.forFrequentOnly ? "Sí" : "No",
        Estado: promo.isActive ? "Activa ✓" : "Inactiva ✗",
        Usos: uses,
        "Total Descontado": `$${totalDiscounted.toFixed(2)}`,
        Vigencia: `${promo.startDate} - ${promo.endDate}`,
      }
    })
    exportToExcel(data, "promociones", "Promociones")
  }

  const exportPaymentMethodsReport = () => {
    const cashSales = sales.filter((s) => s.paymentMethod === "cash" && s.status === "completed")
    const transferSales = sales.filter((s) => s.paymentMethod === "transfer" && s.status === "completed")
    const cardSales = sales.filter((s) => s.paymentMethod === "card" && s.status === "completed")
    const data = [
      {
        "Método de Pago": "Efectivo",
        "Cantidad de Ventas": cashSales.length,
        "Total Recaudado": `$${cashSales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}`,
      },
      {
        "Método de Pago": "Transferencia",
        "Cantidad de Ventas": transferSales.length,
        "Total Recaudado": `$${transferSales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}`,
      },
      {
        "Método de Pago": "Tarjeta",
        "Cantidad de Ventas": cardSales.length,
        "Total Recaudado": `$${cardSales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}`,
      },
      {
        "Método de Pago": "TOTAL",
        "Cantidad de Ventas": cashSales.length + transferSales.length + cardSales.length,
        "Total Recaudado": `$${sales
          .filter((s) => s.status === "completed")
          .reduce((sum, s) => sum + s.total, 0)
          .toFixed(2)}`,
      },
    ]
    exportToExcel(data, "ventas-metodo-pago", "Ventas por Método de Pago")
  }

  const exportCategoryReport = () => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)))
    const categoryData = uniqueCategories.map((category) => {
      const categoryProducts = products.filter((p) => p.category === category)
      const categoryStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0)
      const categoryValue = categoryProducts.reduce((sum, p) => sum + p.stock * p.price, 0)
      return {
        Categoría: category,
        "Total Productos": categoryProducts.length,
        "Stock Total": categoryStock,
        "Valor Total": `$${categoryValue.toFixed(2)}`,
      }
    })
    exportToExcel(categoryData, "stock-por-categoria", "Stock por Categoría")
  }

  const exportExpiringProducts = () => {
    const today = new Date()
    const threeMonthsFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

    const expiringProducts = products
      .filter((p) => {
        if (!p.expiryDate) return false
        const expiryDate = new Date(p.expiryDate)
        return expiryDate <= threeMonthsFromNow
      })
      .map((p) => ({
        Producto: p.name,
        SKU: p.sku,
        Categoría: p.category,
        Stock: p.stock,
        "Fecha de Vencimiento": p.expiryDate,
        "Días para Vencer": Math.ceil((new Date(p.expiryDate!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        Estado:
          new Date(p.expiryDate!) < today
            ? "VENCIDO"
            : new Date(p.expiryDate!).getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000
              ? "CRÍTICO"
              : "PRÓXIMO A VENCER",
      }))

    exportToExcel(expiringProducts, "productos-proximos-vencer", "Productos Próximos a Vencer")
  }

  const exportObsoleteProducts = () => {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)

    const obsoleteProducts = products
      .filter((p) => {
        if (!p.lastSoldDate) return p.stock > 0
        return new Date(p.lastSoldDate) < sixtyDaysAgo && p.stock > 0
      })
      .map((p) => ({
        Producto: p.name,
        SKU: p.sku,
        Categoría: p.category,
        Stock: p.stock,
        "Última Venta": p.lastSoldDate ? new Date(p.lastSoldDate).toLocaleDateString() : "Nunca",
        "Días sin Vender": p.lastSoldDate
          ? Math.ceil((Date.now() - new Date(p.lastSoldDate).getTime()) / (1000 * 60 * 60 * 24))
          : "N/A",
        "Valor en Stock": `$${(p.stock * p.price).toFixed(2)}`,
      }))

    exportToExcel(obsoleteProducts, "productos-obsoletos", "Productos Obsoletos")
  }

  const exportProfitableProducts = () => {
    const productSales = products.map((product) => {
      const totalSold = sales
        .filter((s) => s.status === "completed")
        .reduce((sum, sale) => {
          const item = sale.items.find((item) => item.productId === product.id)
          return sum + (item ? item.quantity : 0)
        }, 0)

      const totalRevenue = sales
        .filter((s) => s.status === "completed")
        .reduce((sum, sale) => {
          const item = sale.items.find((item) => item.productId === product.id)
          return sum + (item ? item.subtotal : 0)
        }, 0)

      const totalProfit = totalSold * (product.price - product.cost)

      return {
        Producto: product.name,
        SKU: product.sku,
        Categoría: product.category,
        "Unidades Vendidas": totalSold,
        "Ingresos Totales": `$${totalRevenue.toFixed(2)}`,
        "Ganancia Total": `$${totalProfit.toFixed(2)}`,
        "Ganancia por Unidad": `$${(product.price - product.cost).toFixed(2)}`,
        "Margen %": product.cost > 0 ? `${(((product.price - product.cost) / product.cost) * 100).toFixed(1)}%` : "0%",
      }
    })

    const sortedByProfit = productSales.sort((a, b) => {
      const profitA = Number.parseFloat(a["Ganancia Total"].replace("$", ""))
      const profitB = Number.parseFloat(b["Ganancia Total"].replace("$", ""))
      return profitB - profitA
    })

    exportToExcel(sortedByProfit, "productos-rentables", "Productos Más Rentables")
  }

//----------------------------------------------------------------- ESTADOS PARA BACKUP Y RECUPERACIÓN ---------------------------------------------------------------------

  const [salesBackup, setSalesBackup] = useState<Sale[]>([])
  const [inventoryMovementsBackup, setInventoryMovementsBackup] = useState<InventoryMovement[]>([])
  const [showRecoverySales, setShowRecoverySales] = useState(false)
  const [showRecoveryInventory, setShowRecoveryInventory] = useState(false)

  //----------------------------------------------------------------- FORMULARIOS ---------------------------------------------------------------------
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    barcode: "",
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 1,
    category: "",
    description: "Producto sin descripción",
    observations: "",
  })

  const [newSupplier, setNewSupplier] = useState({
    empresa: "",           
    contacto: "",          
    email: "",
    telefono: "",           
    direccion: "",         
    productos_que_surte: "",
    ciudad: "",
    rfc: "",
    condiciones_pago: "",
    tiempo_entrega: "",
  });

  // Formularios nuevos
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    isWholesale: false,
  })

//------------------------------------------------------- FUNCIONES DE RESET Y RECUPERACIÓN ---------------------------------------------------------------------------

  const resetSalesHistory = () => {
    setSalesBackup([...sales])
    setSales([])
    setShowRecoverySales(true)
    setTimeout(() => setShowRecoverySales(false), 10000) // Mostrar por 10 segundos
  }

  const resetInventoryMovements = () => {
    setInventoryMovementsBackup([...inventoryMovements])
    setInventoryMovements([])
    setShowRecoveryInventory(true)
    setTimeout(() => setShowRecoveryInventory(false), 10000) // Mostrar por 10 segundos
  }

  const recoverSalesHistory = () => {
    setSales([...salesBackup])
    setSalesBackup([])
    setShowRecoverySales(false)
  }

  const recoverInventoryMovements = () => {
    setInventoryMovements([...inventoryMovementsBackup])
    setInventoryMovementsBackup([])
    setShowRecoveryInventory(false)
  }

//------------------------------------------------------------------------------------ FUNCION PARA AÑADIR PRODUCTO --------------------------------------------------------------------------------------------

  const addProduct = async () => {
    // Validación mejorada
    if (!newProduct.name || newProduct.price <= 0 || !newProduct.description) {
      alert('Por favor completa: Nombre, Precio (mayor a 0) y Descripción');
      return;
    }

    try {
      console.log('🔄 Agregando nuevo producto...', newProduct);

      // 1. GENERAR SKU AUTOMÁTICO
      const ultimoSKU = products.reduce((max, product) => {
        const skuNum = parseInt(product.sku.replace('SKU-', ''));
        return isNaN(skuNum) ? max : Math.max(max, skuNum);
      }, 0);
      
      const nuevoSKUNumero = ultimoSKU + 1;
      const skuGenerado = `SKU-${nuevoSKUNumero.toString().padStart(3, '0')}`;
      
      console.log('🔢 SKU generado:', skuGenerado);

      // 2. PREPARAR DATOS PARA LA BD
      const productData = {
        nombre: newProduct.name,
        descripcion: newProduct.description,
        sku: skuGenerado,
        barcode: newProduct.barcode || "",
        precio: newProduct.price,
        costo: newProduct.cost || 0,
        stock: newProduct.stock || 0,
        min_stock: newProduct.minStock || 1,
        id_categoria: selectedCategoryId,
      };

      console.log('🔍 Categoría seleccionada:', selectedCategoryId);
      console.log('📤 Enviando producto a BD:', productData);

      // 3. GUARDAR EN LA BD PRIMERO
      const productoCreado = await api.createProducto(productData);
      console.log('✅ Producto creado en BD:', productoCreado);

      // 4. OBTENER EL NOMBRE DE LA CATEGORÍA
      const categoriaNombre = categories.find(cat => cat.id_categoria === selectedCategoryId)?.nombre || "General";

      // 5. CREAR OBJETO PARA EL ESTADO LOCAL
      const product: Product = {
        id: productoCreado.id_producto,
        name: newProduct.name,
        sku: skuGenerado,
        barcode: newProduct.barcode,
        price: newProduct.price,
        cost: newProduct.cost,
        stock: newProduct.stock,
        minStock: newProduct.minStock,
        category: categoriaNombre,
        categoryId: selectedCategoryId,
        description: newProduct.description,
        wholesalePrice: newProduct.price * 0.9,
        expiryDate: undefined,
        warrantyMonths: undefined,
        lastSoldDate: undefined
      };

      // 6. ACTUALIZAR ESTADO LOCAL
      setProducts([...products, product]);
      
      console.log('✅ Producto agregado al estado local');

      // 7. LIMPIAR FORMULARIO
      setNewProduct({
        name: "",
        sku: "",
        barcode: "",
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 1,
        category: "",
        description: "",
        observations: "",
      });

      console.log('✅ Producto agregado exitosamente!');

      // 8. CERRAR DIÁLOGO
      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
      if (closeButton) closeButton.click();

    } catch (error: any) {
      console.error('❌ Error agregando producto:', error);
      alert('Error al agregar el producto: ' + error.message);
    }
  };

//----------------------------------------------------------------------------- FUNCION ACTUALIZAR STOCK EN BD ------------------------------------------------------------------------------------------------------

  // FUNCIÓN AUXILIAR PARA ACTUALIZAR STOCK EN BD
  const updateStockInDatabase = async (productId: number, newStock: number) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        console.error('Producto no encontrado:', productId);
        return;
      }

      const productData = {
        nombre: product.name,
        descripcion: product.description,
        sku: product.sku,
        barcode: product.barcode,
        precio: product.price,
        costo: product.cost,
        stock: newStock,
        min_stock: product.minStock,
        id_categoria: product.categoryId, 
      };

      console.log('Actualizando stock en BD:', { productId, newStock, productData });
      
      await api.updateProduct(productId, productData);
      
      // console.log(`✅ Stock actualizado en BD: ${product.name} - ${newStock}`);
    } catch (error) {
      // console.error(`❌ Error actualizando stock en BD:`, error);
      throw error;
    }
  };

  // FUNCIÓN PARA RECARGAR PRODUCTOS
  const loadProducts = async () => {
    try {
      const productosData: ProductoFromAPI[] = await api.getProducts();
      const adaptedProducts: Product[] = productosData.map(producto => ({
        id: producto.id_producto,           
        name: producto.nombre,              
        sku: producto.sku || `SKU-${producto.id_producto}`,
        barcode: producto.barcode || "",    
        price: producto.precio || 0,        
        cost: producto.costo || 0,            
        stock: producto.stock,              
        minStock: producto.min_stock || DEFAULT_MIN_STOCK,
        category: producto.categoria_nombre, 
        categoryId: producto.id_categoria, 
        description: producto.descripcion,  
        wholesalePrice: producto.precio ? producto.precio * 0.9 : 0,
      }));
      setProducts(adaptedProducts);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

//----------------------------------------------------------------------------- FUNCION PARA ACTUALIZAR STOCK ------------------------------------------------------------------------------------------------------

  const updateStock = (productId: number, newStock: number, reason = "Ajuste manual") => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const previousStock = product.stock
      const finalStock = Math.max(0, newStock)
      
      // 1. Actualizar estado local inmediatamente (para respuesta rápida)
      setProducts(products.map((p) => (p.id === productId ? { ...p, stock: finalStock } : p)))

      // 2. Actualizar BD en segundo plano
      updateStockInDatabase(productId, finalStock).catch(error => {
        console.error('Error actualizando stock en BD:', error);
        // Revertir cambio local si falla en BD
        setProducts(products.map((p) => (p.id === productId ? { ...p, stock: previousStock } : p)));
        alert('Error al actualizar stock en la base de datos');
      });

      // 3. Registrar movimiento de inventario
      if (previousStock !== finalStock) {
        addInventoryMovement(
          productId,
          product.name,
          finalStock > previousStock ? "entrada" : finalStock < previousStock ? "salida" : "ajuste",
          Math.abs(finalStock - previousStock),
          previousStock,
          finalStock,
          reason,
        )
      }
    }
  }

//----------------------------------------------------------------------------- FUNCION DE BORRAR PRODUCTO ------------------------------------------------------------------------------------------------------

  const deleteProduct = async (productId: number) => {
    try {
      console.log('🗑️ Eliminando producto ID:', productId);
      
      // VERIFICAR QUE EL ID SEA VÁLIDO
      if (!productId || isNaN(productId)) {
        console.error('❌ ID de producto inválido:', productId);
        alert('Error: ID de producto inválido');
        return;
      }

      // VERIFICAR SI EL PRODUCTO EXISTE EN EL ESTADO LOCAL
      const product = products.find(p => p.id === productId);
      if (!product) {
        console.error('❌ Producto no encontrado en estado local:', productId);
        alert('Producto no encontrado');
        return;
      }
      
      console.log('🔍 Producto a eliminar:', {
        id: product.id,
        name: product.name,
        sku: product.sku
      });
      
      // 1. Eliminar de la BD - usar el ID real del backend
      await api.deleteProducto(productId);
      
      // 2. Eliminar del estado local
      setProducts(products.filter(p => p.id !== productId));
      
      console.log(`✅ Producto ${productId} eliminado exitosamente`);
      
    } catch (error: any) {
      console.error('❌ Error eliminando producto:', error);
      
      // Mostrar error específico
      if (error.message.includes('404')) {
        alert('Error: El producto no existe en la base de datos');
      } else {
        alert('Error al eliminar el producto: ' + error.message);
      }
    }
  };

//----------------------------------------------------------------------------- FUNCION DE BORRAR PROVEEDOR ------------------------------------------------------------------------------------------------------

  const deleteSupplier = (supplierId: number) => {
    setSuppliers(suppliers.filter((s) => s.id_proveedor !== supplierId))
  }

  // Funciones para ventas
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.productId === product.id
              ? { 
                  ...item, 
                  quantity: item.quantity + 1, 
                  subtotal: (item.quantity + 1) * item.price,
                  discount: calculateProductDiscount(product.id, product.price, item.quantity + 1, selectedCustomer).discount
                }
              : item,
          ),
        )
      }
    } else {
      if (product.stock > 0) {
        const { discount } = calculateProductDiscount(product.id, product.price, 1, selectedCustomer)
        setCart([
          ...cart,
          {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            price: product.price,
            subtotal: product.price,
            discount: discount
          },
        ])
      }
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (product && quantity <= product.stock) {
      const { discount } = calculateProductDiscount(productId, product.price, quantity, selectedCustomer)
      setCart(
        cart.map((item) =>
          item.productId === productId ? { 
            ...item, 
            quantity, 
            subtotal: quantity * item.price,
            discount: discount
          } : item,
        ),
      )
    }

  }

  const addInventoryMovement = (
    productId: number,
    productName: string,
    type: "entrada" | "salida" | "ajuste",
    quantity: number,
    previousStock: number,
    newStock: number,
    reason: string,
  ) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const movement: InventoryMovement = {
      id: movementCounter + 1,
      productId,
      productName,
      type,
      quantity,
      previousStock,
      newStock,
      unitCost: product.cost,
      unitPrice: product.price,
      totalCost: quantity * product.cost,
      totalValue: quantity * product.price,
      reason,
      date: new Date().toLocaleString(),
    }
    setMovementCounter(prev => prev + 1)
    setInventoryMovements((prev) => [movement, ...prev])
  }

//------------------------------------------------------------------------------------------ FUNCION PARA EDITAR PRODUCTO ---------------------------------------------------------------------------------------------------

  const editProduct = async (updatedProduct: Product) => {
    try {
      // console.log('🔄 === INICIANDO EDICIÓN DE PRODUCTO ===')
      // console.log('📝 Producto a editar:', updatedProduct)

      // 1. ENCONTRAR LA CATEGORÍA CORRECTA
      const categoriaEncontrada = categories.find(cat => cat.nombre === updatedProduct.category);
      const id_categoria = categoriaEncontrada ? categoriaEncontrada.id_categoria : updatedProduct.categoryId;

      // console.log('🔍 Categoría encontrada:', { 
      //   nombreBuscado: updatedProduct.category, 
      //   categoriaEncontrada,
      //   id_categoria 
      // });

      // 2. PREPARAR DATOS PARA EL BACKEND
      const productData = {
        id_producto: updatedProduct.id,
        nombre: updatedProduct.name,
        descripcion: updatedProduct.description,
        sku: updatedProduct.sku,
        barcode: updatedProduct.barcode,
        precio: updatedProduct.price,
        costo: updatedProduct.cost,
        stock: updatedProduct.stock,
        min_stock: updatedProduct.minStock,
        id_categoria: id_categoria,
      }

      // console.log('📤 === ENVIANDO DATOS AL BACKEND ===')
      // console.log('🎯 Product ID:', updatedProduct.id)
      // console.log('📦 Datos a enviar:', JSON.stringify(productData, null, 2))
      
      // 3. ACTUALIZAR EN EL BACKEND
      // console.log('🚀 Llamando a api.updateProduct...')
      const response = await api.updateProduct(updatedProduct.id, productData)
      // console.log('✅ Respuesta del backend:', response)

      // 4. ACTUALIZAR ESTADO LOCAL
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))

      // 5. CERRAR DIÁLOGO Y LIMPIAR
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      
      // console.log('🎉 Producto actualizado completamente')
      // alert('✅ Producto actualizado correctamente')

    } catch (error: any) {
      // console.error('❌ === ERROR DETALLADO ===')
      // console.error('❌ Error actualizando producto:', error)
      // console.error('❌ Mensaje de error:', error.message)
      
      // Verificar si es error de red o de API
      // if (error.message.includes('404')) {
      //   console.error('🔍 El endpoint no existe. Verificar:')
      //   console.error('   - URL del endpoint')
      //   console.error('   - Método HTTP (debe ser PUT)')
      //   console.error('   - Si el producto existe en la BD')
      // }
      
      // alert('❌ Error al actualizar el producto. Revisa la consola para más detalles.')
    }
  }

//---------------------------------------------------------------------------- FUNCIONES DE EXPORTACIÓN EXCEL MEJORADAS ---------------------------------------------------------------------------------------

<<<<<<< HEAD
// EXPORTACION DE INVENTARIO A EXCEL
=======
  // Funciones de exportación Excel
>>>>>>> 285683847685a869924337743034526f58466762
  const exportInventoryToExcel = () => {
    // 1. Datos principales (tipados correctamente)
    const mainData = inventoryMovements.map((movement) => {
      const ganancia = movement.type === "salida" ? (movement.unitPrice - movement.unitCost) * movement.quantity : 0

      return {
        Fecha: movement.date,
        Producto: movement.productName,
        "Tipo de Movimiento": movement.type.toUpperCase(),
        Cantidad: movement.quantity,
        "Stock Anterior": movement.previousStock,
        "Stock Nuevo": movement.newStock,
        "Costo Unitario": `$${movement.unitCost}`,
        "Precio Unitario": `$${movement.unitPrice}`,
        "Valor Total": `$${movement.totalValue.toFixed(2)}`,
        Ganancia: `$${ganancia.toFixed(2)}`,
        Motivo: movement.reason,
      }
    })

    const totalGanancia = inventoryMovements
      .filter((m) => m.type === "salida")
      .reduce((sum, m) => sum + (m.unitPrice - m.unitCost) * m.quantity, 0)

    // 2. Fila de totales (con tipos compatibles)
    const totalData = [{
      Fecha: "TOTAL GENERAL",
      Producto: "",
      "Tipo de Movimiento": "",
      Cantidad: "-", // ← Usar string en lugar de número vacío
      "Stock Anterior": "-",
      "Stock Nuevo": "-", 
      "Costo Unitario": "",
      "Precio Unitario": "",
      "Valor Total": "",
      Ganancia: `$${totalGanancia.toFixed(2)}`,
      Motivo: "",
    }]

    // 3. Combinar ambos arrays
    const allData = [...mainData, ...totalData]

    exportToExcel(allData, "movimientos-inventario", "Movimientos de Inventario")
  }

// EXPORTACION DE PRODUCTOS A EXCEL
  const exportProductsToExcel = () => {
    interface ProductExcelRow {
    Nombre: string;
    SKU: string;
    "Código de Barras": string;
    Categoría: string;
    Precio: string;
    Costo: string;
    "Ganancia Unitaria": string;
    "Margen de Ganancia": string;
    "Stock Actual": number | string;
    "Stock Mínimo": number | string;
    Estado: string;
    "Valor en Stock": string;
    "Inversión en Stock": string;
    "Ganancia Potencial": string;
    Descripción: string;
    Observaciones?: string;
    }

    const data: ProductExcelRow[] = products.map((product) => ({
    Nombre: product.name,
    SKU: product.sku,
    "Código de Barras": product.barcode,
    Categoría: product.category,
    Precio: `$${product.price}`,
    Costo: `$${product.cost}`,
    "Ganancia Unitaria": `$${(product.price - product.cost).toFixed(2)}`,
    "Margen de Ganancia":
      product.cost > 0 ? `${(((product.price - product.cost) / product.cost) * 100).toFixed(1)}%` : "0.0%",
    "Stock Actual": product.stock,
    "Stock Mínimo": product.minStock,
    Estado: product.stock <= product.minStock ? "CRÍTICO" : product.stock <= product.minStock * 2 ? "BAJO" : "NORMAL",
    "Valor en Stock": `$${(product.stock * product.price).toFixed(2)}`,
    "Inversión en Stock": `$${(product.stock * product.cost).toFixed(2)}`,
    "Ganancia Potencial": `$${(product.stock * (product.price - product.cost)).toFixed(2)}`,
    Descripción: product.description,
    }))

    const totalInversion = products.reduce((sum, p) => sum + p.stock * p.cost, 0)
    const totalValor = products.reduce((sum, p) => sum + p.stock * p.price, 0)
    const totalGanancia = products.reduce((sum, p) => sum + p.stock * (p.price - p.cost), 0)

    data.push({
    Nombre: "TOTALES GENERALES",
    SKU: "",
    "Código de Barras": "",
    Categoría: "",
    Precio: "",
    Costo: "",
    "Ganancia Unitaria": "",
    "Margen de Ganancia": "",
    "Stock Actual": products.reduce((sum, p) => sum + p.stock, 0),
    "Stock Mínimo": "", // Ahora puede ser string o number
    Estado: "",
    "Valor en Stock": `$${totalValor.toFixed(2)}`,
    "Inversión en Stock": `$${totalInversion.toFixed(2)}`,
    "Ganancia Potencial": `$${totalGanancia.toFixed(2)}`,
    Descripción: "",
    })

    exportToExcel(data, "reporte-productos", "Inventario de Productos")
  }

// EXPORTACION DE VENTAS A EXCEL
  const exportSalesToExcel = () => {
    // 1. Datos principales
    const mainData = sales.flatMap((sale) =>
      sale.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        const ganancia = product ? (item.price - product.cost) * item.quantity : 0

        return {
          "Número de Venta": sale.saleNumber,
          Fecha: sale.date,
          Producto: item.productName,
          Cantidad: item.quantity,
          "Precio Unitario": `$${item.price}`,
          "Costo Unitario": `$${product?.cost || 0}`,
          Subtotal: `$${item.subtotal.toFixed(2)}`,
          Ganancia: `$${ganancia.toFixed(2)}`,
          "Total de la Venta": `$${sale.total.toFixed(2)}`,
        }
      }),
    )

    const totalVentas = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalGanancia = mainData.reduce((sum, item) => {
      const gananciaStr = item.Ganancia.replace("$", "")
      return sum + Number.parseFloat(gananciaStr)
    }, 0)

    // 2. Fila de totales (con tipos compatibles)
    const totalData = [{
      "Número de Venta": "TOTALES GENERALES",
      Fecha: "",
      Producto: "",
      Cantidad: "-",
      "Precio Unitario": "",
      "Costo Unitario": "",
      Subtotal: "",
      Ganancia: `$${totalGanancia.toFixed(2)}`,
      "Total de la Venta": `$${totalVentas.toFixed(2)}`,
    }]

    // 3. Combinar ambos arrays
    const allData = [...mainData, ...totalData]

    exportToExcel(allData, "reporte-ventas", "Historial de Ventas")
  }

// FILTRADO DE PRODCUTOS
  const filterProducts = (term: string) => {
    if (!term) return products

    const searchLower = term.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.barcode.includes(term) ||
        p.category.toLowerCase().includes(searchLower),
    )
  }

  const searchProducts = (term: string) => {
    if (!term) return products.filter((p) => p.stock > 0)

    const searchLower = term.toLowerCase()
    return products.filter(
      (p) =>
        p.stock > 0 &&
        (p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.barcode.includes(term) ||
          p.category.toLowerCase().includes(searchLower)),
    )
  }

  // Cálculos del dashboard
  const completedSales = sales.filter(sale => sale.status === "completed");
  const totalRevenue = completedSales.reduce((sum, sale) => {const saleTotal = Number(sale.total) || 0;
  return sum + saleTotal;
}, 0);
  const totalSalesCount = completedSales.length;
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length
  const criticalStockProducts = products.filter((p) => p.stock <= p.minStock)
  const totalSales = sales.length
  const totalSuppliers = suppliers.length
  const totalProfit = inventoryMovements
    .filter((m) => m.type === "salida")
    .reduce((sum, m) => sum + (m.unitPrice - m.unitCost) * m.quantity, 0)

//--------------------------------------------------------------- AÑADIR NUEVO PROVEEDOR -----------------------------------------------------------------------------------
  const addSupplier = async () => {
    if (newSupplier.empresa && newSupplier.contacto) {
      try {
        // 1. Preparar datos para enviar al backend
        const supplierToSend = {
          empresa: newSupplier.empresa,
          contacto: newSupplier.contacto,
          email: newSupplier.email,
          telefono: newSupplier.telefono,
          direccion: newSupplier.direccion,
          productos_que_surte: newSupplier.productos_que_surte,
          ciudad: newSupplier.ciudad || null,
          rfc: newSupplier.rfc || null,
          condiciones_pago: newSupplier.condiciones_pago || null,
          tiempo_entrega: newSupplier.tiempo_entrega || null,
        };

        // 2. Enviar al backend
        const createdSupplier = await api.createProveedor(supplierToSend);

        // 3. Actualizar estado local con la respuesta del backend
        setSuppliers([...suppliers, createdSupplier]);

        // 4. Limpiar formulario
        setNewSupplier({ 
          empresa: "", 
          contacto: "", 
          email: "", 
          telefono: "", 
          direccion: "", 
          productos_que_surte: "",
          ciudad: "",
          rfc: "",
          condiciones_pago: "",
          tiempo_entrega: "",
        });

        // 5. Cerrar el diálogo
        const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
        if (closeButton) closeButton.click();
        
      } catch (error) {
        console.error('Error creando proveedor:', error);
        alert('Error al crear el proveedor. Revisa la consola para más detalles.');
      }
    } else {
      alert('Por favor completa al menos los campos de Empresa y Contacto');
    }
  }

  // Datos para gráficos - ACTUALIZADOS para ser reactivos
  const salesChartData =
    sales.length > 0
      ? sales.map((sale, index) => ({
          name: sale.date,
          value: sale.total,
        }))
      : [{ name: "Sin datos", value: 0 }]

  const productsSoldData = (() => {
    const productSales = products.map((product) => {
      const totalSold = sales.reduce((sum, sale) => {
        const item = sale.items.find((item) => item.productId === product.id)
        return sum + (item ? item.quantity : 0)
      }, 0)
      return { name: product.name, value: totalSold }
    })

    const filteredData = productSales.filter((item) => item.value > 0)
    return filteredData.length > 0 ? filteredData.slice(0, 5) : [{ name: "Sin ventas", value: 0 }]
  })()

//---------------------------------------------------------------------------------- DASHBOARD DE INGRESOS POR CATEGORIA --------------------------------------------------------------------------------------------------------

  const categoryRevenueData = (() => {
    const categoryMap = new Map()

    // Calcular ingresos por categoría
    sales.forEach((sale) => {
      if (sale.status === "completed") {
        sale.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId)
          if (product) {
            const currentValue = categoryMap.get(product.category) || 0
            // Convertir subtotal a número (por si viene como string)
            const subtotalNum = typeof item.subtotal === 'string' 
              ? parseFloat(item.subtotal) 
              : Number(item.subtotal)
            categoryMap.set(product.category, currentValue + subtotalNum)
          }
        })
      }
    })

    const result = Array.from(categoryMap.entries()).map(([name, value]) => ({ 
      name, 
      value: Number(value.toFixed(2)) // Asegurar 2 decimales
    }))

    console.log('📊 INGRESOS POR CATEGORÍA CALCULADOS:', result)
    
    // SIEMPRE devolver los datos reales, aunque sea solo una categoría
    return result.length > 0 ? result : [{ name: "No hay ventas", value: 0 }]
  })()

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  const formatCurrency = (amount: number): string => {
    if (isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Ingresos Totales"
                value={formatCurrency(totalRevenue)}
                subtitle={`${totalSalesCount} ventas realizadas`}
                icon={DollarSign}
                color="blue"
                onClick={() => setActiveTab("history")}
              />
              <MetricCard
                title="Productos"
                value={totalProducts}
                subtitle={`${lowStockProducts} con stock bajo`}
                icon={Package}
                color="cyan"
                onClick={() => setActiveTab("products")}
              />
              <MetricCard
                title="Ganancias"
                value={`$${totalProfit.toLocaleString()}`}
                subtitle="Ganancia total"
                icon={TrendingUp}
                color="green"
                onClick={() => setActiveTab("inventory")}
              />
              <MetricCard
                title="Proveedores"
                value={totalSuppliers}
                subtitle="Proveedores activos"
                icon={Users}
                color="orange"
                onClick={() => setActiveTab("suppliers")}
              />
            </div>

            {/* Gráficos */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Gráfico de Ventas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SalesChart data={salesChartData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Productos Más Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductsPieChart data={productsSoldData} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Ingresos por Categoría
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBarChart data={categoryRevenueData} />
                </CardContent>
              </Card>

              {/* Productos con stock crítico */}
              {criticalStockProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-red-500" />
                      Alertas de Stock Crítico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {criticalStockProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex justify-between items-center p-2 bg-red-50 rounded border-l-4 border-red-500"
                        >
                          <div>
                            <span className="font-medium">{product.name}</span>
                            <div className="text-sm text-muted-foreground">
                              Stock actual: {product.stock} | Mínimo: {product.minStock}
                            </div>
                          </div>
                          <Badge variant="destructive">CRÍTICO</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )
<<<<<<< HEAD

{/*----------------------------------------------------- INVENTARIO DE PRODUCTOS ----------------------------------------------------------------------------------*/}
=======
// Sección Productos
>>>>>>> 285683847685a869924337743034526f58466762
      case "products":
        return (
          <div className="space-y-6">
            <Card>
              {/*--- TITULO DE PAGINA ---*/}
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Productos</CardTitle>
                  {/*--- BOTON DE AGREGAR PRODUCTO ---*/}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                        <DialogDescription>
                          Complete la información del nuevo producto. Los campos marcados con * son obligatorios.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="product-name">Nombre</Label>
                          <Input
                            id="product-name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Nombre del producto"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="product-sku">SKU</Label>
                            <div className="p-2 border rounded-md bg-gray-50 text-gray-600">
                              {products.length > 0 
                                ? `SKU-${(parseInt(products[products.length - 1].sku.replace('SKU-', '')) + 1).toString().padStart(3, '0')}`
                                : 'SKU-001'
                              }
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              El SKU se genera automáticamente en secuencia
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="product-barcode">Código de Barras</Label>
                            <Input
                              id="product-barcode"
                              value={newProduct.barcode}
                              onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                              placeholder="7501234567890"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="product-price">Precio</Label>
                            <Input
                              id="product-price"
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="product-cost">Costo</Label>
                            <Input
                              id="product-cost"
                              type="number"
                              value={newProduct.cost}
                              onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="product-stock">Stock</Label>
                            <Input
                              id="product-stock"
                              type="number"
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="product-minstock">Stock Mínimo</Label>
                            <Input
                              id="product-minstock"
                              type="number"
                              value={newProduct.minStock}
                              onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })}
                              placeholder="1"
                              min="1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="product-category">Categoría *</Label>
                          <select
                            id="product-category"
                            value={selectedCategoryId || ''}
                            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                            className="w-full p-2 border rounded-md"
                            required
                          >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                              <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre}
                              </option>
                            ))}
                          </select>
                          {!selectedCategoryId && (
                            <p className="text-red-500 text-sm mt-1">Debes seleccionar una categoría</p>
                          )}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancelar</Button>
                          </DialogTrigger>
                          <Button onClick={addProduct}>
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Producto
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Input
                    placeholder="Buscar productos por nombre, SKU, código de barras..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                  {/*--- BOTON DE EXPORTACION DE EXCEL ---*/}
                  <Button onClick={exportProductsToExcel} variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Costo</TableHead>
                        <TableHead>Ganancia</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterProducts(productSearchTerm)
                        .filter(product => product && product.id) // ← Filtrar productos válidos
                        .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.category}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-mono">{product.sku}</div>
                              <div className="text-xs text-muted-foreground">{product.barcode}</div>
                            </div>
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>${product.cost}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-green-600">
                                ${(product.price - product.cost).toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {product.cost > 0
                                  ? (((product.price - product.cost) / product.cost) * 100).toFixed(1)
                                  : "0"}
                                %
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  product.stock <= product.minStock
                                    ? "destructive"
                                    : product.stock <= product.minStock * 2
                                      ? "secondary"
                                      : "default"
                                }
                              >
                                {product.stock}
                              </Badge>
                              <span className="text-xs text-muted-foreground">(Mín: {product.minStock})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock <= product.minStock
                                  ? "destructive"
                                  : product.stock <= product.minStock * 2
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {product.stock <= product.minStock
                                ? "CRÍTICO"
                                : product.stock <= product.minStock * 2
                                  ? "BAJO"
                                  : "NORMAL"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStock(product.id, product.stock + 1, "Entrada manual")}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStock(product.id, product.stock - 1, "Salida manual")}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Dialog
                                open={isEditDialogOpen && editingProduct?.id === product.id}
                                onOpenChange={(open) => {
                                  setIsEditDialogOpen(open)
                                  if (!open) setEditingProduct(null)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingProduct(product)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Editar Producto</DialogTitle>
                                  </DialogHeader>
                                  {editingProduct && (
                                    <EditProductForm
                                      product={editingProduct}
                                      onSave={editProduct}
                                      onCancel={() => {
                                        setIsEditDialogOpen(false)
                                        setEditingProduct(null)
                                      }}
                                      categories={categories}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Se eliminará permanentemente el producto "
                                      {product.name}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteProduct(product.id)}>
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

{/*----------------------------------------------------- VENTA DE PRODUCTOS ----------------------------------------------------------------------------------*/}
      case "sales":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Buscar por nombre, SKU, código de barras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2 max-h-96 overflow-y-auto">
                  {searchProducts(searchTerm).map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku} | ${product.price} - Stock: {product.stock}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/*--- CARRO DE COMPRAS ---*/}
            <Card>
              <CardHeader>
                <CardTitle>Carrito de Compras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          ${Number(item.price).toFixed(2)} x {item.quantity} = ${Number(item.subtotal).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.productId)}>
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/*--- PESTAÑA DEL TOTAL ---*/}
                {cart.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-xl font-bold">
                        ${Number(cart.reduce((sum, item) => sum + Number(item.subtotal), 0)).toFixed(2)}
                      </span>
                    </div>
                    <Button onClick={completeSale} disabled={cart.length === 0} className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Completar Venta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

{/*----------------------------------------------------- PROVEEDORES ----------------------------------------------------------------------------------*/}
      case "suppliers":
        return (
          <div className="space-y-6">
            <Card>
              {/*--- TITULO DE PESTAÑA ---*/}
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Proveedores</CardTitle>
                  {/*--- BOTON DE AGREGAR PROVEEDOR ---*/}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Proveedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="supplier-empresa">Empresa</Label>
                          <Input
                            id="supplier-empresa"
                            value={newSupplier.empresa}
                            onChange={(e) => setNewSupplier({ ...newSupplier, empresa: e.target.value })}
                            placeholder="Nombre de la empresa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="supplier-contacto">Contacto</Label>
                          <Input
                            id="supplier-contacto"
                            value={newSupplier.contacto}
                            onChange={(e) => setNewSupplier({ ...newSupplier, contacto: e.target.value })}
                            placeholder="Nombre del contacto"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="supplier-email">Email</Label>
                            <Input
                              id="supplier-email"
                              type="email"
                              value={newSupplier.email}
                              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                              placeholder="email@empresa.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="supplier-telefono">Teléfono</Label>
                            <Input
                              id="supplier-telefono"
                              value={newSupplier.telefono}
                              onChange={(e) => setNewSupplier({ ...newSupplier, telefono: e.target.value })}
                              placeholder="555-0000"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="supplier-direccion">Dirección</Label>
                          <Input
                            id="supplier-direccion"
                            value={newSupplier.direccion}
                            onChange={(e) => setNewSupplier({ ...newSupplier, direccion: e.target.value })}
                            placeholder="Dirección completa"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="supplier-ciudad">Ciudad</Label>
                            <Input
                              id="supplier-ciudad"
                              value={newSupplier.ciudad || ""}
                              onChange={(e) => setNewSupplier({ ...newSupplier, ciudad: e.target.value })}
                              placeholder="Ciudad"
                            />
                          </div>
                          <div>
                            <Label htmlFor="supplier-rfc">RFC</Label>
                            <Input
                              id="supplier-rfc"
                              value={newSupplier.rfc || ""}
                              onChange={(e) => setNewSupplier({ ...newSupplier, rfc: e.target.value })}
                              placeholder="RFC"
                            />
                          </div>
                          <div>
                            <Label htmlFor="supplier-tiempo-entrega">Tiempo de Entrega</Label>
                            <Input
                              id="supplier-tiempo-entrega"
                              value={newSupplier.tiempo_entrega || ""}
                              onChange={(e) => setNewSupplier({ ...newSupplier, tiempo_entrega: e.target.value })}
                              placeholder="24-48 horas"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="supplier-condiciones-pago">Condiciones de Pago</Label>
                          <Input
                            id="supplier-condiciones-pago"
                            value={newSupplier.condiciones_pago || ""}
                            onChange={(e) => setNewSupplier({ ...newSupplier, condiciones_pago: e.target.value })}
                            placeholder="30 días crédito, Contado, etc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="supplier-productos">Productos que Suministra</Label>
                          <Textarea
                            id="supplier-productos"
                            value={newSupplier.productos_que_surte}
                            onChange={(e) => setNewSupplier({ ...newSupplier, productos_que_surte: e.target.value })}
                            placeholder="Laptops, Monitores, Accesorios (separados por comas)"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancelar</Button>
                          </DialogTrigger>
                          <Button onClick={addSupplier}>
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Proveedor
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.id_proveedor}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{supplier.empresa}</div>
                            <div className="text-sm text-muted-foreground">{supplier.direccion}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{supplier.contacto}</div>
                            <div>{supplier.email}</div>
                            <div className="text-muted-foreground">{supplier.telefono}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {supplier.productos_que_surte?.split(',')
                              .filter(product => product.trim() !== '')
                              .map((product, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {product.trim()}
                                </Badge>
                              ))
                            }
                            {(!supplier.productos_que_surte || supplier.productos_que_surte.trim() === '') && (
                              <span className="text-xs text-muted-foreground">Sin productos</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor "
                                  {supplier.contacto}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteSupplier(supplier.id_proveedor)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

{/*----------------------------------------------------- MOVIMIENTO DE INVENTARIO ----------------------------------------------------------------------------------*/}
      case "inventory":
        return (
          <Card>
            {/*--- TITULO DE PESTAÑA ---*/}
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Movimientos de Inventario
                </CardTitle>
                {/*--- BOTON DE EXPORTACION A EXCEL ---*/}
                <div className="flex gap-2">
                  <Button onClick={exportInventoryToExcel} variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  {/*--- BOTON DE LIMPIAR HISTORIAL ---*/}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          ¿Quieres limpiar los Movimientos de Inventario?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará TODOS los movimientos de inventario registrados. Tendrás 10 segundos
                          para recuperar los datos si cambias de opinión.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {/*--- BOTON DE CANCELAR ---*/}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        {/*--- BOTON DE CONFIRMACION ---*/}
                        <AlertDialogAction onClick={resetInventoryMovements} className="bg-red-600 hover:bg-red-700">
                          Sí, Limpiar Todo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Botón de recuperación */}
              {showRecoveryInventory && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Datos eliminados. ¿Quieres recuperarlos?
                      </span>
                    </div>
                    <Button
                      onClick={recoverInventoryMovements}
                      variant="outline"
                      size="sm"
                      className="bg-green-50 hover:bg-green-100"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Recuperar Datos
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {inventoryMovements.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay movimientos registrados</p>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Stock Anterior</TableHead>
                        <TableHead>Stock Nuevo</TableHead>
                        <TableHead>Costo Unit.</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Ganancia</TableHead>
                        <TableHead>Venta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="text-sm">{movement.date}</TableCell>
                          <TableCell>{movement.productName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                movement.type === "entrada"
                                  ? "default"
                                  : movement.type === "salida"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {movement.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.previousStock}</TableCell>
                          <TableCell>{movement.newStock}</TableCell>
                          <TableCell>${movement.unitCost}</TableCell>
                          <TableCell>${movement.unitPrice}</TableCell>
                          <TableCell>${movement.totalValue.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div
                                className={`font-medium ${movement.type === "salida" ? "text-green-600" : "text-gray-500"}`}
                              >
                                $
                                {movement.type === "salida"
                                  ? ((movement.unitPrice - movement.unitCost) * movement.quantity).toFixed(2)
                                  : "0.00"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{movement.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )

{/*----------------------------------------------------------------------------------- HISTORIAL DE VENTAS--------------------------------------------------------------------------------------------*/}
      case "history":
        // console.log('🔍 Ventas disponibles para mostrar en historial:', sales.length);
        // if (sales.length > 0) {
        //   console.log('📋 Primeras 5 ventas:', sales.slice(0, 5));
        //   console.log('🔍 Buscando venta 42:', sales.find(v => v.id === 42));
        // }
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historial de Ventas ({sales.length} ventas)</CardTitle>
                {/*--- EXPORTAR A EXCEL EL HISTORIAL DE VENTAS ---*/}
                <div className="flex gap-2">
                  <Button onClick={exportSalesToExcel} variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  {/*--- BOTON DE LIMPIAR HISTORIAL ---*/}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          ¿Limpiar Historial de Ventas?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará TODAS las ventas registradas. Tendrás 10 segundos para recuperar los
                          datos si cambias de opinión.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {/*--- BOTON DE CANCELAR ---*/}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        {/*--- BOTON DE CONFIRMAR ---*/}
                        <AlertDialogAction onClick={resetSalesHistory} className="bg-red-600 hover:bg-red-700">
                          Sí, Limpiar Todo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {/*--- BOTON DE RECUPERACION ---*/}
              {showRecoverySales && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Datos eliminados. ¿Quieres recuperarlos?
                      </span>
                    </div>
                    <Button
                      onClick={recoverSalesHistory}
                      variant="outline"
                      size="sm"
                      className="bg-green-50 hover:bg-green-100"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Recuperar Datos
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {sales.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay ventas registradas aún</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número de Venta</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => {
                      let fechaFormateada;
                      try {
                        const fechaDate = new Date(sale.date);
                        
                        // 🔥 SOLUCIÓN RECOMENDADA - UTC
                        fechaFormateada = fechaDate.toLocaleDateString('es-ES', {
                          timeZone: 'UTC',
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric'
                        });
                        
                      } catch (error) {
                        console.error('❌ Error formateando fecha:', sale.date);
                        fechaFormateada = 'Fecha inválida';
                      }

                      return (
                        <TableRow key={sale.id}>
                          <TableCell className="font-mono font-medium">{sale.saleNumber}</TableCell>
                          <TableCell>{fechaFormateada}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {sale.items.map((item, index) => (
                                <div key={`${item.productId}-${index}`}>
                                  {item.productName} x{item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">${sale.total.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )

{/*----------------------------------------------------- SECCION CUSTOMERS ----------------------------------------------------------------------------------*/}

      case "customers":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Gestión de Clientes
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={exportCustomersToExcel} variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Cliente
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="customer-name">Nombre Completo</Label>
                            <Input
                              id="customer-name"
                              value={newCustomer.name}
                              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                              placeholder="Nombre del cliente"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="customer-email">Email</Label>
                              <Input
                                id="customer-email"
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                placeholder="email@ejemplo.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="customer-phone">Teléfono</Label>
                              <Input
                                id="customer-phone"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                placeholder="555-0000"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="customer-address">Dirección</Label>
                            <Input
                              id="customer-address"
                              value={newCustomer.address}
                              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                              placeholder="Dirección completa"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="customer-wholesale"
                              checked={newCustomer.isWholesale}
                              onCheckedChange={(checked) => setNewCustomer({ ...newCustomer, isWholesale: checked })}
                            />
                            <Label htmlFor="customer-wholesale" className="cursor-pointer">
                              Cliente Mayorista (precios especiales)
                            </Label>
                          </div>
                          <div>
                            <Label htmlFor="customer-notes">Notas</Label>
                            <Textarea
                              id="customer-notes"
                              value={newCustomer.notes}
                              onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                              placeholder="Información adicional del cliente"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <DialogTrigger asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogTrigger>
                            <Button onClick={addCustomer}>
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar Cliente
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Estadísticas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {customer.name}
                                {customer.isFrequent && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                              </div>
                              {customer.notes && <div className="text-xs text-blue-600">📝 {customer.notes}</div>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{customer.email}</div>
                            <div className="text-muted-foreground">{customer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.isWholesale ? "default" : "secondary"}>
                            {customer.isWholesale ? "Mayorista" : "Minorista"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.isFrequent ? "default" : "secondary"}>
                            {customer.isFrequent ? "⭐ VIP" : "Regular"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{customer.totalPurchases} compras</div>
                            <div className="text-green-600 font-medium">${customer.totalSpent.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              Ticket: $
                              {customer.totalPurchases > 0
                                ? (customer.totalSpent / customer.totalPurchases).toFixed(2)
                                : "0.00"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el cliente "
                                  {customer.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCustomer(customer.id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

{/*----------------------------------------------------- SECCION PROMOCIONES ----------------------------------------------------------------------------------*/}

      case "promotions":
        const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Gestión de Promociones
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={exportPromotionsToExcel} variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Promoción
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Crear Nueva Promoción</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="promo-name">Nombre de la Promoción</Label>
                            <Input
                              id="promo-name"
                              value={newPromotion.name}
                              onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                              placeholder="Ej: Descuento Navidad"
                            />
                          </div>
                          <div>
                            <Label htmlFor="product-description">Descripción *</Label>
                            <Textarea
                              id="product-description"
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              placeholder="Descripción del producto"
                              required
                            />
                            {!newProduct.description && (
                              <p className="text-red-500 text-sm mt-1">La descripción es obligatoria</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="promo-type">Tipo de Descuento</Label>
                            <Select
                              value={newPromotion.discountType}
                              onValueChange={(value: "percentage" | "fixed" | "bundle") =>
                                setNewPromotion({ ...newPromotion, discountType: value })
                              }
                            >
                              <SelectTrigger id="promo-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                                <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                                <SelectItem value="bundle">X por Y (Ej: 3x2)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {newPromotion.discountType === "bundle" ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="promo-bundle-buy">Compra (X)</Label>
                                <Input
                                  id="promo-bundle-buy"
                                  type="number"
                                  value={newPromotion.bundleBuy}
                                  onChange={(e) =>
                                    setNewPromotion({ ...newPromotion, bundleBuy: Number(e.target.value) })
                                  }
                                  placeholder="3"
                                  min="1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="promo-bundle-pay">Paga (Y)</Label>
                                <Input
                                  id="promo-bundle-pay"
                                  type="number"
                                  value={newPromotion.bundlePay}
                                  onChange={(e) =>
                                    setNewPromotion({ ...newPromotion, bundlePay: Number(e.target.value) })
                                  }
                                  placeholder="2"
                                  min="1"
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Label htmlFor="promo-value">Valor del Descuento</Label>
                              <Input
                                id="promo-value"
                                type="number"
                                value={newPromotion.discountValue}
                                onChange={(e) =>
                                  setNewPromotion({ ...newPromotion, discountValue: Number(e.target.value) })
                                }
                                placeholder={newPromotion.discountType === "percentage" ? "10" : "100"}
                              />
                            </div>
                          )}
                          <div>
                            <Label htmlFor="promo-applies">Aplicar a</Label>
                            <Select
                              value={newPromotion.appliesTo}
                              onValueChange={(value: "all" | "specific" | "category") =>
                                setNewPromotion({
                                  ...newPromotion,
                                  appliesTo: value,
                                  specificProducts: [],
                                  specificCategories: [],
                                })
                              }
                            >
                              <SelectTrigger id="promo-applies">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos los productos</SelectItem>
                                <SelectItem value="specific">Productos específicos</SelectItem>
                                <SelectItem value="category">Categorías específicas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {newPromotion.appliesTo === "specific" && (
                            <div>
                              <Label>Seleccionar Productos</Label>
                              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                                {products.map((product) => (
                                  <div key={product.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`product-${product.id}`}
                                      checked={newPromotion.specificProducts.includes(product.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setNewPromotion({
                                            ...newPromotion,
                                            specificProducts: [...newPromotion.specificProducts, product.id],
                                          })
                                        } else {
                                          setNewPromotion({
                                            ...newPromotion,
                                            specificProducts: newPromotion.specificProducts.filter(
                                              (id) => id !== product.id,
                                            ),
                                          })
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`product-${product.id}`} className="cursor-pointer">
                                      {product.name} - ${product.price}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {newPromotion.appliesTo === "category" && (
                            <div>
                              <Label>Seleccionar Categorías</Label>
                              <div className="border rounded-lg p-4 space-y-2">
                                {uniqueCategories.map((category) => (
                                  <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`category-${category}`}
                                      checked={newPromotion.specificCategories.includes(category)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setNewPromotion({
                                            ...newPromotion,
                                            specificCategories: [...newPromotion.specificCategories, category],
                                          })
                                        } else {
                                          setNewPromotion({
                                            ...newPromotion,
                                            specificCategories: newPromotion.specificCategories.filter(
                                              (c) => c !== category,
                                            ),
                                          })
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`category-${category}`} className="cursor-pointer">
                                      {category}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <Label htmlFor="promo-min">Compra Mínima</Label>
                            <Input
                              id="promo-min"
                              type="number"
                              value={newPromotion.minPurchase}
                              onChange={(e) =>
                                setNewPromotion({ ...newPromotion, minPurchase: Number(e.target.value) })
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="promo-vip"
                              checked={newPromotion.forFrequentOnly}
                              onCheckedChange={(checked) =>
                                setNewPromotion({ ...newPromotion, forFrequentOnly: checked })
                              }
                            />
                            <Label htmlFor="promo-vip" className="cursor-pointer">
                              Solo para clientes VIP (5+ compras)
                            </Label>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="promo-start">Fecha de Inicio</Label>
                              <Input
                                id="promo-start"
                                type="date"
                                value={newPromotion.startDate}
                                onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="promo-end">Fecha de Fin</Label>
                              <Input
                                id="promo-end"
                                type="date"
                                value={newPromotion.endDate}
                                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <DialogTrigger asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogTrigger>
                            <Button onClick={addPromotion}>
                              <Plus className="h-4 w-4 mr-2" />
                              Crear Promoción
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Promoción</TableHead>
                      <TableHead>Aplica a</TableHead>
                      <TableHead>Descuento</TableHead>
                      <TableHead>Requisitos</TableHead>
                      <TableHead>Vigencia</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promotions.map((promo) => {
                      let appliesTo = ""
                      if (promo.appliesTo === "all") {
                        appliesTo = "Todos los productos"
                      } else if (promo.appliesTo === "specific") {
                        const productNames = promo.specificProducts
                          .map((id) => products.find((p) => p.id === id)?.name)
                          .filter(Boolean)
                        appliesTo = productNames.length > 0 ? productNames.join(", ") : "Sin productos"
                      } else if (promo.appliesTo === "category") {
                        appliesTo = promo.specificCategories.join(", ") || "Sin categorías"
                      }

                      let discountDescription = ""
                      if (promo.discountType === "percentage") {
                        discountDescription = `${promo.discountValue}%`
                      } else if (promo.discountType === "fixed") {
                        discountDescription = `$${promo.discountValue}`
                      } else if (promo.discountType === "bundle") {
                        discountDescription = `${promo.bundleBuy}x${promo.bundlePay}`
                      }

                      return (
                        <TableRow key={promo.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{promo.name}</div>
                              <div className="text-sm text-muted-foreground">{promo.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-xs truncate" title={appliesTo}>
                              {appliesTo}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{discountDescription}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              {promo.minPurchase > 0 && (
                                <div className="text-muted-foreground">Min: ${promo.minPurchase}</div>
                              )}
                              {promo.forFrequentOnly && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Solo VIP
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(promo.startDate).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                {new Date(promo.endDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={promo.isActive}
                                onCheckedChange={() => togglePromotionStatus(promo.id)}
                              />
                              <Badge variant={promo.isActive ? "default" : "secondary"}>
                                {promo.isActive ? "Activa" : "Inactiva"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                            </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la promoción "
                                    {promo.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deletePromotion(promo.id)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )

{/*----------------------------------------------------- SECCION REPORTES ----------------------------------------------------------------------------------*/}

      case "reports":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Centro de Reportes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">Generales</TabsTrigger>
                    <TabsTrigger value="advanced">Avanzados</TabsTrigger>
                    <TabsTrigger value="payments">Pagos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportProductsToExcel}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            Reporte de Productos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Inventario completo con precios, costos, stock y fechas de vencimiento
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={exportSalesToExcel}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-green-600" />
                            Reporte de Ventas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Historial detallado de ventas con descuentos y métodos de pago
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportCustomersToExcel}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-purple-600" />
                            Reporte de Clientes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Base de clientes con estadísticas y compras históricas
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportPromotionsToExcel}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Tag className="h-5 w-5 text-orange-600" />
                            Reporte de Promociones
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Todas las promociones con usos y descuentos aplicados
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportSuppliersToExcel}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-cyan-600" />
                            Reporte de Proveedores
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Listado completo de proveedores con información de contacto
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportInventoryToExcel}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <History className="h-5 w-5 text-indigo-600" />
                            Reporte de Movimientos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Historial de movimientos de inventario con costos y ganancias
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={exportCategoryReport}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            Stock por Categoría
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Análisis de inventario agrupado por categorías
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportExpiringProducts}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-red-600" />
                            Productos por Vencer
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Productos próximos a vencer o ya vencidos
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportObsoleteProducts}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            Productos Obsoletos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Productos sin ventas en los últimos 60 días
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>

                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportProfitableProducts}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Productos Rentables
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">Análisis de rentabilidad por producto</p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="payments" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={exportPaymentMethodsReport}
                      >
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Ventas por Método de Pago
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Consolidado de ingresos por efectivo, transferencia y tarjeta
                          </p>
                          <Button className="w-full bg-transparent" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Descargar Excel
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Información de Reportes</h3>
                      <p className="text-sm text-blue-700">
                        Todos los reportes se descargan en formato Excel (.xlsx) y pueden ser abiertos en Microsoft
                        Excel, Google Sheets o cualquier programa de hojas de cálculo. Los archivos incluyen totales
                        calculados y están listos para análisis.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )


      default:
        return <div>Sección no encontrada</div>
    }
  }

{/*----------------------------------------------------- TITULO DE PAGINA ----------------------------------------------------------------------------------*/}
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Inventario</h1>
            <p className="text-gray-600 mt-2">Panel de control y gestión</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
/*Este código implementa un sistema web de inventarios y ventas en React que permite gestionar productos, proveedores, ventas y movimientos de inventario, mostrando un dashboard con métricas, gráficos y alertas de stock 
crítico. Incluye funciones para agregar, editar, eliminar y buscar productos y proveedores, manejar un carrito de compras que descuenta stock al completar ventas, registrar automáticamente los movimientos de inventario, 
y exportar reportes a Excel (productos, ventas e inventario) con totales y márgenes de ganancia; además, ofrece opciones de reset y recuperación de datos en ventas e inventario.*/



