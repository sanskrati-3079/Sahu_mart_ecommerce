import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { resizeImage } from '@/data/images'
import { cn } from '@/lib/utils'

interface GalleryProps {
  images: string[]
  alt: string
}

export function Gallery({ images, alt }: GalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Keep the swipe track in sync when a thumbnail is chosen.
  const goTo = (i: number) => {
    setIndex(i)
    const el = trackRef.current
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== index) setIndex(i)
  }

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {images.length > 1 && (
        <ul className="flex gap-2 lg:flex-col" aria-label="Product images">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn(
                  'block w-16 overflow-hidden rounded-md border-2 transition-colors lg:w-20',
                  i === index ? 'border-forest' : 'border-transparent opacity-75 hover:opacity-100',
                )}
              >
                <img src={resizeImage(src, 160)} alt="" className="aspect-[4/5] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative min-w-0 flex-1">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-lg bg-sage"
          aria-roledescription="carousel"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setIndex(i)
                setLightbox(true)
              }}
              className="group relative w-full shrink-0 snap-center cursor-zoom-in"
              aria-label={`Open image ${i + 1} full screen`}
            >
              <img
                src={resizeImage(src, 1100)}
                srcSet={`${resizeImage(src, 700)} 700w, ${resizeImage(src, 1100)} 1100w`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={i === 0 ? alt : `${alt} — view ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="aspect-[4/5] w-full object-cover"
              />
              <span
                className="absolute right-4 bottom-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
                aria-hidden
              >
                <ZoomIn className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden" aria-hidden>
            {images.map((src, i) => (
              <span key={src} className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-5 bg-forest' : 'w-1.5 bg-charcoal/30')} />
            ))}
          </div>
        )}
      </div>
      <Lightbox images={images} alt={alt} index={index} open={lightbox} onOpenChange={setLightbox} onIndex={goTo} />
    </div>
  )
}

function Lightbox({
  images,
  alt,
  index,
  open,
  onOpenChange,
  onIndex,
}: {
  images: string[]
  alt: string
  index: number
  open: boolean
  onOpenChange: (o: boolean) => void
  onIndex: (i: number) => void
}) {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const count = images.length
  const prev = () => {
    setZoom(false)
    onIndex((index - 1 + count) % count)
  }
  const next = () => {
    setZoom(false)
    onIndex((index + 1) % count)
  }

  useEffect(() => {
    if (!open) setZoom(false)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        overlayClassName="bg-charcoal/90"
        className="flex h-[100dvh] max-h-none w-screen max-w-none flex-col rounded-none bg-transparent p-0 shadow-none"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') prev()
          if (e.key === 'ArrowRight') next()
        }}
      >
        <DialogTitle className="sr-only">{alt} — image viewer</DialogTitle>
        <DialogDescription className="sr-only">Use left and right arrow keys to change image. Click the image to zoom.</DialogDescription>
        <div className="flex items-center justify-between p-4 text-ivory">
          <span className="text-sm tabular-nums">
            {index + 1} / {count}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => !z)}
              className="on-dark inline-flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20"
              aria-label={zoom ? 'Zoom out' : 'Zoom in'}
            >
              {zoom ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </button>
            <DialogClose
              className="on-dark inline-flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pb-6">
          <img
            src={resizeImage(images[index], 1600)}
            alt={alt}
            onClick={() => setZoom((z) => !z)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
            }}
            style={{ transformOrigin: origin }}
            className={cn(
              'max-h-full max-w-full rounded-md object-contain transition-transform duration-300',
              zoom ? 'scale-[2.2] cursor-zoom-out' : 'cursor-zoom-in',
            )}
          />
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="on-dark absolute top-1/2 left-4 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={next}
                className="on-dark absolute top-1/2 right-4 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-charcoal"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
