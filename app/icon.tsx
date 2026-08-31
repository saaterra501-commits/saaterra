import { ImageResponse } from 'next/og';

// Image metadata for Google Search Favicon requirements (48x48 multiple)
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 26,
          background: 'linear-gradient(135deg, #0A0F1E 0%, #171E36 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          border: '2px solid #FFD519',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #FFD519 100%)',
            width: 30,
            height: 30,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0F1E',
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          %
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
