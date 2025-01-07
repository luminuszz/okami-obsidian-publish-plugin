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
	baseURL: "http://localhost:3000",
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
