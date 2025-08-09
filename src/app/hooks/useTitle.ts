import { useEffect } from "react";

function useTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle; // откат при размонтировании
    };
  }, [title]);
}

export default useTitle