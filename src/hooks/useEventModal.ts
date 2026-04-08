"use client";

import { useState, useCallback } from "react";
import { PortfolioEntry } from "@/types/portfolio";

export function useEventModal() {
  const [selectedEvent, setSelectedEvent] = useState<PortfolioEntry | null>(null);

  const openModal = useCallback((entry: PortfolioEntry) => {
    setSelectedEvent(entry);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelectedEvent(null);
    document.body.style.overflow = "";
  }, []);

  return { selectedEvent, isOpen: selectedEvent !== null, openModal, closeModal };
}
