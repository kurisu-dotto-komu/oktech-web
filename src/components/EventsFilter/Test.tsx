import { useEffect, useState } from "react";

export default function Test({ items }: { items: any }) {
  console.log("Test props", items[0]);

  const [test, setTest] = useState("hello");
  useEffect(() => {
    setTimeout(() => {
      setTest("world");
    }, 1000);
  }, [items]);

  return (
    <div>
      My src is {items[0].poster.src}
      <img src={items[0].poster.src} />
    </div>
  );
}
