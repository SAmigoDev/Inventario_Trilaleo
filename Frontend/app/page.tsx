"use client"

import type React from "react"

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

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

// ===================================================================================================================================================================================================================
// SECCIÓN 1: INTERFACES Y TIPOS
// ===================================================================================================================================================================================================================

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
  observations?: string
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
    rut?: string;
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
  isInternalPurchase?: boolean
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
  type: "entrada" | "salida" | "ajuste" | "devolucion"  
  quantity: number             
  previousStock: number          
  newStock: number           
  unitCost: number            
  unitPrice: number          
  totalCost: number            
  totalValue: number          
  reason: string              
  date: string                
  id_venta?: number
  venta_numero?: string
  id_proveedor?: number
  proveedor_nombre?: string
  usuario?: string
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

// ===================================================================================================================================================================================================================
// SECCIÓN 2: COMPONENTES DE FORMULARIOS
// ===================================================================================================================================================================================================================

const EditProductForm: React.FC<{ 
  product: Product; 
  onSave: (product: Product) => void; 
  onCancel: () => void;
  categories: any[];
}> = ({ product, onSave, onCancel, categories }) => {
  const [editedProduct, setEditedProduct] = useState(product)

  const handleSave = () => {
    onSave(editedProduct)
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <Label htmlFor="edit-product-name">Nombre</Label>
        <Input
          id="edit-product-name"
          value={editedProduct.name}
          onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
          placeholder="Nombre del producto"
        />
      </div>
      
      {/* SKU no editable */}
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
      
      {/* PRECIOS MEJORADOS */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edit-product-price">Precio Minorista</Label>
          <Input
            id="edit-product-price"
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="edit-product-wholesale">Precio Mayorista</Label>
          <Input
            id="edit-product-wholesale"
            type="number"
            value={editedProduct.wholesalePrice}
            onChange={(e) => setEditedProduct({ ...editedProduct, wholesalePrice: Number(e.target.value) })}
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
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
        {/* Fecha de vencimiento */}
        <div>
          <Label htmlFor="edit-product-expiry">Fecha de Vencimiento (opcional)</Label>
          <Input
            id="edit-product-expiry"
            type="date"
            value={editedProduct.expiryDate || ""}
            onChange={(e) => setEditedProduct({ ...editedProduct, expiryDate: e.target.value })}
          />
        </div>
      </div>
      
      {/* Garantía */}
      <div>
        <Label htmlFor="edit-product-warranty">Garantía (meses)</Label>
        <Input
          id="edit-product-warranty"
          type="number"
          value={editedProduct.warrantyMonths || ""}
          onChange={(e) => setEditedProduct({ ...editedProduct, warrantyMonths: Number(e.target.value) || undefined })}
          placeholder="0"
        />
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
      
      <div>
        <Label htmlFor="edit-product-observations">Observaciones</Label>
        <Textarea
          id="edit-product-observations"
          value={editedProduct.observations || ""}
          onChange={(e) => setEditedProduct({ ...editedProduct, observations: e.target.value })}
          placeholder="Notas adicionales sobre el producto"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
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

// FORMULARIO DE EDICION DE PROVEEDORES
const EditSupplierForm: React.FC<{
  supplier: Supplier
  onSave: (supplier: Supplier) => void
  onCancel: () => void
}> = ({ supplier, onSave, onCancel }) => {
  const [editedSupplier, setEditedSupplier] = useState(supplier)

  const handleSave = () => {
    onSave(editedSupplier)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="edit-supplier-name">Nombre de la Empresa</Label>
        <Input
          id="edit-supplier-name"
          value={editedSupplier.empresa}
          onChange={(e) => setEditedSupplier({ ...editedSupplier, empresa: e.target.value })}
          placeholder="Nombre de la empresa"
        />
      </div>
      <div>
        <Label htmlFor="edit-supplier-contact">Persona de Contacto</Label>
        <Input
          id="edit-supplier-contact"
          value={editedSupplier.contacto}
          onChange={(e) => setEditedSupplier({ ...editedSupplier, contacto: e.target.value })}
          placeholder="Nombre del contacto"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-supplier-email">Email</Label>
          <Input
            id="edit-supplier-email"
            type="email"
            value={editedSupplier.email}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, email: e.target.value })}
            placeholder="email@empresa.com"
          />
        </div>
        <div>
          <Label htmlFor="edit-supplier-phone">Teléfono</Label>
          <Input
            id="edit-supplier-phone"
            value={editedSupplier.telefono}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, telefono: e.target.value })}
            placeholder="555-1234"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-supplier-address">Dirección</Label>
        <Input
          id="edit-supplier-address"
          value={editedSupplier.direccion}
          onChange={(e) => setEditedSupplier({ ...editedSupplier, direccion: e.target.value })}
          placeholder="Dirección completa"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edit-supplier-city">Ciudad</Label>
          <Input
            id="edit-supplier-city"
            value={editedSupplier.ciudad || ""}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, ciudad: e.target.value })}
            placeholder="Ciudad"
          />
        </div>
        <div>
          <Label htmlFor="edit-supplier-rut">RUT</Label>
          <Input
            id="edit-supplier-rut"
            value={editedSupplier.rut || ""}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, rut: e.target.value })}
            placeholder="11.111.111-1"
          />
        </div>
        <div>
          <Label htmlFor="edit-supplier-delivery">Tiempo de Entrega</Label>
          <Input
            id="edit-supplier-delivery"
            value={editedSupplier.tiempo_entrega || ""}
            onChange={(e) => setEditedSupplier({ ...editedSupplier, tiempo_entrega: e.target.value })}
            placeholder="24-48 horas"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-supplier-payment">Condiciones de Pago</Label>
        <Select
          value={editedSupplier.condiciones_pago || ""}
          onValueChange={(value) => setEditedSupplier({ ...editedSupplier, condiciones_pago: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione condición de pago" />
          </SelectTrigger>
          <SelectContent>
            {CONDICIONES_PAGO.map((condicion) => (
              <SelectItem key={condicion} value={condicion}>
                {condicion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-supplier-products">Productos que Suministra</Label>
        <Textarea
          id="edit-supplier-products"
          value={editedSupplier.productos_que_surte}
          onChange={(e) => setEditedSupplier({ ...editedSupplier, productos_que_surte: e.target.value })}
          placeholder="Laptops, Teclados, Monitores (separados por comas)"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="edit-supplier-active"
          checked={editedSupplier.activo !== false}
          onCheckedChange={(checked) => setEditedSupplier({ ...editedSupplier, activo: checked })}
        />
        <Label htmlFor="edit-supplier-active" className="cursor-pointer">
          Proveedor Activo
        </Label>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}

// ===================================================================================================================================================================================================================
// SECCIÓN 3: CONSTANTES Y CONFIGURACIONES
// ===================================================================================================================================================================================================================

const CONDICIONES_PAGO = [
  "Tarjeta de Crédito",
  "Tarjeta de Débito", 
  "Transferencia",
  "Efectivo",
  "Cheque",
  "Otro medio"
] as const;

const DEFAULT_MIN_STOCK = 5;

// ===================================================================================================================================================================================================================
// SECCIÓN 4: FUNCIONES DE UTILIDAD
// ===================================================================================================================================================================================================================

// Funciones helper para mapeo de datos
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
  if (!estado) return 'completed';
  
  const estadoLower = estado.toLowerCase();
  switch(estadoLower) {
    case 'completada': 
    case 'completed': 
    case 'finalizada':
    case 'pagada':
      return 'completed';
    case 'cancelada': 
    case 'cancelled': 
    case 'cancelada':
      return 'cancelled';
    default: 
      console.warn(`Estado de venta no reconocido: "${estado}", usando "completed" por defecto`);
      return 'completed';
  }
};

// Formateo de moneda
const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Cálculo de descuentos por producto
const calculateProductDiscount = (
  productId: number,
  productPrice: number,
  quantity: number,
  customer: Customer | null,
  promotions: Promotion[],
  products: Product[]
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

// Cálculo de descuentos del carrito
const calculateCartDiscount = (
  cartItems: SaleItem[], 
  customer: Customer | null, 
  promotions: Promotion[], 
  products: Product[]
) => {
  let totalDiscount = 0
  const discountBreakdown: DiscountBreakdown[] = []
  let appliedPromotion: Promotion | null = null

  cartItems.forEach((item) => {
    const { discount, promotion } = calculateProductDiscount(
      item.productId, 
      item.price, 
      item.quantity, 
      customer, 
      promotions, 
      products
    )
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

// Búsqueda de clientes
const searchCustomers = (term: string, customers: Customer[]) => {
  if (!term) return customers

  const searchLower = term.toLowerCase()
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.phone.includes(term),
  )
}

// Filtrado de productos
const filterProducts = (term: string, products: Product[]) => {
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

// Búsqueda de productos con stock
const searchProducts = (term: string, products: Product[]) => {
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

// Adaptación de producto para API
const adaptProductToAPI = (product: any) => {
  return {
    nombre: product.name,
    descripcion: product.description,
    sku: product.sku,
    barcode: product.barcode,
    precio: product.price,
    stock: product.stock,
    id_categoria: 1, // TEMPORAL: Cambia esto por un select de categorías
  };
};

// Actualización de stock en BD
const updateStockInDatabase = async (productId: number, newStock: number, product: Product) => {
  try {
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

    await api.updateProduct(productId, productData);
  } catch (error) {
    console.error(`Error actualizando stock en BD:`, error);
    throw error;
  }
};

// Agregar movimiento de inventario por compra a proveedor
const addSupplierInventoryMovement = async (
  productId: number,
  quantity: number,
  supplierId: number,
  product: Product,
  addInventoryMovement: Function,
  updateStockInDatabase: Function
) => {
  const previousStock = product.stock;
  const newStock = previousStock + quantity;

  try {
    await updateStockInDatabase(productId, newStock, product);
    
    await addInventoryMovement(
      productId,
      product.name,
      "entrada",
      quantity,
      previousStock,
      newStock,
      "Compra a proveedor",
      product.cost,
      product.price,
      undefined,
      supplierId
    );

    console.log(`✅ Entrada de inventario registrada: ${quantity} unidades de ${product.name}`);
    
  } catch (error) {
    console.error('❌ Error registrando entrada de inventario:', error);
    throw error;
  }
};

// Validación de promoción
const validatePromotion = (promotion: any): { isValid: boolean; error?: string } => {
  if (!promotion.name) {
    return { isValid: false, error: "El nombre de la promoción es requerido" };
  }

  if (promotion.discountType === "bundle") {
    if (promotion.bundleBuy <= 0 || promotion.bundlePay <= 0) {
      return { isValid: false, error: "Para ofertas X por Y, debes especificar cantidades válidas" };
    }
    if (promotion.bundleBuy <= promotion.bundlePay) {
      return { isValid: false, error: "La cantidad a comprar debe ser mayor que la cantidad a pagar" };
    }
  } else if (promotion.discountValue <= 0) {
    return { isValid: false, error: "Debes especificar un valor de descuento válido" };
  }

  if (new Date(promotion.startDate) > new Date(promotion.endDate)) {
    return { isValid: false, error: "La fecha de inicio no puede ser posterior a la fecha de fin" };
  }

  return { isValid: true };
};

// Generación de número de venta
const generateSaleNumber = (): string => {
  return `V-${Date.now().toString().slice(-6)}`;
};

// Formateo de fecha
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formateando fecha:', dateString);
    return 'Fecha inválida';
  }
};

// Cálculo de estadísticas de productos
const calculateProductStats = (products: Product[]) => {
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const totalInvestment = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const criticalStockCount = products.filter(p => p.stock === 0).length;

  return {
    totalStock,
    totalValue,
    totalInvestment,
    lowStockCount,
    criticalStockCount,
    potentialProfit: totalValue - totalInvestment
  };
};

// Cálculo de estadísticas de ventas
const calculateSalesStats = (sales: Sale[]) => {
  const completedSales = sales.filter(sale => sale.status === "completed");
  const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalDiscounts = completedSales.reduce((sum, sale) => sum + sale.discount, 0);
  const averageSale = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  return {
    totalSales: completedSales.length,
    totalRevenue,
    totalDiscounts,
    averageSale,
    cancelledSales: sales.filter(sale => sale.status === "cancelled").length
  };
};

// Función para determinar el estado del stock
const getStockStatus = (stock: number, minStock: number): { status: string; variant: "default" | "secondary" | "destructive" } => {
  if (stock <= minStock) {
    return { status: "CRÍTICO", variant: "destructive" };
  } else if (stock <= minStock * 2) {
    return { status: "BAJO", variant: "secondary" };
  } else {
    return { status: "NORMAL", variant: "default" };
  }
};

// Función para calcular días hasta vencimiento
const getDaysUntilExpiry = (expiryDate?: string): number | null => {
  if (!expiryDate) return null;
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Función para determinar estado de vencimiento
const getExpiryStatus = (expiryDate?: string): { status: string; color: string } => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry === null) {
    return { status: "SIN FECHA", color: "gray" };
  } else if (daysUntilExpiry < 0) {
    return { status: "VENCIDO", color: "red" };
  } else if (daysUntilExpiry <= 30) {
    return { status: "PRÓXIMO", color: "orange" };
  } else {
    return { status: "VIGENTE", color: "green" };
  }
};

// ===================================================================================================================================================================================================================
// SECCIÓN 5: HOOKS PERSONALIZADOS
// ===================================================================================================================================================================================================================

// Hook para gestión de productos
const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);

  // Cargar productos desde la API
  const loadProducts = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
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

  // Agregar nuevo producto
  const addProduct = async (productData: any) => {
    try {
      const ultimoSKU = products.reduce((max, product) => {
        const skuNum = parseInt(product.sku.replace('SKU-', ''));
        return isNaN(skuNum) ? max : Math.max(max, skuNum);
      }, 0);
      
      const nuevoSKUNumero = ultimoSKU + 1;
      const skuGenerado = `SKU-${nuevoSKUNumero.toString().padStart(3, '0')}`;

      const productToCreate = {
        nombre: productData.name,
        descripcion: productData.description,
        sku: skuGenerado,
        barcode: productData.barcode || "",
        precio: productData.price,
        costo: productData.cost || 0,
        stock: productData.stock || 0,
        min_stock: productData.minStock || 1,
        id_categoria: selectedCategoryId,
      };

      const productoCreado = await api.createProducto(productToCreate);
      const categoriaNombre = categories.find(cat => cat.id_categoria === selectedCategoryId)?.nombre || "General";

      const newProduct: Product = {
        id: productoCreado.id_producto,
        name: productData.name,
        sku: skuGenerado,
        barcode: productData.barcode,
        price: productData.price,
        cost: productData.cost,
        stock: productData.stock,
        minStock: productData.minStock,
        category: categoriaNombre,
        categoryId: selectedCategoryId,
        description: productData.description,
        wholesalePrice: productData.wholesalePrice || productData.price * 0.9,
        expiryDate: undefined,
        warrantyMonths: undefined,
        lastSoldDate: undefined,
        observations: productData.observations || ""
      };

      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error: any) {
      console.error('Error agregando producto:', error);
      throw error;
    }
  };

  // Actualizar producto
  const updateProduct = async (updatedProduct: Product) => {
    try {
      const categoriaEncontrada = categories.find(cat => cat.nombre === updatedProduct.category);
      const id_categoria = categoriaEncontrada ? categoriaEncontrada.id_categoria : updatedProduct.categoryId;

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
      };

      const response = await api.updateProduct(updatedProduct.id, productData);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      return response;
    } catch (error: any) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  };

  // Eliminar producto
  const deleteProduct = async (productId: number) => {
    try {
      await api.deleteProducto(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  };

  // Actualizar stock
  const updateStock = async (productId: number, newStock: number, reason = "Ajuste manual") => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const previousStock = product.stock;
    const finalStock = Math.max(0, newStock);
    
    try {
      const productData = {
        nombre: product.name,
        descripcion: product.description,
        sku: product.sku,
        barcode: product.barcode,
        precio: product.price,
        costo: product.cost,
        stock: finalStock,
        min_stock: product.minStock,
        id_categoria: product.categoryId,
      };

      await api.updateProduct(productId, productData);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: finalStock } : p));
      
      return { previousStock, finalStock };
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw error;
    }
  };

  // Filtrar productos
  const filterProducts = (term: string) => {
    if (!term) return products;

    const searchLower = term.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.barcode.includes(term) ||
        p.category.toLowerCase().includes(searchLower),
    );
  };

  // Buscar productos con stock
  const searchProducts = (term: string) => {
    if (!term) return products.filter((p) => p.stock > 0);

    const searchLower = term.toLowerCase();
    return products.filter(
      (p) =>
        p.stock > 0 &&
        (p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.barcode.includes(term) ||
          p.category.toLowerCase().includes(searchLower)),
    );
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadCategories();
  }, []);

  return {
    products,
    categories,
    loading,
    selectedCategoryId,
    setSelectedCategoryId,
    loadProducts,
    loadCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    filterProducts,
    searchProducts,
    setProducts
  };
};

