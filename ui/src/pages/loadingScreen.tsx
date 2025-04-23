import { ArchivrIcon } from "@/components/archivrIcon";

export const LoadingScreen = () => {
  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center gap-10">
      <ArchivrIcon className="animate-spin" sx={{ fontSize: "12rem" }} />
      <h1 className="">Loading...</h1>
    </main>
  );
};
