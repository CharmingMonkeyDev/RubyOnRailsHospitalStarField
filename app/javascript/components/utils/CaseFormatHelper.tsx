export function snakeCaseToTitleCase(string) {
  if (string) {
    return string
      .split("_")
      .map((word) => {
        return word.slice(0, 1).toUpperCase() + word.slice(1);
      })
      .join(" ");
  } else {
    return string;
  }
}

export function toTitleCase(str) {
  if (str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  } else {
    return str;
  }
}

export function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .trim();
}
