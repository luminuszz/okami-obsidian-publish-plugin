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

					this.contentEl.empty();

					new Setting(this.contentEl)
						.setName("Click the link to copy")
						.addText((text) => {
							text.setValue(results);
						});

					new Setting(this.contentEl).addButton((button) => {
						button.setButtonText("Copy link").onClick(() => {
							navigator.clipboard.writeText(results);
							new Notice("Link copied to clipboard");
						});
					});
				} catch (e) {
					if (e instanceof AxiosError) {
						new Notice(`Failed to upload file ${e.code}  ${e.status}`);
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
		this.contentEl.empty();
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
