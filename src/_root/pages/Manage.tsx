import EditCard from "@/components/shared/EditCard";
import Loader from "@/components/shared/Loader";
 import { useGetEventsMutation } from "@/store/api/postApi";
import { useEffect } from "react";


type eventPoster={
  publicId:string;
  secureUrl:string;
}
type Document={
  eventName:string;
  $createdAt:string;
  _id:string;
  eventPoster:eventPoster;
}

 
const Manage =  () => {

  const [getEvents,{data:events} ] = useGetEventsMutation();

  const fetchData = async () => {
    try {
      // Call the mutate function to trigger the mutation
      const token=localStorage.getItem('token');
      if (!token) {
        throw new Error("Token not found");
    }
      const events = await getEvents({token});
      if ('data' in events) {
        console.log(events.data[0]); // Access the data property
      }
      else{
        alert('Error while loading Events')
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const isEventLoading=true;
  
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">
                Events
          </h2>
          {isEventLoading && !events?(
            <Loader/>

          ):(
            <ul className="flex flex-col flex-1 gap-9 w-full">
            
            {events?.map((event: Document) => (
               
               <EditCard key={event._id} post={event} />
              ))}

            </ul>
          )}

          

        </div>
      </div>
      
    </div>
   )
}

export default Manage
