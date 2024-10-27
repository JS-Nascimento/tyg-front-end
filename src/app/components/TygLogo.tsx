// app/components/TygLogo.tsx
'use client';
import Image from 'next/image';

const TygLogo = () => {
  return (
        <Image
          src="/tyg-logo.png"
          alt="TYG Investments Logo"
          width={500}
          height={500}
          className="object-contain"
          priority
        />
  );
};

export default TygLogo;