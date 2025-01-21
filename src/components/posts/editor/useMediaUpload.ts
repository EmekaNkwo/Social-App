import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

// Image validation configuration
const MEDIA_VALIDATION_CONFIG = {
  minWidth: 500, // Minimum width
  minHeight: 500, // Minimum height
  maxWidth: 3840, // 4K width
  maxHeight: 2160, // 4K height
  maxFileSize: 50 * 1024 * 1024, // 50MB for images
  allowedAspectRatios: [
    { min: 0.5, max: 2 }, // Allow aspect ratios between 1:2 and 2:1
  ],
  allowedMediaTypes: ["image/", "video/"],
};
export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  async function validateMedia(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      // Check file type
      const isAllowedType = MEDIA_VALIDATION_CONFIG.allowedMediaTypes.some(
        (type) => file.type.startsWith(type),
      );

      if (!isAllowedType) {
        toast({
          variant: "destructive",
          description: "Unsupported file type",
        });
        resolve(false);
        return;
      }

      // Check file size
      if (file.size > MEDIA_VALIDATION_CONFIG.maxFileSize) {
        toast({
          variant: "destructive",
          description: `File exceeds max size of ${MEDIA_VALIDATION_CONFIG.maxFileSize / 1024 / 1024}MB`,
        });
        resolve(false);
        return;
      }

      // For images, use Image validation
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;

          // Check min dimensions
          if (
            width < MEDIA_VALIDATION_CONFIG.minWidth ||
            height < MEDIA_VALIDATION_CONFIG.minHeight
          ) {
            toast({
              variant: "destructive",
              description: `Image must be at least ${MEDIA_VALIDATION_CONFIG.minWidth}x${MEDIA_VALIDATION_CONFIG.minHeight} pixels`,
            });
            resolve(false);
            return;
          }

          // Check max dimensions
          if (
            width > MEDIA_VALIDATION_CONFIG.maxWidth ||
            height > MEDIA_VALIDATION_CONFIG.maxHeight
          ) {
            toast({
              variant: "destructive",
              description: `Image dimensions exceed ${MEDIA_VALIDATION_CONFIG.maxWidth}x${MEDIA_VALIDATION_CONFIG.maxHeight}`,
            });
            resolve(false);
            return;
          }

          // Check aspect ratio
          const aspectRatio = width / height;
          const isValidAspectRatio =
            MEDIA_VALIDATION_CONFIG.allowedAspectRatios.some(
              (ratio) => aspectRatio >= ratio.min && aspectRatio <= ratio.max,
            );

          if (!isValidAspectRatio) {
            toast({
              variant: "destructive",
              description: "Image aspect ratio is not supported",
            });
            resolve(false);
            return;
          }

          resolve(true);
        };
        img.onerror = () => {
          toast({
            variant: "destructive",
            description: "Unable to process the image",
          });
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      }
    });
  }
  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  async function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }

    const validatedFiles = [];
    for (const file of files) {
      const isValid = await validateMedia(file);
      if (!isValid) return;
      validatedFiles.push(file);
    }

    startUpload(validatedFiles);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
