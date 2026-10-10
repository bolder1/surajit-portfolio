// The manifest of the only real files KEY LIGHT places: the portrait (and its rim copy), the silhouette path,
// the one font and the eight grain tiles. No screen, export, capture or canvas is listed here, and none may be
// added: every screen in the film is drawn by the kit in src/v6/illus/. Source: v6/V1-DIRECTION.md section 9.3.
import { staticFile } from "remotion";

/** Files under public/, by role. Sizes are the files' own pixels. */
export const ASSETS = {
  /** His photograph, untreated, head and shoulders, with its own red rim as the camera had it. */
  portrait: { file: "img/d/portrait-clean.png", w: 1500, h: 1800 },
  /** The rim copy, stacked at 40 percent only if the rim needs lifting under the grade; otherwise unused. */
  portraitRim: { file: "img/d/portrait-rim.png", w: 1500, h: 1800 },
  /** Archivo, variable (wdth 62 to 125, wght 100 to 900), loaded once by src/v6/type.ts. */
  font: { file: "fonts/Archivo-var.woff2", family: "Archivo Var" },
  /** The eight grain tiles FX.Grain cycles through at opacity 0.04 (FinishKey). */
  grain: Array.from({ length: 8 }, (_, i) => ({ file: `img/grain-${i}.png`, w: 512, h: 512 })),
} as const;

/**
 * The silhouette path lives in the source tree, not under public/: src/assets/silhouette-path.txt is compiled
 * into src/v6/silhouette.ts (SILHOUETTE_PATH, SILHOUETTE_BOX 1200 x 1440 mapping onto the portrait at 0.8).
 * It is a shadow path only, never a mask on the photograph.
 */
export const SILHOUETTE_SOURCE = "src/assets/silhouette-path.txt";

/** The portrait's placement in chapters 1 and 2: 1500 x 1800 scaled to 1020 px tall, right of centre, the bottom
 * edge below the frame (the specimen in SpecimenStage.tsx uses the same box). */
export const PORTRAIT_C1 = { x: 1010, y: 120, w: 850, h: 1020 } as const;

/** A public URL for one of the manifest's files. */
export const assetUrl = (file: string) => staticFile(file);
export const portraitUrl = () => staticFile(ASSETS.portrait.file);
export const portraitRimUrl = () => staticFile(ASSETS.portraitRim.file);
export const grainUrl = (i: number) => staticFile(ASSETS.grain[((i % 8) + 8) % 8].file);
