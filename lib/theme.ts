export type Lighting = "daylight" | "evening";

export const LIGHTING_STORAGE_KEY = "museum:lighting";
export const TICKET_SESSION_KEY = "museum:ticket-shown";

/**
 * Runs before first paint, inlined into <head>. Keep it small and
 * defensive: a visitor with storage blocked still gets the right room.
 */
export const lightingBootScript = `(function(){try{
var k="${LIGHTING_STORAGE_KEY}",s=null;
try{s=localStorage.getItem(k)}catch(e){}
if(s!=="daylight"&&s!=="evening"){
  s=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"evening":"daylight";
}
document.documentElement.setAttribute("data-theme",s);
}catch(e){document.documentElement.setAttribute("data-theme","daylight")}})();`;

export function readLighting(): Lighting {
  if (typeof document === "undefined") return "daylight";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "evening" ? "evening" : "daylight";
}

export function applyLighting(next: Lighting) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(LIGHTING_STORAGE_KEY, next);
  } catch {
    /* storage blocked — the room still changes, it just won't be remembered */
  }
}
