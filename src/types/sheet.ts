export interface sheetResponse {
	id: number;
	title: string;
	key: string | null;
	composer: string | null;
	sourceId: number | null;
	sourceTitle: string | null;
	levelId: number | null;
	levelName: string | null;
	genreId: number | null;
	genreName: string | null;
	examPiece: boolean;
}
