const getName = (element, lang = "es") => {
    if (element.names && element.names.length > 0) {
        return element.names.filter((name) => name.language.name === lang)[0].name;
    }
    return element.name;
}
const getMultiplierColor = (multiplier) => {
    // multiplier goes from 0.75 to 1.25
    if (multiplier > 1) {
        // return color between black and green
        const green = (multiplier - 1) / 0.25 * 255;
        return "rgb(0," + green + ",0)";

    }
    if (multiplier < 1) {
        // return color between black and red .
        const red = (1 - multiplier) / 0.25 * 255;
        return "rgb(" + red + ",0,0)";

    }
    return "black";
}
const getStatWithMultiplier = (stat) => {
    return Math.round(stat.base_stat * stat.multiplier);
}
export { getName, getMultiplierColor, getStatWithMultiplier }