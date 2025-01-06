export interface UploadFileRequest {
	title: string;
	fileContent: string;
	author?: string;
}

export interface UploadFileResponse {
	publicUrl: string;
}

export class OkamiStorageClient {
	constructor(private apiKey: string) {}

	async uploadFile(payload: UploadFileRequest) {
		const response = await fetch("<api upload>", {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				Authorization: `API_KEY ${this.apiKey}`,
			},
		});

		const results = await response.json();

		return results as UploadFileResponse;
	}
}
