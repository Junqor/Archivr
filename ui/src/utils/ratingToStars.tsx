import {
  StarRounded,
  StarHalfRounded,
  StarBorderRounded,
} from "@mui/icons-material";

export function ratingToStars(rating: number) {
  // ratings are out of 10 but we want to display them out of 5, odd numbers are half stars
  const stars = [];
  const fullStars = Math.floor(rating / 2);
  const halfStars = rating % 2;
  const emptyStars = 5 - fullStars - halfStars;
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarRounded key={i} fontSize="inherit" className="text-purple" />,
    );
  }
  if (halfStars) {
    stars.push(
      <StarHalfRounded
        key={fullStars}
        fontSize="inherit"
        className="text-purple"
      />,
    );
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarBorderRounded
        key={fullStars + halfStars + i}
        fontSize="inherit"
        className="text-purple"
      />,
    );
  }
  return stars;
}

export function ratingToTextStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating / 2);
  const halfStars = rating % 2;
  for (let i = 0; i < fullStars; i++) {
    stars.push("★");
  }
  if (halfStars) {
    stars.push("½");
  }
  return stars.join("");
}