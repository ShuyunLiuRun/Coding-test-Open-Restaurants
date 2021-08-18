import { readFileSync } from "fs";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";
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
	const jsonData = <JsonRestaurantData>(
		JSON.parse(readFileSync(jsonFilename, "utf-8"))
	);
	// restrctureRestaurantsData(jsonData.restaurants);
	// console.log(restrctureRestaurantsData(jsonData.restaurants));
	console.log(DateTime.local(2021, 5, 10, 15, 40));
};

/**
 * Finds the restaurants open at the specified time.
 *
 * @param {luxon.DateTime} time
 * @returns {Array<string>} The names of the restaurants open at the specified
 * time. The order of the elements in this array is alphabetical.
 */
const getRestaurantsOpenAt = (time: DateTime) => {
	time;
	return [];
};

/**
 * Convert the json data into a map
 *
 *  @param {Array<EachRestaurant>} restuarantDataJson
 * @returns {Map<string, Array<string>} The well structured json data so we can
 * loop through easier
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
 *
 *Map {
  'Kayasa Restaurant' => Map {
    0 => { open: 8.5, close: 21 },
    1 => { open: 8.5, close: 21 },
    2 => { open: 8.5, close: 21 },
    3 => { open: 8.5, close: 21 },
    4 => { open: 8.5, close: 21 },
    5 => { open: 8.5, close: 21 },
    6 => { open: 8.5, close: 21 }
  },
  'The Golden Duck' => Map {
    0 => { open: 11, close: 23 },
    1 => { open: 11, close: 23 },
    2 => { open: 11, close: 23 },
    3 => { open: 11, close: 23 },
    4 => { open: 11, close: 23 },
    5 => { open: 11, close: 23 },
    6 => { open: 11, close: 23 }
  },
  "World's Best Steakhouse" => Map {
    0 => { open: 11, close: 23 },
    1 => { open: 11, close: 23 },
    2 => { open: 11, close: 23 },
    3 => { open: 11, close: 23 },
    4 => { open: 11, close: 23 },
    5 => { open: 11, close: 1 },
    6 => { open: 24, close: 21 }
  },
  'Tandoori Mahal' => Map {
    0 => { open: 11, close: 22.5 },
    1 => { open: 11, close: 22.5 },
    2 => { open: 11, close: 22.5 },
    3 => { open: 11, close: 22.5 },
    4 => { open: 11, close: 23 },
    5 => { open: 11.5, close: 23 },
    6 => { open: 16.5, close: 22.5 }
  },
  'Coffee and Bagels' => Map {
    3 => { open: 11.5, close: 16 },
    4 => { open: 11.5, close: 16 },
    5 => { open: 11.5, close: 16 },
    6 => { open: 11.5, close: 16 }
  }
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
