import axios from "axios";

export interface UploadFileRequest {
	title: string;
	fileContent: string;
	author?: string;
}

export interface UploadFileResponse {
	publicUrl: string;
	noteId: string;
}

export interface UploadImageAttachmentRequest {
	noteId: string;
	file: ArrayBuffer;
	originalFileName: string;
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

	async uploadImageAttachment(payload: UploadImageAttachmentRequest) {
		const formData = new FormData();

		formData.append("file", new Blob([payload.file]));
		formData.append("noteId", payload.noteId);
		formData.append("originalFileName", payload.originalFileName);

		const response = await client.post("/upload-note-attachment", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				"API-Key": this.apiKey,
			},
		});

		return response.data;
	}
}
