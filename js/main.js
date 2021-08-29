function getSelection(className) {
  return parseInt(document.getElementsByClassName(className)[0].value);
}

function getCheckedArray(className) {
  return Array.from(document.getElementsByClassName(className)).map(box => box.checked);
}

function getTextarea(classname) {
  return document.getElementsByClassName(classname)[0];
}

function output(start, goal, results, sequence) {
  const sequenceLimit = 10000;
  if (start >= goal) {
    return "Initial starforce level meets the goal starforce level.";
  }
  else if (goal < 23) {
    return `${results.join("\n")}\n${sequence.join(" ")}`;
  }
  else {
    return `${results.join("\n")}\nLast ${Math.min(sequenceLimit,sequence.length)}:\n${sequence.slice(-1*sequenceLimit).join(" ")}`;
  }
}

function simulate() {
  const level = getSelection("level-select");
  const start = getSelection("start-select");
  const goal = getSelection("goal-select");
  const starcatchArray = getCheckedArray("starcatch-input");
  const safeguardArray = getCheckedArray("safeguard-input");
  const sunnySundayArray = getCheckedArray("sunny-sunday-input");
  const [baseCost, adjustedCost] = calculateCost(level, safeguardArray, sunnySundayArray);
  const rates = calculateRates(starcatchArray, safeguardArray, sunnySundayArray);
  const textarea = getTextarea("text");
  const [mesos, booms, chanceTimes, steps, sequence] = run(start, goal, baseCost, adjustedCost, rates);
  const results = [
    `Mesos: ${mesos.toLocaleString()}`,
    `Destroyed Equips: ${booms.toLocaleString()}`,
    `Chance Times: ${chanceTimes.toLocaleString()}`,
    `Enhancements: ${steps.toLocaleString()}`];
  textarea.innerHTML = output(start, goal, results, sequence);
  console.log(results.join("\n"));
}
