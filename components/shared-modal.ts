import { OkamiStorageClient } from "api/okami-storage";
import type OkamiStoragePublisherPlugin from "main";
import {
	type App,
	type ButtonComponent,
	Modal,
	Setting,
	type TFile,
} from "obsidian";

export class SharedOnWebModal extends Modal {
	private file: TFile | null = null;

	private disableUploadButton(button: ButtonComponent) {
		button.setDisabled(true);
	}

	constructor(
		app: App,
		private readonly plugin: OkamiStoragePublisherPlugin,
	) {
		super(app);
		this.setTitle("Share on web");

		new Setting(this.containerEl).addButton((button) => {
			button.setButtonText("Share on web").onClick(async () => {
				try {
					this.disableUploadButton(button);
					const results = await this.uploadFile();
					navigator.clipboard.writeText(results);
					this.setContent(`Copied to clipboard: ${results}`);
				} catch (e) {
					console.error(e);
				} finally {
					button.setDisabled(false);
				}
			});
		});
	}

	onOpen() {
		this.file = this.app.workspace.getActiveFile();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async uploadFile(): Promise<string> {
		if (!this.file) throw new Error("No file selected");

		const fileContent = await this.app.vault.read(this.file);

		const { apiKey } = await this.plugin.loadSettings();

		const okamiStorageClient = new OkamiStorageClient(apiKey);

		const data = await okamiStorageClient.uploadFile({
			fileContent,
			title: this.file.basename,
			author: this.app.metadataCache.getFileCache(this.file)?.frontmatter
				?.author,
		});

		return data.publicUrl;
	}
}
