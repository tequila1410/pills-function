const intakes = [
    { time: "0:00", pills: 3 },
    { time: "0:00", pills: 3 },
    { time: "0:01", pills: 4 },
  ];
  
  const stock = 60;
  
  const frequency = "daily"; //possible values - "daily", "eachOtherDay" (через день), "weekly";
  
  const weekDays = {
    monday: false,
    tuesday: true,
    wednesday: false,
    thursday: true,
    friday: false,
    saturday: false,
    sunday: false
  }; // this  parameter is REQUIRED ONLY for "weekly" frequency of intakes
  
  /**
   * Object with intake details
   * @typedef {Object} Intake
   * @property {string} time - time of intake (must be in the 'HH:mm' format)
   * @property {number} pills - amount of pills
   */
  
  /**
   * Object with selected days of intakes
   * @typedef {Object} WeekDays
   * @property {boolean} monday
   * @property {boolean} tuesday
   * @property {boolean} wednesday
   * @property {boolean} thursday
   * @property {boolean} friday
   * @property {boolean} saturday
   * @property {boolean} sunday
   */
  
  /**
   * @param {Intake[]} intakes - number of pills and time of intake (per day)
   * @param {number} stock - total number of pills
   * @param {'daily', 'weekly', 'eachOtherDay'} frequency - the frequency of taking
   * @param {WeekDays} [weekDays] - required only for 'weekly' frequency
   * @return {Date} - the end date of taking the pills
   */
  
  function calculateIntakeEndDate(intakes, stock, frequency, weekDays) {
    let date = new Date();
    date.setSeconds(0, 0);

    intakes.forEach(item => {
        const tmpDate = new Date();
        const intakesTime = item.time.split(':');
        tmpDate.setUTCHours(intakesTime[0], intakesTime[1], 0, 0);

        if (date > tmpDate) {
            stock += item.pills;
        }
    });

    const dayQueue = frequency === 'daily' ? 1 : 2;

    return frequency === 'weekly' ? getWeeklyDate(stock, intakes, weekDays) : getDateByDayPeriod(stock, intakes, dayQueue)
  }

  function getDateByDayPeriod(stock, intakes, n) {
    let sumDays = 0;
    let isPillsExist = stock > 0;
    const pillsDayCount = intakes.reduce((sum, currentItem) => sum + currentItem.pills, 0);

    while(isPillsExist) {
        stock -= pillsDayCount;
        if (stock > 0) {
            sumDays += n;
        }
        isPillsExist = stock > 0;
    }
    let date = new Date();
    date.setDate(date.getDate() + sumDays)
    return date;
  }

  function getWeeklyDate(stock, intakes, weekDays) {
    let sumDays = 0;
    let isPillsExist = stock > 0;
    const pillsDayCount = intakes.reduce((sum, currentItem) => sum + currentItem.pills, 0);

    const currentDay = new Date().getDay();
    let days = Object.keys(weekDays);
    days = [...days.slice(currentDay-1), ...days.slice(0, currentDay-1)];

    while(isPillsExist) {
        days.forEach(item => {
            if (weekDays[item]) {
                stock -= pillsDayCount;
            }
            if (stock > 0) {
                sumDays++;
            }

        });
        isPillsExist = stock > 0;
    }
    let date = new Date();
    date.setDate(date.getDate() + sumDays)
    return date;
  }
  
 calculateIntakeEndDate(intakes, stock, frequency, weekDays);
  