import { ImageResponse } from 'next/og';

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
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'transparent',
        }}
      >
        {/* Purple rounded background */}
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            left: 2,
            width: 32,
            height: 32,
            borderRadius: 10,
            background: '#6C38CC',
          }}
        />
        {/* Pink middle shadow */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            right: 2,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#E93D82',
          }}
        />
        {/* Orange top circle with white % */}
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 4,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#FF6B35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 900,
            fontSize: 20,
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
