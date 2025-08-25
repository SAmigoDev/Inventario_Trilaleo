"use client"

// Función mejorada para exportar a CSV (más confiable que Excel en el navegador)
export const exportToCSV = (data: any[], filename: string) => {
  try {
    if (!data.length) {
      alert("No hay datos para exportar")
      return
    }

    const headers = Object.keys(data[0])

    // Crear contenido CSV con codificación UTF-8
    const csvContent = [
      // BOM para UTF-8 (para que Excel abra correctamente los caracteres especiales)
      "\ufeff",
      // Headers
      headers.join(","),
      // Data rows
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || ""
            // Escapar comillas y envolver en comillas si contiene comas o comillas
            if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    // Crear y descargar archivo
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}.csv`
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Mostrar mensaje de éxito
    alert(`Archivo ${filename}.csv descargado exitosamente. Puede abrirlo en Excel.`)
  } catch (error) {
    console.error("Error al exportar CSV:", error)
    alert("Error al generar el archivo CSV. Por favor, intenta nuevamente.")
  }
}

// Función para exportar a Excel usando SheetJS (más confiable)
export const exportToExcel = async (data: any[], filename: string, sheetName = "Datos") => {
  try {
    // Importar la librería XLSX dinámicamente
    const XLSX = await import("xlsx")

    if (!data || data.length === 0) {
      alert("No hay datos para exportar")
      return
    }

    // Crear worksheet desde los datos JSON
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Crear workbook y agregar la hoja
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Configurar el ancho de las columnas automáticamente
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")
    const colWidths = []

    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
        const cell = worksheet[cellAddress]
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length
          if (cellLength > maxWidth) {
            maxWidth = Math.min(cellLength, 50) // Máximo 50 caracteres
          }
        }
      }
      colWidths.push({ wch: maxWidth })
    }
    worksheet["!cols"] = colWidths

    // Escribir el archivo
    XLSX.writeFile(workbook, `${filename}.xlsx`)

    alert(`Archivo ${filename}.xlsx descargado exitosamente.`)
  } catch (error) {
    console.error("Error al exportar Excel:", error)
    alert("Error al generar el archivo Excel. Asegúrate de que tu navegador soporte la descarga de archivos.")
  }
}

// Función auxiliar para formatear datos antes de exportar
export const formatDataForExcel = (data: any[], title?: string) => {
  if (!data || data.length === 0) return []

  const formattedData = [...data]

  // Agregar título si se proporciona
  if (title) {
    formattedData.unshift({
      [Object.keys(data[0])[0]]: title,
      ...Object.keys(data[0])
        .slice(1)
        .reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
    })
    formattedData.unshift({}) // Línea en blanco
  }

  return formattedData
}
