import { CardContent, Card } from "@/components/ui/card"

const ScheduledCard = ({ anime }) => {
  const { coverImage, title, airingAt, airingEpisode } = anime;
  const getFormatedTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${amOrPm}`;
  }
  return (
    (
      <Card className="h-full w-full">
        <CardContent className="p-3 pt-2 mx-auto grid gap-4">
          <div className="aspect-video">
            <img
              alt={title.native}
              className="object-cover min-h-[180px] max-h-[180px] sm:min-h-[200px] sm:max-h-[200px] rounded-lg"
              height={400}
              src={coverImage}
              width={300} />
          </div>
          <div className="grid gap-1.5">
            <h3 className="text-sm font-bold tracking-wide line-clamp-1">{title.english}</h3>
            <div className="flex space-x-1 items-center justify-between">
              <h4 className="text-sm font-semibold text-secondary tracking-wide">EP{airingEpisode}</h4>
              <p className="text-xs opacity-70 font-medium line-clamp-2">{getFormatedTime(airingAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
}
export default ScheduledCard;