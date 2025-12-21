import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (file: File) => void;
  onClear: () => void;
}

export const ImageUpload = ({
  selectedImage,
  onImageSelect,
  onClear,
}: ImageUploadProps) => {
  return (
    <div className="relative">
      <label
        htmlFor="image-upload"
        className="
          group flex flex-col items-center justify-center
          h-64 w-full cursor-pointer
          rounded-3xl border-2 border-dashed
          border-green-400/50
          bg-white/60 backdrop-blur-md
          transition-all duration-300
          hover:border-green-600
          hover:bg-white/80
          hover:shadow-xl
        "
      >
        {!selectedImage ? (
          <>
            <Upload className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-lg font-medium text-green-700">
              Upload Waste Image
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG — click to browse
            </p>
          </>
        ) : (
          <div className="relative w-full h-full p-4">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain rounded-2xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="
                absolute top-4 right-4
                bg-black/60 text-white
                rounded-full p-2
                hover:bg-black/80
              "
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onImageSelect(e.target.files[0]);
            }
          }}
        />
      </label>
    </div>
  );
};
