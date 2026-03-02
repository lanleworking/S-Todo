import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './not-found.css'

function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${t('label.pageNotExist')} | S-Todo`
  }, [])

  // Parallax on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = textRef.current
      if (!el) return
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy
      el.style.transform = `translate(${dx * -12}px, ${dy * -12}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="nf-root">
      {/* Ambient orbs */}
      <div className="nf-orb nf-orb-1" />
      <div className="nf-orb nf-orb-2" />
      <div className="nf-orb nf-orb-3" />

      {/* Grid lines */}
      <div className="nf-grid" />

      <div className="nf-content" ref={textRef}>
        {/* Glitch 404 */}
        <div className="nf-code" aria-hidden="true">
          <span className="nf-code-glitch" data-text="404">
            404
          </span>
        </div>

        <div className="nf-badge">PAGE NOT FOUND</div>

        <h1 className="nf-title">
          Oops! You've drifted
          <br />
          into the void.
        </h1>

        <p className="nf-sub">
          The page you're looking for doesn't exist, was removed,
          <br />
          or you don't have permission to view it.
        </p>

        <div className="nf-actions">
          <button
            className="nf-btn nf-btn-primary"
            onClick={() => navigate({ to: '/' })}
          >
            <span className="nf-btn-icon">⌂</span>
            Go Home
          </button>
          <button
            className="nf-btn nf-btn-ghost"
            onClick={() => window.history.back()}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
