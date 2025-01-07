import { OkamiStorageClient } from "api/okami-storage";
import { AxiosError } from "axios";
import type OkamiStoragePublisherPlugin from "main";
import {
	type App,
	type ButtonComponent,
	Modal,
	Notice,
	Setting,
	TFile,
} from "obsidian";

export class SharedOnWebModal extends Modal {
	private file: TFile | null = null;

	private disableUploadButton(button: ButtonComponent) {
		button.setDisabled(true);
	}

	private okamiApi: OkamiStorageClient;

	constructor(
		app: App,
		private readonly plugin: OkamiStoragePublisherPlugin,
	) {
		super(app);
		this.setTitle("Share on web");
		this.setContent("Click the button below to share this file on the web.");

		this.okamiApi = new OkamiStorageClient(this.plugin.settings.apiKey ?? "");

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

		new Notice("Uploading file...");

		const data = await this.okamiApi.uploadFile({
			fileContent,
			title: this.file.basename,
			author: this.app.metadataCache.getFileCache(this.file)?.frontmatter
				?.author,
		});

		new Notice("Uploading upload file attachments.");

		await this.saveNoteAttachments(data.noteId);

		return data.publicUrl;
	}

	async saveNoteAttachments(noteId: string) {
		if (this.plugin.settings.attachmentFolderPath === null) {
			console.error("Attachment folder path not set");
			return;
		}

		const activeFile = this.app.workspace.getActiveFile();

		if (!activeFile) {
			console.error("No active file found");
			return;
		}

		const content = await this.app.vault.read(activeFile);

		const attachmentRegex = /!\[\[([^\]]+)\]\]|!\[.*?\]\((.*?)\)/g;
		let match: RegExpExecArray | null;

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		while ((match = attachmentRegex.exec(content)) !== null) {
			const attachmentName = match[1] || match[2];

			new Notice(`Uploading attachment ${attachmentName}`);

			const file = this.plugin.getAttachmentPath(attachmentName);

			if (file && file instanceof TFile) {
				const data = await this.app.vault.adapter.readBinary(file.path);

				await this.okamiApi.uploadImageAttachment({
					noteId,
					file: data,
					originalFileName: attachmentName,
				});
				new Notice(`Attachment ${attachmentName} uploaded`);
			}
		}
	}
}
