export function getPagePostsPerMonth(stage: number) {
  switch (stage) {
    case 1:
      return 31;
    case 2:
      return 62;
    case 3:
      return 186;
    default:
      return 0;
  }
}
