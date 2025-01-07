import type OkamiStoragePublisherPlugin from "main";
import { type App, Notice, PluginSettingTab, Setting } from "obsidian";

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
						new Notice(`API Key updated ${value}`);
						this.plugin.settings.apiKey = value;
						this.plugin.saveSettings();
					});
			});
	}
}
