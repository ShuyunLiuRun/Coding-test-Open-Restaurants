export const mapWeekdayToInt = {
	"Mon": 0,
	"Tus": 1,
	"Wen": 2,
	"Thu": 3,
	"Fri": 4,
	"Sat": 5,
	"Sun": 6
};

/**
 *
 * @param time  ['11','am'] or ['8:30', 'pm']
 */
export const convertStringTimeToNumber = (time: Array<string>) => {
	let result: number = 0;

	time[0].includes(":")
		? (result = +time[0].split(":")[0] + +time[0].split(":")[1] / 60)
		: (result = +time[0]);

	if (time[1] === "pm") {
		result += 12;
	}

	return result;
};
