import construction from "@/assets/construction.gif";

export const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2 py-10">
      <h1 className="font-bol">
        This page is under construction. Check back soon!
      </h1>
      <img src={construction} alt="Under Construction" />
    </div>
  );
};
