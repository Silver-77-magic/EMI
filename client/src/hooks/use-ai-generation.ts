import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type GenerateImageInput = {
  prompt: string;
};

type GenerateImageResponse = {
  url: string;
  b64_json?: string;
};

export function useGenerateImage() {
  return useMutation({
    mutationFn: async (data: GenerateImageInput) => {
      const res = await apiRequest("POST", "/api/generate-image", data);
      return res.json() as Promise<GenerateImageResponse>;
    },
  });
}
