import {
	MLCEngineInterface,
	InitProgressReport,
	CreateMLCEngine,
	ChatCompletionMessageParam,
} from "@mlc-ai/web-llm";

export async function setupAi() {
	const app = document.querySelector<HTMLDivElement>("#app");
	const progressBar = document.querySelector<HTMLProgressElement>("progress");

	const selectModel = "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC-1k";

	const chatHistory: ChatCompletionMessageParam[] = [
		{
			role: "user",
			content: "hello",
		},
	];

	const initProgressCallback = (report: InitProgressReport) => {
		console.log(report.text, report.progress);

		if (progressBar) {
			progressBar.value = report.progress;
		}

		if (report.progress === 1.0) {
			enableChat();
		}
	};

	const engine: MLCEngineInterface = await CreateMLCEngine(selectModel, {
		initProgressCallback: initProgressCallback,
	});

	function enableChat() {
		if (app) {
			app.innerHTML =
				'<div class="container"> <div class="prompt-box"> <button id="startButton">➤</button><input id="input" type="text"> </div> <div><pre id="response"></pre></div></div>';

			const startButton =
				document.querySelector<HTMLButtonElement>("#startButton");
			startButton?.addEventListener("click", submitRequest);
		}
	}

	function updateAnswer(answer: string) {
		const responseDiv = document.querySelector<HTMLPreElement>("#response");
		if (responseDiv) {
			responseDiv.innerHTML = answer;
		}
	}

	function submitRequest() {
		const input = document.querySelector<HTMLInputElement>("#input");
		if (input) {
			startEngine(input.value);
		}
	}

	async function startEngine(message: string) {
		let curMessage = "";
		chatHistory.push({ role: "user", content: message });

		const completion = await engine.chat.completions.create({
			stream: true,
			messages: chatHistory,
		});

		for await (const chunk of completion) {
			const curDelta = chunk.choices[0].delta.content;
			if (curDelta) {
				curMessage += curDelta;
			}
			updateAnswer(curMessage);
		}

		const response = await engine.getMessage();
		chatHistory.push({
			role: "assistant",
			content: response,
		});
	}
}
