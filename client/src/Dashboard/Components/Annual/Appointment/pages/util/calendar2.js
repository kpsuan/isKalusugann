import dayjs from "dayjs";

export const generateDate = (
	month = dayjs().month(),
	year = dayjs().year()
) => {
	const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
	const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

	const arrayOfDate = [];

	// Create prefix dates (dates from previous month)
	for (let i = 0; i < firstDateOfMonth.day(); i++) {
		const date = firstDateOfMonth.subtract(firstDateOfMonth.day() - i, 'day');
		arrayOfDate.push({
			currentMonth: false,
			date,
		});
	}

	// Generate current month dates
	for (let i = 1; i <= lastDateOfMonth.date(); i++) {
		const date = firstDateOfMonth.date(i);
		arrayOfDate.push({
			currentMonth: true,
			date,
			today: date.isSame(dayjs(), 'day'),
		});
	}

	// Fill remaining days (dates from next month)
	const remaining = 42 - arrayOfDate.length;
	for (let i = 1; i <= remaining; i++) {
		const date = lastDateOfMonth.add(i, 'day');
		arrayOfDate.push({
			currentMonth: false,
			date,
		});
	}

	return arrayOfDate;
};


// Export months array
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
