import { readFileSync } from "fs";
import { EachRestaurant } from "./Model/EachRestaurant";
import { JsonRestaurantData } from "./Model/JsonRestaurantData";
import { OpenHours } from "./Model/OpenHours";
import { convertStringTimeToNumber, mapWeekdayToInt } from "./util/helper";

/**
 * This function takes the name of a JSON file containing details on opening hours
 * for a number of restaurants. It parses the contents of this file and then
 * provides a method for querying which restaurants are open at a specified date
 * and time. The input JSON file can be assumed to contain correctly formatted
 * data.
 *
 * All dates and times can be assumed to be in the same time zone.
 */
export const getRestaurants = (jsonFilename: string) => {
	const jsonData = <JsonRestaurantData | undefined>(
		JSON.parse(readFileSync(jsonFilename, "utf-8"))
	);
	if (jsonData === {}) return undefined;

	return restrctureRestaurantsData(jsonData.restaurants);
};

/**
 * Finds the restaurants open at the specified time.
 *
 * @param {Date} time
 * @param {string} jsonFilename
 * @returns {Array<string>} The names of the restaurants open at the specified
 * time. The order of the elements in this array is alphabetical.
 */
export const getRestaurantsOpenAt = (jsonFilename: string, time?: Date) => {
	let mappedData: Map<string, Map<number, OpenHours>> = getRestaurants(
		jsonFilename
	);
	let result = [];
	let ampm = time.getHours() > 12 ? "pm" : "am";
	let hourAndMinutes = convertStringTimeToNumber([
		`${time.getHours()}:${time.getMinutes()}`,
		ampm
	]);
	let weekday = time.getDay() === 0 ? 7 : time.getDay();

	if (mappedData === undefined) return [];

	mappedData.forEach(
		(eachRestaurant: Map<number, OpenHours>, restaurantName: string) => {
			//for the normal situation
			eachRestaurant.has(weekday) &&
				eachRestaurant.get(weekday).open <= hourAndMinutes &&
				hourAndMinutes <= eachRestaurant.get(weekday).close &&
				result.push(restaurantName);

			// for the situation that the shop close after midnight
			eachRestaurant.has(weekday) &&
				eachRestaurant.get(weekday).open >
					eachRestaurant.get(weekday).close &&
				(eachRestaurant.get(weekday).open <= hourAndMinutes ||
					hourAndMinutes <= eachRestaurant.get(weekday).close) &&
				result.push(restaurantName);

			//for the situation that the shop opening all day
			eachRestaurant.has(weekday) &&
				eachRestaurant.get(weekday).open ===
					eachRestaurant.get(weekday).close &&
				result.push(restaurantName);
		}
	);
	return [...new Set(result)];
};

/**
 * Convert the json data into a map
 *
 *  @param {Array<EachRestaurant>} restuarantDataJson
 * @returns {Map<string,Map<number, OpenHours>>}
 *  the restructured data arranged by seperate weekdays
 */
const restrctureRestaurantsData = (
	restuarantDataJson: Array<EachRestaurant>
) => {
	let restaurantMap: Map<string, Array<string>> = new Map();
	let eachRestaurantOpenHours: Array<string>;

	restuarantDataJson.forEach((restaurant: EachRestaurant) => {
		eachRestaurantOpenHours = restaurant.opening_hours.split(";");
		restaurantMap.set(restaurant.name, eachRestaurantOpenHours);
	});

	return divideOpenTimeToSevenDays(restaurantMap);
};

/**
 *
 * @param {Map<string, Array<string>>} restaurantMap
 * @returns {Map<string,Map<number, OpenHours>>} 
 * the restructured data arranged by seperate weekdays
 * 
 *result : Map {
  'Kayasa Restaurant' => Map {
    0 => { open: 8.5, close: 21 },
    1 => { open: 8.5, close: 21 },
    2 => { open: 8.5, close: 21 },
    3 => { open: 8.5, close: 21 },
    4 => { open: 8.5, close: 21 },
    5 => { open: 8.5, close: 21 },
    6 => { open: 8.5, close: 21 }
  },
  ...
}
 */
const divideOpenTimeToSevenDays = (
	restaurantMap: Map<string, Array<string>>
) => {
	let mappedRestaurantDataToDays: Map<
		string,
		Map<number, OpenHours>
	> = new Map();
	restaurantMap.forEach(
		(openHoursRaw: Array<string>, restaurantName: string) => {
			let openTimeSevenDaysEachRestaurant: Map<number, OpenHours> =
				new Map();

			openHoursRaw.forEach((openHours: string) => {
				let weekday: number = 0;

				let splited = openHours.trim().split(" ");
				let openDay = splited[0];
				let startDay: number = mapWeekdayToInt[openDay.split("-")[0]];
				let endDay: number = mapWeekdayToInt[openDay.split("-")[1]];

				let startHour: number = convertStringTimeToNumber([
					splited[1],
					splited[2]
				]);
				let endHour: number = convertStringTimeToNumber([
					splited[4],
					splited[5]
				]);

				let openHoursADay: OpenHours = {
					open: startHour,
					close: endHour
				};

				if (endDay !== undefined) {
					for (let i = 0; i < endDay - startDay + 1; i++) {
						weekday = startDay + i;

						openTimeSevenDaysEachRestaurant.set(
							weekday,
							openHoursADay
						);
					}
				} else {
					weekday = mapWeekdayToInt[openDay];
					openTimeSevenDaysEachRestaurant.set(weekday, openHoursADay);
				}
			});

			mappedRestaurantDataToDays.set(
				restaurantName,
				openTimeSevenDaysEachRestaurant
			);
		}
	);
	return mappedRestaurantDataToDays;
};
