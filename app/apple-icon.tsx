import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: 'linear-gradient(135deg, #0A0F1E 0%, #171E36 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
          border: '4px solid #FFD519',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #FFD519 100%)',
            width: 110,
            height: 110,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0F1E',
            fontWeight: 900,
            fontSize: 70,
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
