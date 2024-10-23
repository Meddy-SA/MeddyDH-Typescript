import { ref } from "vue";

interface CompressorOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export function useImageCompressor() {
  const isCompressing = ref(false);

  const compressImage = async (
    file: File,
    options: CompressorOptions = {}
  ): Promise<File> => {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.7,
      mimeType = "image/jpeg",
    } = options;

    isCompressing.value = true;

    try {
      const compressedBlob = await new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const elem = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            elem.width = width;
            elem.height = height;

            const ctx = elem.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);

            ctx?.canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error("Canvas to Blob conversion failed"));
                }
              },
              mimeType,
              quality
            );
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
      });

      return new File([compressedBlob], file.name, { type: mimeType });
    } finally {
      isCompressing.value = false;
    }
  };

  return {
    compressImage,
    isCompressing,
  };
}
