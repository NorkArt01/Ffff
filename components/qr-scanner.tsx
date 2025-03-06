"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"
import { Camera, CameraOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function QrScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader")

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            setScanResult(decodedText)
            setIsScanning(false)

            // Stop scanning after successful scan
            if (html5QrCode) {
              html5QrCode.stop()

              // Navigate to the candidate profile or handle URL
              if (decodedText.startsWith("http")) {
                window.location.href = decodedText
              } else {
                router.push(`/candidate/${decodedText}`)
              }
            }
          },
          (errorMessage) => {
            // Ignore the QR code not found error
            if (errorMessage.includes("QR code not found")) {
              return
            }
            setError(`Scan error: ${errorMessage}`)
          },
        )

        setIsScanning(true)
        setError("")
      } catch (err) {
        setError(`Camera error: ${err.message || "Failed to access camera"}`)
        setIsScanning(false)
      }
    }

    const stopScanner = async () => {
      if (html5QrCode && isScanning) {
        try {
          await html5QrCode.stop()
          setIsScanning(false)
        } catch (err) {
          console.error("Error stopping scanner:", err)
        }
      }
    }

    if (isScanning) {
      startScanner()
    }

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch((err) => console.error("Error stopping scanner:", err))
      }
    }
  }, [isScanning, router])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div id="qr-reader" className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden"></div>

          {error && <div className="w-full p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

          <Button
            onClick={() => setIsScanning(!isScanning)}
            className="w-full"
            variant={isScanning ? "destructive" : "default"}
          >
            {isScanning ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" /> Stop Scanner
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" /> Start Scanner
              </>
            )}
          </Button>

          {scanResult && (
            <div className="w-full p-3 bg-green-50 text-green-600 rounded-md text-sm">
              QR Code detected! Redirecting...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

