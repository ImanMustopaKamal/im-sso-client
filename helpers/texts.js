import moment from "moment-timezone";

export default {
  FormatCost: (num) => {
    if (num) {
      return "$" + num.toLocaleString().replace(/,/g, ".");
    } else {
      return "$0";
    }
  },
  FormatDate: (dateString, inputFormat, outputFormat) => {
    const momentDate = moment(dateString, inputFormat);
    const result = momentDate.format(outputFormat);
    if (result != "Invalid date") {
      return result;
    }
    return null;
  },
  FormatDate2: (format, value) => {
    if (value && format) {
      let dateTime = new Date(String(value));
      dateTime = moment(dateTime).utc().format(format);
      return dateTime;
    }
  },
  FormatTimeAgo(timestamp) {
    const now = moment();
    const then = moment.unix(timestamp);
    const diff = now.diff(then);

    const duration = moment.duration(diff);
    const seconds = duration.asSeconds();
    const minutes = duration.asMinutes();
    const hours = duration.asHours();
    const days = duration.asDays();
    const weeks = duration.asWeeks();
    const months = duration.asMonths();
    const years = duration.asYears();

    if (seconds < 60) {
      return `${Math.floor(seconds)} second${
        Math.floor(seconds) !== 1 ? "s" : ""
      } ago`;
    } else if (minutes < 60) {
      return `${Math.floor(minutes)} minute${
        Math.floor(minutes) !== 1 ? "s" : ""
      } ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)} hour${
        Math.floor(hours) !== 1 ? "s" : ""
      } ago`;
    } else if (days < 7) {
      return `${Math.floor(days)} day${Math.floor(days) !== 1 ? "s" : ""} ago`;
    } else if (weeks < 4) {
      return `${Math.floor(weeks)} week${
        Math.floor(weeks) !== 1 ? "s" : ""
      } ago`;
    } else if (months < 12) {
      return `${Math.floor(months)} month${
        Math.floor(months) !== 1 ? "s" : ""
      } ago`;
    } else {
      return `${Math.floor(years)} year${
        Math.floor(years) !== 1 ? "s" : ""
      } ago`;
    }
  },
  S2AB(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  },
  FormatIncidentHistory(text) {
    let parts = text.split("*b*");
    parts[1] = "<b>" + parts[1] + "</b>";
    let parts2 = parts.join("").split("*r*");
    if (parts2.length > 1) {
      parts2[1] = `<span class="badge-danger history">${parts2[1]}</span>`;
    }
    let parts3 = parts2.join("").split("*g*");
    if (parts3.length > 1) {
      parts3[1] = `<span class="badge-success history">${parts3[1]}</span>`;
    }
    let returned = parts3.join("");
    return returned;
  },
  GetFileExtension: (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },
  ObjectToFormData(obj) {
    const form_data = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      form_data.append(key, value);
    });

    return form_data;
  },
  Ellipsis(str) {
    if (str.length > 50) {
      return str.slice(0, 50) + "...";
    }
    return str;
  },
  GetFileName(url) {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    return fileName;
  },
  PhoneNumberRecoverred(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    return "+62" + parseInt(cleanNumber);
  },
  PhoneNumberFormatted(formattedPhoneNumber) {
    const cleanNumber = formattedPhoneNumber.replace(/\D/g, "");
    if (cleanNumber.startsWith("62")) {
      return "0" + parseInt(cleanNumber.slice(2));
    } else {
      return "";
    }
  },
  ParseJwt: (token) => {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  },
  GenerateId: (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  },
};
