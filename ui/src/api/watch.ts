import { getAuthHeader } from "@/utils/authHeader";

type TProviders = [
  string,
  {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
  }[],
][];

type TRegionData = {
  [linkOrType: string]:
    | string
    | {
        logo_path: string;
        provider_id: number;
        provider_name: string;
        display_priority: number;
      }[];
};

type TWatchProviders = { [region: string]: TRegionData };

export const getWatchProviders = async (id: number) => {
  const url = import.meta.env.VITE_API_URL + "/watch/" + id;
  const response = await fetch(url, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch watch providers");
  }

  const data = await response.json();

  const providersByRegion = data.result as TWatchProviders;

  const formattedProviders = Object.entries(providersByRegion).map(
    ([region, regionData]) => {
      return {
        region: region,
        link: regionData.link as string,
        providers: Object.entries(regionData).filter(
          ([k, _]) => k !== "link",
        ) as TProviders,
      };
    },
  );

  return formattedProviders;
};
