'use client';

export default function StackDealLogo({ className = "w-[175px] h-[50px]" }) {
  return (
    <div className="flex items-center shrink-0">
      <img
        src="/stackdeal-logo.png"
        alt="StackDeal"
        width={185}
        height={52}
        className={`object-contain ${className}`}
      />
    </div>
  );
}
