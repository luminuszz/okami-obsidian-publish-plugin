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
	baseURL: "https://tmaoxhwccsdmupcduklj.supabase.co/functions/v1",
});

export class OkamiStorageClient {
	constructor(private apiKey: string) {}

	async uploadFile(payload: UploadFileRequest) {
		const response = await client.post<UploadFileResponse>(
			"/upload-note",
			payload,
			{
				headers: {
					"API-Key": this.apiKey,
				},
			},
		);

		return response.data;
	}
}
