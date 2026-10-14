import { useEffect, useRef, useState, type ReactNode } from 'react'
import { X, Plus, Minus, Check, AlertCircle } from 'lucide-react'

export function Image({ src, alt, className = '', ...props }: { src: string; alt: string; className?: string; loading?: 'eager' | 'lazy'; onClick?: () => void }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  return failed ? <div className={`image-fallback ${className}`} role="img" aria-label={alt}><span>KORU</span></div> : <img src={src} alt={alt} className={className} loading={props.loading ?? 'lazy'} onClick={props.onClick} onError={() => setFailed(true)} />
}

export function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false, block = false, onClick }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'text' | 'light'; size?: 'sm' | 'md' | 'lg'; className?: string; type?: 'button' | 'submit' | 'reset'; disabled?: boolean; block?: boolean; onClick?: () => void }) {
  return <button type={type} className={`button button-${variant} button-${size} ${block ? 'button-block' : ''} ${className}`} disabled={disabled} onClick={onClick}>{children}</button>
}

export function Dialog({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const dialogRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')
    ;(firstFocusable ?? dialogRef.current)?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) { event.preventDefault(); dialogRef.current.focus(); return }
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = oldOverflow; previousFocus?.focus?.() }
  }, [open])
  if (!open) return null
  return <div className="dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeRef.current() }}>
    <section ref={dialogRef} tabIndex={-1} className={`dialog dialog-${size}`} role="dialog" aria-modal="true" aria-label={title ?? 'Dialog'}>
      <div className="dialog-head">{title && <h3>{title}</h3>}<button aria-label="Close dialog" className="icon-button" onClick={() => closeRef.current()}><X size={19} /></button></div>
      <div className="dialog-content">{children}</div>
    </section>
  </div>
}

export function QuantityControl({ quantity, onChange, min = 1 }: { quantity: number; onChange: (next: number) => void; min?: number }) {
  return <div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity <= min} onClick={() => onChange(Math.max(min, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => onChange(Math.min(99, quantity + 1))}><Plus size={14} /></button></div>
}

export function Field({ label, error, optional, children }: { label: string; error?: string; optional?: boolean; children: ReactNode }) {
  return <label className={`field ${error ? 'field-error' : ''}`}><span className="field-label">{label}{optional && <span className="optional"> · optional</span>}</span>{children}{error && <span className="error-text"><AlertCircle size={13} /> {error}</span>}</label>
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-icon">{icon ?? <span>◌</span>}</div><h3>{title}</h3><p>{description}</p>{action}</div>
}

export function SectionEyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-line" />{children}</div>
}

export function PageIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="page-intro">{eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}<h1>{title}</h1>{description && <p>{description}</p>}</div>
}

export function ToastHost() {
  const [toast, setToast] = useState<{ id: number; message: string; kind: 'success' | 'error' } | null>(null)
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as { message: string; kind?: 'success' | 'error' }
      setToast({ id: Date.now(), message: detail.message, kind: detail.kind ?? 'success' })
    }
    window.addEventListener('koru-toast', handler)
    return () => window.removeEventListener('koru-toast', handler)
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])
  if (!toast) return null
  return <div className={`toast toast-${toast.kind}`} role="status"><span className="toast-icon">{toast.kind === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}</span>{toast.message}<button aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></button></div>
}

export function notify(message: string, kind: 'success' | 'error' = 'success') {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('koru-toast', { detail: { message, kind } }))
}

export function ConfirmAction({ title, body, confirmText = 'Confirm', onConfirm, children }: { title: string; body: string; confirmText?: string; onConfirm: () => void; children: (open: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  return <>{children(() => setOpen(true))}<Dialog open={open} onClose={() => setOpen(false)} title={title} size="sm"><div><p className="dialog-copy">{body}</p><div className="dialog-actions"><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { onConfirm(); setOpen(false) }}>{confirmText}</Button></div></div></Dialog></>
}
