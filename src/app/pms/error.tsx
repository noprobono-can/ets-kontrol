"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function PmsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
      <p className="font-medium text-rose-950">Pano yüklenemedi</p>
      <p className="mt-1 text-sm text-rose-800">
        Demo verisi okunamadı veya beklenmeyen bir hata oluştu. Sayfayı yeniden
        deneyin.
      </p>
      <Button className="mt-4" onClick={reset}>
        Yeniden dene
      </Button>
    </div>
  )
}
