"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  minStock: number
  category: string
  description: string
  observations: string
}

interface EditProductFormProps {
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}

export function EditProductForm({ product, onSave, onCancel }: EditProductFormProps) {
  const [formData, setFormData] = useState<Product>({ ...product })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.price > 0 && formData.minStock > 0) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Nombre</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nombre del producto"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-price">Precio</Label>
          <Input
            id="edit-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="0.00"
            required
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="edit-stock">Stock Actual</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            placeholder="0"
            required
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-minstock">Stock Mínimo</Label>
          <Input
            id="edit-minstock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
            placeholder="1"
            required
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="edit-category">Categoría</Label>
          <Input
            id="edit-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Categoría"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-description">Descripción</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del producto"
        />
      </div>

      <div>
        <Label htmlFor="edit-observations">Observaciones</Label>
        <Textarea
          id="edit-observations"
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          placeholder="Notas adicionales sobre el producto"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  )
}
