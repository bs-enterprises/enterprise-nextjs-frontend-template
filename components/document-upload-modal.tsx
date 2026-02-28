'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, ImageIcon, X, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-populated file list (e.g. already-uploaded docs in edit mode) */
  documents?: File[];
  onSave: (documents: File[]) => void;
  maxFiles?: number;
  /** Max file size in MB */
  maxFileSize?: number;
  acceptedFormats?: string[];
}

function fileIcon(file: File) {
  if (file.type.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
  if (file.type === 'application/pdf') return <FileText className="h-8 w-8" />;
  return <File className="h-8 w-8" />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * DocumentUploadModal — drag-and-drop file uploader with preview list.
 *
 * @example
 * <DocumentUploadModal
 *   open={uploadOpen}
 *   onOpenChange={setUploadOpen}
 *   onSave={(files) => handleFilesChange(files)}
 *   maxFiles={5}
 *   maxFileSize={20}
 * />
 */
export function DocumentUploadModal({
  open,
  onOpenChange,
  documents: initial = [],
  onSave,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedFormats = ['image/*', 'application/pdf'],
}: DocumentUploadModalProps) {
  const [docs, setDocs] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDocs([...initial]);
      setError(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024)
      return `"${file.name}" exceeds the ${maxFileSize} MB limit.`;
    const ok = acceptedFormats.some((fmt) => {
      if (fmt.endsWith('/*')) return file.type.startsWith(fmt.split('/')[0]);
      if (fmt.startsWith('.')) return file.name.toLowerCase().endsWith(fmt);
      return file.type === fmt;
    });
    if (!ok) return `"${file.name}" has an unsupported format.`;
    return null;
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    if (docs.length + incoming.length > maxFiles) {
      setError(`You can upload at most ${maxFiles} files.`);
      return;
    }
    for (const f of incoming) {
      const err = validate(f);
      if (err) { setError(err); return; }
    }
    setDocs((prev) => [...prev, ...incoming]);
    setError(null);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Attach receipts, invoices or supporting files — max {maxFiles} files,{' '}
            {maxFileSize} MB each.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer',
              'transition-colors hover:border-primary/50',
              dragActive ? 'border-primary bg-primary/5' : 'border-border/50'
            )}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
            onClick={() => document.getElementById('doc-upload-input')?.click()}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, images, Word & Excel supported
            </p>
            <Input
              id="doc-upload-input"
              type="file"
              multiple
              accept={acceptedFormats.join(',')}
              className="hidden"
              onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* File list */}
          {docs.length > 0 && (
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                Files ({docs.length}/{maxFiles})
              </Label>
              <ScrollArea className="h-52 rounded-lg border border-border/50 p-3">
                <div className="space-y-2">
                  {docs.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-lg group hover:bg-muted transition-colors"
                    >
                      <div className="text-muted-foreground shrink-0">{fileIcon(file)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocs(docs.filter((_, j) => j !== i));
                          setError(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => { onSave(docs); onOpenChange(false); }}>
            Save {docs.length > 0 ? `(${docs.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
