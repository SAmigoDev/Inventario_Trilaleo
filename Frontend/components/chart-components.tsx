"use client"

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"

interface ChartData {
  name: string
  value: number
  color?: string
}

interface SalesChartProps {
  data: ChartData[]
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Ventas"]} />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function ProductsPieChart({ data }: SalesChartProps) {
  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} unidades`, "Vendidas"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function CategoryBarChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Ingresos"]} />
        <Bar dataKey="value" fill="#06b6d4" />
      </BarChart>
    </ResponsiveContainer>
  )
}
