import { CardContent, Card } from "@/components/ui/card";

const ScheduledCard = ({ anime }) => {
  const { time, name, jname } = anime;
  const convertTo12HourFormat=(time)=> {
    let [hours, minutes] = time.split(":").map(Number);

    // Determine AM or PM suffix
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // '0' hours should convert to '12'

    // Return formatted time
    return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
}
  return (
    <Card className="h-full w-full">
      <CardContent className="p-2 pt-2 grid gap-4 mx-auto">
        <div className="grid gap-1.5">
          <h3 className="text-sm font-bold tracking-wide line-clamp-1">
            {name}
          </h3>
          <div className="flex space-x-1 items-center justify-between">
            <h4 className="text-xs font-semibold text-secondary text-opacity-80 tracking-wide">
              {jname.slice(0,29)}
            </h4>
            <p className="text-xs opacity-70 font-medium text-right ">
              {convertTo12HourFormat(time)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ScheduledCard;
