import { useMutation } from "@tanstack/react-query";
import { convinceMe } from "~/features/recommendation/server/convince";

export function useConvinceMe() {
  return useMutation<{ pitch: string }, Error, string>({
    mutationFn: (sessionId) => convinceMe({ data: { sessionId } }),
  });
}
