function roundNearest(arr, n) {
  return arr.map(x => Math.round(x/n)*n);
}

function maxStars(level) {
  if (level < 95) { return 5; }
  if (level < 108) { return 8; }
  if (level < 118) { return 10; }
  if (level < 128) { return 15; }
  if (level < 138) { return 20; }
  return 25;
}

function costArray(level) {
  let f = function(level, star, exp, divisor) {
    return 1000 + Math.pow(level,3)*Math.pow(star,exp)/divisor;
  }
  let array = [];
  for (let star=0; star < 10; ++star) { array.push(f(level, star + 1, 1.0, 25)); }
  for (let star=10; star < 15; ++star) { array.push(f(level, star + 1, 2.7, 400)); }
  for (let star=15; star < 18; ++star) { array.push(f(level, star + 1, 2.7, 120)); }
  for (let star=18; star < 20; ++star) { array.push(f(level, star + 1, 2.7, 110)); }
  for (let star=20; star < 25; ++star) { array.push(f(level, star + 1, 2.7, 100)); }
  return roundNearest(array, 100);
}

function calculateCost(level, safeguardArray, sunnySundayArray) {
  const [passEvent, discountEvent] = sunnySundayArray;
  let baseCost = costArray(level);
  let defaultCost = [...baseCost];
  safeguardArray.forEach((safeguarding, star) => {
    if (safeguarding) {
      defaultCost[star] *= 2;
    }
  });
  if (discountEvent) {
    defaultCost.forEach((cost, star, defaultCost) => {
      defaultCost[star] -= 0.30*baseCost[star];
    });
    baseCost.forEach((cost, star, baseCost) => {
      baseCost[star] *= 0.70;
    });
  }
  if (passEvent) {
    defaultCost[15] = baseCost[15];
  }
  return [
    roundNearest(defaultCost, 100),
    roundNearest(baseCost, 100)];
}

function calculateRates(starcatchArray, safeguardArray, sunnySundayArray) {
  const [passEvent, discountEvent] = sunnySundayArray;
  rates = [
    [0.950, 0.050, 0.000],
    [0.900, 0.100, 0.000],
    [0.850, 0.150, 0.000],
    [0.850, 0.150, 0.000],
    [0.800, 0.200, 0.000],
    [0.750, 0.250, 0.000],
    [0.700, 0.300, 0.000],
    [0.650, 0.350, 0.000],
    [0.600, 0.400, 0.000],
    [0.550, 0.450, 0.000],
    [0.500, 0.500, 0.000],
    [0.450, 0.000, 0.550],
    [0.400, 0.000, 0.594],
    [0.350, 0.000, 0.637],
    [0.300, 0.000, 0.686],
    [0.300, 0.679, 0.000],
    [0.300, 0.000, 0.679],
    [0.300, 0.000, 0.679],
    [0.300, 0.000, 0.672],
    [0.300, 0.000, 0.672],
    [0.300, 0.630, 0.000],
    [0.300, 0.000, 0.630],
    [0.030, 0.000, 0.776],
    [0.020, 0.000, 0.686],
    [0.010, 0.000, 0.594]];
  starcatchArray.forEach((value, star) => {
    if (value) {
      let old = rates[star][0];
      rates[star][0] *= 1.045;
      rates[star][1] = (1.0 - rates[star][0]) * (rates[star][1] / (1.0 - old));
      rates[star][2] = (1.0 - rates[star][0]) * (rates[star][2] / (1.0 - old));
    }
  });
  rates = rates.map(x => [x[0], x[0]+x[1], x[0]+x[1]+x[2]]);
  if (passEvent) {
    rates[5][0] = 1.0;
    rates[10][0] = 1.0;
    rates[15][0] = 1.0;
  }
  safeguardArray.forEach((value, star) => {
    if (value) {
      rates[star][2] = 1.0;
    }
  });
  return rates;
}

function starforce(start, goal, defaultCost, baseCost, rates) {
  let [mesos, chanceTimes, booms, steps] = [0, 0, 0, 0];
  let downFlag = false;
  let star = start;
  let sequence = [start];
  while (star < goal) {
    ++steps;
    const roll = Math.random();
    mesos += defaultCost[star];
    if (roll <= rates[star][0]) {
      downFlag = false;
      ++star;
    }
    else if (roll <= rates[star][1]) {
      downFlag = false;
    }
    else if (roll <= rates[star][2]) {
      if (downFlag) {
        mesos += baseCost[star-1];
        ++steps;
        ++chanceTimes;
        downFlag = false;
        sequence.push(star-1);
      }
      else {
        downFlag = true;
        --star;
      }
    }
    else {
      downFlag = false;
      ++booms;
      star = 12;
    }
    sequence.push(star);
  }
  return [mesos, booms, chanceTimes, steps, sequence];
}
