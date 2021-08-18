import { expect } from "chai";

import { getRestaurantsOpenAt } from "../app/restaurants";

const restaurantDataFile = "./restaurant_data.json";

describe("Restaurants class", function () {
	it("reports no open restaurants at 5am on Monday", () => {
		expect(
			getRestaurantsOpenAt(
				restaurantDataFile,
				new Date("August 23, 2021 05:00:00")
			)
		).to.deep.equal([]);
	});

	it("reports only the Kayasa Restaurant open on Monday at 8:30 am", () => {
		expect(
			getRestaurantsOpenAt(
				restaurantDataFile,
				new Date("August 23, 2021 08:30:00")
			)
		).to.deep.equal(["Kayasa Restaurant"]);
	});

	it("reports five restaurants open on Sat at 11:30 am", () => {
		expect(
			getRestaurantsOpenAt(
				restaurantDataFile,
				new Date("August 21, 2021 11:30:00")
			)
		).to.deep.equal([
			"Kayasa Restaurant",
			"The Golden Duck",
			"World's Best Steakhouse",
			"Tandoori Mahal",
			"Coffee and Bagels",
			"24 Hours Shop"
		]);
	});

	it("reports two restuarants open on Monday at 00:00 am", () => {
		expect(
			getRestaurantsOpenAt(
				restaurantDataFile,
				new Date("August 23, 2021 00:00:00")
			)
		).to.deep.equal([
			"Louise Home Made Instant Noodle",
			"Louise Midnight Kitchen"
		]);
	});

	it("reports only the Louise Midnight Kitchen open on Monday at 1:00 am", () => {
		expect(
			getRestaurantsOpenAt(
				restaurantDataFile,
				new Date("August 23, 2021 01:00:00")
			)
		).to.deep.equal(["Louise Midnight Kitchen"]);
	});

	it("reports no one open on Thrusday at 00:00 am", () => {
		expect(
			getRestaurantsOpenAt(
				restaurantDataFile,
				new Date("August 19, 2021 00:00:00")
			)
		).to.deep.equal([]);
	});

	it("reports only 24 Hours Shop opens on Sunday at 00:00 am", () => {
		expect(
			getRestaurantsOpenAt(
				restaurantDataFile,
				new Date("August 22, 2021 00:00:00")
			)
		).to.deep.equal(["24 Hours Shop"]);
	});
});
