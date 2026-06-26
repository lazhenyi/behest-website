import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'behest - Rust-native AI Agent Runtime'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            right: 60,
            bottom: 60,
            border: '6px solid #7C3AED',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '12px 12px 0 0 #06B6D4',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: '#F43F5E',
              textTransform: 'uppercase',
              letterSpacing: 4,
              marginBottom: 24,
            }}
          >
            {'> Rust-Native AI Agent Runtime'}
          </div>
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              textTransform: 'uppercase',
              display: 'flex',
              letterSpacing: -4,
            }}
          >
            <span style={{ color: '#7C3AED' }}>be</span>
            <span style={{ color: '#06B6D4' }}>hest</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#888',
              marginTop: 24,
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            Type-safe, modular, provider-neutral building blocks for production AI agent runtimes
          </div>
        </div>
      </div>
    ),
    size
  )
}
