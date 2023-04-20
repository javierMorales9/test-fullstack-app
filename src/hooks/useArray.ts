import { useState } from "react";

function useArray<T>(initialValue: T[]) {
  const [array, setArray] = useState<Array<T>>(initialValue);

  function push(newElement: T) {
    setArray((prevArray) => [...prevArray, newElement]);
  }

  function filter(callback: (element: T, index: number) => boolean) {
    setArray((prevArray) => prevArray.filter(callback));
  }

  function update(index: number, newElement: T) {
    setArray((prevArray) => [
      ...prevArray.splice(0, index),
      newElement,
      ...prevArray.splice(index + 1),
    ]);
  }

  function removeElement(index: number) {
    setArray((prevArray) => [
      ...prevArray.slice(0, index),
      ...prevArray.slice(index + 1),
    ]);
  }

  function remove(index: number) {
    setArray((prevArray) => [
      ...prevArray.splice(0, index),
      ...prevArray.splice(index + 1),
    ]);
  }

  function set(arr: ((prevArray: T[]) => T[]) | T[]) {
    setArray(arr);
  }

  function clear() {
    set([]);
  }

  function enqueue(newElement: T) {
    set((prevArray) => [newElement, ...prevArray]);
  }

  return [
    array,
    { push, filter, update, removeElement, remove, clear, set, enqueue },
  ];
}

export default useArray;
