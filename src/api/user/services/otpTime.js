function padZero(num) {
    return num < 10 ? '0' + num : num;
}

export default (delayMinute = 10) => {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + delayMinute);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    const timezoneOffset = currentDate.getTimezoneOffset();
    const timezoneSign = timezoneOffset > 0 ? '-' : '+';
    const absTimezoneOffset = Math.abs(timezoneOffset);
    const timezoneHours = String(Math.floor(absTimezoneOffset / 60)).padStart(2, '0');
    const timezoneMinutes = String(absTimezoneOffset % 60).padStart(2, '0');
    const timezoneOffsetString = `${timezoneSign}${timezoneHours}:${timezoneMinutes}`;

    const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetString}`;
    console.log(time)
    return time
}
