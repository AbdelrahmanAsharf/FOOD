import { useRef } from "react"
import Image from "next/image"
type Props = {
  previewUrl: string
  onFileSelect: (file: File) => void
}

export function UploadImage({ previewUrl, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className="relative w-48 h-48 cursor-pointer border rounded-lg overflow-hidden group"
      onClick={() => inputRef.current?.click()}
    >
      <Image
        src={previewUrl || "/placeholder.png"}
        alt="Preview"
        className="w-full h-full object-cover"
        width={400}
        height={200}
      />
      <div className="absolute inset-0 bg-black/50 text-white items-center justify-center hidden group-hover:flex text-sm">
        تغيير الصورة
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
        }}
        className="hidden"
        ref={inputRef}
      />
    </div>
  )
}
