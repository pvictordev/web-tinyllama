import { setupAi } from "./ai.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
	<progress value=.5> Downloading model </progress>
  </div>
`;

setupAi();
