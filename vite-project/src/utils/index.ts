export const formatDate = (date: any) => {
  if (!date) return "Date invalide"; // Vérifie si la date est vide ou invalide

  const parsedDate = new Date(date); // Assure-toi de transformer la date en objet Date

  // Si la date est invalide, retourne une chaîne spécifique
  if (isNaN(parsedDate.getTime())) {
    return "Date invalide";
  }

  const month = parsedDate.toLocaleString("en-US", { month: "short" });
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear();

  // Récupérer l'heure, les minutes et les secondes
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();
  const seconds = parsedDate.getSeconds();

  // Formater l'heure pour avoir 2 chiffres (ex : 9 -> 09)
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Formater la date et l'heure
  const formattedDate = `${day}-${month}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  return formattedDate;
};

export function dateFormatter(dateString: any) {
  const inputDate: any = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export function getInitials(fullName: any) {
  const names = fullName.split(" ");

  const initials = names.slice(0, 2).map((name: any) => name[0].toUpperCase());

  const initialsStr = initials.join("");

  return initialsStr;
}

export const PRIOTITYSTYELS: any = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

export const TASK_TYPE: any = {
  todo: "bg-blue-600",
  in_progress: "bg-yellow-600",
  done: "bg-green-600",
};
export const TASK_TYPE_TEXT: any = {
  todo: "text-blue-600",
  in_progress: "text-yellow-600",
  done: "text-green-600",
};

export const BGS: any = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];
