import axios from "axios";

export interface UploadFileRequest {
	title: string;
	fileContent: string;
	author?: string;
}

export interface UploadFileResponse {
	publicUrl: string;
}

const client = axios.create({
	baseURL:
		"https://okami-obsidian-shared-6by72d3sr-davi-ribeiros-projects.vercel.app/",
});

export class OkamiStorageClient {
	constructor(private apiKey: string) {}

	async uploadFile(payload: UploadFileRequest) {
		const response = await client.post<UploadFileResponse>("api", payload, {
			headers: {
				"API-Key": this.apiKey,
			},
		});

		return response.data;
	}
}
