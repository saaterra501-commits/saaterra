'use client';

export default function StackDealLogo({ className = "w-[150px] h-[45px]" }) {
  return (
    <div className="flex items-center">
      <img
        src="/stackdeal-logo.png"
        alt="StackDeal"
        width={150}
        height={45}
        className={`object-contain ${className}`}
        style={{ width: '150px', height: '45px', aspectRatio: '150 / 45' }}
      />
    </div>
  );
}
