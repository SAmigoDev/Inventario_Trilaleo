"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

// Tipos de datos
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
  description: string
  observations: string
}

interface Supplier {
  id: number
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  products: string[]
}

interface Sale {
  id: number
  saleNumber: string
  items: SaleItem[]
  total: number
  date: string
}

interface SaleItem {
  productId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

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

const EditProductForm: React.FC<{ product: Product; onSave: (product: Product) => void; onCancel: () => void }> = ({
  product,
  onSave,
  onCancel,
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-product-sku">SKU</Label>
          <Input
            id="edit-product-sku"
            value={editedProduct.sku}
            onChange={(e) => setEditedProduct({ ...editedProduct, sku: e.target.value })}
            placeholder="SKU-001"
          />
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
          <Input
            id="edit-product-category"
            value={editedProduct.category}
            onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
            placeholder="Categoría"
          />
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
      <div>
        <Label htmlFor="edit-product-observations">Observaciones</Label>
        <Textarea
          id="edit-product-observations"
          value={editedProduct.observations}
          onChange={(e) => setEditedProduct({ ...editedProduct, observations: e.target.value })}
          placeholder="Notas adicionales sobre el producto"
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

export default function BusinessSalesSystem() {
  // Estados
  const [activeTab, setActiveTab] = useState("dashboard")

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Laptop HP",
      sku: "LAP-HP-001",
      barcode: "7501234567890",
      price: 15000,
      cost: 12000,
      stock: 10,
      minStock: 3,
      category: "Electrónicos",
      description: "Laptop HP Core i5",
      observations: "Producto estrella",
    },
    {
      id: 2,
      name: "Mouse Inalámbrico",
      sku: "MOU-WIR-002",
      barcode: "7501234567891",
      price: 500,
      cost: 350,
      stock: 25,
      minStock: 5,
      category: "Accesorios",
      description: "Mouse inalámbrico ergonómico",
      observations: "",
    },
    {
      id: 3,
      name: "Teclado Mecánico",
      sku: "KEY-MEC-003",
      barcode: "7501234567892",
      price: 1200,
      cost: 800,
      stock: 15,
      minStock: 2,
      category: "Accesorios",
      description: "Teclado mecánico RGB",
      observations: "Revisar proveedor",
    },
    {
      id: 4,
      name: 'Monitor 24"',
      sku: "MON-24-004",
      barcode: "7501234567893",
      price: 3500,
      cost: 2800,
      stock: 8,
      minStock: 2,
      category: "Electrónicos",
      description: "Monitor LED 24 pulgadas",
      observations: "",
    },
    {
      id: 5,
      name: "Webcam HD",
      sku: "WEB-HD-005",
      barcode: "7501234567894",
      price: 800,
      cost: 600,
      stock: 20,
      minStock: 5,
      category: "Accesorios",
      description: "Cámara web HD 1080p",
      observations: "",
    },
  ])

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: "TechnoSupply SA",
      contactPerson: "Roberto Vega",
      email: "ventas@technosupply.com",
      phone: "555-1001",
      address: "Zona Industrial 100",
      products: ["Laptops", "Computadoras", "Monitores"],
    },
    {
      id: 2,
      name: "Distribuidora Digital",
      contactPerson: "Carmen Morales",
      email: "contacto@digidigital.com",
      phone: "555-1002",
      address: "Centro Comercial 200",
      products: ["Accesorios", "Cables", "Periféricos"],
    },
  ])

  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      saleNumber: "V-001234",
      items: [
        { productId: 1, productName: "Laptop HP", quantity: 1, price: 15000, subtotal: 15000 },
        { productId: 2, productName: "Mouse Inalámbrico", quantity: 2, price: 500, subtotal: 1000 },
      ],
      total: 16000,
      date: "2024-01-15",
    },
    {
      id: 2,
      saleNumber: "V-001235",
      items: [{ productId: 3, productName: "Teclado Mecánico", quantity: 1, price: 1200, subtotal: 1200 }],
      total: 1200,
      date: "2024-01-16",
    },
  ])

  const [cart, setCart] = useState<SaleItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Estados para backup y recuperación
  const [salesBackup, setSalesBackup] = useState<Sale[]>([])
  const [inventoryMovementsBackup, setInventoryMovementsBackup] = useState<InventoryMovement[]>([])
  const [showRecoverySales, setShowRecoverySales] = useState(false)
  const [showRecoveryInventory, setShowRecoveryInventory] = useState(false)

  // Formularios
  const [newProduct, setNewProduct] = useState({
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
  })

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    products: "",
  })

  // Funciones de reset y recuperación
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

  // Funciones para productos
  const addProduct = () => {
    if (newProduct.name && newProduct.sku && newProduct.price > 0 && newProduct.cost >= 0) {
      const product: Product = {
        id: Date.now(),
        ...newProduct,
      }
      setProducts([...products, product])
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
      })
      // Cerrar el diálogo
      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement
      if (closeButton) closeButton.click()
    }
  }

  const updateStock = (productId: number, newStock: number, reason = "Ajuste manual") => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const previousStock = product.stock
      const finalStock = Math.max(0, newStock)
      setProducts(products.map((p) => (p.id === productId ? { ...p, stock: finalStock } : p)))

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

  const deleteSupplier = (supplierId: number) => {
    setSuppliers(suppliers.filter((s) => s.id !== supplierId))
  }

  // Funciones para ventas
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
              : item,
          ),
        )
      }
    } else {
      if (product.stock > 0) {
        setCart([
          ...cart,
          {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            price: product.price,
            subtotal: product.price,
          },
        ])
      }
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (product && quantity <= product.stock) {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity, subtotal: quantity * item.price } : item,
        ),
      )
    }
  }

  const completeSale = () => {
    if (cart.length === 0) return

    const saleNumber = `V-${Date.now().toString().slice(-6)}`
    const sale: Sale = {
      id: Date.now(),
      saleNumber,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.subtotal, 0),
      date: new Date().toLocaleDateString(),
    }

    const updatedProducts = [...products]
    const newMovements: InventoryMovement[] = []

    cart.forEach((item) => {
      const productIndex = updatedProducts.findIndex((p) => p.id === item.productId)
      if (productIndex !== -1) {
        const product = updatedProducts[productIndex]
        const previousStock = product.stock
        const newStock = Math.max(0, previousStock - item.quantity)

        updatedProducts[productIndex] = { ...product, stock: newStock }

        const movement: InventoryMovement = {
          id: Date.now() + Math.random(),
          productId: product.id,
          productName: product.name,
          type: "salida",
          quantity: item.quantity,
          previousStock,
          newStock,
          unitCost: product.cost,
          unitPrice: product.price,
          totalCost: item.quantity * product.cost,
          totalValue: item.quantity * product.price,
          reason: `Venta ${saleNumber}`,
          date: new Date().toLocaleString(),
        }
        newMovements.push(movement)
      }
    })

    setProducts(updatedProducts)
    setInventoryMovements((prev) => [...newMovements, ...prev])
    setSales([...sales, sale])
    setCart([])
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
      id: Date.now(),
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
    setInventoryMovements((prev) => [movement, ...prev])
  }

  const editProduct = (updatedProduct: Product) => {
    const originalProduct = products.find((p) => p.id === updatedProduct.id)

    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))

    if (originalProduct && originalProduct.stock !== updatedProduct.stock) {
      setProducts(products.map((p) => (p.id === updatedProduct.id ? originalProduct : p)))

      setTimeout(() => {
        updateStock(updatedProduct.id, updatedProduct.stock, "Edición de producto")
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? { ...updatedProduct, stock: updatedProduct.stock } : p)),
        )
      }, 0)
    }

    setIsEditDialogOpen(false)
    setEditingProduct(null)
  }

  const deleteProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  // Funciones de exportación Excel mejoradas
  const exportInventoryToExcel = () => {
    const data = inventoryMovements.map((movement) => {
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

    if (data.length > 0) {
      data.push({
        Fecha: "TOTAL GENERAL",
        Producto: "",
        "Tipo de Movimiento": "",
        Cantidad: "",
        "Stock Anterior": "",
        "Stock Nuevo": "",
        "Costo Unitario": "",
        "Precio Unitario": "",
        "Valor Total": "",
        Ganancia: `$${totalGanancia.toFixed(2)}`,
        Motivo: "",
      })
    }

    exportToExcel(data, "movimientos-inventario", "Movimientos de Inventario")
  }

  const exportProductsToExcel = () => {
    const data = products.map((product) => ({
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
      Observaciones: product.observations,
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
      "Stock Mínimo": "",
      Estado: "",
      "Valor en Stock": `$${totalValor.toFixed(2)}`,
      "Inversión en Stock": `$${totalInversion.toFixed(2)}`,
      "Ganancia Potencial": `$${totalGanancia.toFixed(2)}`,
      Descripción: "",
      Observaciones: "",
    })

    exportToExcel(data, "reporte-productos", "Inventario de Productos")
  }

  const exportSalesToExcel = () => {
    const data = sales.flatMap((sale) =>
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
    const totalGanancia = data.reduce((sum, item) => {
      const gananciaStr = item.Ganancia.replace("$", "")
      return sum + Number.parseFloat(gananciaStr)
    }, 0)

    if (data.length > 0) {
      data.push({
        "Número de Venta": "TOTALES GENERALES",
        Fecha: "",
        Producto: "",
        Cantidad: "",
        "Precio Unitario": "",
        "Costo Unitario": "",
        Subtotal: "",
        Ganancia: `$${totalGanancia.toFixed(2)}`,
        "Total de la Venta": `$${totalVentas.toFixed(2)}`,
      })
    }

    exportToExcel(data, "reporte-ventas", "Historial de Ventas")
  }

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
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length
  const criticalStockProducts = products.filter((p) => p.stock <= p.minStock)
  const totalSales = sales.length
  const totalSuppliers = suppliers.length
  const totalProfit = inventoryMovements
    .filter((m) => m.type === "salida")
    .reduce((sum, m) => sum + (m.unitPrice - m.unitCost) * m.quantity, 0)

  const addSupplier = () => {
    if (newSupplier.name && newSupplier.contactPerson) {
      const supplier: Supplier = {
        id: Date.now(),
        ...newSupplier,
        products: newSupplier.products
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0),
      }
      setSuppliers([...suppliers, supplier])
      setNewSupplier({ name: "", contactPerson: "", email: "", phone: "", address: "", products: "" })
      // Cerrar el diálogo
      const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement
      if (closeButton) closeButton.click()
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

  const categoryRevenueData = (() => {
    const categoryMap = new Map()

    // Inicializar categorías
    products.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, 0)
      }
    })

    // Calcular ingresos por categoría
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product) {
          const currentValue = categoryMap.get(product.category) || 0
          categoryMap.set(product.category, currentValue + item.subtotal)
        }
      })
    })

    const result = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }))
    return result.length > 0 && result.some((item) => item.value > 0)
      ? result.filter((item) => item.value > 0)
      : [{ name: "Sin datos", value: 0 }]
  })()

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Ingresos Totales"
                value={`$${totalRevenue.toLocaleString()}`}
                subtitle={`${totalSales} ventas realizadas`}
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
                            <Input
                              id="product-sku"
                              value={newProduct.sku}
                              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                              placeholder="SKU-001"
                            />
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
                          <Label htmlFor="product-category">Categoría</Label>
                          <Input
                            id="product-category"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            placeholder="Categoría"
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-description">Descripción</Label>
                          <Textarea
                            id="product-description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Descripción del producto"
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-observations">Observaciones</Label>
                          <Textarea
                            id="product-observations"
                            value={newProduct.observations}
                            onChange={(e) => setNewProduct({ ...newProduct, observations: e.target.value })}
                            placeholder="Notas adicionales sobre el producto"
                          />
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
                      {filterProducts(productSearchTerm).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.category}</div>
                              {product.observations && (
                                <div className="text-xs text-blue-600 mt-1">📝 {product.observations}</div>
                              )}
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

      case "sales":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos Disponibles</CardTitle>
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
                          ${item.price} x {item.quantity} = ${item.subtotal}
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
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-xl font-bold">
                        ${cart.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}
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
                          <Label htmlFor="supplier-name">Nombre de la Empresa</Label>
                          <Input
                            id="supplier-name"
                            value={newSupplier.name}
                            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                            placeholder="Nombre de la empresa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="supplier-contact">Persona de Contacto</Label>
                          <Input
                            id="supplier-contact"
                            value={newSupplier.contactPerson}
                            onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
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
                            <Label htmlFor="supplier-phone">Teléfono</Label>
                            <Input
                              id="supplier-phone"
                              value={newSupplier.phone}
                              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                              placeholder="555-0000"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="supplier-address">Dirección</Label>
                          <Input
                            id="supplier-address"
                            value={newSupplier.address}
                            onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                            placeholder="Dirección completa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="supplier-products">Productos que Suministra</Label>
                          <Textarea
                            id="supplier-products"
                            value={newSupplier.products}
                            onChange={(e) => setNewSupplier({ ...newSupplier, products: e.target.value })}
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
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">{supplier.address}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{supplier.contactPerson}</div>
                            <div>{supplier.email}</div>
                            <div className="text-muted-foreground">{supplier.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {supplier.products.map((product, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
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
                                  {supplier.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteSupplier(supplier.id)}>
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
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          ¿Resetear Movimientos de Inventario?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará TODOS los movimientos de inventario registrados. Tendrás 10 segundos
                          para recuperar los datos si cambias de opinión.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={resetInventoryMovements} className="bg-red-600 hover:bg-red-700">
                          Sí, Resetear Todo
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
                        <TableHead>Motivo</TableHead>
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

      case "history":
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historial de Ventas</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={exportSalesToExcel} variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          ¿Resetear Historial de Ventas?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará TODAS las ventas registradas. Tendrás 10 segundos para recuperar los
                          datos si cambias de opinión.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={resetSalesHistory} className="bg-red-600 hover:bg-red-700">
                          Sí, Resetear Todo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Botón de recuperación */}
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
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono font-medium">{sale.saleNumber}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {sale.items.map((item, index) => (
                              <div key={index}>
                                {item.productName} x{item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">${sale.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )

      default:
        return <div>Sección no encontrada</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Sistema web de inventarios</h1>
            <p className="text-gray-600 mt-2">Panel de control y gestión</p>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}
