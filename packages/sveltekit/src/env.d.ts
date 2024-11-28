interface ImportMetaEnv {
	readonly VITE_PROJECT_ID: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
