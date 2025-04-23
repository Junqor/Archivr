// icon-box.tsx

import { Link } from "react-router-dom";
import {
  TrendingUpRounded,
  FavoriteRounded,
  StarRounded,
  VisibilityRounded,
  AutoAwesomeRounded,
  QuestionAnswerRounded,
} from "@mui/icons-material";

// IconBox Props
interface IconBoxProps {
  iconName: string;
  title?: string;
  description?: string;
  link?: string;
}

// IconBox component
export default function IconBox({
  iconName, // Icon name
  title, // Title
  description, // Description
  link, // Link
}: IconBoxProps): JSX.Element {
  return link ? (
    <Link
      to={link}
      className="flex h-auto w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-muted px-5 py-3 transition-colors hover:bg-purple hover:text-white sm:flex-row sm:gap-6"
    >
      <div className="flex items-center justify-center text-5xl">
        {getIcon(iconName)}
      </div>
      <div className="flex h-full flex-col items-start justify-start gap-3">
        {title ? <h4>{title}</h4> : null}
        {description ? <p>{description}</p> : null}
      </div>
    </Link>
  ) : (
    <div className="flex h-auto w-full cursor-default flex-col items-center justify-center gap-4 rounded-lg bg-muted px-5 py-3 transition-colors hover:bg-purple hover:text-white sm:flex-row sm:gap-6">
      <div className="flex items-center justify-center text-5xl">
        {getIcon(iconName)}
      </div>
      <div className="flex h-full flex-col items-start justify-start gap-3">
        {title ? <h4>{title}</h4> : null}
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

// Get icon function (We will add more icons later)
function getIcon(iconName: string) {
  switch (iconName) {
    case "TrendingUp":
      return <TrendingUpRounded fontSize="inherit" />;
    case "Favorite":
      return <FavoriteRounded fontSize="inherit" />;
    case "Star":
      return <StarRounded fontSize="inherit" />;
    case "Browse":
      return <VisibilityRounded fontSize="inherit" />;
    case "Sparkles":
      return <AutoAwesomeRounded fontSize="inherit" />;
    case "Reviews":
      return <QuestionAnswerRounded fontSize="inherit" />;
    default:
      return null;
  }
}
