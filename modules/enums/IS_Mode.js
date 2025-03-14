/**
 * Arrays of keyboard node root indices of tuning modes
 * @type {{phrygian: number[], major: number[], minor: number[], mixolydian: number[], dorian: number[],
 * lydian: number[]}}
 */
export const IS_Mode =
{
	Major: [0, 2, 4, 5, 7, 9, 11],
	Minor: [0, 2, 3, 5, 7, 8, 10],
	Dorian: [0, 2, 3, 5, 7, 9, 10],
	Phrygian: [0, 1, 3, 5, 7, 8, 10],
	Kydian: [0, 2, 4, 6, 7, 9, 11],
	Mixolydian: [0, 2, 4, 5, 7, 9, 10]
}