// Hook para gestión de proveedores
const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar proveedores
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

  // Agregar proveedor
  const addSupplier = async (supplierData: Omit<Supplier, 'id_proveedor'>) => {
    try {
      const createdSupplier = await api.createProveedor(supplierData);
      setSuppliers(prev => [...prev, createdSupplier]);
      return createdSupplier;
    } catch (error) {
      console.error('Error creando proveedor:', error);
      throw error;
    }
  };

  // Actualizar proveedor
  const updateSupplier = async (id: number, updatedData: Partial<Supplier>) => {
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

  // Eliminar proveedor
  const deleteSupplier = async (id: number) => {
    try {
      await api.deleteProveedor(id);
      setSuppliers(prev => prev.filter(s => s.id_proveedor !== id));
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      throw error;
    }
  };

  // Buscar proveedores
  const searchSuppliers = async (query: string) => {
    try {
      if (query.trim() === '') {
        await loadSuppliers();
        return;
      }
      const resultados = await api.searchProveedores(query);
      setSuppliers(resultados);
    } catch (error) {
      console.error('Error buscando proveedores:', error);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    loadSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    setSuppliers
  };
};

// Hook para gestión de ventas
const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar ventas desde BD
  const loadSalesFromDB = async (products: Product[]) => {
    try {
      setLoading(true);
      const ventasData = await api.getVentas();
      const ventasOrdenadas = [...ventasData].sort((a, b) => b.id_venta - a.id_venta);

      const salesWithDetails = await Promise.all(
        ventasOrdenadas.map(async (venta: VentaFromAPI) => {
          try {
            // Obtener detalles de la venta
            const detallesData: DetalleVentaFromAPI[] = await api.getDetalleVenta(venta.id_venta);
            
            // Obtener información del cliente si existe
            let clienteInfo = null;
            if (venta.id_cliente) {
              try {
                clienteInfo = await api.getCliente(venta.id_cliente);
              } catch (error) {
                console.warn(`Cliente no encontrado para venta ${venta.id_venta}:`, error);
              }
            }

            // Obtener información de promoción si existe
            let promocionInfo = null;
            if (venta.id_promocion) {
              try {
                promocionInfo = await api.getPromocion(venta.id_promocion);
              } catch (error) {
                console.warn(`Promoción no encontrada para venta ${venta.id_venta}:`, error);
              }
            }

            // Mapear los items de la venta CORRECTAMENTE
            const itemsConNombresReales = detallesData.map(detalle => {
              // PRIMERO: Buscar el producto por ID en nuestros productos locales
              const product = products.find(p => p.id === detalle.id_presentacion);
              
              let nombreFinal = detalle.nombre_producto;
              
              // Si no encontramos el producto en nuestros datos locales Y el nombre es genérico
              if (!product && (!nombreFinal || nombreFinal === 'Producto' || nombreFinal === 'Producto Desconocido')) {
                // Intentar obtener el nombre de alguna otra manera
                // Por ahora, usaremos un nombre genérico mejorado
                nombreFinal = `Producto #${detalle.id_presentacion}`;
              } else if (product && product.name) {
                // Si encontramos el producto, usar su nombre real
                nombreFinal = product.name;
              }

              // Si después de todo esto el nombre sigue siendo problemático
              if (!nombreFinal || nombreFinal === 'Producto' || nombreFinal === 'Producto Desconocido') {
                nombreFinal = `Producto ID:${detalle.id_presentacion}`;
              }

              return {
                productId: detalle.id_presentacion,
                productName: nombreFinal,
                quantity: detalle.cantidad,
                price: detalle.precio_unitario,
                discount: detalle.descuento || 0,
                subtotal: detalle.subtotal
              };
            });

            return {
              id: venta.id_venta,
              saleNumber: venta.numero_venta,
              customerId: venta.id_cliente || undefined,
              customerName: clienteInfo?.nombre || clienteInfo?.name || undefined,
              items: itemsConNombresReales,
              subtotal: venta.subtotal || detallesData.reduce((sum, d) => sum + d.subtotal, 0),
              discount: venta.descuento || 0,
              promotionId: venta.id_promocion || undefined,
              promotionName: promocionInfo?.nombre || promocionInfo?.name || undefined,
              discountBreakdown: [],
              total: venta.total,
              date: venta.fecha,
              paymentMethod: mapPaymentMethod(venta.metodo_pago),
              isWholesale: venta.es_mayorista || false,
              status: mapSaleStatus(venta.estado),
              isInternalPurchase: false // Por defecto
            };
          } catch (error) {
            console.error(`Error procesando venta ${venta.id_venta}:`, error);
            // Retornar una venta básica en caso de error
            return {
              id: venta.id_venta,
              saleNumber: venta.numero_venta,
              items: [],
              subtotal: venta.subtotal || 0,
              discount: venta.descuento || 0,
              total: venta.total,
              date: venta.fecha,
              paymentMethod: mapPaymentMethod(venta.metodo_pago),
              isWholesale: venta.es_mayorista || false,
              status: mapSaleStatus(venta.estado),
              discountBreakdown: []
            };
          }
        })
      );

      setSales(salesWithDetails.filter(sale => sale !== null));
    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Completar venta
  const completeSale = async (saleData: {
    cart: SaleItem[],
    selectedCustomer: Customer | null,
    currentSubtotal: number,
    currentDiscount: number,
    currentTotal: number,
    currentPromotion: Promotion | null,
    paymentMethod: "cash" | "transfer" | "card",
    isWholesaleSale: boolean,
    isInternalPurchase: boolean,
    products: Product[],
    updateStockInDatabase: (productId: number, newStock: number) => Promise<void>,
    addInventoryMovement: Function
  }) => {
    if (saleData.cart.length === 0) return;

    try {
      const subtotalNum = Number(saleData.currentSubtotal) || 0;
      const discountNum = Number(saleData.currentDiscount) || 0;
      const totalNum = Number(saleData.currentTotal) || Math.max(0.01, subtotalNum - discountNum);

      const saleDataToSend = {
        numero_venta: `V-${Date.now().toString().slice(-6)}`,
        id_cliente: saleData.selectedCustomer?.id || null,
        id_promocion: saleData.currentPromotion?.id || null,
        subtotal: subtotalNum,
        descuento: discountNum,
        total: totalNum,
        fecha: new Date().toISOString().split('T')[0],
        metodo_pago: mapPaymentMethodToDB(saleData.paymentMethod),
        es_mayorista: saleData.isWholesaleSale || saleData.selectedCustomer?.isWholesale || false,
        estado: 'completada'
      };

      const ventaCreada = await api.createVenta(saleDataToSend);

      // OBTENER PRESENTACIONES DE LA BD
      let presentaciones = [];
      try {
        presentaciones = await api.getPresentaciones();
        console.log('🔍 Presentaciones obtenidas:', presentaciones.length);
      } catch (error) {
        console.warn('⚠️ Error cargando presentaciones:', error);
      }

      // GUARDAR DETALLES DE VENTA
      console.log('🔄 Creando detalles de venta...');
      
      for (const item of saleData.cart) {
        let id_presentacion = null;
        
        if (presentaciones.length > 0) {
          const presentacion = presentaciones.find((p: any) => p.id_producto === item.productId);
          if (presentacion) {
            id_presentacion = presentacion.id_presentacion;
            console.log(`✅ Presentación encontrada: ${id_presentacion} para producto ${item.productId}`);
          } else {
            id_presentacion = presentaciones[0].id_presentacion;
            console.warn(`⚠️ Usando presentación por defecto: ${id_presentacion}`);
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
        };
        
        console.log('📦 Enviando detalle:', itemData);
        const resultadoDetalle = await api.createDetalleVenta(itemData);
        console.log('✅ Detalle creado:', resultadoDetalle);
      }

      console.log('🎉 Todos los detalles creados exitosamente');

      // ACTUALIZAR STOCK EN BD
      console.log('📊 Actualizando stock en BD...');
      for (const item of saleData.cart) {
        const product = saleData.products.find(p => p.id === item.productId);
        if (product) {
          const nuevoStock = product.stock - item.quantity;
          console.log(`🔄 Actualizando stock producto ${product.id}: ${product.stock} -> ${nuevoStock}`);
          await saleData.updateStockInDatabase(product.id, nuevoStock);
        }
      }

      // AGREGAR MOVIMIENTOS DE INVENTARIO
      console.log('📦 Agregando movimientos de inventario...');
      for (const item of saleData.cart) {
        const product = saleData.products.find(p => p.id === item.productId);
        if (product) {
          const nuevoStock = product.stock - item.quantity;
          
          // Luego registrar movimiento de inventario
          console.log(`📝 Registrando movimiento para ${product.name}`);
          try {
            await saleData.addInventoryMovement({
              productId: product.id,
              productName: product.name,
              type: "salida",
              quantity: item.quantity,
              previousStock: product.stock,
              newStock: nuevoStock,
              reason: `Venta ${ventaCreada.numero_venta}`,
              productCost: product.cost || 0, // Asegurar que no sea undefined
              productPrice: product.price || 0, // Asegurar que no sea undefined
              saleId: ventaCreada.id_venta
            });
            console.log(`✅ Movimiento registrado para ${product.name}`);
          } catch (movementError) {
            console.error(`❌ Error registrando movimiento para ${product.name}:`, movementError);
            // Continuar con los demás productos aunque falle un movimiento
            throw movementError; // O puedes comentar esta línea si quieres que continúe
          }
        }
      }

      // CREAR OBJETO SALE LOCAL PARA EL ESTADO
      const sale: Sale = {
        id: ventaCreada.id_venta,
        saleNumber: ventaCreada.numero_venta,
        customerId: saleData.selectedCustomer?.id,
        customerName: saleData.selectedCustomer?.name,
        items: saleData.cart.map((item) => {
          const itemDiscount = 0;
          return {
            ...item,
            discount: itemDiscount,
          };
        }),
        subtotal: subtotalNum,
        discount: discountNum,
        promotionId: saleData.currentPromotion?.id,
        promotionName: saleData.currentPromotion?.name,
        discountBreakdown: [],
        total: totalNum,
        date: new Date().toISOString(),
        paymentMethod: saleData.paymentMethod,
        isWholesale: saleData.isWholesaleSale,
        status: "completed",
        isInternalPurchase: saleData.isInternalPurchase,
      };

      // ACTUALIZAR ESTADO LOCAL (si estás usando esta función dentro del componente)
      // setSales(prev => [sale, ...prev]);

      console.log('🎉 Venta completada y datos persistidos');
      return ventaCreada;

    } catch (error: any) {
      console.error('❌ Error completando venta:', error);
      throw error;
    }
  };

  // Agregar al carrito
  const addToCart = (product: Product, isWholesaleSale: boolean, selectedCustomer: Customer | null, cart: SaleItem[], setCart: React.Dispatch<React.SetStateAction<SaleItem[]>>) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    const priceToUse = isWholesaleSale ? product.wholesalePrice : product.price;

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.productId === product.id
              ? { 
                  ...item, 
                  quantity: item.quantity + 1,
                  price: priceToUse,
                  subtotal: Number((item.quantity + 1) * priceToUse),
                  discount: 0 // Se calcularía después
                }
              : item,
          ),
        );
      }
    } else {
      if (product.stock > 0) {
        setCart([
          ...cart,
          {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            price: priceToUse,
            subtotal: Number(priceToUse),
            discount: 0
          },
        ]);
      }
    }
  };

  // Remover del carrito
  const removeFromCart = (productId: number, cart: SaleItem[], setCart: React.Dispatch<React.SetStateAction<SaleItem[]>>) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Actualizar cantidad en carrito
  const updateCartQuantity = (productId: number, quantity: number, cart: SaleItem[], setCart: React.Dispatch<React.SetStateAction<SaleItem[]>>, products: Product[], isWholesaleSale: boolean, selectedCustomer: Customer | null) => {
    if (quantity <= 0) {
      removeFromCart(productId, cart, setCart);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product && quantity <= product.stock) {
      const priceToUse = isWholesaleSale ? product.wholesalePrice : product.price;

      setCart(
        cart.map((item) =>
          item.productId === productId ? { 
            ...item, 
            quantity,
            price: priceToUse,
            subtotal: Number(quantity * priceToUse),
            discount: 0
          } : item,
        ),
      );
    }
  };

  return {
    sales,
    cart,
    loading,
    setCart,
    loadSalesFromDB,
    completeSale,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    setSales
  };
};

