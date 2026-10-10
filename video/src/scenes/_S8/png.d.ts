// PNG imports for S8's pre-graded portrait layers (portrait.png, rim.png; regenerate with bake.py).
// Same ambient declaration as _S2/png.d.ts, kept here so S8 does not depend on another scene's folder.
declare module "*.png" {
  const src: string;
  export default src;
}
