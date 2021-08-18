import { expect } from "chai";
import { DateTime, Duration, Interval, Info, Settings } from "luxon";

import { getRestaurants } from "../app/restaurants";

const restaurantDataFile = "./restaurant_data.json";

describe("Restaurants class", function () {
	let restaurants;

	beforeEach(() => {
		restaurants = getRestaurants(restaurantDataFile);
	});

	// Helper function that returns the restaurants open on a specific weekday
	// at a given time. Monday is weekday === 0, and Sunday is weekday === 6.
	const getRestaurantsOpenAt = ({ weekday, hour, minute = 0 }) => {
		return restaurants.getRestaurantsOpenAt(
			DateTime.local(2021, 5, 10 + weekday, hour, minute)
		);
	};

	it("reports no open restaurants at 5am on Sundays", () => {
		expect(getRestaurantsOpenAt({ weekday: 6, hour: 5 })).to.deep.equal([]);
	});

	it("reports only the Kayasa Restaurant open on Monday at 8:30 am", () => {
		expect(
			getRestaurantsOpenAt({ weekday: 0, hour: 8, minute: 30 })
		).to.deep.equal(["Kayasa Restaurant"]);
	});

	// TODO
});