// Hook para gestión de inventario
const useInventory = () => {
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar movimientos de inventario
  const loadInventoryMovementsFromDB = async () => {
    try {
      setLoading(true);
      const movimientosData = await api.getMovimientosInventario();
      const adaptedMovements: InventoryMovement[] = movimientosData.map((mov: any) => ({
        id: mov.id_movimiento,
        productId: mov.id_producto,
        productName: mov.producto_nombre,
        type: mov.tipo,
        quantity: mov.cantidad,
        previousStock: mov.stock_anterior,
        newStock: mov.stock_nuevo,
        unitCost: Number(mov.costo_unitario) || 0,
        unitPrice: Number(mov.precio_unitario) || 0,
        totalCost: Number(mov.costo_unitario) * mov.cantidad || 0,
        totalValue: Number(mov.valor_total) || 0,
        reason: mov.motivo,
        date: mov.fecha_movimiento,
        id_venta: mov.id_venta || undefined,
        venta_numero: mov.venta_numero || undefined,
        id_proveedor: mov.id_proveedor || undefined,
        proveedor_nombre: mov.proveedor_nombre || undefined,
        usuario: mov.usuario || 'Sistema',
      }));
      setInventoryMovements(adaptedMovements);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar movimiento de inventario
  const addInventoryMovement = async (movementData: {
    productId: number,
    productName: string,
    type: "entrada" | "salida" | "ajuste" | "devolucion",
    quantity: number,
    previousStock: number,
    newStock: number,
    reason: string,
    productCost: number,
    productPrice: number,
    saleId?: number,
    supplierId?: number
  }) => {
    try {
      console.log('📦 Creando movimiento de inventario:', movementData);

      const movementToCreate = {
        id_producto: movementData.productId || 0,
        tipo: movementData.type || "salida",
        cantidad: movementData.quantity || 0,
        stock_anterior: movementData.previousStock || 0,
        stock_nuevo: movementData.newStock || 0,
        costo_unitario: Number(movementData.productCost) || 0,
        precio_unitario: Number(movementData.productPrice) || 0,
        valor_total: (movementData.quantity || 0) * (Number(movementData.productPrice) || 0),
        motivo: movementData.reason || "Movimiento de inventario",
        id_venta: movementData.saleId || null,
        id_proveedor: movementData.supplierId || null,
        usuario: 'Sistema',
      };

      if (!movementToCreate.id_producto || !movementToCreate.tipo || !movementToCreate.motivo) {
        throw new Error(`Campos requeridos faltantes: id_producto=${movementToCreate.id_producto}, tipo=${movementToCreate.tipo}, motivo=${movementToCreate.motivo}`);
      }

      console.log('📤 Enviando datos validados a API:', movementToCreate);

      const movimientoBD = await api.createMovimientoInventario(movementToCreate);
      
      console.log('✅ Movimiento creado en BD:', movimientoBD);

      const movement: InventoryMovement = {
        id: movimientoBD.id_movimiento,
        productId: movementData.productId,
        productName: movementData.productName,
        type: movementData.type,
        quantity: movementData.quantity,
        previousStock: movementData.previousStock,
        newStock: movementData.newStock,
        unitCost: movementData.productCost,
        unitPrice: movementData.productPrice,
        totalCost: movementData.quantity * movementData.productCost,
        totalValue: movementData.quantity * movementData.productPrice,
        reason: movementData.reason,
        date: new Date().toISOString(),
        id_venta: movementData.saleId,
        venta_numero: movementData.saleId ? `V-${movementData.saleId}` : undefined,
        id_proveedor: movementData.supplierId,
        usuario: 'Sistema',
      };
      
      setInventoryMovements(prev => [movement, ...prev]);
      return movement;
    } catch (error: any) {
      console.error('❌ Error agregando movimiento:', error);
      console.error('📋 Datos que causaron el error:', movementData);
      throw new Error(`Error al registrar movimiento de inventario: ${error.message}`);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadInventoryMovementsFromDB();
  }, []);

  return {
    inventoryMovements,
    loading,
    loadInventoryMovementsFromDB,
    addInventoryMovement,
    setInventoryMovements
  };
};

// ===================================================================================================================================================================================================================
// SECCIÓN 6: COMPONENTE PRINCIPAL
// ===================================================================================================================================================================================================================

export default function BusinessSalesSystem() {
  // ===========================================================================
  // SECCIÓN 6.1: INICIALIZACIÓN DE HOOKS PERSONALIZADOS
  // ===========================================================================

  // Inicializar todos los hooks personalizados
  const productsHook = useProducts();
  const salesHook = useSales();
  const suppliersHook = useSuppliers();
  const inventoryHook = useInventory();

  // Desestructurar estados y funciones de los hooks
  const {
    products,
    categories,
    loading: productsLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    addProduct: addProductHook,
    updateProduct: updateProductHook,
    deleteProduct: deleteProductHook,
    updateStock: updateStockHook,
    filterProducts: filterProductsHook,
    searchProducts: searchProductsHook,
    setProducts
  } = productsHook;

  const {
    sales,
    cart,
    loading: salesLoading,
    setCart,
    loadSalesFromDB,
    completeSale: completeSaleHook,
    addToCart: addToCartHook,
    removeFromCart: removeFromCartHook,
    updateCartQuantity: updateCartQuantityHook,
    setSales
  } = salesHook;

  const {
    suppliers,
    loading: suppliersLoading,
    loadSuppliers: loadSuppliersHook,
    addSupplier: addSupplierHook,
    updateSupplier: updateSupplierHook,
    deleteSupplier: deleteSupplierHook,
    searchSuppliers: searchSuppliersHook,
    setSuppliers
  } = suppliersHook;

  const {
    inventoryMovements,
    loading: inventoryLoading,
    loadInventoryMovementsFromDB: loadInventoryMovementsHook,
    addInventoryMovement: addInventoryMovementHook,
    setInventoryMovements
  } = inventoryHook;

  // ===========================================================================
  // SECCIÓN 6.2: ESTADOS DE UI Y FORMULARIOS
  // ===========================================================================

  // Estado de navegación y UI
  const [activeTab, setActiveTab] = useState("dashboard");

  // Estado de búsquedas y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  // Estado de clientes
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    isWholesale: false,
  });

  // Estado de promociones
  const [promotions, setPromotions] = useState<Promotion[]>([]);
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
  });

  // Estado de proceso de venta
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [currentSubtotal, setCurrentSubtotal] = useState(0);
  const [currentDiscount, setCurrentDiscount] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [currentBreakdown, setCurrentBreakdown] = useState<DiscountBreakdown[]>([]);
  const [isWholesaleSale, setIsWholesaleSale] = useState(false);
  const [isInternalPurchase, setIsInternalPurchase] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "card">("cash");

  // Estado de formularios y diálogos
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
    wholesalePrice: 0,
  });

  const [newSupplier, setNewSupplier] = useState({
    empresa: "",
    contacto: "",
    email: "",
    telefono: "",
    direccion: "",
    productos_que_surte: "",
    ciudad: "",
    rut: "",
    condiciones_pago: "",
    tiempo_entrega: "",
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isEditSupplierDialogOpen, setIsEditSupplierDialogOpen] = useState(false);

  // Estado de backup y recuperación
  const [salesBackup, setSalesBackup] = useState<Sale[]>([]);
  const [inventoryMovementsBackup, setInventoryMovementsBackup] = useState<InventoryMovement[]>([]);
  const [showRecoverySales, setShowRecoverySales] = useState(false);
  const [showRecoveryInventory, setShowRecoveryInventory] = useState(false);

  // Estado de notificaciones y errores
  const [notifications, setNotifications] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }[]>([]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Estado para datos de gráficos
  const [dashboardData, setDashboardData] = useState({
    salesChartData: [{ name: "Sin datos", value: 0 }],
    productsSoldData: [{ name: "Sin ventas", value: 0 }],
    categoryRevenueData: [{ name: "No hay ventas", value: 0 }]
  });

  // ===========================================================================
  // SECCIÓN 6.3: EFFECTS COORDINADORES
  // ===========================================================================

  // Effect para carga inicial de datos
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🔄 Inicializando datos del sistema...');
        
        // Cargar datos en paralelo
        await Promise.all([
          loadSuppliersHook(),
          loadInventoryMovementsHook()
        ]);

        // Cargar categorías primero (necesarias para productos)
        await productsHook.loadCategories();
        
        // Luego cargar productos y ventas
        await Promise.all([
          productsHook.loadProducts(),
          loadSalesFromDB(productsHook.products)
        ]);

        console.log('✅ Todos los datos inicializados correctamente');
        
        setNotifications(prev => [{
          type: 'success',
          message: 'Sistema inicializado correctamente',
          timestamp: new Date()
        }, ...prev]);

      } catch (error) {
        console.error('❌ Error inicializando datos:', error);
        setErrors(prev => ({ ...prev, initialization: 'Error al cargar los datos iniciales' }));
        
        setNotifications(prev => [{
          type: 'error',
          message: 'Error al cargar datos iniciales',
          timestamp: new Date()
        }, ...prev]);
      }
    };

    initializeData();
  }, []);

  // Effect para calcular datos del dashboard
  useEffect(() => {
    const calculateDashboardData = () => {
      // Datos para gráfico de ventas
      const salesChartData = sales.length > 0
        ? sales.map((sale, index) => ({
            name: formatDate(sale.date),
            value: sale.total,
          }))
        : [{ name: "Sin datos", value: 0 }];

      // Datos para productos más vendidos
      const productsSoldData = (() => {
        const productSales = products.map((product) => {
          const totalSold = sales.reduce((sum, sale) => {
            const item = sale.items.find((item) => item.productId === product.id);
            return sum + (item ? item.quantity : 0);
          }, 0);
          return { name: product.name, value: totalSold };
        });

        const filteredData = productSales.filter((item) => item.value > 0);
        return filteredData.length > 0 ? filteredData.slice(0, 5) : [{ name: "Sin ventas", value: 0 }];
      })();

      // Datos para ingresos por categoría
      const categoryRevenueData = (() => {
        const categoryMap = new Map();

        sales.forEach((sale) => {
          if (sale.status === "completed") {
            sale.items.forEach((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (product) {
                const currentValue = categoryMap.get(product.category) || 0;
                const subtotalNum = typeof item.subtotal === 'string' 
                  ? parseFloat(item.subtotal) 
                  : Number(item.subtotal);
                categoryMap.set(product.category, currentValue + subtotalNum);
              }
            });
          }
        });

        const result = Array.from(categoryMap.entries()).map(([name, value]) => ({ 
          name, 
          value: Number(value.toFixed(2))
        }));

        return result.length > 0 ? result : [{ name: "No hay ventas", value: 0 }];
      })();

      setDashboardData({
        salesChartData,
        productsSoldData,
        categoryRevenueData
      });
    };

    if (products.length > 0 || sales.length > 0) {
      calculateDashboardData();
    }
  }, [sales, products]);

  // Effect para calcular descuentos automáticamente cuando cambia el carrito
  useEffect(() => {
    if (cart.length === 0) {
      setCurrentSubtotal(0);
      setCurrentDiscount(0);
      setCurrentTotal(0);
      setCurrentBreakdown([]);
      setCurrentPromotion(null);
      return;
    }

    const subtotal = cart.reduce((sum, item) => {
      const itemSubtotal = Number(item.subtotal) || 0;
      return sum + itemSubtotal;
    }, 0);
    
    const { discount, promotion, breakdown } = calculateCartDiscount(cart, selectedCustomer, promotions, products);
    const total = Math.max(0.01, subtotal - discount);
    
    setCurrentSubtotal(subtotal);
    setCurrentDiscount(discount);
    setCurrentTotal(total);
    setCurrentBreakdown(breakdown);
    setCurrentPromotion(promotion);
  }, [cart, selectedCustomer, promotions, products]);

  // Effect para notificaciones de stock bajo
  useEffect(() => {
    const checkLowStock = () => {
      const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0);
      const outOfStockProducts = products.filter(p => p.stock === 0);
      
      if (lowStockProducts.length > 0 || outOfStockProducts.length > 0) {
        const newNotifications: {
          type: 'success' | 'error' | 'warning' | 'info';
          message: string;
          timestamp: Date;
        }[] = [];
        
        if (outOfStockProducts.length > 0) {
          newNotifications.push({
            type: 'error' as const,
            message: `${outOfStockProducts.length} producto(s) sin stock`,
            timestamp: new Date()
          });
        }
        
        if (lowStockProducts.length > 0) {
          newNotifications.push({
            type: 'warning' as const,
            message: `${lowStockProducts.length} producto(s) con stock bajo`,
            timestamp: new Date()
          });
        }
        
        setNotifications(prev => [...newNotifications, ...prev.slice(0, 4)]);
      }
    };

    if (products.length > 0) {
      checkLowStock();
    }
  }, [products]);

  // Effect para sincronizar datos cuando cambia la pestaña activa
  useEffect(() => {
    const syncDataForTab = async () => {
      switch (activeTab) {
        case "products":
          if (products.length === 0) {
            await productsHook.loadProducts();
          }
          break;
        case "sales":
          if (sales.length === 0) {
            await loadSalesFromDB(productsHook.products);
          }
          break;
        case "suppliers":
          if (suppliers.length === 0) {
            await loadSuppliersHook();
          }
          break;
        case "inventory":
          if (inventoryMovements.length === 0) {
            await loadInventoryMovementsHook();
          }
          break;
      }
    };

    syncDataForTab();
  }, [activeTab]);

  // ===========================================================================
  // SECCIÓN 6.4: FUNCIONES DELEGADAS A LOS HOOKS
  // ===========================================================================

  // ==================== FUNCIONES DE PRODUCTOS ====================
  const addProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0 || !newProduct.description) {
      setErrors(prev => ({ 
        ...prev, 
        addProduct: 'Por favor completa: Nombre, Precio (mayor a 0) y Descripción' 
      }));
      return;
    }

    if (!selectedCategoryId) {
      setErrors(prev => ({ 
        ...prev, 
        addProduct: 'Debes seleccionar una categoría' 
      }));
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        barcode: newProduct.barcode,
        price: newProduct.price,
        cost: newProduct.cost,
        stock: newProduct.stock,
        minStock: newProduct.minStock,
        wholesalePrice: newProduct.wholesalePrice,
        observations: newProduct.observations
      };

      await addProductHook(productData);

      // Limpiar formulario
      setNewProduct({
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
        wholesalePrice: 0,
      });

      setNotifications(prev => [{
        type: 'success',
        message: `Producto "${newProduct.name}" agregado correctamente`,
        timestamp: new Date()
      }, ...prev]);

      // Cerrar diálogo
      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
      if (closeButton) closeButton.click();

    } catch (error: any) {
      console.error('❌ Error agregando producto:', error);
      setErrors(prev => ({ 
        ...prev, 
        addProduct: 'Error al agregar el producto: ' + error.message 
      }));
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    try {
      await updateProductHook(updatedProduct);
      
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      
      setNotifications(prev => [{
        type: 'success',
        message: `Producto "${updatedProduct.name}" actualizado correctamente`,
        timestamp: new Date()
      }, ...prev]);

    } catch (error: any) {
      console.error('❌ Error actualizando producto:', error);
      setErrors(prev => ({ 
        ...prev, 
        editProduct: 'Error al actualizar el producto: ' + error.message 
      }));
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      await deleteProductHook(productId);
      
      setNotifications(prev => [{
        type: 'success',
        message: 'Producto eliminado correctamente',
        timestamp: new Date()
      }, ...prev]);
      
    } catch (error: any) {
      console.error('❌ Error eliminando producto:', error);
      setErrors(prev => ({ 
        ...prev, 
        deleteProduct: 'Error al eliminar el producto: ' + error.message 
      }));
    }
  };

  const updateStock = async (productId: number, newStock: number, reason = "Ajuste manual") => {
    try {
      await updateStockHook(productId, newStock, reason);
      
      // Registrar movimiento de inventario
      const product = products.find(p => p.id === productId);
      if (product) {
        await addInventoryMovementHook({
          productId,
          productName: product.name,
          type: newStock > product.stock ? "entrada" : "salida",
          quantity: Math.abs(newStock - product.stock),
          previousStock: product.stock,
          newStock,
          reason,
          productCost: product.cost,
          productPrice: product.price
        });
      }

    } catch (error: any) {
      console.error('❌ Error actualizando stock:', error);
      setErrors(prev => ({ 
        ...prev, 
        updateStock: 'Error al actualizar stock: ' + error.message 
      }));
    }
  };

  // ==================== FUNCIONES DE VENTAS ====================
  const addToCart = (product: Product) => {
    addToCartHook(product, isWholesaleSale, selectedCustomer, cart, setCart);
  };

  const removeFromCart = (productId: number) => {
    removeFromCartHook(productId, cart, setCart);
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
      setNotifications(prev => [{
        type: 'info',
        message: `${item.productName} removido del carrito`,
        timestamp: new Date()
      }, ...prev]);
    }
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    updateCartQuantityHook(productId, quantity, cart, setCart, products, isWholesaleSale, selectedCustomer);
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      setErrors(prev => ({ ...prev, completeSale: 'El carrito está vacío' }));
      return;
    }

    try {
      const saleData = {
        cart,
        selectedCustomer,
        currentSubtotal,
        currentDiscount,
        currentTotal,
        currentPromotion,
        paymentMethod,
        isWholesaleSale,
        isInternalPurchase,
        products,
        updateStockInDatabase: async (productId: number, newStock: number) => {
          const product = products.find(p => p.id === productId);
          if (product) {
            await updateStockHook(productId, newStock, `Venta`);
          }
        },
        addInventoryMovement: addInventoryMovementHook
      };

      await completeSaleHook(saleData);

      // Limpiar estados de UI después de la venta
      setCart([]);
      setSelectedCustomer(null);
      setCurrentSubtotal(0);
      setCurrentDiscount(0);
      setCurrentTotal(0);
      setCurrentBreakdown([]);
      setCurrentPromotion(null);
      setIsWholesaleSale(false);
      setIsInternalPurchase(false);
      
      setNotifications(prev => [{
        type: 'success',
        message: `✅ Venta completada exitosamente! Total: ${formatCurrency(currentTotal)}`,
        timestamp: new Date()
      }, ...prev]);

    } catch (error: any) {
      console.error('❌ Error completando venta:', error);
      setErrors(prev => ({ 
        ...prev, 
        completeSale: 'Error al procesar la venta: ' + error.message 
      }));
    }
  };

  // ==================== FUNCIONES DE PROVEEDORES ====================
  const addSupplier = async () => {
    if (newSupplier.empresa && newSupplier.contacto) {
      try {
        await addSupplierHook(newSupplier);
        
        setNewSupplier({ 
          empresa: "", 
          contacto: "", 
          email: "", 
          telefono: "", 
          direccion: "", 
          productos_que_surte: "",
          ciudad: "",
          rut: "",
          condiciones_pago: "",
          tiempo_entrega: "",
        });

        setNotifications(prev => [{
          type: 'success',
          message: `Proveedor "${newSupplier.empresa}" agregado correctamente`,
          timestamp: new Date()
        }, ...prev]);

        const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
        if (closeButton) closeButton.click();
        
      } catch (error: any) {
        console.error('❌ Error agregando proveedor:', error);
        setErrors(prev => ({ 
          ...prev, 
          addSupplier: 'Error al crear el proveedor: ' + error.message 
        }));
      }
    } else {
      setErrors(prev => ({ 
        ...prev, 
        addSupplier: 'Por favor completa al menos los campos de Empresa y Contacto' 
      }));
    }
  };

  const updateSupplier = async (updatedSupplier: Supplier) => {
    try {
      await updateSupplierHook(updatedSupplier.id_proveedor, updatedSupplier);
      
      setIsEditSupplierDialogOpen(false);
      setEditingSupplier(null);
      
      setNotifications(prev => [{
        type: 'success',
        message: `Proveedor "${updatedSupplier.empresa}" actualizado correctamente`,
        timestamp: new Date()
      }, ...prev]);

    } catch (error: any) {
      console.error('❌ Error actualizando proveedor:', error);
      setErrors(prev => ({ 
        ...prev, 
        updateSupplier: 'Error al actualizar el proveedor: ' + error.message 
      }));
    }
  };

  const deleteSupplier = async (supplierId: number) => {
    try {
      await deleteSupplierHook(supplierId);
      
      setNotifications(prev => [{
        type: 'success',
        message: 'Proveedor eliminado correctamente',
        timestamp: new Date()
      }, ...prev]);

    } catch (error: any) {
      console.error('❌ Error eliminando proveedor:', error);
      setErrors(prev => ({ 
        ...prev, 
        deleteSupplier: 'Error al eliminar el proveedor: ' + error.message 
      }));
    }
  };

  // ==================== FUNCIONES DE CLIENTES Y PROMOCIONES ====================
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
      };
      setCustomers([...customers, customer]);
      
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        isWholesale: false,
      });

      setNotifications(prev => [{
        type: 'success',
        message: `Cliente "${newCustomer.name}" agregado correctamente`,
        timestamp: new Date()
      }, ...prev]);

      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
      if (closeButton) closeButton.click();
    }
  };

  const deleteCustomer = (customerId: number) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
    
    setNotifications(prev => [{
      type: 'info',
      message: 'Cliente eliminado correctamente',
      timestamp: new Date()
    }, ...prev]);
  };

  const addPromotion = () => {
    if (newPromotion.name) {
      if (newPromotion.discountType === "bundle") {
        if (newPromotion.bundleBuy <= 0 || newPromotion.bundlePay <= 0 || newPromotion.bundleBuy <= newPromotion.bundlePay) {
          setErrors(prev => ({ 
            ...prev, 
            addPromotion: "Para ofertas X por Y, debes especificar cantidades válidas (ejemplo: compra 3, paga 2)" 
          }));
          return;
        }
      } else if (newPromotion.discountValue <= 0) {
        setErrors(prev => ({ 
          ...prev, 
          addPromotion: "Debes especificar un valor de descuento válido" 
        }));
        return;
      }

      const promotion: Promotion = {
        id: Date.now(),
        ...newPromotion,
      };
      setPromotions([...promotions, promotion]);
      
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
      });

      setNotifications(prev => [{
        type: 'success',
        message: `Promoción "${newPromotion.name}" creada correctamente`,
        timestamp: new Date()
      }, ...prev]);

      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
      if (closeButton) closeButton.click();
    }
  };

  const togglePromotionStatus = (promotionId: number) => {
    setPromotions(promotions.map((p) => (p.id === promotionId ? { ...p, isActive: !p.isActive } : p)));
  };

  const deletePromotion = (promotionId: number) => {
    setPromotions(promotions.filter((p) => p.id !== promotionId));
    
    setNotifications(prev => [{
      type: 'info',
      message: 'Promoción eliminada correctamente',
      timestamp: new Date()
    }, ...prev]);
  };

  // ==================== FUNCIONES UTILITARIAS ====================
  const reloadAllData = async () => {
    try {
      await Promise.all([
        productsHook.loadProducts(),
        loadSalesFromDB(productsHook.products),
        loadSuppliersHook(),
        loadInventoryMovementsHook()
      ]);

      setNotifications(prev => [{
        type: 'success',
        message: 'Datos actualizados correctamente',
        timestamp: new Date()
      }, ...prev]);

    } catch (error) {
      console.error('❌ Error recargando datos:', error);
      setNotifications(prev => [{
        type: 'error',
        message: 'Error al actualizar los datos',
        timestamp: new Date()
      }, ...prev]);
    }
  };

  const clearError = (errorKey: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // ===========================================================================
  // SUBSECCIÓN 6.5: FUNCIONES DE EXPORTACIÓN
  // ===========================================================================
  
  const exportProductsToExcel = () => {
    const data = products.map((product) => ({
      Nombre: product.name,
      SKU: product.sku,
      "Código de Barras": product.barcode,
      Categoría: product.category,
      Precio: `$${product.price}`,
      Costo: `$${product.cost}`,
      "Ganancia Unitaria": `$${(product.price - product.cost).toFixed(2)}`,
      "Margen de Ganancia": product.cost > 0 ? `${(((product.price - product.cost) / product.cost) * 100).toFixed(1)}%` : "0.0%",
      "Stock Actual": product.stock,
      "Stock Mínimo": product.minStock,
      Estado: product.stock <= product.minStock ? "CRÍTICO" : product.stock <= product.minStock * 2 ? "BAJO" : "NORMAL",
      "Valor en Stock": `$${(product.stock * product.price).toFixed(2)}`,
      "Inversión en Stock": `$${(product.stock * product.cost).toFixed(2)}`,
      "Ganancia Potencial": `$${(product.stock * (product.price - product.cost)).toFixed(2)}`,
      Descripción: product.description,
    }));

    exportToExcel(data, "reporte-productos", "Inventario de Productos");
  };

  const exportSalesToExcel = () => {
    const mainData = sales.flatMap((sale) =>
      sale.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const ganancia = product ? (item.price - product.cost) * item.quantity : 0;

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
        };
      }),
    );

    exportToExcel(mainData, "reporte-ventas", "Historial de Ventas");
  };

  const exportSuppliersToExcel = () => {
    const data = suppliers.map((supplier) => ({
      Empresa: supplier.empresa,
      Contacto: supplier.contacto,
      Email: supplier.email,
      Teléfono: supplier.telefono,
      Dirección: supplier.direccion,
      Ciudad: supplier.ciudad || "",
      RFC: supplier.rut || "",
      "Condiciones de Pago": supplier.condiciones_pago || "",
      "Tiempo de Entrega": supplier.tiempo_entrega || "",
      "Productos que Surte": supplier.productos_que_surte,
      Estado: supplier.activo ? "Activo" : "Inactivo"
    }));

    exportToExcel(data, "proveedores", "Lista de Proveedores");
  };

  const exportInventoryToExcel = () => {
    const mainData = inventoryMovements.map((movement) => {
      const ganancia = movement.type === "salida" ? (movement.unitPrice - movement.unitCost) * movement.quantity : 0;

      return {
        "ID Movimiento": movement.id,
        Fecha: new Date(movement.date).toLocaleDateString('es-MX'),
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
        "Venta Relacionada": movement.venta_numero || "N/A",
        "Proveedor": movement.proveedor_nombre || "N/A",
        Usuario: movement.usuario || "Sistema"
      };
    });

    exportToExcel(mainData, "movimientos-inventario", "Movimientos de Inventario");
  };

    // Agregar estas funciones después de las otras funciones de exportación
  const exportCustomersToExcel = () => {
    const data = customers.map((customer) => ({
      Nombre: customer.name,
      Email: customer.email,
      Teléfono: customer.phone,
      Dirección: customer.address,
      Tipo: customer.isWholesale ? "Mayorista" : "Minorista",
      Estado: customer.isFrequent ? "VIP" : "Regular",
      'Total Compras': customer.totalPurchases,
      'Total Gastado': `$${customer.totalSpent.toLocaleString()}`,
      'Ticket Promedio': `$${customer.totalPurchases > 0 ? (customer.totalSpent / customer.totalPurchases).toFixed(2) : "0.00"}`,
      'Fecha Registro': customer.registrationDate,
      'Última Compra': customer.lastPurchaseDate || "Sin compras",
      Notas: customer.notes || ""
    }));

    exportToExcel(data, "clientes", "Base de Clientes");
  };

  const exportPromotionsToExcel = () => {
    const data = promotions.map((promo) => {
      let aplicaA = "";
      if (promo.appliesTo === "all") {
        aplicaA = "Todos los productos";
      } else if (promo.appliesTo === "specific") {
        aplicaA = `${promo.specificProducts.length} productos específicos`;
      } else if (promo.appliesTo === "category") {
        aplicaA = promo.specificCategories.join(", ");
      }

      let descuento = "";
      if (promo.discountType === "percentage") {
        descuento = `${promo.discountValue}%`;
      } else if (promo.discountType === "fixed") {
        descuento = `$${promo.discountValue}`;
      } else if (promo.discountType === "bundle") {
        descuento = `${promo.bundleBuy}x${promo.bundlePay}`;
      }

      return {
        Nombre: promo.name,
        Descripción: promo.description,
        'Tipo Descuento': promo.discountType,
        Descuento: descuento,
        'Aplica a': aplicaA,
        'Compra Mínima': promo.minPurchase > 0 ? `$${promo.minPurchase}` : "Sin mínimo",
        'Solo VIP': promo.forFrequentOnly ? "Sí" : "No",
        Estado: promo.isActive ? "Activa" : "Inactiva",
        'Fecha Inicio': promo.startDate,
        'Fecha Fin': promo.endDate
      };
    });

    exportToExcel(data, "promociones", "Promociones");
  };

  const exportCategoryReport = () => {
    const categoryData = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          cantidadProductos: 0,
          stockTotal: 0,
          valorTotal: 0
        };
      }
      acc[product.category].cantidadProductos++;
      acc[product.category].stockTotal += product.stock;
      acc[product.category].valorTotal += product.stock * product.price;
      
      return acc;
    }, {} as Record<string, { cantidadProductos: number; stockTotal: number; valorTotal: number }>);

    const data = Object.entries(categoryData).map(([categoria, info]) => ({
      Categoría: categoria,
      'Cantidad de Productos': info.cantidadProductos,
      'Stock Total': info.stockTotal,
      'Valor Total': `$${info.valorTotal.toFixed(2)}`
    }));

    exportToExcel(data, "stock-por-categoria", "Stock por Categoría");
  };

  const exportExpiringProducts = () => {
    const today = new Date();
    
    type ProductoVencimiento = {
      Producto: string;
      SKU: string;
      Categoría: string;
      'Fecha Vencimiento': string;
      'Días Restantes': number;
      Estado: string;
      Stock: number;
      'Valor en Stock': string;
      Alerta: string;
    };

    const data: ProductoVencimiento[] = products
      .filter(product => {
        if (!product.expiryDate) return false;
        const expiryDate = new Date(product.expiryDate);
        return !isNaN(expiryDate.getTime());
      })
      .map(product => {
        const expiryDate = new Date(product.expiryDate!);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let estado: string;
        if (diffDays < 0) {
          estado = "VENCIDO";
        } else if (diffDays <= 7) {
          estado = "CRÍTICO";
        } else if (diffDays <= 30) {
          estado = "PRÓXIMO";
        } else {
          estado = "VIGENTE";
        }
        
        return {
          Producto: product.name,
          SKU: product.sku,
          Categoría: product.category,
          'Fecha Vencimiento': product.expiryDate!, // Sabemos que no es undefined
          'Días Restantes': diffDays,
          Estado: estado,
          Stock: product.stock,
          'Valor en Stock': `$${(product.stock * product.price).toFixed(2)}`,
          'Alerta': diffDays <= 7 ? '⚠️ URGENTE' : diffDays <= 30 ? '⚠️ ATENCIÓN' : '✅ NORMAL'
        };
      })
      .sort((a, b) => {
        const estadoPrioridad: Record<string, number> = {
          'VENCIDO': 1,
          'CRÍTICO': 2,
          'PRÓXIMO': 3,
          'VIGENTE': 4
        };
        
        const prioridadA = estadoPrioridad[a.Estado] || 5;
        const prioridadB = estadoPrioridad[b.Estado] || 5;
        
        if (prioridadA === prioridadB) {
          const dateA = new Date(a['Fecha Vencimiento']).getTime();
          const dateB = new Date(b['Fecha Vencimiento']).getTime();
          return dateA - dateB;
        }
        
        return prioridadA - prioridadB;
      });

    if (data.length === 0) {
      setNotifications(prev => [{
        type: 'info',
        message: 'No hay productos con fechas de vencimiento para exportar',
        timestamp: new Date()
      }, ...prev]);
      return;
    }

    exportToExcel(data, "productos-por-vencer", "Productos por Vencer");

    setNotifications(prev => [{
      type: 'success',
      message: `Reporte de productos por vencer exportado: ${data.length} productos`,
      timestamp: new Date()
    }, ...prev]);
  };

  const exportObsoleteProducts = () => {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const data = products
      .filter(product => {
        // Productos sin ventas recientes (simplificado)
        const lastSold = product.lastSoldDate ? new Date(product.lastSoldDate) : null;
        return !lastSold || lastSold < sixtyDaysAgo;
      })
      .map(product => ({
        Producto: product.name,
        SKU: product.sku,
        Categoría: product.category,
        Stock: product.stock,
        'Última Venta': product.lastSoldDate || "Sin ventas registradas",
        'Valor en Stock': `$${(product.stock * product.price).toFixed(2)}`
      }));

    exportToExcel(data, "productos-obsoletos", "Productos Obsoletos");
  };

  const exportProfitableProducts = () => {
    const data = products
      .map(product => {
        const gananciaUnitaria = product.price - product.cost;
        const margen = product.cost > 0 ? (gananciaUnitaria / product.cost) * 100 : 0;
        const gananciaTotal = gananciaUnitaria * product.stock;
        
        return {
          Producto: product.name,
          SKU: product.sku,
          Categoría: product.category,
          Precio: `$${product.price}`,
          Costo: `$${product.cost}`,
          'Ganancia Unitaria': `$${gananciaUnitaria.toFixed(2)}`,
          'Margen %': `${margen.toFixed(1)}%`,
          Stock: product.stock,
          'Ganancia Total Potencial': `$${gananciaTotal.toFixed(2)}`
        };
      })
      .sort((a, b) => {
        const gananciaA = parseFloat(a['Ganancia Total Potencial'].replace('$', ''));
        const gananciaB = parseFloat(b['Ganancia Total Potencial'].replace('$', ''));
        return gananciaB - gananciaA;
      });

    exportToExcel(data, "productos-rentables", "Productos Rentables");
  };

  const exportPaymentMethodsReport = () => {
    const paymentData = sales.reduce((acc, sale) => {
      if (sale.status === "completed") {
        const method = sale.paymentMethod || "cash";
        if (!acc[method]) {
          acc[method] = { ventas: 0, total: 0 };
        }
        acc[method].ventas++;
        acc[method].total += sale.total;
      }
      return acc;
    }, {} as Record<string, { ventas: number; total: number }>);

    const data = Object.entries(paymentData).map(([metodo, info]) => ({
      'Método de Pago': metodo === "cash" ? "Efectivo" : 
                      metodo === "transfer" ? "Transferencia" : "Tarjeta",
      'Cantidad de Ventas': info.ventas,
      'Total Recaudado': `$${info.total.toFixed(2)}`,
      'Porcentaje del Total': `${((info.total / totalRevenue) * 100).toFixed(1)}%`
    }));

    exportToExcel(data, "ventas-por-metodo-pago", "Ventas por Método de Pago");
  };

  // ===========================================================================
  // SUBSECCIÓN 6.6: FUNCIONES DE BACKUP Y RECUPERACIÓN
  // ===========================================================================
  
  const resetSalesHistory = () => {
    setSalesBackup([...sales]);
    setSales([]);
    setShowRecoverySales(true);
    setTimeout(() => setShowRecoverySales(false), 10000);
  };

  const resetInventoryMovements = () => {
    setInventoryMovementsBackup([...inventoryMovements]);
    setInventoryMovements([]);
    setShowRecoveryInventory(true);
    setTimeout(() => setShowRecoveryInventory(false), 10000);
  };

  const recoverSalesHistory = () => {
    setSales([...salesBackup]);
    setSalesBackup([]);
    setShowRecoverySales(false);
  };

  const recoverInventoryMovements = () => {
    setInventoryMovements([...inventoryMovementsBackup]);
    setInventoryMovementsBackup([]);
    setShowRecoveryInventory(false);
  };

  // ===========================================================================
  // SUBSECCIÓN 6.7: CÁLCULOS Y DATOS PARA UI
  // ===========================================================================
  
  const completedSales = sales.filter(sale => sale.status === "completed");
  const totalRevenue = completedSales.reduce((sum, sale) => {
    const saleTotal = Number(sale.total) || 0;
    return sum + saleTotal;
  }, 0);
  
  const totalSalesCount = completedSales.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length;
  const criticalStockProducts = products.filter((p) => p.stock <= p.minStock);
  const totalSuppliers = suppliers.length;
  
  const totalProfit = inventoryMovements
    .filter((m) => m.type === "salida")
    .reduce((sum, m) => sum + (m.unitPrice - m.unitCost) * m.quantity, 0);

  const salesChartData = sales.length > 0
    ? sales.map((sale, index) => ({
        name: sale.date,
        value: sale.total,
      }))
    : [{ name: "Sin datos", value: 0 }];

  const productsSoldData = (() => {
    const productSales = products.map((product) => {
      const totalSold = sales.reduce((sum, sale) => {
        const item = sale.items.find((item) => item.productId === product.id);
        return sum + (item ? item.quantity : 0);
      }, 0);
      return { name: product.name, value: totalSold };
    });

    const filteredData = productSales.filter((item) => item.value > 0);
    return filteredData.length > 0 ? filteredData.slice(0, 5) : [{ name: "Sin ventas", value: 0 }];
  })();

  const categoryRevenueData = (() => {
    const categoryMap = new Map();

    sales.forEach((sale) => {
      if (sale.status === "completed") {
        sale.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            const currentValue = categoryMap.get(product.category) || 0;
            const subtotalNum = typeof item.subtotal === 'string' 
              ? parseFloat(item.subtotal) 
              : Number(item.subtotal);
            categoryMap.set(product.category, currentValue + subtotalNum);
          }
        });
      }
    });

    const result = Array.from(categoryMap.entries()).map(([name, value]) => ({ 
      name, 
      value: Number(value.toFixed(2))
    }));

    return result.length > 0 ? result : [{ name: "No hay ventas", value: 0 }];
  })();

  // ===========================================================================
  // SUBSECCIÓN 6.8: RENDERIZADO POR PESTAÑA
  // ===========================================================================

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
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
        );

      case "products":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Productos</CardTitle>
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
                      {productsHook.filterProducts(productSearchTerm)
                        .filter(product => product && product.id)
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
        );

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
                  {productsHook.searchProducts(searchTerm).map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sku} | Min: ${product.price}
                          {isWholesaleSale && ` | May: $${product.wholesalePrice}`} - Stock: {product.stock}
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

            <Card>
              <CardHeader>
                <CardTitle>Carrito de Compras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={isWholesaleSale} 
                      onCheckedChange={setIsWholesaleSale}
                      id="wholesale-mode"
                    />
                    <Label htmlFor="wholesale-mode" className="cursor-pointer">
                      Venta Mayorista
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={isInternalPurchase} 
                      onCheckedChange={setIsInternalPurchase}
                      id="internal-purchase"
                    />
                    <Label htmlFor="internal-purchase" className="cursor-pointer">
                      Compra Interna
                    </Label>
                  </div>
                </div>
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

                {cart.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${currentSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Descuento:</span>
                        <span className="text-red-600">-${currentDiscount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>${currentTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <Label>Método de Pago</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={paymentMethod === "cash" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("cash")}
                          size="sm"
                        >
                          Efectivo
                        </Button>
                        <Button
                          variant={paymentMethod === "transfer" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("transfer")}
                          size="sm"
                        >
                          Transferencia
                        </Button>
                        <Button
                          variant={paymentMethod === "card" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("card")}
                          size="sm"
                        >
                          Tarjeta
                        </Button>
                      </div>
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
        );

      case "suppliers":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Proveedores</CardTitle>
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
                            <Label htmlFor="supplier-rut">RUT</Label>
                            <Input
                              id="supplier-rut"
                              value={newSupplier.rut || ""}
                              onChange={(e) => setNewSupplier({ ...newSupplier, rut: e.target.value })}
                              placeholder="RUT"
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
                          <Select
                            value={newSupplier.condiciones_pago || ""}
                            onValueChange={(value) => setNewSupplier({ ...newSupplier, condiciones_pago: value })}
                          >
                            <SelectTrigger id="supplier-condiciones-pago">
                              <SelectValue placeholder="Seleccione condición de pago" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                              <SelectItem value="Tarjeta de Débito">Tarjeta de Débito</SelectItem>
                              <SelectItem value="Transferencia">Transferencia</SelectItem>
                              <SelectItem value="Efectivo">Efectivo</SelectItem>
                              <SelectItem value="Cheque">Cheque</SelectItem>
                              <SelectItem value="Otro medio">Otro medio</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <div className="flex gap-2">
                            <Dialog
                              open={isEditSupplierDialogOpen && editingSupplier?.id_proveedor === supplier.id_proveedor}
                              onOpenChange={(open) => {
                                setIsEditSupplierDialogOpen(open)
                                if (!open) setEditingSupplier(null)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingSupplier(supplier)
                                    setIsEditSupplierDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Editar Proveedor</DialogTitle>
                                </DialogHeader>
                                {editingSupplier && (
                                  <EditSupplierForm
                                    supplier={editingSupplier}
                                    onSave={updateSupplier}
                                    onCancel={() => {
                                      setIsEditSupplierDialogOpen(false)
                                      setEditingSupplier(null)
                                    }}
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
                                  <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor "{supplier.empresa}".
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case "inventory":
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Movimientos de Inventario
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={exportInventoryToExcel} variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
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
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={resetInventoryMovements} className="bg-red-600 hover:bg-red-700">
                          Sí, Limpiar Todo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

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
                        <TableHead>ID</TableHead>
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
                        <TableHead>Motivo</TableHead>
                        <TableHead>Venta</TableHead>
                        <TableHead>Proveedor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="text-sm font-mono">{movement.id}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(movement.date).toLocaleDateString('es-MX')}
                          </TableCell>
                          <TableCell>{movement.productName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                movement.type === "entrada" ? "default" :
                                movement.type === "salida" ? "destructive" :
                                movement.type === "ajuste" ? "secondary" : "outline"
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
                              <div className={`font-medium ${
                                movement.type === "salida" ? "text-green-600" : "text-gray-500"
                              }`}>
                                $
                                {movement.type === "salida"
                                  ? ((movement.unitPrice - movement.unitCost) * movement.quantity).toFixed(2)
                                  : "0.00"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate" title={movement.reason}>
                            {movement.reason}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.venta_numero || "N/A"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.proveedor_nombre || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "history":
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historial de Ventas ({sales.length} ventas)</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={exportSalesToExcel} variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
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
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={resetSalesHistory} className="bg-red-600 hover:bg-red-700">
                          Sí, Limpiar Todo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

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
                        fechaFormateada = fechaDate.toLocaleDateString('es-ES', {
                          timeZone: 'UTC',
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric'
                        });
                      } catch (error) {
                        fechaFormateada = 'Fecha inválida';
                      }

                      return (
                        <TableRow key={sale.id}>
                          <TableCell className="font-mono font-medium">{sale.saleNumber}</TableCell>
                          <TableCell>{fechaFormateada}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{sale.customerName || "Sin cliente"}</div>
                              {sale.isWholesale && (
                                <Badge variant="outline" className="text-xs">Mayorista</Badge>
                              )}
                              {sale.isInternalPurchase && (
                                <Badge variant="secondary" className="text-xs ml-1">Interna</Badge>
                              )}
                              <div className="text-sm text-muted-foreground mt-1">
                                {sale.items.map((item, index) => (
                                  <div key={`${item.productId}-${index}`}>
                                    {item.productName} x{item.quantity}
                                  </div>
                                ))}
                              </div>
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
        );

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
        );

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
                            <Label htmlFor="promo-description">Descripción</Label>
                            <Textarea
                              id="promo-description"
                              value={newPromotion.description}
                              onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                              placeholder="Descripción de la promoción"
                            />
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
        );

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
        );

      default:
        return <div>Sección no encontrada</div>;
    }
  };

  // ===========================================================================
  // SUBSECCIÓN 6.9: RENDER PRINCIPAL
  // ===========================================================================
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
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
  );
}

/*
Avance de Page.tsx avanzado con:
Alberto garcia
Diego Jorquera
29-10-2025
Parte desarrollada: FrondEnt
*/
