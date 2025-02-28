import { useState } from "react";

export const CollapsedText = ({text, max_length}:{text:string, max_length:number}) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const isTooLong = () => {
      return text.length > max_length;
    };
  
    const truncatedComment = () => {
      return text.substring(0, max_length) + "...";
    };

    return (
        <>
        <p className="min-h-8 text-gray-300 whitespace-pre-wrap break-words">
            {expanded || !isTooLong() ? text : truncatedComment()}
        </p>
        {isTooLong() && (
            <button
                onClick={() => {
                    setExpanded(!expanded);
                }}
                className="flex justify-start hover:underline"
            >
                {expanded ? "Show less" : "Show more"}
            </button>
            )}
        </>
    )
}