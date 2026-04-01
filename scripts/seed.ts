import { db } from '../src/config/db';
import { appUser, genre, level, source, sheet } from '../src/models/database/schema';
import bcrypt from 'bcrypt';

async function seed() {
	console.log('Seeding...');

	// Clear tables (in reverse FK order)
	await db.delete(sheet);
	await db.delete(source);
	await db.delete(level);
	await db.delete(genre);
	await db.delete(appUser);

	// Insert demo data
	const hashedAdminPassword = await bcrypt.hash('Admin1234', 10);
	const hashedUserPassword = await bcrypt.hash('Demo1234', 10);

	const [, user] = await db
		.insert(appUser)
		.values([
			{ email: 'admin@demo.app', name: 'Admin', password: hashedAdminPassword },
			{ email: 'user@demo.app', name: 'User', password: hashedUserPassword },
		])
		.returning();

	const [classical, jazz, contemporary] = await db
		.insert(genre)
		.values([
			{ name: 'Classical', userId: user.id },
			{ name: 'Jazz', userId: user.id },
			{ name: 'Contemporary', userId: user.id },
		])
		.returning();

	const [beginner, intermediate, advanced] = await db
		.insert(level)
		.values([
			{ name: 'Beginner', userId: user.id },
			{ name: 'Intermediate', userId: user.id },
			{ name: 'Advanced', userId: user.id },
		])
		.returning();

	const [source1, source2, source3] = await db
		.insert(source)
		.values([
			{
				title: 'Accelerated Piano Adventures Book 1',
				author: 'Nancy and Randall Faber',
				format: 'Print',
				userId: user.id,
			},
			{
				title: 'Jazz, Rags & Blues Book 1',
				author: 'Martha Mier',
				format: 'Print',
				userId: user.id,
			},
			{
				title: 'Piano Literature Book 1',
				author: 'Nancy and Randall Faber',
				format: 'Digital',
				userId: user.id,
			},
		])
		.returning();

	await db.insert(sheet).values([
		{
			title: 'Adagio and Allegro',
			sourceId: source3.id,
			levelId: intermediate.id,
			genreId: classical.id,
			userId: user.id,
			examPiece: true,
		},
		{
			title: 'Bagatelle',
			sourceId: source3.id,
			levelId: intermediate.id,
			genreId: classical.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: 'Canario',
			sourceId: source3.id,
			levelId: intermediate.id,
			genreId: classical.id,
			userId: user.id,
			examPiece: true,
		},
		{
			title: "Don't Wanna' Leave You Blues",
			sourceId: source2.id,
			levelId: intermediate.id,
			genreId: jazz.id,
			userId: user.id,
			examPiece: true,
		},
		{
			title: 'Downright Happy Rag',
			sourceId: source2.id,
			levelId: intermediate.id,
			genreId: jazz.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: 'Fiddler on the Roof',
			sourceId: source1.id,
			levelId: intermediate.id,
			genreId: contemporary.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: 'Gavotte in C',
			sourceId: source3.id,
			levelId: intermediate.id,
			genreId: classical.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: 'Hallelujah!',
			sourceId: source2.id,
			levelId: intermediate.id,
			genreId: jazz.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: "Hedwig's Theme (from Harry Potter and the Sorcerer's Stone)",
			sourceId: source1.id,
			levelId: intermediate.id,
			genreId: contemporary.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: 'In Dreams (from The Lord of the Rings)',
			sourceId: source1.id,
			levelId: intermediate.id,
			genreId: contemporary.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: "Just Struttin' Along",
			sourceId: source2.id,
			levelId: beginner.id,
			genreId: jazz.id,
			userId: user.id,
			examPiece: false,
		},
		{
			title: 'Minuet',
			sourceId: source3.id,
			levelId: advanced.id,
			genreId: classical.id,
			userId: user.id,
			examPiece: false,
		},
	]);

	console.log('Seeding done!');
	process.exit(0);
}

seed().catch((error) => {
	console.error('Seed failed:', error);
	process.exit(1);
});
