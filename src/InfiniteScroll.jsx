import { useState, useEffect, useRef } from "react";

const InfiniteScroll = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const lastItemRef = useRef(null); 
  

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`);
      const newData = await response.json();
      setItems((prevItems) => [...prevItems, ...newData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [items]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => observer.disconnect(); // Cleanup observer
  }, [items]);

  return (
    
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Infinite Scrolling List</h1>
      
      <ol type="1">
        {items.map((item, index) => {
          if (index === items.length - 1) {
            return (
              <li key={item.id} ref={lastItemRef} className="border p-2 mb-2 rounded bg-gray-100">
                {item.title}
              </li>
             
            );
          }
          return (
            <li key={item.id} className="border p-2 mb-2 rounded bg-gray-100">
              {item.title}
            </li>
          );
        })}
      </ol>
      {loading && <p className="text-center">Loading more...</p>}
    </div>
  );
};

export default InfiniteScroll;
