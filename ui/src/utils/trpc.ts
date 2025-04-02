import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../backend/src/trpc/baseRouter";
import { QueryClient } from "@tanstack/react-query";
import { getAuthHeader } from "./authHeader";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL + "/trpc",
      headers() {
        return getAuthHeader();
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
