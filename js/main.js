function getSelection(className) {
  return parseInt(document.getElementsByClassName(className)[0].value);
}

function getCheckedArray(className) {
  const elements = document.getElementsByClassName(className);
  array = [];
  for (let i = 0, len = elements.length; i < len; ++i) {
    array[elements[i].value] = elements[i].checked;
  }
  return array;
}

function getTextarea(classname) {
  return document.getElementsByClassName(classname)[0];
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
  const [mesos, chanceTimes, booms, steps, sequence] = run(start, goal, baseCost, adjustedCost, rates);
  const output = [
    `Mesos: ${mesos.toLocaleString()}`,
    `Destroyed Equips: ${booms.toLocaleString()}`,
    `Chance Times: ${chanceTimes.toLocaleString()}`,
    `Enhancements: ${steps.toLocaleString()}`];
  if (start >= goal) {
    textarea.innerHTML = "Initial starforce level meets the goal starforce level.";
  }
  else if (goal < 23) {
    textarea.innerHTML = `${output.join("\n")}\n${sequence.join(" ")}`;
  }
  else {
    textarea.innerHTML = `${output.join("\n")}\nLast ${Math.min(10000,sequence.length)}:\n${sequence.slice(-10000).join(" ")}`;
  }
  console.log(output.join("\n"));
}
