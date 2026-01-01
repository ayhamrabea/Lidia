import { Raleway } from "next/font/google";
import { Poiret_One } from "next/font/google";


export const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "700"], // тонкий, обычный, жирный
  display: "swap",
});



export const poiret = Poiret_One({
  subsets: ["latin", "cyrillic"], // يدعم الروسية
  weight: "400", // هو خط بوزن واحد فقط
  display: "swap",
});
