import { ArchivrIcon } from "@/components/archivrIcon";

export const LoadingScreen = () => {
  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center gap-10 bg-black">
      <ArchivrIcon className="animate-spin" sx={{ fontSize: "12rem" }} />
      <h1 className="text-white">Loading...</h1>
    </main>
  );
};
