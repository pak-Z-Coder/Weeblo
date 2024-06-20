import { CardContent, Card } from "@/components/ui/card";

const ScheduledCard = ({ anime }) => {
  const { time, name, jname } = anime;
  // const getFormatedTime = (timestamp) => {
  //   const date = new Date(timestamp);
  //   let hours = date.getHours();
  //   const minutes = String(date.getMinutes()).padStart(2, "0");

  //   const amOrPm = hours >= 12 ? "PM" : "AM";

  //   hours = hours % 12 || 12;
  //   return `${hours}:${minutes} ${amOrPm}`;
  // };
  return (
    <Card className="h-full w-full">
      <CardContent className="p-2 pt-2 grid gap-4 mx-auto">
        <div className="grid gap-1.5">
          <h3 className="text-sm font-bold tracking-wide line-clamp-1">
            {name}
          </h3>
          <div className="flex space-x-1 items-center justify-between">
            <h4 className="text-xs font-semibold text-secondary tracking-wide">
              {jname}
            </h4>
            <p className="text-xs opacity-70 font-medium text-right ">
              {time}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ScheduledCard;
