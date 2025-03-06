"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface QrCodeGeneratorProps {
  defaultValue?: string
  size?: number
}

export function QrCodeGenerator({ defaultValue = "", size = 200 }: QrCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState(defaultValue)
  const [qrSize, setQrSize] = useState(size)

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = qrSize
      canvas.height = qrSize
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `qrcode-${qrValue.replace(/[^a-z0-9]/gi, "-")}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <Label htmlFor="qr-value">QR Code Value</Label>
            <Input
              id="qr-value"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              placeholder="Enter URL or text for QR code"
              className="mt-1"
            />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrValue || "https://example.com"}
              size={qrSize}
              level="H" // High error correction
              includeMargin={true}
            />
          </div>

          <Button onClick={downloadQRCode} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

