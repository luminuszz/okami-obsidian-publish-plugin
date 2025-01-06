import type OkamiStoragePublisherPlugin from "main";
import { type App, PluginSettingTab, Setting } from "obsidian";

export class SettingTab extends PluginSettingTab {
	private plugin: OkamiStoragePublisherPlugin;

	constructor(app: App, plugin: OkamiStoragePublisherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("API Key")
			.setDesc("Your Okami Storage API key")
			.addText(async (text) => {
				const { apiKey = "" } = await this.plugin.loadSettings();
				text
					.setPlaceholder("API Key")
					.setValue(apiKey)
					.onChange(async (value) => {
						this.plugin.saveSettings(value);
					});
			});
	}
}
