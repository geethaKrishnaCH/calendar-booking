import Navbar from "../../common/navbar/Navbar";
import UpcomingEvents from "../events/upcoming/UpcomingEvents";

export default function Home() {
  return (
    <>
      <Navbar />
      <UpcomingEvents events={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]} />
    </>
  );
}
