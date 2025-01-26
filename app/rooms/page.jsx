"use client";
import RoomCard from "@/components/RoomCard";
import { useAppContext } from "@/context/page";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [roomType, setRoomType] = useState("all");
  const observerRef = useRef(); // Ref for the Intersection Observer target element
  const { user } = useAppContext();

  const fetchRooms = useCallback(async () => {
    if (loading || !hasMore || !roomType) return;

    setLoading(true);

    try {
      const url =
        roomType === "mine" && user?._id
          ? `/api/rooms?page=${page}&limit=10&type=${roomType}&uId=${user._id}`
          : `/api/rooms?page=${page}&limit=10&type=${roomType}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.status === 201) {
        setRooms((prevRooms) => {
          const newRooms = data.body.rooms.filter(
            (newRoom) => !prevRooms.some((room) => room._id === newRoom._id)
          );
          return [...prevRooms, ...newRooms];
        });

        setHasMore(page < data.body.totalPages);
      } else {
        console.error(data.body.message);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, roomType, page, user?._id]);

  // Reset rooms and pagination when roomType changes
  useEffect(() => {
    setRooms([]);
    setPage(1);
    setHasMore(true);
  }, [roomType]);

  // Fetch rooms whenever `page` or `roomType` changes
  useEffect(() => {
    fetchRooms();
  }, [page, roomType, fetchRooms]);

  // Pause observer when loading or when roomType changes
  useEffect(() => {
    if (loading || !hasMore) return;

    const observerCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setPage((prevPage) => prevPage + 1); // Increment page
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  return (
    <div className="lg:pl-1 flex-grow-0 flex flex-col items-center justify-center mt-10 sm:mt-16">
      <div className="mt-1">
        <ToggleGroup
          disabled={loading}
          type="single"
          variant="outline"
          defaultValue="all"
          value={roomType}
          onValueChange={(e) => e && setRoomType(e)}>
          <ToggleGroupItem
            value="all"
            aria-label="All Rooms"
            className="text-xs">
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="public"
            aria-label="Public Rooms"
            className="text-xs">
            Public
          </ToggleGroupItem>
          <ToggleGroupItem
            value="private"
            aria-label="Private Rooms"
            className="text-xs">
            Private
          </ToggleGroupItem>
          {user && (
            <ToggleGroupItem
              value="mine"
              aria-label="My Rooms"
              className="text-xs">
              Mine
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      </div>
      <div className="">
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} userId={user?._id} />
          ))}
        </ul>
      </div>
      <div ref={observerRef} style={{ height: "1px" }} />
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more rooms available.</p>}
    </div>
  );
};

export default Rooms;
