import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Music } from 'lucide-react';
import { uploadsApi } from '@/api/uploads';
import { toast } from 'sonner';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  label?: string;
}

type MediaType = 'image' | 'audio' | 'pdf' | 'file';

function getMediaType(accept: string): MediaType {
  if (accept.includes('image')) return 'image';
  if (accept.includes('audio')) return 'audio';
  if (accept.includes('pdf')) return 'pdf';
  return 'file';
}

function getFilename(url: string): string {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() ?? url);
  } catch {
    return url.split('/').pop() ?? url;
  }
}

function MediaPreview({ url, mediaType, onRemove }: { url: string; mediaType: MediaType; onRemove: () => void }) {
  const removeBtn = (
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
      title="Remove"
    >
      <X size={13} />
    </button>
  );

  if (mediaType === 'image') {
    return (
      <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
        <img
          src={url}
          alt="Preview"
          className="w-full h-40 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {removeBtn}
      </div>
    );
  }

  if (mediaType === 'audio') {
    return (
      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-violet-500/15 p-2">
            <Music size={15} className="text-violet-400" />
          </div>
          <p className="text-sm text-slate-300 truncate flex-1">{getFilename(url)}</p>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
        <audio
          controls
          src={url}
          className="w-full h-9"
          style={{ colorScheme: 'dark' }}
        />
      </div>
    );
  }

  if (mediaType === 'pdf') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
        <div className="rounded-lg bg-red-500/15 p-2 shrink-0">
          <FileText size={15} className="text-red-400" />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-300 hover:text-white truncate flex-1 transition-colors"
        >
          {getFilename(url)}
        </a>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
          title="Remove"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  // generic file
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
      <div className="rounded-lg bg-blue-500/15 p-2 shrink-0">
        <FileText size={15} className="text-blue-400" />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-300 hover:text-white truncate flex-1 transition-colors"
      >
        {getFilename(url)}
      </a>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
        title="Remove"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function FileUpload({ value, onChange, accept = 'image/*', folder, label = 'Upload file' }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const mediaType = getMediaType(accept);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadsApi.upload(file, folder);
      onChange(result.url);
      toast.success('File uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />

      {value && (
        <MediaPreview url={value} mediaType={mediaType} onRemove={() => onChange('')} />
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={14} />
        {isUploading ? 'Uploading…' : value ? `Replace ${mediaType}` : label}
      </Button>
    </div>
  );
}
