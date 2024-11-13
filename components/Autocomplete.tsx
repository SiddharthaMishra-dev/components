"use client";

import { ChevronUp } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

interface AutocompleteProps {
  data: string[];
}

export default function Autcomplete({ data }: AutocompleteProps) {
  const [hide, setHide] = useState(true);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(data);
  const [selected, setSelected] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      setHide(true);
      setSelected(false);
      return;
    }
    const debounce = setTimeout(() => {
      if (input.length > 0) {
        handleSuggestions();
        setHide(false);
      } else {
        setSuggestions(data);
        setActiveIndex(-1);
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [input, data]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setHide(true);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [containerRef]);

  const handleSuggestions = () => {
    const suggestions = data.filter((item) => {
      return item.toLowerCase().includes(input.toLowerCase());
    });
    if (suggestions.length === 0) {
      setSuggestions(data);
    } else {
      setSuggestions(suggestions);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setSelected(false);
  };

  const handleSelect = (item: string, index: number) => {
    setSelected(true);
    setInput(item);
    setHide(true);
    setActiveIndex(index);
  };

  const handleInputClick = () => {
    setHide((prevState) => !prevState);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      handleSelect(suggestions[activeIndex], activeIndex);
    } else if (e.key === "Escape") {
      setHide(true);
    }
  };
  return (
    <div
      ref={containerRef}
      className="mx-auto flex flex-col justify-center items-center max-w-2xl"
    >
      <label
        htmlFor="input"
        className="w-full text-left mb-1 font-semibold"
      >
        Autocomplete
      </label>
      <div
        className="w-full relative"
        onClick={handleInputClick}
      >
        <input
          ref={inputRef}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          type="text"
          aria-autocomplete="list"
          aria-controls="suggestions"
          aria-activedescendant={`suggestion-${activeIndex}`}
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-md border-none p-3 outline-none focus:outline-2 focus:outline-gray-700 text-xl bg-gray-800 text-gray-300"
        />
        <div className={`absolute w-7 h-7 right-2 top-1/2 -translate-y-1/2 `}>
          <ChevronUp
            className={`w-full h-full text-gray-400 transition-transform duration-300 ease-in-out ${
              hide ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </div>

      <div
        role="listbox"
        className={`mt-2 w-full rounded-md max-h-[400px] overflow-y-auto bg-gray-700 shadow-lg p-2 ${
          hide ? "hidden" : ""
        }`}
      >
        {suggestions.length > 0
          ? suggestions.map((item, index) => (
              <p
                className={`cursor-pointer hover:bg-gray-600 transition rounded-md p-2 ${
                  index === activeIndex ? "bg-gray-600" : ""
                }`}
                key={item}
                onClick={() => handleSelect(item, index)}
              >
                {item}
              </p>
            ))
          : "No suggestions"}
      </div>
    </div>
  );
}
