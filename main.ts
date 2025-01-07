import { SettingTab } from "components/settings-tab";
import { SharedOnWebModal } from "components/shared-modal";
import { Plugin } from "obsidian";

export interface OkamiStoragePublisherPluginSettings {
	apiKey: string | null;
}

export const DEFAULT_SETTINGS: OkamiStoragePublisherPluginSettings = {
	apiKey: null,
};

export default class OkamiStoragePublisherPlugin extends Plugin {
	public settings: OkamiStoragePublisherPluginSettings;

	async onload() {
		this.loadSettings();

		this.app.workspace.on("editor-menu", (menu, editor, view) => {
			menu.addItem((item) => {
				item
					.setTitle("Share on web")
					.setIcon("cloud-upload")
					.onClick(() => {
						return new SharedOnWebModal(this.app, this).open();
					});
			});
		});

		this.app.workspace.on("file-menu", (menu, file) => {
			menu.addItem((item) => {
				item
					.setTitle("Share on web")
					.setIcon("cloud-upload")
					.onClick(() => {
						return new SharedOnWebModal(this.app, this).open();
					});
			});
		});

		this.addSettingTab(new SettingTab(this.app, this));
	}

	async onunload() {
		console.log("unloading OkamiStoragePublisherPlugin");
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async loadSettings() {
		const data = await this.loadData();

		if (data) {
			this.settings = Object.assign({}, data);
		} else {
			this.settings = Object.assign({}, DEFAULT_SETTINGS);
		}
	}
}
