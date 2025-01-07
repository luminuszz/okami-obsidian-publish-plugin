import { OkamiStorageClient } from "api/okami-storage";
import { AxiosError } from "axios";
import type OkamiStoragePublisherPlugin from "main";
import {
	type App,
	type ButtonComponent,
	Modal,
	Notice,
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
		this.setContent("Click the button below to share this file on the web.");

		new Setting(this.contentEl).addButton((button) => {
			button.setButtonText("Share on web").onClick(async () => {
				try {
					this.disableUploadButton(button);
					const results = await this.uploadFile();

					new Setting(this.contentEl).addText((text) => {
						text.setValue(results);
					});

					new Notice(`File uploaded: ${results}`);
				} catch (e) {
					if (e instanceof AxiosError) {
						new Notice(
							`Failed to upload file ${e.response?.data}  ${e.response?.status}`,
						);
					}
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

		const okamiStorageClient = new OkamiStorageClient(
			this.plugin.settings.apiKey ?? "",
		);

		const data = await okamiStorageClient.uploadFile({
			fileContent,
			title: this.file.basename,
			author: this.app.metadataCache.getFileCache(this.file)?.frontmatter
				?.author,
		});

		return data.publicUrl;
	}
}
