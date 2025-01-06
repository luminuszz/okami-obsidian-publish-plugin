import { SettingTab } from "components/settings-tab";
import { SharedOnWebModal } from "components/shared-modal";
import { Plugin } from "obsidian";

export default class OkamiStoragePublisherPlugin extends Plugin {
	async onload() {
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

	saveSettings(apiKey: string) {
		this.saveData({ apiKey });
	}

	async loadSettings(): Promise<{ apiKey: string }> {
		return (await this.loadData()) as { apiKey: string };
	}
}
