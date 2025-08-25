export const validateStock = (currentStock: number, requestedQuantity: number): boolean => {
  return currentStock >= requestedQuantity && requestedQuantity > 0
}

export const calculateNewStock = (currentStock: number, change: number): number => {
  const newStock = currentStock + change
  return Math.max(0, newStock) // Nunca permitir stock negativo
}

export const validateStockForSale = (products: any[], cartItems: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (product && product.stock < item.quantity) {
      errors.push(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
