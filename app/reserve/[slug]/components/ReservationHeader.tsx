import {
  convertToDisplayTime,
  Time,
} from '../../../../utilities/convertToDisplayTime';
import { format } from 'date-fns';

interface ReservationHeaderProps {
  image: string;
  name: string;
  date: string;
  partySize: string;
}

const ReservationHeader: React.FC<ReservationHeaderProps> = ({
  image,
  name,
  partySize,
  date,
}) => {
  const [day, time] = date.split('T');
  return (
    <div className="mt-5 flex flex-col md:flex-row border p-4">
      <img
        src={image}
        alt="Description of Image"
        className="w-48 h-32 md:w-32 md:h-18 rounded mx-auto md:mx-0"
      />

      <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>

        <div className="flex flex-wrap justify-center md:justify-start mt-3 space-x-0 md:space-x-6">
          <p>{format(new Date(day), 'ccc, LLL d')}</p>
          <p>{convertToDisplayTime(time as Time)}</p>
        </div>
        <p>
          {partySize} {parseInt(partySize) === 1 ? 'person' : 'people'}
        </p>
      </div>
    </div>
  );
};

export default ReservationHeader;
