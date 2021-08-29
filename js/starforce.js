function roundNearest(arr, n) {
  return arr.map(x => Math.round(x/n)*n);
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
  const base = costArray(level);
  let adjusted = [...base];
  safeguardArray.forEach((value, i) => {
    if(value) {
      adjusted[i] *= 2;
    }
  });
  const [passEvent, discountEvent] = sunnySundayArray;
  if (passEvent) {
    adjusted[0] = base[0];
    adjusted[10] = base[10];
    adjusted[15] = base[15];
  }
  if (discountEvent) {
    base.forEach((b, star) => {
      adjusted[star] -= 0.3*b;
    });
    adjusted = roundNearest(adjusted, 100);
  }
  return [base, adjusted];
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

function run(start, goal, baseCost, adjustedCost, rates) {
  let [mesos, chanceTimes, booms, steps] = [0, 0, 0, 0];
  let downFlag = false;
  let star = start;
  let sequence = [start];
  while (star < goal) {
    ++steps;
    const roll = Math.random();
    mesos += adjustedCost[star];
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
