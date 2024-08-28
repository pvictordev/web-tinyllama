import { setupAi } from "./ai.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
	hello world
  </div>
`;

setupAi();
