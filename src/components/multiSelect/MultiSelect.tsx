import React, { useState, useRef, useEffect } from "react";
import styles from "./MultiSelect.module.scss";
import { Option } from "./types";

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (selected: Option[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, placeholder, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [availableOptions, setAvailableOptions] = useState<Option[]>(options);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: Option) => {
    if (!selectedOptions.find((o) => o.value === option.value)) {
      const newSelected = [...selectedOptions, option];
      setSelectedOptions(newSelected);
      onChange?.(newSelected);
    }
  };

  const handleAddOption = () => {
    if (inputValue.trim() && !availableOptions.find((o) => o.label === inputValue.trim())) {
      const newOption = { label: inputValue.trim(), value: inputValue.trim() };
      const newOptions = [...availableOptions, newOption];
      setAvailableOptions(newOptions);
      handleSelectOption(newOption);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };


  const handleRemoveOption = (option: Option) => {
    const newSelected = selectedOptions.filter((o) => o.value !== option.value);
    setSelectedOptions(newSelected);
    onChange?.(newSelected);
  };
  

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={`${styles.inputWrapper} ${isOpen && styles.isOpen}`} onClick={() => setIsOpen(!isOpen)}>
        {selectedOptions.map((option) => (
          <span key={option.value} className={styles.selectedItem}>
            {option.label}
            <button
              className={styles.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveOption(option);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Select or type..."}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {availableOptions.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${selectedOptions.some((selected) => selected.value === option.value) ? styles.active : ""}`}
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
