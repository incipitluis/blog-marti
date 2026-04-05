'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ImageUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative overflow-hidden rounded-md border border-border">
          <img
            src={value}
            alt="Hero image"
            className="aspect-[16/9] w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-black/80"
          >
            Eliminar
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface px-4 py-8 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          {uploading ? (
            <span>Subiendo imagen...</span>
          ) : (
            <>
              <span className="text-2xl">↑</span>
              <span>Arrastra una imagen o haz clic para seleccionar</span>
              <span className="text-xs">JPG, PNG, WebP o GIF · máx. 5 MB</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
