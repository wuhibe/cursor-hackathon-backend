"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  fallbackSrc = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop"
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 200}
      height={height || 300}
      className={className}
      onError={handleError}
    />
  );
};

export default ImageWithFallback; 