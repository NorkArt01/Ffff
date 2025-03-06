"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { QrScanner } from "@/components/qr-scanner"

export default function QRScannerPage() {
  const router = useRouter()

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">QR Code Scanner</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Scan a QR code to quickly access candidate information
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Button variant="outline" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <QrScanner />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Position the QR code within the scanner frame.</p>
          <p>Make sure you have adequate lighting for best results.</p>
        </div>
      </div>
    </div>
  )
}

