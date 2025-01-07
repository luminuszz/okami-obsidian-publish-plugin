import type OkamiStoragePublisherPlugin from "main";
import { type App, PluginSettingTab, Setting } from "obsidian";

export class SettingTab extends PluginSettingTab {
	private plugin: OkamiStoragePublisherPlugin;

	constructor(app: App, plugin: OkamiStoragePublisherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("API Key")
			.setDesc("Your Okami Storage API key")
			.addText((text) => {
				text
					.setPlaceholder("API Key")
					.setValue(this.plugin.settings.apiKey ?? "")
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Attachment folder path")
			.setDesc(
				"The folder path where attachments will be stored (you need to set fixed Attachment path)",
			)
			.addText((text) => {
				text
					.setPlaceholder("Attachment folder path")
					.setValue(this.plugin.settings.attachmentFolderPath ?? "")
					.onChange(async (value) => {
						this.plugin.settings.attachmentFolderPath = value;
						this.plugin.saveSettings();
					});
			});
	}
}
