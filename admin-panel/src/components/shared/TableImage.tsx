import { ImageIcon } from 'lucide-react';

interface Props {
  src?: string | null;
  alt?: string;
  aspectRatio?: 'square' | 'landscape';
}

const SIZES = {
  square:    { width: 40,  height: 40  },
  landscape: { width: 64,  height: 40  },
};

export function TableImage({ src, alt = '', aspectRatio = 'square' }: Props) {
  const { width, height } = SIZES[aspectRatio];

  return (
    <div
      style={{ width, height, minWidth: width }}
      className="rounded overflow-hidden bg-white/[0.06] flex items-center justify-center flex-shrink-0"
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <ImageIcon size={14} className="text-muted-foreground/50" />
      )}
    </div>
  );
}
