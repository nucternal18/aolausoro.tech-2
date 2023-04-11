export default function getFormattedDateString(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
    new Date(date)
  );
}
