export const mapWeekdayToInt = {
	"Mon": 1,
	"Tus": 2,
	"Wed": 3,
	"Thu": 4,
	"Fri": 5,
	"Sat": 6,
	"Sun": 7
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

	if (time[1] === "pm" && time[0] !== "12") {
		result += 12;
	}
	if (
		(time[0] === "12" ||
			time[0] === "0" ||
			time[0] === "0:0" ||
			time[0] === "00" ||
			time[0] === "00:00") &&
		time[1] === "am"
	) {
		result = 24;
	}
	if ((time[0] === "12:30" || time[0] === "0:30") && time[1] === "am") {
		result = 24.5;
	}

	return result;
};
