import { useState, useEffect } from "react";

const KEY = "8dbf33cf";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setISLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setISLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            {
              signal: controller.signal,
            }
          );

          if (!res.ok) throw new Error("Something went Wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setISLoading(false);
        }
      }

      if (!query.length < 3) {
        setMovies([]);
        setError("");
      }

      //   handleCloseMOvie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
