import { PageStages } from "../model/IGPage";

export function shouldUpload(pageStage: PageStages): boolean {
  const now = new Date();
  const options = { timeZone: "Asia/Kolkata", hour12: false };
  const hourInIST = parseInt(
    now.toLocaleString("en-US", options).split(":")[0],
    10
  );

  switch (pageStage) {
    case PageStages.One:
      return hourInIST === 18;
    case PageStages.Two:
      return hourInIST === 18 || hourInIST === 23;
    case PageStages.Three:
      return true;
    default:
      return false;
  }
}
